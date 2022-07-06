const noteRoutes = require('./account.js');

/* NADA QUE VER AQUI, VAYA AL 'account.js'  */
module.exports = function(app, db) {  
    noteRoutes(app, db);  
};