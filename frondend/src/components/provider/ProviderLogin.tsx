import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { loginProvider } from '../../Api/Provider'
import { toast } from 'react-hot-toast';
import { signInSuccessProvider } from '../../App/Slice/ProviderSlice';
// import { signInSuccess } from '../../app/slice/userSlice';

interface Errors {
  email?: string;
  password?: string;
}

function ProviderLogin() {
  let dispatch = useDispatch()
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});

  const navigate = useNavigate();

  const validation = (): Errors => {
    const new_errors: Errors = {};
    const trimmedEmail = email.trim();   // trim spaces at the start and end
    const trimmedPassword = password.trim();  // trim spaces at the start and end

    if (!trimmedEmail) new_errors.email = 'Email is required';
    if (!trimmedPassword) new_errors.password = 'Password is required';
    if (/\s/.test(trimmedPassword)) {
      new_errors.password = 'Password should not contain spaces';
    }
    if (password.length < 6) {
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
      const response = await loginProvider(formData);

      if (response) {
       
        dispatch( signInSuccessProvider(response.data.user.data))
        localStorage.setItem('token', response.data.token); // Store the token
        navigate('/provider/home'); // Redirect to home page
      } else {

        navigate('/provider/login'); // Redirect back to login page if failed
      }

    } catch (error) {
 
      toast.error('somthing went wrong while login');
    }
  };

  return (
    <div>
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg sm:flex">
          <div
            className="m-2 w-full rounded-2xl bg-gray-400 bg-cover bg-center text-white sm:w-1/3"
            style={{ backgroundImage: `url('/images/provider.webp')` }}>
          </div>
          <div className="w-full sm:w-2/3">
            <div className="p-8">
              <h1 className="text-3xl font-black text-slate-700">Sign in</h1>
              <p className="mt-2 mb-5 text-base leading-tight text-gray-600">
                Create an account to get access to 1000+ Freebies
              </p>
              <form onSubmit={submitData} className="mt-8">
                <div className="relative mt-2 w-full">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email} // bind the trimmed value
                    type="text"
                    id="email"
                    className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
                  >
                    Enter Your Email
                  </label>    
                  {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
                <div className="relative mt-2 w-full">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password} // bind the trimmed value
                    type="password"
                    id="password"
                    className="border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                  />
                  <label
                    htmlFor="password"
                    className="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
                  >
                    Enter Your Password
                  </label>
                  {errors.password && <p className="text-red-500">{errors.password}</p>}
                </div>
                <input
                  className="mt-4 w-full cursor-pointer rounded-lg bg-red-600 pt-3 pb-3 text-white shadow-lg hover:bg-red-500"
                  type="submit"
                  value="Sign in"
                />
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?
                  <a
                    href="/provider/signup"
                    className="font-bold text-red-600 no-underline hover:text-red-500"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderLogin;
