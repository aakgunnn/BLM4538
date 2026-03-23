const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = require('./config/db');

// Basic Route with DB test
app.get('/api/health', async (req, res) => {
  try {
    const dbTest = await db.query('SELECT NOW()');
    res.status(200).json({ 
      status: 'UP', 
      message: 'Library System API is running',
      db: 'Connected',
      time: dbTest.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
