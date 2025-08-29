const express = require('express')  //importo express
const app = express();          // creo la app


//CONFIGURACION EJS (NUEVO)
app.set('view engine', 'ejs');
app.set('views', './views');   // Carpeta donde estaran las plantillas


//Para convertir los JSON que lleguen a datos JavaScript
app.use(express.json());


//Arraray de temas con mas datos
const temas = [
    {id: 1, titulo: "Python Basico", votos: 0},
    {id: 2, titulo: "JavaScript", votos: 0},
    {id: 3, titulo: "Introduccion a la Ingenieria de Software", votos: 0}
];

//Funcion para validar
function validarTitulo(titulo) {
    if (!titulo) {
        return "El titulo es obligatorio";
    }
    if (titulo.trim().length === 0) {
        return "El titulo no puede estar vacio";
    }
    return null; //sin errores
}

//RUTA BASICA FORMA LARGA
function rutaBasica(req, res) {
    res.send("Hola, Mi servidor funciona ");
}
app.get('/', rutaBasica);


//RUTA PARA CREAR UN NUEVO TEMA
function crearTemaNuevo (req, res) {
    const error = validarTitulo(req.body.titulo);

    //Validaciones primero
    if (error) {
        res.status(400).send({error: error});
        return; //Para que pare aqui
    }

    //los datos vienen con el req.body
    const nuevoTema = {
        id: temas.length + 1,  //ID simple incremental
        titulo: req.body.titulo, //obtengo de los datos
        votos: 0  //Siempre inicia en 0
    };
    temas.push(nuevoTema);  //Agregar en el array
    res.status(201).send(nuevoTema);  // 201 = "Creado Exitosamente"
};
app.post('/temas', crearTemaNuevo);


//RUTA PARA ELIMINAR TEMAS
function eliminarTema(req, res) {
    const idTema = parseInt(req.params.id);   //Obtiene el ID de la URL

    //Buscar la POSICION del tema en array
    const indice = temas.findIndex(t => t.id === idTema);

    if (indice !== -1) { //Si lo encontro (), en caso de no encontrarlo devuelve -1
        const temaEliminado = temas.splice(indice, 1)[0]; //Elimina y guarda el tema
        res.send({mensaje: 'Tema eliminado', tema: temaEliminado});
    } 
    else {
        res.status(404).send({error: "tema no encontrado"});
    }
}

app.delete('/tema/:id', eliminarTema);


//Lista de temas Manual (POR AHORA)
app.get('/temas', (req, res) => {
    res.send(temas)
});


//RUTA PARA ACTUALIZAR UN TEMA (SOLO TITULO DISPONIBLE)
function actualizarTema(req, res) {
    const idTema = parseInt(req.params.id);   //Obtiene el numoero de id que se le pase en la url

    //Valido primero
    const error = validarTitulo(req.body.titulo)
    if (error) {
        res.status(400).send({error: error});
    return;
    }

    // Buscar el tema en el array
    const tema = temas.find(t => t.id === idTema);

    if (tema) {
        tema.titulo = req.body.titulo;  // Actualiza el titulo
        res.send({mensaje: 'Tema Actualizado', tema: tema}); 
    }
    else {
        res.status(404).send({error: 'Tema no encontrado'});
    }
}
app.put('/temas/:id', actualizarTema);


//RUTA PARA VOTAR
app.post('/temas/:id/votar', (req, res) => {
    const idTema = parseInt(req.params.id);  //Obtiene el ID de la URL
    
    //Buscar el tema en el array
    const tema = temas.find(t => t.id === idTema);
    if (tema) {
        tema.votos = tema.votos + 1; // 0 simplemente: tema.votos++
        res.send({mensaje: 'Voto agregado', tema: tema}); //Devolucion en pagina web
    } 
    else {                                        //Si el tema no se encuentr
        res.status(404).send({error: "Tema no encontrado"}); 
    }
});

app.listen(3000, ()  => {        //Pon a escuchar en el puertp 3000
    console.log('Servidor corriendo en http://localhost:3000');
});