const mongoose = require('mongoose');
require('dotenv').config();
// Fallback to localhost if no ENV provided
const dbURI = process.env.MONGO_URI || 'mongodb+srv://15110623088_db_user:MtXNaQrVVSMczIkh@cluster-0-music-spa.5eejwtp.mongodb.net/?appName=Cluster-0-music-spa';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB database (Music SPA).'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Export connection mostly for keeping syntax similar to before if needed 
// Though typically with Mongoose, you just require models directly in routes now.
const db = mongoose.connection;
module.exports = db;
