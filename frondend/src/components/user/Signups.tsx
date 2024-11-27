import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../Api/User';
import { toast } from 'react-hot-toast';

interface Errors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}


function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  // Validation Function
  const validate = (): Errors => {
    const validationErrors: Errors = {};

    // Check if email is empty
    if (!email) {
      validationErrors.email = 'Email is required';
    }

    // Check if password is empty
    if (!password) {
      validationErrors.password = 'Password is required';
    }

    // Check if username is empty or contains spaces
    if (!username) {
      validationErrors.userName = 'Username is required';
    } else if (/\s/.test(username)) {
      validationErrors.userName = 'Username cannot contain spaces'; // Check for spaces in username
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if password is at least 6 characters long
    if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters';
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = { email, password, confirmPassword, username }; // Ensure username is used
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    try {
       
        let result = await signup(formData);
        if (result.success) {
            navigate('/otp'); // Navigate to OTP page on success
        } else {
            toast.error(result.message);
        }
    } catch (error) {
      
        toast.error('An error occurred during signup.');
    }
};


  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-2xl overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Left Side - Image Section */}
        <div
          className="hidden sm:block sm:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/Rent-a-car.jpeg')` }}
        />
        {/* Right Side - Signup Form */}
        <div className="w-full sm:w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Sign Up</h1>
          <p className="text-gray-500 mb-4">
            Create an account and get access to our car rental service.
          </p>
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative mb-4">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="username"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Username
              </label>
              {errors.userName && <p className="text-red-500">{errors.userName}</p>}
            </div>

            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Email
              </label>
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Password
              </label>
              {errors.password && <p className="text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="relative mb-4">
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0"
                placeholder=" "
              />
              <label
                htmlFor="confirm-password"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Confirm Password
              </label>
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
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
              <a href="/login" className="text-red-600 font-bold hover:text-red-500">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;


