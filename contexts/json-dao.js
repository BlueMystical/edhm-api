const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;

const CyclicDb = require("@cyclic.sh/dynamodb");
const db = CyclicDb("careful-rose-singletCyclicDB");


// Instancia del JSON que contiene nuestro datos:   saveOnPush=true, HumanReadable=false
var jdb = new JsonDB(new Config('./Data/edhm_users.json', true, false, '/'));

/*  MODO DE USO DE 'JsonDB':

    ? Obtiene TODOS los registros:
        jdb.getData("/data");

    ? Cuenta el Total de Registros:
        let numberOfElement = jdb.count("/data");

    ? Obtiene el Ultimo elemento del Array:
        jdb.getData("/data[-1]");

    ? Doing this will delete the object stored at the index 0 of the array.
        jdb.delete("/data[0]");

    ? Obtiene el Indice del elemento buscado:
        var foundIndex = jdb.getIndex("/data", 'Blue Mystic', "CommanderName");

    ? Agrega un nuevo elemento al array:
        jdb.push("/data[]", UserData, true); 

        //Modifica un elelemnto del aRRAY
        jdb.push("/data[" + foundIndex + "]", UserData, false);

    ? divide un Objeto en un array de Claves y Valores
      const filters = Object.entries(req.query);
      console.log(filters);
      console.log(filters[0][0,0]);
      console.log(filters[0][0,1]);

    ? For Each
      theArray.forEach(element => {
          // ...use `element`...
      });
*/
//$------------------------------------- METODOS PRIVADOS ------------------------------------------------------------------------------*/


//Removes Non UTF-8 characters:
function cleanString(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127 || input.charCodeAt(i) >= 160 && input.charCodeAt(i) <= 255) {
            output += input.charAt(i);
        }
    }
    return output;
};
function stringToDate(_date, _format, _delimiter) {
    var formatLowerCase = _format.toLowerCase();
    var formatItems = formatLowerCase.split(_delimiter);
    var dateItems = _date.split(_delimiter);
    var monthIndex = formatItems.indexOf("mm");
    var dayIndex = formatItems.indexOf("dd");
    var yearIndex = formatItems.indexOf("yyyy");
    var month = parseInt(dateItems[monthIndex]);
    month -= 1;
    //var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
};


//Esta Clase se usa para Filtrar los Registros
class MyArray extends Array {
    filterBy(argument) {
        return this.filter(function (el) {
            try {
                //console.log(argument);
                if (typeof argument !== 'undefined' && Object.keys(argument).length) {
                    // object with key/parameter pairs for filtering:
                    // {key1: 0, gender: "m"}
                    //argument:  Date >= 2022-01-01 (yyyy-mm-dd)

                    for (let key in argument) {

                        if (key.indexOf('Date') > -1) {
                            //console.log('x');

                            var Operators = key.split(' ');
                            var CriteriaDate = stringToDate(argument[key], 'yyyy-mm-dd', '-');
                            var ValueDate = stringToDate(el[Operators[0]], 'yyyy-mm-dd', '-');

                            switch (Operators[1]) {
                                case '<':
                                    return (ValueDate <= CriteriaDate); break;
                                case '>':
                                    return (ValueDate >= CriteriaDate); break;
                                case '!':
                                    return (+ValueDate !== +CriteriaDate); break;
                                default:
                                    return (+ValueDate === +CriteriaDate); break;
                            }

                        } else {
                            // console.log('y');
                            //if (argument[key] !== el[key]) return false; //<- Busqueda Exacta
                            if (el[key].toLowerCase().indexOf(argument[key].toLowerCase()) === -1) return false; //<- Busqueda parcial
                        }
                    };
                    return true;
                } else if (typeof argument == "string") {
                    // string with logical expression with key names @-escaped, e.g.
                    // @gender == 'm' && @key1 == @key2
                    let expression = argument.split("@").join("el.")
                    return eval(expression);
                }
            } catch (error) {
                throw {
                    error: 500, message: 'Criteria Field not found!',
                    stack: 'at MyArray.filter (<anonymous>) at MyArray.filterBy ()'
                };
            }
        });
    }
};

//$----------------------------------- METODOS PUBLICAS --------------------------------------------------------------------------------*/
//** ESTE ES EL OBJETO QUE DEVUELVEN TODOS LOS METODOS <<--- */
var _Response = {
    success: false,
    result: null, //<- Lo que sea que estas buscando, o el detalle de los errores
    message: "Not Found"
};

/** Obtiene la Lista Completa de Usuarios. */
exports.JSONDB_GetUsers = async function () {
    
   // _Response.result = jdb.getData("/data");
    //JSON.parse(my_file);

    //let edhm_users = db.collection("edhm_users");
    let all_users =  await db.collection("edhm_users").list();
    if (all_users && all_users.results.length > 0) {
        _Response.result = new Array();

        for (const user of all_users.results) {
            var ret = await user.get();
            //console.log('line147:', ret);
            _Response.result.push(ret.props);
        };
    }
    
    if (_Response.result && _Response.result.length > 0) {
        _Response.success = true;
        _Response.message = _Response.result.length + ' records.';
    } else {
        _Response.success = false;
        _Response.result = null;
        _Response.message = 'No records found!';
    }
    return _Response;    
};

/** Agrega (o Actualiza) un Registro al Array de Usuarios.
 * @param  {} UserData  JSON con los datos del nuevo Usuario, si ya existe se sobre-escribe.  */
exports.JSONDB_AddUser = function (UserData) {
    try {
        //Removes Non UTF-8 characters:
        UserData.CommanderName = cleanString(UserData.CommanderName).replace(/[!@#$^&%*()+=[\]/{}|:<>?,.\\-]/g, '');

        // create an item in collection with key "leo"
        let edhm_users = db.collection("edhm_users");
        let leo = edhm_users.set(UserData.CommanderName, UserData);
        //console.log(leo);

        _Response.success = true;
        _Response.result = true;
        _Response.message = 'User data Added successfully (•̀ᴗ•́)و';

        //Obtiene el Indice del elemento buscado:
        /*var foundIndex = jdb.getIndex("/data", UserData.CommanderName, "CommanderName");

        //Verifies the pre-existance of the new record:
        if (foundIndex != null && typeof foundIndex != 'undefined' && foundIndex >= 0) {
            //The New Record already Exists!
            jdb.push("/data[" + foundIndex + "]", UserData, false);
            _Response.success = true;
            _Response.result = true;
            _Response.message = 'User data Updated successfully (•̀ᴗ•́)و';

        } else {
            //The New Record doesnt Exists
            jdb.push("/data[]", UserData, true);
            _Response.success = true;
            _Response.result = true;
            _Response.message = 'User data Added successfully (•̀ᴗ•́)و';
        } */

        
    } catch (error) {
        console.log(error);
        _Response.success = false;
        _Response.result = { name: error.name, message: error.message, stack: error.stack };
        _Response.message = 'Error';
    }
    return _Response;
};

/** PERMITE BUSCAR USUARIOS USANDO CUALQUIER CRITERIO DISPONIBLE
 * @param  {} Criteria Nombres de los Campos y Condicion de busqueda, ejem: 'CommanderName=Blue', 'Date >= 2022-07-09'  */
exports.JSONDB_FindUsers = async function (Criteria) {
    /*var AllRecords = jdb.getData("/data");
    if (AllRecords && AllRecords.length > 0) {
        _Response.result = MyArray.from(AllRecords).filterBy(Criteria);
    }*/

    var AllRecords = new Array();
    let all_users =  await db.collection("edhm_users").list();
    if (all_users && all_users.results.length > 0) {
        for (const user of all_users.results) {
            var ret = await user.get();
            AllRecords.push(ret.props);
        };
    }
    if (AllRecords && AllRecords.length > 0) {
        _Response.result = MyArray.from(AllRecords).filterBy(Criteria);
    }

    //let edhm_users = db.collection("edhm_users");
    //let item = await edhm_users.get('Blue Mystical');

    if (_Response.result) {
        _Response.success = true;
        _Response.message = _Response.result.length + ' records.';
    } else {
        _Response.success = false;
        _Response.result = null;
        _Response.message = 'No records found!';
    }
    return _Response;
};

exports.JSONDB_getUserData = async function (Criteria) {
    try {
    	let edhm_users = db.collection("edhm_users");
        let data = await edhm_users.get('Blue Mystical');
        //console.log(data);
        _Response.result = data.props;

        if (_Response.result) {
            _Response.success = true;
            _Response.message = 1 + ' records.';
        }

    } catch (err) {
       console.log(err)
    }  
    return _Response;  
};

/** Devuelve Estadisticas de Diferentes Campos. */
exports.JSONDB_GetStatistics = async function () {
    var result = {
        Countries: [],
        Languages: [],
        Odyssey: [{ Value: 'Odyssey', Count: 0 }, { Value: 'Horizons', Count: 0 }],
        GameMode: [],
        UserCount: 0
    }

    //var existingRecords = jdb.getData("/data"); //<- Obtiene los Registros Actuales
    let existingRecords = await db.collection("edhm_users").list();
    //console.log("Line_263:", existingRecords.length);

    if (existingRecords && existingRecords.results.length > 0) {
        //console.log("Line_265:", existingRecords);

        for (const user of existingRecords.results) {
            var userinfo = await user.get();
            //console.log("Line_270:", userinfo);

            //Si ya existe, le sumamos 1; Si no existe, lo agregamos
            //1. Countries:
            var Found = result.Countries.find(element => element.Value === userinfo.props.Country);
            if (Found && typeof Found != 'undefined') { if (Found.Value != '') { Found.Count++; } }
            else { if (userinfo.props.Country != '') { result.Countries.push({ Value: userinfo.props.Country, Count: 1 }); } }

            //2. Languages:
            Found = result.Languages.find(element => element.Value === userinfo.props.Language);
            if (Found != null && typeof Found != 'undefined') { Found.Count++; } else { result.Languages.push({ Value: userinfo.props.Language, Count: 1 }); }

            //3. Odyssey:
            if (userinfo.props.Odyssey === 'true') result.Odyssey[0].Count++;
            if (userinfo.props.Odyssey === 'false') result.Odyssey[1].Count++;

            //4. GameMode:
            Found = result.GameMode.find(element => element.Value === userinfo.props.GameMode);
            if (Found != null && typeof Found != 'undefined') { Found.Count++; } else { result.GameMode.push({ Value: userinfo.props.GameMode, Count: 1 }); }

            result.UserCount++;
        };
        
        result.Countries.sort((a, b) => (a.Count > b.Count) ? 1 : ((b.Count > a.Count) ? -1 : 0));
        result.Languages.sort((a, b) => (a.Value > b.Value) ? 1 : ((b.Value > a.Value) ? -1 : 0));
    }

    _Response.result = result;

    if (_Response.result) {
        _Response.success = true;
        _Response.message = result.UserCount + ' records.';
    } else {
        _Response.success = false;
        _Response.result = null;
        _Response.message = 'No records found!';
    }
    return _Response;
};

