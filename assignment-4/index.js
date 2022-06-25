// Requiring Modules
const express = require('express');
var expressLayouts = require('express-ejs-layouts');
const app = express();

// set up view engine and layout
app.use(expressLayouts);
app.set('layout', './layout/main');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

// Set up express server
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
