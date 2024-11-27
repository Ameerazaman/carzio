import React, { useEffect, useState } from 'react';
import { editProvider, editUser, updateProvider, updateUser } from '../../Api/Admin';
import { useParams, useNavigate } from 'react-router-dom';

interface EditUserProps {
  header: string;
}
const EditUser: React.FC<EditUserProps> = ({ header }) => {
  const { id } = useParams<{ id: string }>(); // Extracting `id` from URL params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (header === 'user') {
        if (id) {
          try {

            const result = await editUser(id);
           
            const userData = result?.data; // Assuming user data is inside `data`
      
            setFormData({
              username: userData?.username || '',
              email: userData?.email || '',
              password: '' // Keep password empty for security reasons
            });
          } catch (error) {
          
          }
        } else {
          
        }
      }
      else {
        if (id) {
          try {

            const result = await editProvider(id);
            console.log(result, "result") // Ensure 'id' is defined
            const providerData = result?.data; // Assuming user data is inside `data`
            // Setting the formData with the fetched user data
            setFormData({
              username: providerData?.username || '',
              email: providerData?.email || '',
              password: '' // Keep password empty for security reasons
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        } else {
          console.error('No user ID provided.');
        }
      }

    };

    fetchUserData();
  }, [id]); // Re-run the effect if 'id' changes

  const validateForm = () => {
    const newErrors = { username: '', email: '', password: '' };
    let isValid = true;

    if (!formData.username) {
      newErrors.username = 'Username is required.';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm() && id) {  // Ensure that 'id' is not undefined
      if(header==='user'){

        try {
          // Call the updateUser function with formData and user id
          const result = await updateUser(formData, id);
  
          // Check if the update was successful, then navigate
          if (result) {
            navigate("/admin/users"); // Correcting the route
          }
  
          console.log('Submitted data:', formData);
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
      else{
        try {
          // Call the updateUser function with formData and user id
          const result = await updateProvider(formData, id);
  
          // Check if the update was successful, then navigate
          if (result) {
            navigate("/admin/providers"); // Correcting the route
          }
  
          console.log('Submitted data:', formData);
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }
    } else {
      console.error('User ID is not provided.');
    }
  };


  return (
    <div className="edit-user-form max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Edit {header}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className={`mt-1 block w-full border rounded-md p-2 ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className={`mt-1 block w-full border rounded-md p-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>


        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditUser;
