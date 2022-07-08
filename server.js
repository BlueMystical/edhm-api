const express        = require('express');
const bodyParser     = require('body-parser');
const routes         = require('./Routes/Route')
const fs             = require('fs');
const app            = express();
const port           = 3000;

/* -----------------------------------------------------------------
    ESTE ES UN BACKEND HECHO CON NODE.js v16.15 y Express.
    Autor:          Jhollman Chacon R. (Blue Mystic) 2022 (•̀ᴗ•́)و    
    
    Development:    http://localhost:3000/
    Produccion:     https://edhm-ui.herokuapp.com/
    Source Code:    https://github.com/BlueMystical/edhm-api
* ----------------------------------------------------------------- */
// todo dentro de la carpeta 'public' se puede acceder estaticamente, en el navegador 'localhost:3000\favicon.ico'
// middleware:
app.set("view options", { layout: false });
app.use(
    bodyParser.urlencoded({ extended: true }),
    express.json(),
    express.static(__dirname + '/public', { index: '404.html' }) 
);
app.use('/', routes);  //<- Llama al archivo de Rutas.


//Starts the App running on the Port provided by Heroku, or in the Default if on Localhost:
app.listen(process.env.PORT || port, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

