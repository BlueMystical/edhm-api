const fs = require('fs');
const countriesData = './Data/countries.json';




module.exports = function (app, db) {

  //Esta es la Conexion con la Base de Datos:
  const JsonDB = require('../contexts/json-dao.js');

  //** ESTE ES EL OBJETO QUE DEVUELVEN TODOS LOS METODOS <<--- */
  var _Response = {
    success: false,
    result: null, //<- Lo que sea que estas buscando, o el detalle de los errores
    message: "Not Found"
  };

  //======================================================================================================================
  //** AQUI SE RECIBEN LAS SOLICITUDES GET y POST AL SERVIDOR */
  //======================================================================================================================
  //* ESTA ES LA RAIZ DEL SERVIDOR. 

  app.get('/', (req, res) => {
    try {
      //Re-directs to the Index page:
      res.status(200).sendFile('index.html', { root: './public' });
    } catch (error) {
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  // Shows the Data of all Registered Users
  app.get('/users/list', (req, res) => {

   // _Response = JsonDB.JSONDB_GetUsers();
   //  res.status(200).send(_Response);   //<- OK 

      JsonDB.JSONDB_GetUsers().then(ret => {
        //console.log(ret);
        res.status(200).send(ret);
      }).catch(err => {
        console.log(err)
      });

  });

  // Returns the whole JSON data file
  app.get('/users/file', (req, res) => {
    try {

      //Returns the Whole file for Download:
      res.setHeader('Content-disposition', 'attachment; filename=myData.json');
      res.setHeader('Content-type', 'application/json');

      res.download('./Data/edhm_users.json', 'myData.json');

    } catch (error) {
      console.log(error);
      _Response.message = error.message;
      res.send(_Response);
    }
  });

  //POST Request to add a new Record for User Data, Existing Record will be Updated:
  app.post('/users/add', (req, res) => {
    try {
      //console.log(req);
      //console.log(req.body);

      if (req.body && Object.keys(req.body).length !== 0 && Object.getPrototypeOf(req.body) === Object.prototype) {

        
        res.status(200).send(JsonDB.JSONDB_AddUser(req.body));   //<- OK 

      } else {
        _Response.result = { error: 400, message: "Expected parameters have not been passed." };
        _Response.success = false;
        _Response.message = "Bad Request";
        res.status(400).send(_Response);
      }
    } catch (error) {
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  /* PERMITE BUSCAR USUARIOS USANDO CUALQUIER CRITERIO DISPONIBLE
 * Los Criterios son los Nombres de los Campos devueltos  */
  app.get('/users/find', (req, res) => {
    try {
      //console.log(req.query);  //<- Parametros pasados x el Query
      //No es un array sino un Objeto con tantos Campos como Parametros se pasan

      if (typeof req.query !== 'undefined' && Object.keys(req.query).length) {

        //res.status(200).send(JsonDB.JSONDB_FindUsers(req.query));   //<- OK 

        // getData is a promise
        //JsonDB.JSONDB_getUserData(req.query).then(ret => res.status(200).send(ret)).catch(err => console.log(err)); 

        JsonDB.JSONDB_getUserData(req.query).then(ret => {
          //console.log(ret);
          res.status(200).send(ret);
        }).catch(err => {
          console.log(err)
        });

      } else {
        _Response.result = { error: 400, message: "Expected parameters have not been passed." };
        _Response.success = false;
        _Response.message = "Bad Request";
        res.status(400).send(_Response);
      }
    } catch (error) {
      //console.log(error);
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  app.get('/users/get-statistics', (req, res) => {
    try {

      res.status(200).send(JsonDB.JSONDB_GetStatistics());   //<- OK 
  
    } catch (error) {
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  app.get('/users/show-statistics', (req, res) => {
    try {
      //Re-directs to the Chart page:
      res.status(200).sendFile('chart.html', { root: './public/pages' });
    } catch (error) {
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  //Parametro: 'code', Deveuleve el Pais correspondiente al codigo ISO.
  app.get('/users/get-country', (req, res) => {
    try {
      if (typeof req.query !== 'undefined' && Object.keys(req.query).length && typeof req.query.code != 'undefined') {
        var Query = req.query;
        const jsonData = JSON.parse(fs.readFileSync(countriesData));

        if (jsonData && jsonData.length > 0) {
          for (var i = 0; i < jsonData.length; i++) {
            var Keys = Object.keys(jsonData[i]);
            var Codes = jsonData[i][Keys[0]].split('/');
            var ISO_1 = Codes[0].toLowerCase();
            var ISO_2 = Codes[1].toLowerCase();

            if (ISO_1 === Query.code.toLowerCase() || ISO_2 === Query.code.toLowerCase) {
              _Response.result = { CountryName: Keys[0], ISO: jsonData[i][Keys[0]] };
              _Response.message = Keys[0] + ' (' + Query.code.toUpperCase() + ')';
              break;
            }
          }
          _Response.success = true;
          res.status(200).send(_Response);   //<- OK 
        };
      } else {
        _Response.result = { error: 400, message: "Expected parameters have not been passed." };
        _Response.success = false;
        _Response.message = "Bad Request";
        res.status(400).send(_Response);
      };
    } catch (error) {
      _Response.success = false;
      _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
      _Response.message = "Internal Server Error";
      res.status(500).send(_Response);
    }
  });

  //---------------------------------------------------------------------------------------------------------
  //A Todas las Solicitudes que no figuren en la lista anterior, se les escupira con un Error 404:
  app.get('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
      res.sendFile('404.html', { root: './public/pages' });
      return;
    }
    if (req.accepts('json')) {
      _Response.result = { error: 404, message: "We could not find what you was looking for, ¿Are you Lost?." };
      res.json(_Response);
      return;
    }
    res.type('txt').send("We could not find what you was looking for, ¿Are you Lost?.");
  });
  app.post("*", (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
      _Response.result = { error: 404, message: "We could not find what you was looking for, ¿Are you Lost?." };
      res.json(_Response);
      return;
    }
    res.type('txt').send("We could not find what you was looking for, ¿Are you Lost?.");
  });
};