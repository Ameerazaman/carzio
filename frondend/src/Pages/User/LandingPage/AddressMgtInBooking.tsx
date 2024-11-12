import React, { useEffect, useState } from 'react';
import { editAddress, checkAddress, saveAddressData } from '../../../Api/User';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';
import { AddressInterface } from '../../../Interface/AddressInterface';
import toast from 'react-hot-toast';

interface AddressMgtInBookingProps {
    onAddressIdChange: (id: string) => void;
}

function AddressMgtInBooking({ onAddressIdChange }: AddressMgtInBookingProps) {
    const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
    const [addressId, setAddressId] = useState('');
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<AddressInterface>({
        houseName: '',
        street: '',
        city: '',
        state: '',
        district: '',
        zip: '',
        userId: user?._id
    });
    const [addressErrors, setAddressErrors] = useState<Partial<AddressInterface>>({});

    useEffect(() => {
        const fetchProfile = async () => {
            if (user && user._id) {
                try {
                    const response = await checkAddress(user._id);
                    if (response?.status === 200) {
                        setCurrentAddress(response.data.data);
                        setAddressId(response.data.data._id);
                        setIsEditingAddress(true);
                        onAddressIdChange(response.data.data._id); // Pass addressId to the parent component
                    } else {
                        toast.error('No address found. Please create a new address.');
                    }
                } catch {
                    toast.error('Error fetching address data.');
                }
            }
        };

        // Check if the addressId is already set before fetching it again
        if (!addressId) {
            fetchProfile();
        }
    }, [user, addressId, onAddressIdChange]); // Depend on addressId to prevent multiple calls


    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentAddress((prev) => ({ ...prev, [name]: value }));
        if (addressErrors[name as keyof AddressInterface]) {
            setAddressErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateAddress = (): boolean => {
        const newErrors: Partial<AddressInterface> = {};
        if (!currentAddress.houseName) newErrors.houseName = 'House Name is required';
        if (!currentAddress.street) newErrors.street = 'Street is required';
        if (!currentAddress.city) newErrors.city = 'City is required';
        if (!currentAddress.state) newErrors.state = 'State is required';
        if (!currentAddress.district) newErrors.district = 'District is required';
        if (!currentAddress.zip) {
            newErrors.zip = 'ZIP is required';
        } else if (!/^\d{5,6}$/.test(currentAddress.zip)) {
            newErrors.zip = 'ZIP should be 5 or 6 digits';
        }
        setAddressErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveAddress = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAddress()) {
            toast.error('Please fill all fields correctly.');
            return;
        }

        const formData = {
            houseName: currentAddress.houseName,
            street: currentAddress.street,
            city: currentAddress.city,
            state: currentAddress.state,
            district: currentAddress.district,
            zip: currentAddress.zip,
            userId: user?._id
        };

        try {
            let result;
            if (isEditingAddress) {
                result = await editAddress(formData, addressId);
            } else {
                result = await saveAddressData(formData);
                if (result?.data) {
                    setIsEditingAddress(true);
                    setAddressId(result.data._id); // Update the addressId for newly created address
                    onAddressIdChange(result.data._id); // Pass addressId to the parent component
                }
            }

            if (result?.status === 200) {
                toast.success(isEditingAddress ? 'Address updated successfully.' : 'Address saved successfully.');
            } else {
                toast.error(isEditingAddress ? 'Failed to update address.' : 'Failed to save address.');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Error saving address. Please try again.');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8">
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
                    <button onClick={saveAddress} className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition">
                        {isEditingAddress ? 'Edit' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddressMgtInBooking;


