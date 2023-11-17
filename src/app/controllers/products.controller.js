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
            importPrice: importPrice,
            retailPrice: retailPrice,
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

    // [POST] /admin/products/e
    thisPrd = async (req, res) => {
        console.log(req.body);
        const prdCheck = await productModel.findOne({ _id: req.body.prdID });

        const name = prdCheck.name;
        const imp = prdCheck.importPrice;
        const ret = prdCheck.retailPrice;
        const cat = prdCheck.category;


        return res.json({
            status: true,
            message: "lấy ok",
            data: { name, imp, ret, cat }
        });
    }


    // [GET] /admin/products/update
    getUpdate = async (req, res) => {
        res.render('pages/products.update.hbs')
    }


    // [POST] /admin/products/update
    postUpdate = async (req, res) => {
        const prdID = req.body._id;
        // const newName = req.body.pname;
        // const newImp = req.body.importPrice;
        // const newRet = req.body.retailPrice;
        // const newCat = req.body.category;

        const newData = {
            name: req.body.pname,
            importPrice: req.body.importPrice,
            retailPrice:  req.body.retailPrice,
            category: req.body.category,
        }

        await productModel.updateOne({ _id: prdID}, newData).then(() => {
            return res.json({
                status: true,
                message: "update thành công",
                data: { }
            })
        })
    }


    // [DELETE]
    delPrd = async (req, res) => {
        const prdID = req.params.id;

        try {
            const delPrd = await productModel.findByIdAndDelete(prdID);
            if (!delPrd) {
                return res.status(404).json({ message: 'k tìm thấy sản phẩm' });
            }
          
              // Trả về phản hồi cho client-side
              return res.json({
                status: true,
                message: "xóa thành công",
                data: { }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


module.exports = new ProductController();