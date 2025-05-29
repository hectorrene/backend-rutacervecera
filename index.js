const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//conexion a base de datos y puerto
mongoose.connect("mongodb+srv://admin:admin12345@backenddb.mjazc36.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backenddb")
.then(() => {
    console.log("connected to mongodb");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})

// mensaje inicial al abrir la API
app.get ('/', (req, res) => {
    res.send('Conectado a la API de ruta cervecera');
});



// mongodb+srv://admin:admin12345@backenddb.mjazc36.mongodb.net/?retryWrites=true&w=majority&appName=backenddb
// falta agregar lo de que por cualquier IP
// npm i nodemon -D
// nodemon index.js
// npm i express
// npm i mongoose
//npm i 
// npm run dev

