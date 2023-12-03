const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect('mongodb://localhost:27017/note');
        console.log('Database Connected: ${conn}');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;
// const { MongoClient } = require("mongodb");
// const uri = 'mongodb://127.0.0.1:27017';
// const client = new MongoClient(uri);
// const {MongoClient} = require('mongodb');
// const uri = 'mongodb://127.0.0.1:27017';
// const dbName = 'note'

// const client = new MongoClient (uri);

// client.connect((error, client) => {
//     if (error) {
//         return console.log('koneksi gagal')
//     } console.log('berhasil')
// })


// with server
// const mongoose = require('mongoose');
// const connectDB = async () => {
//     try {
//         // const database = client.db('note');
//         mongoose.set('strictQuery', false);
//         // console.log(database);
//         const conn = await mongoose.connect(process.env.MONGODB_URI)
//         console.log('Database Connected: ${conn.connection.host}');
//     } catch (error) {
//         console.log(error);
//     }
// }

// module.exports = connectDB;

