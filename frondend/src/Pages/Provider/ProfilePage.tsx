// ProfilePage.jsx
import React, { useState } from 'react';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '+1 234 567 890',
    city: 'Los Angeles',
    state: 'CA',
    pinNumber: '90001',
  });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 pt-0">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg flex w-full max-w-3xl">
        {/* Profile Picture */}
        <div className="flex-shrink-0 w-1/3 flex justify-center items-center">
          <div className="w-32 h-32 rounded-full bg-gray-500 overflow-hidden">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex-grow w-2/3">
          <h1 className="text-xl font-bold mb-3 text-red-600">Provider Profile</h1>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
            {['name', 'email', 'phone', 'city', 'state', 'pinNumber'].map((field) => (
              <div className="relative mb-4" key={field}>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                //   value={profile[field]}
                //   onChange={handleChange}
                  disabled={!isEditing}
                  placeholder=" "
                  className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
                />
                <label
                  htmlFor={field}
                  className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            {isEditing ? (
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
