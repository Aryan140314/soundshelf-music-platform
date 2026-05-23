require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Initialize the database connection before accepting requests.
connectDB();

// Start the HTTP server after the app and database setup have been loaded.
app.listen(3000, () =>{
    console.log('server is running on port 3000');
})
