import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, } from 'react'; // Import Suspense and lazy
import Loading from './Pages/Common/Loading';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



const stripePromise = loadStripe('pk_test_51QJq7aDRjWHiMHMFbKsTqHRDHPep0XNgdvdjLwN8gWxkZpn2mMKx4fKXm0fQLjusUKKqRfFPzd17w52FH9Koe07800Ce8IksDd');
// Lazy loading components

const BookingReportProvider =lazy(()=>import( './Components/Provider/BookingReportProvider'));
const BookingReport =lazy(()=>import('./Components/Admin/BookingReport')) ;
const DashboardProvider = lazy(() => import('./Components/Provider/DashboardProvider'));
const Chat = lazy(() => import('./Components/Provider/Chat'));
const CheckoutForm = lazy(() => import('./Pages/User/LandingPage/CheckOutForm'));
const Profile = lazy(() => import('./Components/User/Profile'));
const WalletPage = lazy(() => import('./Components/User/WalletPage'));

const HistoryDetailsInAdmin = lazy(() => import('./Components/Admin/HistoryDetailsInAdmin'))
const BookingHistoryInAdmin = lazy(() => import('./Components/Admin/BookingHistoryInAdmin'))
const HistoryDetailsInProvider = lazy(() => import('./Components/Provider/HistoryDetailsInProvider'))
const BookingHistoryInProvider = lazy(() => import('./Components/Provider/BookingHistoryInProvider'))
const UserHistoryDetails = lazy(() => import('./Components/User/UserHistoryDetails'))
const BookingHistory = lazy(() => import('./Components/User/BookingHistory'))
const SuccessPage = lazy(() => import('./Pages/User/LandingPage/Success'))
const BookingDetails = lazy(() => import('./Components/User/BookingDetails'))
const EditCouponMgt = lazy(() => import('./Components/Admin/EditCouponMgt'))
const CouponMgt = lazy(() => import('./Components/Admin/CouponMgt'))
const AddCoupons = lazy(() => import('./Components/Admin/AddCoupons'))
const OfferPage = lazy(() => import('./Components/User/OfferPage'))
const EditOfferMgt = lazy(() => import('./Components/Admin/EditOfferMgt'))
const AddOffers = lazy(() => import('./Components/Admin/AddOffers'))
const OfferMgt = lazy(() => import('./Components/Admin/OfferMgt'))
const CarList = lazy(() => import('./Components/User/CarList'))
const CarDetailPage = lazy(() => import('./Components/User/CarDetailPage'))
const EditCarMgt = lazy(() => import('./Components/Provider/EditCarMgt'))
const CarsMgt = lazy(() => import('./Components/Admin/CarsMgt'))
const CarMgt = lazy(() => import('./Components/Provider/CarMgt'))
const NotificationDetail = lazy(() => import('./Components/Admin/NotificationDetail'))
const NotificationMgt = lazy(() => import('./Components/Admin/NotificationMgt'));
const LandingPage = lazy(() => import('./Components/User/LandingPage'));
const Login = lazy(() => import('./Components/User/Login'));
const Signup = lazy(() => import('./Components/User/Signups'));
const Otp = lazy(() => import('./Components/User/Otp'));
const Home = lazy(() => import('./Components/User/Home'));
const ProviderLogin = lazy(() => import('./Components/Provider/ProviderLogin'));
const ProviderSignup = lazy(() => import('./Components/Provider/ProviderSignup'));
const ProviderHome = lazy(() => import('./Components/Provider/ProviderHome'));
const ProviderOtp = lazy(() => import('./Components/Provider/ProviderOtp'));
const LoginAdmin = lazy(() => import('./Components/Admin/LoginAdmin'));
const Dashboard = lazy(() => import('./Components/Admin/Dashboard'));
const UserMgt = lazy(() => import('./Components/Admin/UserMgt'));
const ProviderMgt = lazy(() => import('./Components/Admin/ProviderMgt'));
const AddCarMgt = lazy(() => import('./Components/Provider/AddCarMgt'));
const EditUserMgt = lazy(() => import('./Components/Admin/EditUserMgt'));
const EditProviderMgt = lazy(() => import('./Components/Admin/EditProviderMgt'));
const Error404 = lazy(() => import('./Pages/Common/Error404'));
const InternalServerError = lazy(() => import('./Pages/Common/InternalServerError'));

function App() {
  return (

    <div>
      <Router>

        <Suspense fallback={<div><Loading /></div>}>
          <Routes>
            {/* Error routes */}
            <Route path="/error/404" element={<Error404 />} />
            <Route path="/internal_server_error" element={<InternalServerError />} />

            {/* ************************************userSide*********************** */}

            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/home" element={<Home />} />
            <Route path='/car_details/:id' element={<CarDetailPage />} />
            <Route path='/carlist' element={<CarList />} />
            <Route path='/offers' element={<OfferPage />} />
            <Route path='/booking_details/:carId' element={<BookingDetails />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/checkout' element={<Elements stripe={stripePromise}><CheckoutForm /></Elements>} />
            <Route path='/success' element={<SuccessPage />} />
            <Route path='/booking_history' element={<BookingHistory />} />
            <Route path='/view_details/:bookingId' element={<UserHistoryDetails />} />
            <Route path='/wallet' element={<WalletPage />} />



            {/* ************************************Provider Side*************************** */}

            <Route path="/provider/login" element={<ProviderLogin />} />
            <Route path="/provider/signup" element={<ProviderSignup />} />
            <Route path="/provider/home" element={<ProviderHome />} />
            <Route path="/provider/otp" element={<ProviderOtp />} />
            <Route path="/provider/add_car" element={<AddCarMgt />} />
            <Route path="/provider/cars" element={<CarMgt />} />
            <Route path="/provider/edit_car/:id" element={<EditCarMgt />} />
            <Route path="/provider/booking" element={<BookingHistoryInProvider />} />
            <Route path='/provider/view_details/:bookingId' element={<HistoryDetailsInProvider />} />
            <Route path='/provider/chat' element={<Chat />} />
            <Route path="/provider/dashboard" element={<DashboardProvider />} />
            <Route path="/provider/sales_report" element={<BookingReportProvider />} />
            {/* *************************************Admin Side**************************** */}

            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/users" element={<UserMgt />} />
            <Route path="/admin/edit_user/:id" element={<EditUserMgt />} />
            <Route path="/admin/providers" element={<ProviderMgt />} />
            <Route path="/admin/edit_provider/:id" element={<EditProviderMgt />} />
            <Route path="/admin/notifications" element={<NotificationMgt />} />
            <Route path="/admin/notifications_details/:id" element={<NotificationDetail />} />
            <Route path="/admin/cars" element={<CarsMgt />} />
            <Route path="/admin/offers" element={<OfferMgt />} />
            <Route path="/admin/add_offer" element={<AddOffers />} />
            <Route path="/admin/edit_offers/:id" element={<EditOfferMgt />} />
            <Route path="/admin/coupon" element={<CouponMgt />} />/
            <Route path="/admin/add_coupon" element={<AddCoupons />} />
            <Route path="/admin/edit_coupons/:id" element={<EditCouponMgt />} />
            <Route path="/admin/booking" element={<BookingHistoryInAdmin />} />
            <Route path='/admin/view_details/:bookingId' element={<HistoryDetailsInAdmin />} />
            <Route path="/admin/sales_report" element={<BookingReport />} />

          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
