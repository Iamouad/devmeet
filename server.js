const express = require('express');
const connectDB = require('./config/db');

//initialise the app variable
const app = express();

//Connect db

connectDB();

//Init middleware bodyparser
app.use(express.json({extended: false}))

//simple endpoint
//app.get('/', (req, res)=> res.send('Api running Here'))

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));


//getting the port from env variable
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=> console.log('Server running on port '+ PORT));