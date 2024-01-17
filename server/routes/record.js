const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/register").post(async function(req, res) {
    const newUser = req.body;
    try {
        let db_connect = dbo.getDb("pswbaza");
        const usersCollection = db_connect.collection('users');
        const existingUser = await usersCollection.findOne({ login: newUser.login });
        if (existingUser) {
            return res.status(500).json({ message: 'Jest już taki użytkownik' });
        }
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);
        newUser.password = hashedPassword;
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'Użytkownik dodany'});
        console.log("Dodalem uzytkownika");
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania użytkownika' });
        console.log("Nie dodalem uzytkownika");
    }
});

module.exports = recordRoutes;
