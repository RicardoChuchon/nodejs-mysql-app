const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    //res.send("Hola bienvenido");
    res.render('index');
});

module.exports = router;
