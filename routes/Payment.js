const express = require('express');
const Stripe = require('stripe');
const Payment = require('../models/Payment');
const router = express.Router();

const stripe = Stripe('sk_test_51QECqmJiclWUf5gQ3StkQQODuXVxgGbI2set1hgURDonuFeaR7NvU2pXRXCAIedsULo8Nky1sVgWqrGQBVFVYcsS00HPChJAsM');
router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    const newPayment = new Payment({
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });

    await newPayment.save();


    res.status(200).json({ clientSecret: paymentIntent.client_secret });
} catch (error) {
  console.error('Error creating payment intent:', error.message);
  res.status(500).json({ error: 'Failed to create payment intent' });
}
});

module.exports = router;