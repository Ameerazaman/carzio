import { loadStripe } from '@stripe/stripe-js';
var stripePromise;
var getStripe = function () {
    if (!stripePromise) {
        console.log("keyv public", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};
export default getStripe;
