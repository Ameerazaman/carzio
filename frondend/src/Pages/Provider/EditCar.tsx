import React, { useEffect, useState } from 'react';
import { AiOutlineCar } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { GiPriceTag } from 'react-icons/gi';
import { MdDescription } from 'react-icons/md';
import { BsFuelPump } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { CarDataInterface } from '../../Interface/CarInterface';
import { addCarDetails, editCar, editCarDetails, editCarImage } from '../../Api/Provider';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from '../Common/Navbar';

interface Errors {
    [key: string]: string;
}

const EditCar: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extracting `id` from URL params
    useEffect(() => {
        const fetchCarData = async () => {
            if (id) {
                try {
                    const result = await editCar(id); // Fetch the car data
                    const carData = result?.data;

                    // Convert the dates to YYYY-MM-DD format (if necessary)
                    const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
                    };

                    setFormData({
                        car_name: carData?.car_name || '',
                        model: carData?.model || '',
                        rentalPrice: carData?.rentalPrice || '',
                        engineType: carData?.engineType || '',
                        fuelType: carData?.fuelType || '',
                        color: carData?.color || '',
                        images: carData?.images || ['', '', '', ''],
                        rcNumber: carData?.rcNumber || '',
                        rcExpiry: carData?.rcExpiry ? formatDate(carData.rcExpiry) : '', // Ensure correct format
                        insurancePolicyNumber: carData?.insurancePolicyNumber || '',
                        insuranceExpiry: carData?.insuranceExpiry ? formatDate(carData.insuranceExpiry) : '', // Ensure correct format
                        pollutionCertificateNumber: carData?.pollutionCertificateNumber || '',
                        pollutionExpiry: carData?.pollutionExpiry ? formatDate(carData.pollutionExpiry) : '', // Ensure correct format
                        providerId: carData?.providerId || ''
                    });
                } catch (error) {

                }
            } else {

            }
        };

        fetchCarData();
    }, [id]);


    let navigate = useNavigate();
    const [formData, setFormData] = useState<CarDataInterface>({
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
        providerId: '',
        id: ''// Ensure this value is set from the provider data
    });
    const [uploadedImages, setUploadedImages] = useState<string[]>(formData.images);

    const [errors, setErrors] = useState<Errors>({});
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    // Handle image uploads
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).slice(0, 4); // Limit to 4 images
            const newImageURLs = newFiles.map(file => URL.createObjectURL(file)); // Create URLs for preview

            // Update the form data with the image URLs and actual files
            setUploadedImages(newImageURLs);
            setFormData((prevData) => ({
                ...prevData,
                images: newImageURLs,       // URLs for preview
                uploadedFiles: newFiles,    // Actual files for uploading
            }));

            // Clear error if images are uploaded
            if (newFiles.length > 0) {
                setErrors((prevErrors) => {
                    const updatedErrors = { ...prevErrors };
                    delete updatedErrors['images'];
                    return updatedErrors;
                });
            }
        }
    };

    // Handle form submission
    const validate = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.car_name.trim()) newErrors.car_name = 'Car name is required.';
        if (!formData.model.trim()) newErrors.model = 'Model is required.';
        if (!formData.rentalPrice) {
            newErrors.rentalPrice = 'Rental price is required.';
        } else if (isNaN(Number(formData.rentalPrice)) || Number(formData.rentalPrice) <= 0) {
            newErrors.rentalPrice = 'Rental price must be a positive number.';
        }
        if (!formData.engineType.trim()) newErrors.engineType = 'Engine type is required.';
        if (!formData.fuelType.trim()) newErrors.fuelType = 'Fuel type is required.';
        if (!formData.color.trim()) newErrors.color = 'Color is required.';

        // Images validation
        if (uploadedImages.length === 0) {
            newErrors.images = 'At least one car image is required.';
        }
        // Document details validation
        if (!formData.pollutionCertificateNumber.trim()) newErrors.pollutionCertificateNumber = 'Pollution certificate number is required.';
        if (!formData.pollutionExpiry.trim()) newErrors.pollutionExpiry = 'Pollution expiry date is required.';

        // Insurance details validation
        if (!formData.insurancePolicyNumber.trim()) newErrors.insurancePolicyNumber = 'Insurance policy number is required.';
        if (!formData.insuranceExpiry.trim()) newErrors.insuranceExpiry = 'Insurance expiry date is required.';

        // RC details validation
        if (!formData.rcNumber.trim()) newErrors.rcNumber = 'RC number is required.';
        if (!formData.rcExpiry.trim()) newErrors.rcExpiry = 'RC expiry date is required.';
        // if (!carData.rcOwnerName.trim()) newErrors.rcOwnerName = 'RC owner name is required.';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const handleSaveImage = async () => {
        const carId = id; // Ensure this value is obtained correctly, e.g., via props or state

        if (!carId) {

            return;
        }

        // Ensure uploadedFiles is defined before proceeding
        const uploadedFiles = formData.uploadedFiles || [];
        if (uploadedFiles.length === 0) {

            return;
        }

        try {
            // Pass `uploadedFiles` to the API call
            const result = await editCarImage(uploadedFiles, carId);
            if (result) {

                navigate('/provider/cars'); // Navigate on successful upload
            }
        } catch (error) {

        }
    };


    // save the details
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {

            const carId = id
            if (!carId) {

                return; // Or handle this case as you see fit
            }

            let result = await editCarDetails(formData, carId);
            if (result) {
                navigate('/provider/cars');
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
                    <input type="text" value={formData.id} name='providerId' />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                                    value={formData.pollutionCertificateNumber}
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
                                                    value={formData.pollutionExpiry}
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
                                                    value={formData.insurancePolicyNumber}
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
                                                    value={formData.insuranceExpiry}
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
                                                    readOnly
                                                    type="text"
                                                    name="rcNumber" // Updated name to reflect the field's purpose
                                                    value={formData.rcNumber} // Updated value to match state variable
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
                                                    value={formData.rcExpiry} // Updated value to match state variable
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.rcExpiry ? 'border border-red-500' : ''}`} // Updated error handling
                                                />
                                            </div>
                                            {errors.rcExpiry && <p className="text-red-500 text-sm mt-1">{errors.rcExpiry}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
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
                                                    value={formData.car_name}
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
                                                    value={formData.model}
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
                                                    value={formData.rentalPrice}
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
                                                    value={formData.engineType}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.engineType ? 'border border-red-500' : ''}`}
                                                >
                                                    <option className=' text-black' value="" disabled>Select engine type</option>
                                                    <option className=' text-black' value="V6">Manual</option>
                                                    <option className=' text-black' value="V8">Automaic</option>
                                                    <option className=' text-black' value="Electric">Electric</option>

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
                                                    value={formData.fuelType}
                                                    onChange={handleInputChange}
                                                    className={`bg-transparent text-white w-full outline-none ${errors.fuelType ? 'border border-red-500' : ''}`}
                                                >
                                                    <option className=' text-black' value="" disabled>Select fuel type</option>
                                                    <option className=' text-black' value="Petrol">Petrol</option>
                                                    <option className=' text-black' value="Diesel">Diesel</option>
                                                    <option className=' text-black' value="Electric">Electric</option>
                                                    <option className=' text-black' value="Hybrid">Hybrid</option>
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
                                                    value={formData.color}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter car color"
                                                    className={`bg-transparent text-white w-full outline-none ${errors.color ? 'border border-red-500' : ''}`}
                                                />
                                            </div>
                                            {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"

                                                className="mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
                                            >
                                                Save
                                            </button>
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
                                                {formData.images.map((image, index) => (
                                                    <div key={index} className="bg-gray-700 rounded-lg h-24 flex justify-center items-center">
                                                        <img
                                                            src={image}
                                                            alt={`Car ${index + 1}`}
                                                            className="h-full w-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleSaveImage}
                                                className="mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
                                            >
                                                Edit Image
                                            </button>
                                        </div>



                                    </div>
                                </div>


                                {/* Save Button */}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCar;
