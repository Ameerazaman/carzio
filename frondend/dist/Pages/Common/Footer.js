import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
function Footer() {
    return (_jsx("div", { className: "bg-cover bg-center text-white py-12", style: { backgroundImage: 'url(/images/footer.jpg)' }, children: _jsxs("div", { className: "container mx-auto px-8 lg:px-16", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-gray-200 mb-4", children: "Welcome to Our Car Rental Service" }), _jsx("p", { className: "text-gray-400 mb-4", children: "We provide a wide range of vehicles to suit your travel needs. Enjoy your journey with us!" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(FaPhoneAlt, { className: "text-red-600" }), _jsx("p", { className: "text-gray-400", children: "(123) 456-7890" })] }), _jsxs("div", { className: "flex items-center space-x-4 mt-2", children: [_jsx(FaEnvelope, { className: "text-red-600" }), _jsx("p", { className: "text-gray-400", children: "info@example.com" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-gray-200 mb-4 relative inline-block", children: ["Head Office", _jsx("span", { className: "absolute left-0 bottom-0 w-10 h-1 bg-red-600" })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(FaMapMarkerAlt, { className: "text-red-600" }), _jsx("p", { className: "text-gray-400", children: "123 Main Street, City, State, Zip" })] })] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-xl font-bold text-gray-200 mb-4 relative inline-block", children: ["Quick Links", _jsx("span", { className: "absolute left-0 bottom-0 w-10 h-1 bg-red-600" })] }), _jsxs("ul", { className: "space-y-2", children: [_jsx("li", { children: _jsx("a", { href: "/about", className: "hover:text-red-600 text-gray-400", children: "About Us" }) }), _jsx("li", { children: _jsx("a", { href: "/services", className: "hover:text-red-600 text-gray-400", children: "Services" }) }), _jsx("li", { children: _jsx("a", { href: "/contact", className: "hover:text-red-600 text-gray-400", children: "Contact" }) }), _jsx("li", { children: _jsx("a", { href: "/faq", className: "hover:text-red-600 text-gray-400", children: "FAQ" }) })] })] })] }), _jsx("div", { className: "mt-8 border-t border-gray-700 pt-4 text-center", children: _jsxs("p", { className: "text-gray-400 text-sm", children: ["\u00A9 ", new Date().getFullYear(), " Car Rental Service. All Rights Reserved."] }) })] }) }));
}
export default Footer;