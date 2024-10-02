import React, { useState, useRef, useEffect } from 'react';

// Sample slide data
const slides = [
  { image: '/images/hyundai-creta.webp', title: 'Cars are available', date: '2024-01-01' },
  { image: '/images/family-car.jpg', title: 'Family Cars', date: '2024-02-01' },
  { image: '/images/dark-side-car-digital-art-4k-2z.jpg', title: 'Luxury Cars', date: '2024-03-01' },
];

function Carosel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const carouselRef = useRef(null);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const translateXValue = -currentIndex * 100;

  const filteredSlides = slides.filter(slide => {
    const slideDate = new Date(slide.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (!startDate || slideDate >= start) && (!endDate || slideDate <= end);
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black"> {/* Main carousel background set to black */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${translateXValue}%)` }}
        ref={carouselRef}
      >
        {filteredSlides.length > 0 ? filteredSlides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl bg-black bg-opacity-50 p-4 rounded">{slide.title}</h2>
          </div>
        )) : (
          <div className="min-w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center bg-gray-900">
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl">No slides available</h2>
          </div>
        )}
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow-lg hover:bg-yellow-600"
      >
        ◀
      </button>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow-lg hover:bg-yellow-600"
      >
        ▶
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-1/2 p-4 bg-white bg-opacity-90 rounded-t-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <img 
            src="/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/bmw-offer.png" 
            alt="Car Offer"
            className="h-16 sm:h-24 object-contain mx-4" 
          />
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-black p-2 rounded w-full sm:w-auto"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-black p-2 rounded w-full sm:w-auto"
            />
            <button
              onClick={() => {
                console.log('Searching for cars...');
              }}
              className="bg-black text-white p-2 rounded w-full sm:w-auto hover:bg-gray-700"
            >
              Find a Car
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carosel;
