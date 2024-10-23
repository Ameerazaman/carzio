import React from 'react';

function Error404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-6">Oops! Page not found</h2>
      <p className="text-center text-lg max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Please go back to the homepage.
      </p>
      <a href="/" className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300">
        Go to Homepage
      </a>
    </div>
  );
}

export default Error404;
