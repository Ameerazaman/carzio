import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // You can use any notification library if needed
import { adminLogin } from '../../Api/Admin';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccessAdmin } from '../../App/Slice/AdminSlice';

interface Errors {
  email?: string;
  password?: string;
}

function LoginAdmin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
let dispatch=useDispatch()
  const navigate = useNavigate();

  const validation = (): Errors => {
    const new_errors: Errors = {};
    const trimmedEmail = email.trim(); // Trim spaces at start and end
    const trimmedPassword = password.trim(); // Trim spaces at start and end

    if (!trimmedEmail) new_errors.email = 'Email is required';

    // Checking the trimmed password length and whitespace
    if (!trimmedPassword) {
      new_errors.password = 'Password is required';
    } else if (/\s/.test(password)) {
      new_errors.password = 'Password should not contain spaces';
    } else if (trimmedPassword.length < 6) {
      new_errors.password = 'Password must be at least 6 characters long';
    }

    // Update state with trimmed values
    setEmail(trimmedEmail);
    setPassword(trimmedPassword);

    return new_errors;
  };


  const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = { email, password };

    // Perform validation
    const validationErrors = validation();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Call loginUser with form data
      const response = await adminLogin(formData);
      console.log()
console.log(response,"response")
      if (response) {
        localStorage.setItem('token', response.data.token);
        dispatch( signInSuccessAdmin(response.data.user.data)) // Store the token
        navigate('/admin/dashboard'); // Redirect to home page
      } else {

        navigate('/admin/login'); // Redirect back to login page if failed
      }

    } catch (error) {
      console.log(error as Error);
      toast.error('somthing went wrong while login');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-2xl overflow-hidden rounded-lg shadow-lg bg-white">
        {/* Left Side - Image Section */}
        <div
          className="hidden sm:block sm:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/admin.webp')` }} // Ensure the path to the image is correct
        ></div>

        {/* Right Side - Login Form */}
        <div className="w-full sm:w-1/2 p-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Login</h1>
          <form onSubmit={submitData}>
            {/* Email Input */}
            {/* Email Input */}
            <div className="relative mb-4">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`peer block w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-0`}
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Email
              </label>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="relative mb-4">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`peer block w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-0`}
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
              >
                Password
              </label>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Already have an account? */}
          <div className="mt-4 text-center">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
