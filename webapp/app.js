const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));



//mongodb connection string
const mongoose = require('mongoose');
const dbURI = "mongodb+srv://polyhacks2024:polyhacks-project@polyhacks-carpool.gye06fd.mongodb.net/?retryWrites=true&w=majority"

;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error(err));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trouver l'utilisateur dans la base de données par email
        const user = await User.findOne({ email });

        // Si l'utilisateur existe
        if (user) {
            // Comparer le mot de passe en texte clair (à des fins de démonstration seulement)
            if (user.password === password) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashed_password_here',
    email: 'john.doe@example.com',
    university: 'Some University',
    homeAddress: '123 Main St',
    carSeats: 4
});

newUser.save()
    .then(user => console.log(user))
    .catch(err => console.error(err));


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