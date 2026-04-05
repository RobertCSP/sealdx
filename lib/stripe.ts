// Server-side Stripe client — never import this in client components.
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const FREE_LIMIT = 3; // documents per month on the free tier
