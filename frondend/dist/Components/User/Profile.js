import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Common/Navbar';
import UserProfile from '../../Pages/User/LandingPage/UserProfile';
import Footer from '../../Pages/Common/Footer';
function Profile() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex flex-grow", children: _jsx("div", { className: "flex-grow pt-0 pb-0", children: _jsx(UserProfile, {}) }) }), _jsx("div", { className: "mt-12", children: _jsx(Footer, {}) })] }));
}
export default Profile;
