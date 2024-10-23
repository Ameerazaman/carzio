import React from 'react';

function ServicesCard() {
  return (
    <div className="p-8 flex justify-center"> {/* Adjusted padding to p-8 for a better layout */}
      <div className="flex flex-col items-center max-w-5xl w-full">
        <h6 className="text-xl font-bold mb-2 text-red-600 text-center">See Our</h6>
        <h4 className="text-xl font-bold mb-6 text-gray-600 text-center">Latest Services</h4>
        
        <div className="flex justify-between flex-wrap gap-6"> {/* Removed overflow and added gap for spacing */}
          {[
           
            {
              imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/airport-transport.png",
              title: "Airport Services",
              description: "Our airport services provide seamless transportation solutions for travelers. We offer convenient pick-up."
            },
            {
              imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/city-transport.png",
              title: "City Transfer",
              description: "Our city transfer services offer efficient and reliable transportation for individuals and groups navigating urban."
            },
            {
              imgSrc: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/wedding-ceremony.png",
              title: "Ceremony",
              description: "Our ceremony services offer efficient and reliable transportation for events and celebrations."
            }
          ].map((service, index) => (
            <div key={index} className="max-w-xs w-full">
              <div className="bg-white shadow-2xl rounded-lg p-6 flex flex-col items-center space-y-4 h-64 transition-transform duration-300 hover:scale-105"> {/* Adjusted padding to p-6 and space-y to 4 */}
                <img 
                  src={service.imgSrc} 
                  alt={service.title} 
                  className="w-full h-16 object-cover rounded-t-lg" 
                  style={{ objectFit: 'contain' }} 
                />
                <h6 className="text-lg font-semibold text-gray-600">{service.title}</h6>
                <p className="text-gray-700 text-center text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesCard;

