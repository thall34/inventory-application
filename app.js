const express = require('express');
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000

const indexRouter = require('./routes/indexRouter');
const coasterRouter = require('./routes/coasterRouter');
const parkRouter = require('./routes/parkRouter');
const riderRouter = require('./routes/riderRouter');
const errorHandler = require('./utils/errorHandler');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/coaster', coasterRouter);
app.use('/park', parkRouter);
app.use('/rider', riderRouter);
app.get('/{*splat}', (req, res) => {
  res.status(404).render('errors', {
    title: 'Error 404 - Page Not Found',
    message: 'Error 404 - Page does not exist in the database',
  });
});
app.use(errorHandler);

app.listen(PORT, (err) => {
    if (err) {
        throw err;
    };

    console.log(`Roller Coaster Database App - listening on port ${PORT}`);
});