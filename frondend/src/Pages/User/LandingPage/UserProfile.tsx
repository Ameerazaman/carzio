import { useSelector } from 'react-redux';
import { User } from '../../Common/Navbar';
import { RootState } from '../../../App/Store';
import { useCallback, useEffect, useState } from 'react';
import { ProfileInterface } from '../../../Interface/ProfileInterface';

import toast from 'react-hot-toast';
import {  editProfile, checkProfile, saveProfileData } from '../../../Api/User';
import UserAddress from './UserAdress';

const UserProfile = () => {
    const user = useSelector((state: RootState) => state.user .currentUser) as User | null;
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<Partial<ProfileInterface>>({});
    const [profileId, setProfileId] = useState('');
    const[addressId,setAddressId]=useState('')
    const [profile, setProfile] = useState<ProfileInterface>({
        name: '',
        email: '',
        phone: '',
        adharNo: '',
        gender: "",
        userId: user?._id
    });

    useEffect(() => {
        
        const fetchProfile = async () => {
            if (user) {
                
                try {
                    const result = await checkProfile(user._id);
                   
                    if (result?.status === 200) {
                        setProfile(result.data);
                        setProfileId(result.data._id);
                        setIsEditing(true);
                    } else {
                        setProfile({ name: '', email: '', phone: '', adharNo: '', gender: '', userId: undefined });
                        toast.error('No profile found. Please create a new profile.');
                    }
                } catch {
                    toast.error('Error fetching profile data.');

                }
            }
        };
        fetchProfile();
    }, [user]);




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<ProfileInterface> = {};

        if (!profile.name) {
            newErrors.name = 'Name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(profile.name)) {
            newErrors.name = 'Name should contain only letters and spaces';
        }

        if (!profile.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(profile.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!profile.phone) {
            newErrors.phone = 'Phone is required';
        } else if (!/^\d{10}$/.test(profile.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        if (!profile.gender) newErrors.gender = 'Gender selection is required';

        if (!profile.adharNo) {
            newErrors.adharNo = 'Aadhar number is required';
        } else if (!/^\d{12}$/.test(profile.adharNo)) {
            newErrors.adharNo = 'Aadhar number must be 12 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleAddressId = useCallback((id: string) => {
        setAddressId(id);
    }, []);

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            // toast.error('Please fill all fields correctly.');
            return;
        }
        if (!user) {
            toast.error('No provider data available.');
            return;
        }

        const formData = {
            name: profile.name,
            phone: profile.phone,
            email: profile.email,
            adharNo: profile.adharNo,
            gender: profile.gender,
            userId: user?._id
        };

        try {
            if (isEditing) {
               
                const result = await editProfile(formData, profileId);
                if (result) {
                    setIsEditing(true)
                } else {
                    toast.error('Failed to update profile.');
                }
            } else {
               
                const result = await saveProfileData(formData);
                setIsEditing(true)
                if (result) {
    
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

                    <img
                        src="/images/fun-unique-cartoon-profile-picture-that-represents-your-style-personality_1283595-14223.avif"
                        alt="User Profile Cartoon"
                        className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    <p className="text-gray-700 text-sm">Welcome back!</p>
                    <p className="text-gray-500 text-xs italic text-center mt-2">"A well-maintained profile opens doors to new opportunities."</p>
                </div>
                <div className="flex-grow w-2/3">
                    <h1 className="text-xl font-bold mb-3 text-red-600">User Profile</h1>
                    <form onSubmit={saveProfile}>
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                            <input type="text" value={user?._id} style={{ display: "none" }} />

                            {(['name', 'email', 'phone', 'adharNo'] as (keyof ProfileInterface)[]).map((field) => (
                                <div className="relative mb-4" key={field}>
                                    <input
                                        type={
                                            field === 'email' ? 'email' :
                                                field === 'phone' ? 'tel' :
                                                    'text'  // Default type
                                        }
                                        name={field}
                                        value={profile[field]}
                                        onChange={handleChange}
                                        placeholder=" "
                                        className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ${isEditing ? 'bg-white' : 'bg-gray-200'} ${errors[field] ? 'border-red-500' : ''}`}
                                    />
                                    <label
                                        htmlFor={field}
                                        className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                                </div>
                            ))}
                            <div className="relative mb-4">
                                <select
                                    name="gender"
                                    value={profile.gender}
                                    onChange={(e) => handleChange(e)} // Corrected
                                    className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ${isEditing ? 'bg-white' : 'bg-gray-200'} ${errors.gender ? 'border-red-500' : ''}`}
                                >
                                    <option value="" disabled hidden>Choose Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                <label
                                    htmlFor="gender"
                                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
                                >
                                    Gender
                                </label>
                                <br />
                                {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                            </div>

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
            <div>
                <UserAddress onAddressIdChange={handleAddressId} />
            </div>
            {/* <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
                <h1 className="text-xl font-bold mb-3 text-red-600">Manage Address</h1>
                <form onSubmit={saveAddress}>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                        <input type="text" value={user?._id} style={{ display: "none" }} />

                        {(['houseName', 'street', 'city', 'state', 'district', 'zip'] as (keyof AddressInterface)[]).map((field) => (
                            <div className="relative mb-4" key={field}>
                                <input
                                    type='text'
                                    name={field}
                                    value={currentAddress[field]}
                                    onChange={handleAddressChange}
                                    placeholder=" "
                                    className={`peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ${isEditingAddress ? 'bg-white' : 'bg-gray-200'} ${addressErrors[field] ? 'border-red-500' : ''}`}
                                />
                                <label
                                    htmlFor={field}
                                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500"
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                {addressErrors[field] && <p className="text-xs text-red-500 mt-1">{addressErrors[field]}</p>}
                            </div>
                        ))}


                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
                        >
                            {isEditingAddress ? 'Edit' : 'Save'}
                        </button>
                    </div>
                </form>
            </div> */}
        </div>
    );
};

export default UserProfile;
