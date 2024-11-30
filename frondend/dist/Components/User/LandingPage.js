import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Common/Navbar';
import About from '../../Pages/User/LandingPage/About';
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard';
import Carosel from '../../Pages/Common/Carosel';
import Footer from '../../Pages/Common/Footer';
function LandingPage() {
    var handleSearhCar = function (data) {
    };
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsx(Carosel, { onEvent: handleSearhCar }), _jsx(About, {}), _jsx(ServicesCard, {}), _jsx("div", { className: "mt-12", children: _jsx(Footer, {}) })] }));
}
export default LandingPage;
