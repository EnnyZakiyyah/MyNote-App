require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

//override PUT for edit
const methodOverride = require('method-override');  

const connectDB = require('./server/config/db');

const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Folder Public
app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));
// app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log('App Listening on port ${PORT}');
})