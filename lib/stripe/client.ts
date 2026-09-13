import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
  typescript: true,
});

export const isStripeConfigured = () => {
  return Boolean(process.env.STRIPE_SECRET_KEY);
};

export function assertStripeConfigured() {
  if (!isStripeConfigured()) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.');
  }
}
