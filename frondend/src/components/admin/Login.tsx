import React from 'react';

function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-2xl overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Left Side - Image Section */}
        <div
          className="hidden sm:block sm:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/admin.webp')` }} // Ensure the path to the image is correct
        >
          {/* You can add additional styling or content to the image section if needed */}
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full sm:w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Login</h1>
          <p className="text-gray-500 mb-4">
         
          </p>
          <form>
            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500">
                Email
              </label>
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500">
                Password
              </label>
            </div>

          

            {/* Submit Button */}
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-300">
              Create Account
            </button>
          </form>

          {/* Already have an account? */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-red-600 font-bold hover:text-red-500">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
