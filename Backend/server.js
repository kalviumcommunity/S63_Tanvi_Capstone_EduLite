const express = require("express");
const mongoose = require('mongoose');
const userRoutes = require('../Backend/userRoutes');

const app = express();

const PORT = 5000;

app.use('/api', userRoutes);

app.get('/', (req, res) => {
    res.send('Api is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})
