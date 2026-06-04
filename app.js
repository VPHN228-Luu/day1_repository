const express = require('express');
const itemsRouter = require('./routes/items');

const app = express();
app.use(express.json());

app.use('/items', itemsRouter);

module.exports = app;
