// proxy-server.js
const express = require('express');
const fetch = require('node-fetch');
const helmet = require('helmet');
const { URL } = require('url');

const app = express();
app.use(helmet());

function isSafeTarget(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

app.get('/fetch', async (req, res) => {
  const target = req.query.url;
  if (!target || !isSafeTarget(target)) return res.status(400).send('Invalid URL');

  try {
    const response = await fetch(target);
    const contentType = response.headers.get('content-type') || 'text/html';
    res.set('Content-Type', contentType);
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch target');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy server running on port', PORT));