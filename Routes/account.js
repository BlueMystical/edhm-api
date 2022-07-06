const fs = require('fs');
const express = require("express")
const accountRoutes = express.Router();
const edhmData = './Data/edhm_users.json';

//======================================================================================================================
//** METODOS INTERNOS */
//======================================================================================================================
 //** ESTE ES EL OBJETO QUE DEVUELVEN TODOS LOS METODOS <<--- */
 var _Response = {
  success: false,
  result: null, //<- Lo que sea que estas buscando, o el detalle de los errores
  message: "Not Found"
};

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data)
  fs.writeFileSync(edhmData, stringifyData)
}

const getAccountData = () => {
  const jsonData = fs.readFileSync(edhmData)
  return JSON.parse(jsonData)
}

const getStatistics = () => {
  var result = {
    Countries: [],
    Languages: [],
    Odyssey: [{ Value: 'Odyssey', Count: 0 },{ Value: 'Horizons', Count: 0 }],
    GameMode: []
  }

  var existingRecords = getAccountData(); //<- Obtiene los Registros Actuales
  if (typeof existingRecords !== 'undefined' && existingRecords.length > 0) {
    existingRecords.forEach(userinfo => {
      //Si ya existe, le sumamos 1; Si no existe, lo agregamos
      //1. Countries:
      var Found = result.Countries.find(element => element.Value === userinfo.Country);
      if (Found != null && typeof Found != 'undefined') { Found.Count++; } else { result.Countries.push({ Value: userinfo.Country, Count: 1 }); }

      //2. Languages:
      Found = result.Languages.find(element => element.Value === userinfo.Language);
      if (Found != null && typeof Found != 'undefined') { Found.Count++; } else { result.Languages.push({ Value: userinfo.Language, Count: 1 }); }

      //3. Odyssey:
      if (userinfo.Odyssey === 'true') result.Odyssey[0].Count++;
      if (userinfo.Odyssey === 'false') result.Odyssey[1].Count++;

      //4. GameMode:
      Found = result.GameMode.find(element => element.Value === userinfo.GameMode);
      if (Found != null && typeof Found != 'undefined') { Found.Count++; } else { result.GameMode.push({ Value: userinfo.GameMode, Count: 1 }); }

    })   
  }
  return result
}

//Esta Clase se usa para Filtrar los Registros
class MyArray extends Array {
  filterBy(argument) {
    return  this.filter(function(el){
      if (typeof argument == "object") {
        // object with key/parameter pairs for filtering:
        // {key1: 0, gender: "m"}
        for (let key in argument) {
          //if (argument[key] !== el[key]) return false; //<- Busqueda Exacta
          if (el[key].toLowerCase().indexOf(argument[key].toLowerCase()) === -1) return false; //<- Busqueda parcial
        };
        return true;
      } else if (typeof argument == "string") {
        // string with logical expression with key names @-escaped, e.g.
        // @gender == 'm' && @key1 == @key2
        let expression = argument.split("@").join("el.")
        return eval(expression);
      }
    });
  }
};

/* //$divide un Objeto en un array de Claves y Valores
      const filters = Object.entries(req.query);
      console.log(filters);
      console.log(filters[0][0,0]);
      console.log(filters[0][0,1]);

      theArray.forEach(element => {
          // ...use `element`...
      });
*/
//======================================================================================================================
//** AQUI SE RECIBEN LAS SOLICITUDES GET y POST AL SERVIDOR */
//======================================================================================================================
//* ESTA ES LA RAIZ DEL SERVIDOR. 
  //  Cualquier solicitud x GET se redirije a la pagina de Error y devuelve 'status: 403 (Forbidden)'
accountRoutes.get('/', function(req, res) { res.status(403).sendFile('404.html', { root: './public' }); });
accountRoutes.post("/", (req, res) => {
  _Response.result = { error: 404, message: "NO se ha encontrado lo que estaba buscando." };
  res.send(_Response);
});

// Returns the whole JSON data file
accountRoutes.get('/users/file', (req, res) => {
  fs.readFile(edhmData, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

// Shows the Data of all Registered Users
accountRoutes.get('/users/list', (req, res) => {
  var accounts = getAccountData();
  if (typeof accounts !== 'undefined') {
    _Response.success = true;
    _Response.result = accounts;
    _Response.message = accounts.length + ' records.';

    res.status(200).send(_Response);   //<- OK 
  } else {
    _Response.success = false;
    _Response.result = null;
    _Response.message = 'No records found!';
    res.status(200).send(_Response);   //<- OK 
  }
});

//POST Request to add a new Record for User Data, Existing Record will be Updated:
accountRoutes.post('/users/add', (req, res) => {
  try {
    //console.log(req);
    //console.log(req.body);

    if (req.body && Object.keys(req.body).length !== 0 && Object.getPrototypeOf(req.body) === Object.prototype) {
      var newRecord = req.body; //<- Obtiene el nuevo registro pasado en el Body de la Solicitud
      var existingRecords = getAccountData(); //<- Obtiene los Registros Actuales

      //console.log(newRecord);
        
      //Verifies the pre-existance of the new record:
      //var found = existingRecords.find(element => element.CommanderName === newRecord.CommanderName);
      var foundIndex = existingRecords.findIndex(element => element.CommanderName === newRecord.CommanderName);
      if (foundIndex != null && typeof foundIndex != 'undefined' && foundIndex >= 0) {

        //console.log(foundIndex);

        //The New Record already Exists!
        existingRecords[foundIndex] = newRecord;
        saveAccountData(existingRecords); //<- Save the Changes

        _Response.success = true;
        _Response.result = true;
        _Response.message = 'User data Updated successfully (•̀ᴗ•́)و';
        
      } else {
        //The New Record doesnt Exists
        existingRecords.push(newRecord); //<- Adds the New Record
        saveAccountData(existingRecords); //<- Save the Changes

        _Response.success = true;
        _Response.result = true;
        _Response.message = 'User data Added successfully (•̀ᴗ•́)و';
      }
      res.status(200).send(_Response);   //<- OK 
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
accountRoutes.get('/users/find', (req, res) => {
  try {
    //console.log(req.query);  //<- Parametros pasados x el Query
    //No es un array sino un Objeto con tantos Campos como Parametros se pasan

    if (typeof req.query !== 'undefined' && Object.keys(req.query).length) {
      var existingRecords = getAccountData(); //<- Obtiene los Registros Actuales

      if (typeof existingRecords !== 'undefined' && existingRecords.length > 0) {
        _Response.success = true;
        _Response.result = MyArray.from(existingRecords).filterBy(req.query);
        _Response.message = _Response.result.length + ' records.';
      } else {
        _Response.success = false;
        _Response.result = null;
        _Response.message = 'No records found!';
      }
      res.status(200).send(_Response);   //<- OK 
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

accountRoutes.get('/users/get-statistics', (req, res) => {
  try {
    var result = getStatistics();
 
    if (typeof result !== 'undefined') {
      _Response.success = true;
      _Response.result = result;
      _Response.message = 'Done.';
    } else {
      _Response.success = false;
      _Response.result = null;
      _Response.message = 'No records found!';
    }

    res.status(200).send(_Response);   //<- OK 

  } catch (error) {
    _Response.success = false;
    _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
    _Response.message = "Internal Server Error";
    res.status(500).send(_Response);
  }
});

accountRoutes.get('/users/show-statistics', (req, res) => {
  try {
    //Re-directs to the Chart page:
    res.status(200).sendFile('chart.html', { root: './public' });
  } catch (error) {
    _Response.success = false;
    _Response.result = { error: 500, message: error.message, stack_trace: error.stack };
    _Response.message = "Internal Server Error";
    res.status(500).send(_Response);
  }
});


//---------------------------------------------------------------------------------------------------------
// Update - using Put method
accountRoutes.put('/account/:id', (req, res) => {
  var existAccounts = getAccountData()
  fs.readFile(dataPath, 'utf8', (err, data) => {
    const accountId = req.params['id'];
    existAccounts[accountId] = req.body;

    saveAccountData(existAccounts);
    res.send(`accounts with id ${accountId} has been updated`)
  }, true);
});

//delete - using delete method
accountRoutes.delete('/account/delete/:id', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    var existAccounts = getAccountData()

    const userId = req.params['id'];

    delete existAccounts[userId];
    saveAccountData(existAccounts);
    res.send(`accounts with id ${userId} has been deleted`)
  }, true);
});

module.exports = accountRoutes