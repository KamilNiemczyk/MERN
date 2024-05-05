const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

const fs = require('fs');
const util = require('util');

const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
const log_stdout = process.stdout;

console.log = function (d) {
    log_file.write(util.format(d) + "\n");
    log_stdout.write(util.format(d) + "\n");
};


recordRoutes.route("/addProduct").post(async function(req, res) {
    const date = new Date();

    const newProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        quantity: req.body.quantity,
        rating: [],
        comments: [],
        full_description: req.body.full_description,
        brand: req.body.brand,
        date : date
    }
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const existingProduct = await productsCollection.findOne({ name: newProduct.name });
        if (existingProduct) {
            return res.status(500).json({ message: 'Jest już taki produkt' });
        }
        const result = await productsCollection.insertOne(newProduct);
        res.status(201).json({ message: 'Produkt dodany'});
        console.log('Produkt dodany');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania produktu' });
    }
});


recordRoutes.route("/getProducts").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.find().filter({ quantity: { $gt: 0 } }).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
        console.log('Pobrano produkty');
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    });
});


recordRoutes.route("/getProduct/:id").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.findOne({ _id: ObjectId(req.params.id) });
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania produktu' });
    });
});

recordRoutes.route("/deleteProduct/:id").delete(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.deleteOne({ _id: ObjectId(req.params.id) });
        res.status(200).json({ message: 'Produkt usunięty' });
        console.log('Produkt usunięty');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania produktu' });
    }
});

recordRoutes.route("/addComment/:id").post(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.updateOne({ _id: ObjectId(req.params.id) }, { $push: { comments: req.body } });
        res.status(200).json({ message: 'Komentarz dodany' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania komentarza' });
    }
});

recordRoutes.route("/addRating/:id").post(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.updateOne({ _id: ObjectId(req.params.id) }, { $push: { rating: req.body } });
        res.status(200).json({ message: 'Ocena dodana' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania oceny' });
    }
});

recordRoutes.route("/getAverageRating/:id").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.findOne({ _id: ObjectId(req.params.id) });
        const rating = result.rating;
        let sum = 0;
        rating.forEach(element => {
            sum += element.rating;
        });
        const averageRating = sum / rating.length;
        res.status(200).json({ averageRating: averageRating });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania średniej oceny' });
    }
});

recordRoutes.route("/getProductsByCategoryAndBrand/:category/:brand").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const category = req.params.category;
        const brand = req.params.brand;
        if (category === 'Wszystkie' && brand === 'Wszystkie') {
            const result = await productsCollection.find().toArray();
            res.status(200).json(result);
        } else if (category === 'Wszystkie') {
            const result = await productsCollection.find({ brand: brand }).toArray();
            res.status(200).json(result);
        } else if (brand === 'Wszystkie') {
            const result = await productsCollection.find({ category: category }).toArray();
            res.status(200).json(result);
        } else {
            const result = await productsCollection.find({ category: category, brand: brand }).toArray();
            res.status(200).json(result);} 
        } catch (error) {
            res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
        }
    });

recordRoutes.route("/getProductsByPrice/:price").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const price = req.params.price;
        if (price === 'FromMinToMax') {
            const result = await productsCollection.find().sort({ price: 1 }).toArray();
            res.status(200).json(result);
        } else if (price === 'FromMaxToMin') {
            const result = await productsCollection.find().sort({ price: -1 }).toArray();
            res.status(200).json(result);
        } } catch (error) {
            res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
        }
    }
);

recordRoutes.route("/getProductsByAvgRating").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $project :  {
                name: 1,
                price: 1,
                description: 1,
                image: 1,
                category: 1,
                quantity: 1,
                rating: 1,
                comments: 1,
                full_description: 1,
                brand: 1,
                date: 1,
                averageRating: { $avg: "$rating.rating" }
            }},
            { $sort: { averageRating: -1 }},
            { $project: { averageRating: 0 }} 
            ]).toArray();
        res.status(200).json(result);
        console.log('Posegregowano produkty po średniej ocenie');
            }
    catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    }});

recordRoutes.route("/getProductsByPrice/:min/:max").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const min = Number(req.params.min);
        const max = Number(req.params.max);
        const result = await productsCollection.find({ price: { $gte: min, $lte: max } }).toArray();
        res.status(200).json(result);
        console.log('Pobrano produkty po cenie');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    }
}); 

recordRoutes.route("/editComment/:idproduct/:idcomment").put(async function(req, res) {
    const { newComment } = req.body;
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.updateOne({ _id: ObjectId(req.params.idproduct), "comments.id": req.params.idcomment }, { $set: { "comments.$.komentarz": newComment } });
        res.status(200).json({ message: 'Komentarz edytowany' });
        console.log('Komentarz edytowany');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas edytowania komentarza' });
    }
});

recordRoutes.route("/deleteComment/:idproduct/:idcomment").delete(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.updateOne({ _id: ObjectId(req.params.idproduct) }, { $pull: { comments: { id: req.params.idcomment } } });
        res.status(200).json({ message: 'Komentarz usunięty' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania komentarza' });
    }
});    

recordRoutes.route("/deleteRating/:idproduct/:rating").delete(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.updateOne({ _id: ObjectId(req.params.idproduct) }, { $pull: { rating: { rating: Number(req.params.rating) } } });
        res.status(200).json({ message: 'Ocena usunięta' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania oceny' });
    }
});

recordRoutes.route("/deleteAllProducts").delete(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        await productsCollection.deleteMany();
        res.status(200).json({ message: 'Produkty usunięte' });
        console.log('Produkty usunięte');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania produktów' });
    }
});

recordRoutes.route("/getProductsByDate").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.find().sort({ date: -1 }).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    });
});

recordRoutes.route("/searchProducts/:searchWzorzec").get(async function(req, res) {
    const { searchWzorzec } = req.params;
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.find({ name: { $regex: searchWzorzec, $options: 'i' } }).toArray();
        res.status(200).json(result);
        console.log('Wyszukano produkty');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania czatów' });
    }
});

recordRoutes.route("/getAmountOfProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $group: { _id: null, total: { $sum: 1 } } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania ilości produktów' });
    }
});

recordRoutes.route("/getMostCommentedProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $project :  {
                name: 1,
                comments: 1,
                numberOfComments: { $size: "$comments" }
            }},
            { $sort: { numberOfComments: -1 }},
            { $limit : 3}
            ]).toArray();
        res.status(200).json(result);
        console.log('Posegregowano produkty po ilości komentarzy');
            }
    catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    }});

recordRoutes.route("/getMostPopularBrands").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $group: { _id: "$brand", total: { $sum: 1 } } },
            { $sort: { total: -1 }}
        ]).toArray();
        res.status(200).json(result);
        console.log('Posegregowano marki po ilości produktów');
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania ilości produktów' });
    }
});

recordRoutes.route("/countQuantityOfProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania ilości produktów' });
    }
});

recordRoutes.route("/howManyProductsStartsWith/:letter").get(async function(req, res) {
    const { letter } = req.params;
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $match: { name: { $regex: '^' + letter, $options: 'i' } } },
            { $group: { _id: null, total: { $sum: 1 }, products: { $push: "$name" }} }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania ilości produktów' });
    }
});

recordRoutes.route("/getAvgPriceOfProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            { $group: { _id: null, avgPrice: { $avg: "$price" } } }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania średniej ceny' });
    }
});

recordRoutes.route("/getPriceOfAllProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrice: {
                        $sum: { $multiply: ["$price", "$quantity"] }
                    }
                }
            }
        ]).toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania ceny' });
    }
});

recordRoutes.route("/getProductsAlphabetically").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.find().collation({ locale: "pl", strength: 2 }).sort({ name: 1 }).toArray();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    });
});

recordRoutes.route("/getCategories").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.distinct('category');
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania kategorii' });
    });
});
recordRoutes.route("/getBrands").get(function(req, res) {
    new Promise(async (resolve, reject) => {
        try {
            let db_connect = dbo.getDb("sklep");
            const productsCollection = db_connect.collection('products');
            const result = await productsCollection.distinct('brand');
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
    .then(result => {
        res.status(200).json(result);
    })
    .catch(error => {
        res.status(500).json({ message: 'Błąd podczas pobierania marek' });
    });
});

recordRoutes.route("/updateQuantity/:product_id/:quantity").put(async function(req, res) {
    const { quantity } = req.params;
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const product = await productsCollection.findOne({ _id: ObjectId(req.params.product_id) });
        if (!product) {
            return res.status(404).json({ message: 'Produkt nie znaleziony' });
        }
        const updatedQuantity = product.quantity - parseInt(quantity);
        if (updatedQuantity < 0) {
            return res.status(400).json({ message: 'Ilość produktu nie może być ujemna' });
        }
        const result = await productsCollection.updateOne(
            { _id: ObjectId(req.params.product_id) },
            { $set: { quantity: updatedQuantity } }
        );
        res.status(200).json({ message: 'Ilość produktu zaktualizowana' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas aktualizowania ilości produktu' });
    }
});


module.exports = recordRoutes;
