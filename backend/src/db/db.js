const mongoose = require('mongoose');

async function connectDB() {
    try {
        // Use the MongoDB connection string from the environment configuration.
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection error:', error);
    }

}

module.exports = connectDB;
