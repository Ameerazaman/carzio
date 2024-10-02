import React from 'react';

function Footer() {
  return (
    <div
      className="bg-cover bg-center text-white p-8"
      style={{ backgroundImage: 'url(/images/slide2.jpg)' }}
    >
      <div className="container mx-auto flex flex-col justify-between h-full py-16">
        <div>
          <h3 className="text-2xl font-bold mb-2 text-gray-400">Welcome to Our Car Rental Service</h3> {/* Changed to gray */}
          <p className="mb-4 text-gray-400">We provide a wide range of vehicles to suit your travel needs. Enjoy your journey with us!</p> {/* Changed to gray */}
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          {/* Head Office Details */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2 relative inline-block text-gray-400">
              Head Office
              <span className="absolute left-0 bottom-0 w-full h-1 bg-red-600"></span> {/* Red underline */}
            </h3>
            <p className="text-gray-400">123 Main Street</p> {/* Changed to gray */}
            <p className="text-gray-400">City, State, Zip</p> {/* Changed to gray */}
            <p className="text-gray-400">Phone: (123) 456-7890</p> {/* Changed to gray */}
            <p className="text-gray-400">Email: info@example.com</p> {/* Changed to gray */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-2 relative inline-block text-gray-400">
              Quick Links
              <span className="absolute left-0 bottom-0 w-full h-1 bg-red-600"></span> {/* Red underline */}
            </h3>
            <ul>
              <li><a href="/about" className="hover:underline text-gray-400">About Us</a></li> {/* Changed to gray */}
              <li><a href="/services" className="hover:underline text-gray-400">Services</a></li> {/* Changed to gray */}
              <li><a href="/contact" className="hover:underline text-gray-400">Contact</a></li> {/* Changed to gray */}
              <li><a href="/faq" className="hover:underline text-gray-400">FAQ</a></li> {/* Changed to gray */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

