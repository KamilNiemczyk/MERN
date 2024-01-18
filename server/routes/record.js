const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/addProduct").post(async function(req, res) {
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
        brand: req.body.brand
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
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania produktu' });
    }
});

recordRoutes.route("/getProducts").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.find().toArray();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów' });
    }
});

recordRoutes.route("/getProduct/:id").get(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.findOne({ _id: ObjectId(req.params.id) });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktu' });
    }
});

recordRoutes.route("/deleteProduct/:id").delete(async function(req, res) {
    try {
        let db_connect = dbo.getDb("sklep");
        const productsCollection = db_connect.collection('products');
        const result = await productsCollection.deleteOne({ _id: ObjectId(req.params.id) });
        res.status(200).json({ message: 'Produkt usunięty' });
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


module.exports = recordRoutes;
