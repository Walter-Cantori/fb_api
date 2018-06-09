const app = require('express')();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const requireDir = require('require-dir');
require('dotenv').config();

const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url);
requireDir(dbConfig.modelsPath);

app.use(bodyParser.json());

app.use('/api', require('./src/routes'));

app.listen(3000);
