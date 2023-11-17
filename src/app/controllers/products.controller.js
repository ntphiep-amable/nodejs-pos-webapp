const productModel = require("../models/products.model");
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const JsBarcode = require("jsbarcode");


function genBarcode(code) {
    const canvas = createCanvas(200, 200);
    JsBarcode(canvas, code, {
        format: 'CODE128',
        width: 2,
        height: 100,
        displayValue: true,
    });

    const buffer = canvas.toBuffer('image/png');
    const srcPath = path.resolve(__dirname, '../..');
    console.log(srcPath);
    fs.writeFileSync(srcPath + `/public/images/barcode/${code}.png`, buffer);
}

class ProductController {
    // [GET] /admin/products
    index = async (req, res) => {
        // genBarcode("1acfqwkjr")
        let productList = await productModel.find();
        let prds = productList.map(prd => {
            let prdObj = prd.toObject();
            return prdObj;
        });

        res.render('pages/admin.products.hbs', { productList: prds });
    };


    // [POST] /admin/products
    addPrd = async (req, res) => {
        // console.log("helelele")
        const { pname, importPrice, retailPrice, category } = req.body;

        const newProduct = new productModel({
            name: pname,
            barcodeImg: '',
            importPrice: retailPrice,
            retailPrice: importPrice,
            category: category, 
            creationDate: new Date(), 
            beenPurchased: false,
            image: '',
        });

        try {
            const result = await newProduct.save();
            const objectID = result._id;
            // console.log(objectID);
            const barcodeImgPath = `/images/barcode/${objectID}.png`;

            await productModel.updateOne({ _id: objectID }, { barcodeImg: barcodeImgPath });
            genBarcode(objectID);

        } catch (error) {
            console.log(err)
        }
        

        return res.json({
            status: true,
            message: "lưu ok",
            data: {}
        });
        
    }

}


module.exports = new ProductController();