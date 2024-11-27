import React, { useEffect, useState } from 'react';
import { editProfileData, getProfile, submitProfileData, updateProfileImage } from '../../Api/Provider';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from '../Common/Navbar';
import { FaUpload } from 'react-icons/fa'; // Importing upload icon

// Define the type for the profile fields
export type ProfileType = {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pinNumber: string;
  providerId: string;
  image?: string; // Optional imageUrl field for profile image
};

const ProfilePage = () => {
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
  const [profileId, setProfileId] = useState('');
  const [profile, setProfile] = useState<ProfileType>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    pinNumber: '',
    providerId: '',
    image: '', // Default image placeholder
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileType>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Image file state

  // Fetch profile data when the component mounts or when provider changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (provider && provider._id) {
        try {
          const result = await getProfile(provider._id);
          if (result) {
            setProfile(result.data);
            setProfileId(result.data._id);
            setIsEditing(true); // Assuming result.data contains the profile data
          } else {
            toast.error('Failed to fetch profile data.');
          }
        } catch (error) {
          toast.error('Error fetching profile data.');
        }
      }
    };

    fetchProfile();
  }, [provider, isEditing]);

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file); // Set the selected image as File

      // Create a preview of the image using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          imageUrl: reader.result as string, // Base64 image preview
        }));
      };
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileType> = {};
    if (!profile.name) newErrors.name = 'Name is required';
    if (!profile.email) newErrors.email = 'Email is required';
    if (!profile.phone) newErrors.phone = 'Phone is required';
    if (!profile.city) newErrors.city = 'City is required';
    if (!profile.state) newErrors.state = 'State is required';
    if (!profile.pinNumber) newErrors.pinNumber = 'Pin Number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //******** */ update image*****************

  const updateImage = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedImage); // 'image' should match the backend field name
      const result = await updateProfileImage(formData, profileId);

      if (result) {
        toast.success('Image updated successfully.');
      } else {
        toast.error('Failed to update the image.');
      }
    } catch (error) {
      toast.error('Error updating image. Please try again.');
    }
  };


  // Handle form submit
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      toast.error('Please fill all fields correctly.');
      return;
    }

    if (!provider) {
      toast.error('No provider data available.');
      return;
    }

    // Prepare form data
    const formData = {
      name: profile.name,
      phone: profile.phone,
      city: profile.city,
      state: profile.state,
      pinNumber: profile.pinNumber,
      email: profile.email,
      providerId: provider._id,
      image: profile.image, // Include image URL in form data
    };

    try {
      if (isEditing) {
        const result = await editProfileData(formData, profileId);
        if (result) {
          toast.success('Profile updated successfully.');
        } else {
          toast.error('Failed to update profile.');
        }
      } else {
        const result = await submitProfileData(formData);
        if (result) {
          toast.success('Profile saved successfully.');
        } else {
          toast.error('Failed to save profile.');
        }
      }
    } catch (error) {
      toast.error('Error saving profile. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 pt-0">

      <div className="bg-white p-6 rounded-lg shadow-lg flex w-full max-w-3xl mb-8">
        <div className="flex-shrink-0 w-1/3 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-500 overflow-hidden mb-4">
            <img
              src={profile.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Image Upload */}
          <div className="mt-2 w-full text-center flex items-center justify-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-3/4 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1"
            />
            <button
              type="button"
              onClick={updateImage}
              className="text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              <FaUpload size={20} /> {/* Icon size adjusted */}
            </button>
            {selectedImage && (
              <p className="text-xs text-gray-500 mt-1 w-full text-left">Image selected: {selectedImage.name}</p>
            )}
          </div>

        </div>
        <div className="flex-grow w-2/3">
          <h1 className="text-xl font-bold mb-3 text-red-600">Provider Profile</h1>
          <form onSubmit={saveProfile}>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
              {(['name', 'email', 'phone', 'city', 'state', 'pinNumber'] as (keyof ProfileType)[]).map((field) => (
                <div className="relative mb-4" key={field}>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={profile[field]}
                    onChange={handleChange}
                    placeholder=" "
                    className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ${isEditing ? 'bg-white' : 'bg-gray-200'} ${errors[field] ? 'border-red-500' : ''}`}
                  />
                  <label
                    htmlFor={field}
                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>



            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
              >
                {isEditing ? 'Edit' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl flex items-center">
        <div className="w-2/3 pr-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Do you want to earn from this app?</h2>
          <p className="text-gray-700 mb-6">Please add your car details here to start renting it out.</p>
          <div className="flex justify-center">
            <a href="/provider/add_car">
              <button

                className="bg-red-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-red-700 transition"
              >
                Add Car Details
              </button></a>
          </div>
        </div>

        <div className="w-1/3">
          <img
            src="/images/Rent-a-car.jpeg"
            alt="Car Image"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div >
  );
};

export default ProfilePage;
