import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ServicesCard() {
    return (_jsx("div", { className: "p-8 flex justify-center", children: _jsxs("div", { className: "flex flex-col items-center max-w-7xl w-full", children: [_jsx("h6", { className: "text-xl font-bold mb-2 text-red-600 text-center", children: "See Our" }), _jsx("h4", { className: "text-2xl font-bold mb-8 text-gray-600 text-center", children: "Latest Services" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
                        {
                            imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/airport-transport.png",
                            title: "Airport Services",
                            description: "Our airport services provide seamless transportation solutions for travelers. We offer convenient pick-up.",
                        },
                        {
                            imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/city-transport.png",
                            title: "City Transfer",
                            description: "Our city transfer services offer efficient and reliable transportation for individuals and groups navigating urban areas.",
                        },
                        {
                            imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/wedding-ceremony.png",
                            title: "Ceremony",
                            description: "Our ceremony services offer efficient and reliable transportation for events and celebrations.",
                        },
                    ].map(function (service, index) { return (_jsxs("div", { className: "bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105", children: [_jsx("img", { src: service.imgSrc, alt: service.title, className: "w-20 h-20 object-contain mb-4" }), _jsx("h6", { className: "text-lg font-semibold text-gray-800", children: service.title }), _jsx("p", { className: "text-gray-600 text-center text-sm", children: service.description })] }, index)); }) })] }) }));
}
export default ServicesCard;
