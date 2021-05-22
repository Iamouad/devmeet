const express = require('express');

//initialise the app variable
const app = express();

//simple endpoint
app.get('/', (req, res)=> res.send('Api running'))

//getting the port from env variable
const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=> console.log('Server running on port '+ PORT));