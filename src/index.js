const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;
const route = require('./routes/index');
const db = require('./config/db');
const bodyParser = require('body-parser');
const bycrypt = require('bcrypt');


// ** HTTP logger **
app.use(morgan('tiny'));

// ** Static files **
app.use(express.static(path.join(__dirname, 'public')));

// ** Template engine **
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set("view engine', '.hbs");
app.set('views', path.join(__dirname, 'resources', 'views'));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// ** Connect to DB **
db.connect();

// ** router
route(app);






app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
