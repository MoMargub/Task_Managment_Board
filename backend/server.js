const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require("./routes/routes");
dotenv.config();
const app=express();

const PORT = process.env.SERVER_PORT || 5000
const origin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
    origin
}));

app.use(express.json())

app.use(express.urlencoded({ extended: true }));

app.use(routes);

mongoose.connect(process.env.MONGO_URI).then(()=> {
    console.log("Connected to Mongo Db")
    app.listen(PORT, ()=> {
        console.log(`Your app is running in http://localhost:${PORT}`);
    })
}).catch((e)=> {
    console.log("Error connecting in database");
})