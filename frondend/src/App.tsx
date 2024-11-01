import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react'; // Import Suspense and lazy
import Loading from './Pages/Common/Loading';




// Lazy loading components
const CouponMgt=lazy(()=>import('./Components/Admin/CouponMgt'))
const AddCoupons=lazy(()=>import('./Components/Admin/AddCoupons'))
const OfferPage=lazy(()=>import('./Components/User/OfferPage'))
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
        {/* Wrap the routes with Suspense and provide a loading message */}
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



            {/* ************************************Provider Side*************************** */}

            <Route path="/provider/login" element={<ProviderLogin />} />
            <Route path="/provider/signup" element={<ProviderSignup />} />
            <Route path="/provider/home" element={<ProviderHome />} />
            <Route path="/provider/otp" element={<ProviderOtp />} />
            <Route path="/provider/add_car" element={<AddCarMgt />} />
            <Route path="/provider/cars" element={<CarMgt />} />
            <Route path="/provider/edit_car/:id" element={<EditCarMgt />} />

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
            <Route path="/admin/add_coupon" element={<AddCoupons/>} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
