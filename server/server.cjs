// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000; // 👈 Use dynamic port for Railway

app.use(cors());

app.get('/api/proxy-image', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  // Optional: Security - Only allow TMDB images
  if (!url.startsWith('https://image.tmdb.org/')) {
    return res.status(403).send('Forbidden: Invalid image source');
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'];
    res.send(`data:${mimeType};base64,${base64}`);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Error fetching image');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
