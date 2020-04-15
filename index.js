// remote webapp ====> https://lit-meadow-98814.herokuapp.com/ 
// remote repository ====> https://git.heroku.com/lit-meadow-98814.git 

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const UserModel = require('./models/User');
const authRouter = require('./routes/authRoutes');
const billingRouter = require('./routes/billingRoutes');


try {
    mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
} catch (err) {
    console.log('DB connection error:', err);
}


const app = express();

app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use(billingRouter);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('/client/build'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`---- Server listening on port ${PORT}..`);
});



