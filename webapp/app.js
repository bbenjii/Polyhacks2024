const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json()); // for parsing application/json
app.use(cors());


app.use(session({
    secret: 'polyhacks2024', // This should be a random string for security
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));


//login
app.post('/login', (req, res) => {
    // ... your login logic here, including authentication
    console.log("login started")
    // If authentication is successful
    //mock id
    req.session.userId = "65becd30c93f464f57302939";

    res.status(200).json({ success: true });



    // req.session.userId = user._id; // Store the user's ID (or other identifier) in the session
    // res.redirect('/userdashboard'); // Redirect to the dashboard or other page
    // res.redirect( 301,'/public/dashboard.html');

});

app.get('/dashboard', checkAuth, (req, res) => {
    console.log("redirect done")
    res.sendFile('/public/dashboard.html', { root: __dirname });

    // console.log(res)

});


function checkAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login.html');
    }
}


app.get('/get-user-info', async (req, res) => {
    if (req.session.userId) {
        try {
            // Use await to wait for the promise to resolve
            const user = await User.findById(req.session.userId, 'firstName lastName email');
            if (!user) {
                res.status(404).send('User not found');
            } else {
                res.json({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error getting user info');
        }
    } else {
        res.status(403).send('User not logged in');
    }
});

//mongodb connection string
const mongoose = require('mongoose');
const dbURI = "mongodb+srv://polyhacks2024:polyhacks-project@polyhacks-carpool.gye06fd.mongodb.net/?retryWrites=true&w=majority" ;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.error(err));

const rideRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fromLocation: String,
    toLocation: String,
    departureTime: Date,
    seatsNeeded: Number,
    additionalInfo: String,
    status: { type: String, default: 'pending' } // e.g., pending, confirmed, completed, cancelled
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