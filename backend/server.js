/** @format */

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/goals', require('./routes/goalRoute'));
app.use('/api/users', require('./routes/userRoute'));

app.use(errorHandler);

app.listen(port, () => console.log(`API is running on port ${port}`));
