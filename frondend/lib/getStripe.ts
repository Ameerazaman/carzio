// lib/stripe.ts
import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    // Stripe's public key should be securely provided, preferably using environment variables
    stripePromise = loadStripe('pk_test_51QJq7aDRjWHiMHMFtss2Qg2I9G4lA8QA5oaq6IRMkJ4SkqdTGj04h6KM0eHTswcRKy0o60BN5R4fwF0KKvay6xdT00949UiDqH');
  }
  return stripePromise;
};

export default getStripe;
