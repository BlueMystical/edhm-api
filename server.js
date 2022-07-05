const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs');

// create our express app
const app = express()
// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// route
const routes = require('./Routes/Route')
app.use('/', routes)

//start server 
/*
app.listen(3000, ()=>{
    console.log("Escuchando el puerto :3000")
}) */

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});