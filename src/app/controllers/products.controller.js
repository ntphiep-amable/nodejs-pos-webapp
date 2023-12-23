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
    const srcPath = path.resolve(__dirname, '../..'); // D:\University\NodeJS\Final-project\Node new\nodejs-finalproject\src
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
        // get a list of categories
        let categories = [];
        prds.forEach(prd => {
            if (!categories.includes(prd.category)) {
                categories.push(prd.category);
            }
        });
        res.render('pages/admin.products.hbs', { productList: prds, categories, isAdm: true, navActive: 'products' });
    };


    // [POST] /admin/products
    addPrd = async (req, res) => {
        const { pcode, pname, importPrice, retailPrice, category } = req.body;
        const newProduct = new productModel({
            barcode: '',
            name: pname,
            barcodeImg: '',
            importPrice: importPrice,
            retailPrice: retailPrice,
            category: category, 
            creationDate: new Date(), 
            beenPurchased: false,
            image: '',
        });
        // req.file ? `/images/pdThumbs/${req.file.filename}` : null
        var barcode = '';
        try {
            const result = await newProduct.save();
            const objectID = result._id;
            if (pcode) {
                const isBarcodeExist = await productModel.findOne({ barcode: pcode });
                if (isBarcodeExist) {
                    return res.status(400).json({
                        status: false,
                        message: "Barcode existed",
                        data: {}
                    });
                }
                barcode = pcode;
            } else {
                barcode = objectID;
            }
            var file = req.file;
            var imgPath = '';
            if (file) {
                imgPath = `/images/pdThumbs/${req.file.filename}`;
                if (!pcode){ // if there is no pcode, then rename the image file to the objectID
                    fs.renameSync(file.path, file.destination + `/${barcode}.png`);
                    imgPath = `/images/pdThumbs/${barcode}.png`;
                }
            }

            const barcodeImgPath = `/images/barcode/${barcode}.png`;

            await productModel.updateOne({ _id: objectID }, { 
                barcode: barcode,
                barcodeImg: barcodeImgPath,
                image: imgPath
            });
            genBarcode(barcode);

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: false,
                message: "Something went wrong, please try again later",
                data: {}
            });
        }
        return res.json({
            status: true,
            message: "Product added successfully",
            data: {}
        });
        
    }

    // [POST] /admin/products/e
    thisPrd = async (req, res) => {
        const prdCheck = await productModel.findOne({ _id: req.body.prdID });

        const name = prdCheck.name;
        const imp = prdCheck.importPrice;
        const ret = prdCheck.retailPrice;
        const cat = prdCheck.category;
        const barcode = prdCheck.barcode;


        return res.json({
            status: true,
            message: "Get product successfully",
            data: { name, imp, ret, cat, barcode }
        });
    }


    // [GET] /admin/products/update
    getUpdate = async (req, res) => {
        res.render('pages/products.update.hbs')
    }


    // [POST] /admin/products/update
    postUpdate = async (req, res) => {
        const barcode = req.body.pcode;

        const newData = {
            name: req.body.pname,
            importPrice: req.body.importPrice,
            retailPrice:  req.body.retailPrice,
            category: req.body.category,
        }
        if (req.file) {
            newData.image = `/images/pdThumbs/${req.file.filename}`;
        }
        
        // await productModel.findOne({ _id: barcode }).then(async (prd) => {
        //     console.log(prd);
        // });

        await productModel.updateOne({ barcode: barcode}, newData).then(() => {
            return res.json({
                status: true,
                message: "Update product successfully",
                data: { }
            })
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                status: false,
                message: "Something went wrong, please try again later",
                data: {}
            });
        });
    }


    // [DELETE]
    delPrd = async (req, res) => {
        const prdID = req.params.id;

        try {
            const prdObj = await productModel.findOne({ _id: prdID });
            if (prdObj.beenPurchased) {
                return res.json({
                    status: false,
                    message: "Product has been purchased, cannot delete",
                    data: { }
                });
            } else {
                const delPrd = await productModel.findByIdAndDelete(prdID);
                if (!delPrd) {
                    return res.status(400).json({ message: 'Product not found' });
                }
                const srcPath = path.resolve(__dirname, '../../public'); // D:\University\NodeJS\Final-project\Node new\nodejs-finalproject\public
                if (prdObj.image && prdObj.image != '') {
                    fs.unlinkSync(srcPath + prdObj.image);
                }
                fs.unlinkSync(srcPath + prdObj.barcodeImg);
                // Trả về phản hồi cho client-side
                return res.json({
                    status: true,
                    message: "Delete product successfully",
                    data: { }
                });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}


module.exports = new ProductController();
