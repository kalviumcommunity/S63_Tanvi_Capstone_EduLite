const express = require('express');
const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const verifyToken = require('./authMiddleware');
const User = require('./models/user');
const ActivityLog = require('./models/ActivityLog');

// POST: Create a checkout session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
  try {
    const { amount, itemName, courseId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe configuration missing. Add STRIPE_SECRET_KEY to .env' });
    }

    // Fallback to explicit method types if the Stripe API version is older.
    // 'card' automatically supports Apple Pay and Google Pay on compatible devices.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: itemName,
            },
            unit_amount: amount * 100, // Stripe expects amount in smallest currency unit (paise)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}&amount=${amount}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/fees`,
      client_reference_id: req.user.id,
      customer_email: user.email,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// POST: Confirm payment and update DB
router.post('/confirm-payment', verifyToken, async (req, res) => {
  try {
    const { session_id, amount } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // In a real app, verify the session with Stripe
    if (process.env.STRIPE_SECRET_KEY) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ error: 'Payment not successful' });
      }
    }

    // Update user fee
    user.feePaid = (user.feePaid || 0) + Number(amount);
    
    // Gamification points (+50 for fee payment)
    user.points = (user.points || 0) + 50;
    
    await user.save();

    // Log Activity
    const io = req.app.get('io');
    const log = new ActivityLog({
      action: 'FEE_PAID',
      message: `${user.name} paid ₹${amount} towards fees. Earned 50 points!`,
      userId: user._id,
      role: 'student'
    });
    await log.save();
    
    if (io) {
      io.emit('newActivity', log);
    }

    res.status(200).json({ message: 'Payment confirmed successfully', points: user.points });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

module.exports = router;
