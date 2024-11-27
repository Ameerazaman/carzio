import React, { useState } from 'react';
import { AiOutlineCar } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { GiPriceTag } from 'react-icons/gi';
import { BsFuelPump } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { CarDataInterface } from '../../Interface/CarInterface';
import { addCarDetails } from '../../Api/Provider';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from '../Common/Navbar';

interface Errors {
    [key: string]: string;
}

const AddCar: React.FC = () => {
    let navigate = useNavigate()

    const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
    const [carData, setCarData] = useState<CarDataInterface>({
        car_name: '',
        model: '',
        rentalPrice: '',
        engineType: '',
        fuelType: '',
        color: '',
        images: ['', '', '', ''],
        rcNumber: '',
        rcExpiry: '',
        insurancePolicyNumber: '',
        insuranceExpiry: '',
        pollutionCertificateNumber: '',
        pollutionExpiry: '',
        providerId: provider?._id || undefined // Use `||` instead of bitwise `|`
    });
    const [uploadedImages, setUploadedImages] = useState<string[]>(carData.images);
    const [errors, setErrors] = useState<Errors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCarData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    
        if (errors[name]) {
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[name];
                return updatedErrors;
            });
        }
    };
    

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).slice(0, 4); // Limit to 4 images
            const newImageURLs = newFiles.map(file => URL.createObjectURL(file)); // Create URLs for preview
            setUploadedImages(newImageURLs);

            // Update carData with image URLs and store actual File objects in `uploadedFiles`
            setCarData((prevData) => ({
                ...prevData,
                images: newImageURLs, // Store image URLs for preview
                uploadedFiles: newFiles, // Store actual File objects for upload
            }));

            if (newFiles.length > 0) {
                // Clear the image error if images are uploaded
                setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors['images'];
                    return updatedErrors;
                });
            }
        }
    };


    const validate = (): boolean => {
        const newErrors: Errors = {};
        // Required fields validation
        if (!carData.car_name.trim()) newErrors.car_name = 'Car name is required.';
        if (!carData.model.trim()) newErrors.model = 'Model is required.';
        if (!carData.rentalPrice.trim()) {
            newErrors.rentalPrice = 'Rental price is required.';
        } else if (isNaN(Number(carData.rentalPrice)) || Number(carData.rentalPrice) <= 0) {
            newErrors.rentalPrice = 'Rental price must be a positive number.';
        }
        if (!carData.engineType.trim()) newErrors.engineType = 'Engine type is required.';
        if (!carData.fuelType.trim()) newErrors.fuelType = 'Fuel type is required.';
        if (!carData.color.trim()) newErrors.color = 'Color is required.';

        // Images validation
        if (uploadedImages.length === 0) {
            newErrors.images = 'At least one car image is required.';
        }
        // Document details validation
        if (!carData.pollutionCertificateNumber.trim()) newErrors.pollutionCertificateNumber = 'Pollution certificate number is required.';
        if (!carData.pollutionExpiry.trim()) newErrors.pollutionExpiry = 'Pollution expiry date is required.';

        // Insurance details validation
        if (!carData.insurancePolicyNumber.trim()) newErrors.insurancePolicyNumber = 'Insurance policy number is required.';
        if (!carData.insuranceExpiry.trim()) newErrors.insuranceExpiry = 'Insurance expiry date is required.';

        // RC details validation
        if (!carData.rcNumber.trim()) newErrors.rcNumber = 'RC number is required.';
        if (!carData.rcExpiry.trim()) newErrors.rcExpiry = 'RC expiry date is required.';
        // if (!carData.rcOwnerName.trim()) newErrors.rcOwnerName = 'RC owner name is required.';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            
            let result = await addCarDetails(carData);
            if (result) {
                navigate('/provider/home');
            }
        } else {
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementsByName(firstErrorField)[0];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                element.focus();
            }
        }
    };


    return (
        <div className="bg-gray-900 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <form onSubmit={handleSave}>
                    <input type="text" value={provider?._id} name='providerId' />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Car Details Card */}
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                                <h2 className="text-3xl font-bold text-white mb-6">Car Details</h2>
                                {/* Car Name */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Car Name</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <AiOutlineCar className="text-white text-xl mr-2" />
                                        <input
                                            type="text"
                                            name="car_name"
                                            value={carData.car_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter car name"
                                            className={`bg-transparent text-white w-full outline-none ${errors.car_name ? 'border border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.car_name && <p className="text-red-500 text-sm mt-1">{errors.car_name}</p>}
                                </div>

                                {/* Model */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Model</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <BiDetail className="text-white text-xl mr-2" />
                                        <input
                                            type="text"
                                            name="model"
                                            value={carData.model}
                                            onChange={handleInputChange}
                                            placeholder="Enter car model"
                                            className={`bg-transparent text-white w-full outline-none ${errors.model ? 'border border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                                </div>

                                {/* Rental Price */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Rental Price</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <GiPriceTag className="text-white text-xl mr-2" />
                                        <input
                                            type="number"
                                            name="rentalPrice"
                                            value={carData.rentalPrice}
                                            onChange={handleInputChange}
                                            placeholder="Enter rental price per day"
                                            className={`bg-transparent text-white w-full outline-none ${errors.rentalPrice ? 'border border-red-500' : ''}`}
                                            min="0"
                                        />
                                    </div>
                                    {errors.rentalPrice && <p className="text-red-500 text-sm mt-1">{errors.rentalPrice}</p>}
                                </div>

                                {/* Engine Type */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Engine Type</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <BsFuelPump className="text-white text-xl mr-2" />
                                        <select
                                            name="engineType"
                                            value={carData.engineType}
                                            onChange={handleInputChange}
                                            className={`bg-transparent text-grey w-full outline-none ${errors.engineType ? 'border border-red-500' : ''}`}
                                        >
                                            <option value="" disabled>Select engine type</option>
                                            <option value="V6">Manual</option>
                                            <option value="V8">Automatic</option>
                                            <option value="Electric">Electric</option>
                                        </select>
                                    </div>
                                    {errors.engineType && <p className="text-red-500 text-sm mt-1">{errors.engineType}</p>}
                                </div>

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Fuel Type</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <BsFuelPump className="text-white text-xl mr-2" />
                                        <select
                                            name="fuelType"
                                            value={carData.fuelType}
                                            onChange={handleInputChange}
                                            className={`bg-transparent text-grey w-full outline-none ${errors.fuelType ? 'border border-red-500' : ''}`}
                                        >
                                            <option value="" disabled>Select fuel type</option>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                    {errors.fuelType && <p className="text-red-500 text-sm mt-1">{errors.fuelType}</p>}
                                </div>


                                {/* Color */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Color</label>
                                    <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                        <div className="text-white text-xl mr-2">🎨</div>
                                        <input
                                            type="text"
                                            name="color"
                                            value={carData.color}
                                            onChange={handleInputChange}
                                            placeholder="Enter car color"
                                            className={`bg-transparent text-white w-full outline-none ${errors.color ? 'border border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                </div>

                                {/* Car Images */}
                                <div>
                                    <label className="block text-gray-400 font-medium mb-2">Car Images</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className={`mb-4 text-white ${errors.images ? 'border border-red-500' : ''}`}
                                    />
                                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
                                    <div className="grid grid-cols-4 gap-2">
                                        {uploadedImages.map((image, index) => (
                                            <div key={index} className="bg-gray-700 rounded-lg h-24 flex justify-center items-center">
                                                <img
                                                    src={image}
                                                    alt={`Car ${index + 1}`}
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* Document Details Card */}
                        <div className="space-y-4">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                                <h6 className="text-3xl font-bold text-white mb-6">Documents Details</h6>
                                <div className="space-y-6">
                                    {/* Pollution Details */}
                                    <div>
                                        <h3 className="text-red-500 font-bold mb-2">Pollution Details</h3>
                                        {/* Certificate Number */}
                                        <div className="mb-4">
                                            <label className="block text-gray-400 font-medium mb-2">Certificate Number</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <BiDetail className="text-white text-xl mr-2" />
                                                <input
                                                    type="text"
                                                    name="pollutionCertificateNumber"
                                                    value={carData.pollutionCertificateNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter pollution certificate number"
                                                    className={`bg-transparent text-white w-full outline-none ${errors.pollutionCertificateNumber ? 'border border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.pollutionCertificateNumber && <p className="text-red-500 text-sm mt-1">{errors.pollutionCertificateNumber}</p>}
                                        </div>
                                        {/* Expiry Date */}
                                        <div>
                                            <label className="block text-gray-400 font-medium mb-2">Expiry Date</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <FaRegCalendarAlt className="text-white text-xl mr-2" />
                                                <input
                                                    type="date"
                                                    name="pollutionExpiry"
                                                    value={carData.pollutionExpiry}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.pollutionExpiry ? 'border border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.pollutionExpiry && <p className="text-red-500 text-sm mt-1">{errors.pollutionExpiry}</p>}
                                        </div>
                                    </div>

                                    {/* Insurance Details */}
                                    <div>
                                        <h6 className="text-red-500 font-bold mb-2">Insurance Details</h6>
                                        {/* Policy Number */}
                                        <div className="mb-4">
                                            <label className="block text-gray-400 font-medium mb-2">Policy Number</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <BiDetail className="text-white text-xl mr-2" />
                                                <input
                                                    type="text"
                                                    name="insurancePolicyNumber"
                                                    value={carData.insurancePolicyNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter insurance policy number"
                                                    className={`bg-transparent text-white w-full outline-none ${errors.insurancePolicyNumber ? 'border border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.insurancePolicyNumber && <p className="text-red-500 text-sm mt-1">{errors.insurancePolicyNumber}</p>}
                                        </div>
                                        {/* Expiry Date */}
                                        <div>
                                            <label className="block text-gray-400 font-medium mb-2">Expiry Date</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <FaRegCalendarAlt className="text-white text-xl mr-2" />
                                                <input
                                                    type="date"
                                                    name="insuranceExpiry"
                                                    value={carData.insuranceExpiry}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.insuranceExpiry ? 'border border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.insuranceExpiry && <p className="text-red-500 text-sm mt-1">{errors.insuranceExpiry}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="text-red-500 font-bold mb-2">RC Details</h6>

                                        {/* RC Owner Name */}
                                        <div className="mb-4">
                                            <label className="block text-gray-400 font-medium mb-2">RC Number</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <BiDetail className="text-white text-xl mr-2" />
                                                <input
                                                    type="text"
                                                    name="rcNumber" // Updated name to reflect the field's purpose
                                                    value={carData.rcNumber} // Updated value to match state variable
                                                    onChange={handleInputChange}
                                                    placeholder="Enter RC owner name"
                                                    className={`bg-transparent text-white w-full outline-none ${errors.rcNumber ? 'border border-red-500' : ''}`} // Updated error handling
                                                />
                                            </div>
                                            {errors.rcNumber && <p className="text-red-500 text-sm mt-1">{errors.rcNumber}</p>}
                                        </div>

                                        {/* Expiry Date */}
                                        <div>
                                            <label className="block text-gray-400 font-medium mb-2">Expiry Date</label>
                                            <div className="flex items-center bg-gray-700 rounded-lg p-2">
                                                <FaRegCalendarAlt className="text-white text-xl mr-2" />
                                                <input
                                                    type="date"
                                                    name="rcExpiry" // Updated name to reflect the field's purpose
                                                    value={carData.rcExpiry} // Updated value to match state variable
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.rcExpiry ? 'border border-red-500' : ''}`} // Updated error handling
                                                />
                                            </div>
                                            {errors.rcExpiry && <p className="text-red-500 text-sm mt-1">{errors.rcExpiry}</p>}
                                        </div>
                                    </div>

                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"

                                        className="mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCar;
