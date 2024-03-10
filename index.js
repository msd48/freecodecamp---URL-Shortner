require('dotenv').config();
const dns = require("node:dns")
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const urls = []



// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post("/api/shorturl", bodyParser.urlencoded({extended: false}))
app.post("/api/shorturl", function(req, res) {
  const correctURL = req.body.url.replace(/https?:[/]{2}/, "")
  dns.lookup(correctURL, (err, address, family) => {
    if (err) {
      res.json({ error: 'invalid url' })
    } else {
      const newURL = {original_url: req.body.url, short_url: urls.length + 1}
      const existingURL = urls.find(e => e.original_url === req.body.url)
      if (!existingURL) {
        urls.push(newURL)
        res.json(newURL);
      } else {res.json(existingURL)}
    }
  })
});

app.get("/api/shorturl/:short_url", function(req, res) {
  const existingURL = urls.find(e => e.short_url == req.params.short_url)
  if (existingURL) {
    res.redirect(existingURL.original_url)
  } else {res.json({ error: 'invalid url' })};
});




app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
