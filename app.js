const express = require('express');
const path = require('path');
const indexRouter = require('./routers/indexRouter');

require('dotenv').config()

const PORT = process.env.PORT || 8080;
const app = express();

//Set-up url request body parsing
app.use(express.urlencoded({ extended: false }));
//Set-up EJS
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");
//Set-up Public files
const assetsPath = path.join(__dirname, "Public");
app.use(express.static(assetsPath));

app.use('/', indexRouter);

//Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}. Rely.`));