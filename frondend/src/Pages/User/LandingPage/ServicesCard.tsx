import React from 'react';

function ServicesCard() {
  return (
    <div className="p-8 flex justify-center">
      <div className="flex flex-col items-center max-w-7xl w-full">
        <h6 className="text-xl font-bold mb-2 text-red-600 text-center">See Our</h6>
        <h4 className="text-2xl font-bold mb-8 text-gray-600 text-center">Latest Services</h4>

        {/* Responsive grid layout for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
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
          ].map((service, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105">
              <img
                src={service.imgSrc}
                alt={service.title}
                className="w-20 h-20 object-contain mb-4"
              />
              <h6 className="text-lg font-semibold text-gray-800">{service.title}</h6>
              <p className="text-gray-600 text-center text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesCard;

