import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { userApi } from '../../../Services/Axios';
import { BookingConfirm, userIdStoredInCoupon } from '../../../Api/User';


const CheckoutForm = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const { bookingData } = location.state; // Get form data passed via navigation
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null); 
  
  
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        
        const response = await userApi.post('/create-payment-intent', {
          amount: bookingData.total_Amt, // Convert to cents
        });

        setPaymentIntent(response.data);
      } catch (error) {
        
      }
    };

    createPaymentIntent();
  }, [bookingData]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !paymentIntent?.clientSecret) {
      console.error("Stripe.js has not loaded or payment intent client secret is missing.");
      return;
    }

    setLoading(true);
    try {
      const { clientSecret } = paymentIntent;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
       
        toast.error("An error occurred during payment.");
      } else if (result.paymentIntent?.status === 'succeeded') {
        toast.success('Payment successful!');
        const result=await BookingConfirm(bookingData); 
        if(result){
          
          if(bookingData.Coupon){
            const result=await userIdStoredInCoupon(bookingData.Coupon,bookingData.UserId)
          }
          navigate('/success');  // Redirect to success page
        }
      }
    } catch (error) {
    
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
