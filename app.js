const express = require('express')  //importo express
const app = express();          // creo la app

app.get('/', (req, res) => {            //Cunado alguin visite esta ruta '/'
    res.send('Hola, Mi servidor funciona'); // Envia esta respuesta
});

app.listen(3000, ()  => {        //Pon a escuchar en el puertp 3000
    console.log('Servidor corriendo en http://localhost:3000');
});