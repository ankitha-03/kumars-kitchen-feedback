const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const multer   = require('multer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/restaurantFeedback');

app.use('/api/menu',     require('./routes/menu'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/feedback', upload.single('image'), require('./routes/feedback'));
app.use('/api/wonback', require('./routes/wonback'));

app.listen(5000, () => console.log('Server running on port 5000'));