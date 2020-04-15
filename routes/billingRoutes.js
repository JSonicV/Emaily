const express = require('express');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const { requireAuth } = require('../services/middlewares');

const router = express.Router();

router.post('/api/stripe', requireAuth, async (req, res) => {
    const charge = await stripe.charges.create({
        amount: 500,
        currency: 'usd',
        description: '$5 for 5 emails',
        source: req.body.id
    });

    req.user.credits += 5;
    const user = await req.user.save();

    res.send(user);
});

module.exports = router;