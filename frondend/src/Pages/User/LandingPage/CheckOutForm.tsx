import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { userApi } from '../../../Services/Axios';
import { BookingConfirm } from '../../../Api/User';


const CheckoutForm = () => {
  const navigate=useNavigate()
  const location = useLocation();
  const { bookingData } = location.state; // Get form data passed via navigation
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null); // To store card validation errors

  // Create Payment Intent (called once the component mounts)
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        console.log(bookingData,"total Amount")
        const response = await userApi.post('/create-payment-intent', {
          amount: bookingData.total_Amt, // Convert to cents
        });
        console.log("response",response)
        setPaymentIntent(response.data);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [bookingData]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(paymentIntent,"paymentIntent")
    if (!stripe || !elements || !paymentIntent || !paymentIntent.client_secret) {
      console.error("Stripe.js has not loaded or payment intent is missing.");
      return;
    }

    setLoading(true);
    try {
      const { client_secret } = paymentIntent;
      console.log(client_secret, "client secret")
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      console.log("Payment Result:", result);

      if (result.error) {
        console.error("Payment Error:", result.error.message);
        toast.error("An error occurred during payment.");
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!');
        const bookingResult = await BookingConfirm(bookingData);
        navigate('/success')
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("An error occurred during payment.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <h2 className="text-center text-xl font-semibold">Checkout</h2>
      <div className="my-4">
        <CardElement />
        {cardError && <p className="text-red-500 text-center">{cardError}</p>} {/* Display card error */}
      </div>
      <div className="text-center">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

export default CheckoutForm;
