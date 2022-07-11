const usersRoutes = require('./users');

/* NADA QUE VER AQUI, VAYA AL './users.js'  */
module.exports = function(app, db) {  
    usersRoutes(app, db);  
    // Other route groups could go here, in the future
};