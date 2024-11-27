import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Common/Navbar';
import BookingPage from '../../Pages/User/LandingPage/BookingPage';
import Footer from '../../Pages/Common/Footer';
function BookingDetails() {
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsx("div", { className: "shadow-xl p-6 mt-4 rounded-lg bg-white", children: _jsx(BookingPage, {}) }), _jsx(Footer, {})] }));
}
export default BookingDetails;
