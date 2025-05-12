const express = require('express');

const PORT = 8080;
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}. Rely.`));