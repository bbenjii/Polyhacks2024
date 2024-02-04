const express = require('express');
const app = express();
const path = require('path');
app.use(express.json()); // for parsing application/json
const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


//mongodb connection string
const mongoose = require('mongoose');
const dbURI = "mongodb+srv://polyhacks2024:polyhacks-project@polyhacks-carpool.gye06fd.mongodb.net/?retryWrites=true&w=majority" ;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error(err));


//fonction pour ajouter un utilisateur au database
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    password: String, // Store hashed passwords only
    email: { type: String, unique: true },
    university: String,
    homeAddress: String,
    carSeats: Number // Optional, use if the user is a driver
});

const User = mongoose.model('User', userSchema);

const newUser = new User({
    firstName: 'Omar',
    lastName: 'Zed',
    password: '12345678910',
    email: 'omarzed@gmail.com',
    university: 'Polytechnique',
    homeAddress: 'Cote Vertu',
    carSeats: 4
});

// newUser.save()
//     .then(user => console.log(user))
//     .catch(err => console.error(err));


//function chercher tout les utilisateur
// Route to get all users
app.get('/users', async (req, res) => {
    try {

        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// POST route to add a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});