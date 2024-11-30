import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  return (
    <div className="relative bg-cover bg-center text-white py-12" style={{ backgroundImage: 'url(/images/footer.jpg)' }}>
      {/* Black overlay with increased opacity */}
      <div className="absolute inset-0 bg-black bg-opacity-75"></div> {/* Increased opacity to 75 */}
      
      <div className="container mx-auto px-8 lg:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-gray-200 mb-4">Welcome to Our Car Rental Service</h3>
            <p className="text-gray-400 mb-4">
              We provide a wide range of vehicles to suit your travel needs. Enjoy your journey with us!
            </p>
            <div className="flex items-center space-x-4">
              <FaPhoneAlt className="text-red-600" />
              <p className="text-gray-400">(123) 456-7890</p>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <FaEnvelope className="text-red-600" />
              <p className="text-gray-400">info@example.com</p>
            </div>
          </div>

          {/* Head Office Details */}
          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-4 relative inline-block">
              Head Office
              <span className="absolute left-0 bottom-0 w-10 h-1 bg-red-600"></span>
            </h3>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-red-600" />
              <p className="text-gray-400">123 Main Street, City, State, Zip</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-gray-200 mb-4 relative inline-block">
              Quick Links
              <span className="absolute left-0 bottom-0 w-10 h-1 bg-red-600"></span>
            </h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-red-600 text-gray-400">About Us</a></li>
              <li><a href="/services" className="hover:text-red-600 text-gray-400">Services</a></li>
              <li><a href="/contact" className="hover:text-red-600 text-gray-400">Contact</a></li>
              <li><a href="/faq" className="hover:text-red-600 text-gray-400">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Car Rental Service. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
