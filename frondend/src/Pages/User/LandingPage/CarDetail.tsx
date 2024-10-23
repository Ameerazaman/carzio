import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaCalendarCheck, FaFileAlt, FaCertificate, FaIdCard, FaMoneyBillWave } from 'react-icons/fa';
import { carDetail } from '../../../Api/User';
import { CarDataInterface } from '../../../Interface/CarInterface';

function CarDetail() {
    const { id } = useParams<{ id: string }>();
    const [carDetails, setCarDetails] = useState<CarDataInterface>({
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
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null); // Initialize mainImage as null
    const [error, setError] = useState('');

    let navigate = useNavigate();

    useEffect(() => {

        const fetchCarDetails = async () => {
            if (id) {
                try {
                    const result = await carDetail(id);
                    console.log(result, "result detail") // Assuming `carDetails` is your fetch function, replace it with correct API call.
                    let carData = result?.data;
                    const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
                    };

                    setCarDetails({
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
                    // Set main image only if images exist
                    if (result?.data?.images && result.data.images.length > 0) {
                        setMainImage(result.data.images[0]);
                    }
                    setLoading(false);
                } catch (err) {
                    setError('Error fetching car details');
                    setLoading(false);
                }
            }
        };
        fetchCarDetails();
    }, [id]);

    // Render loading or error states
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex p-6 bg-gray-100">
            {/* Right Side: Images and Booking */}
            <div className="w-1/2 pr-6">
                {/* Main Image Display */}
                <img
                    src={mainImage ?? ""}
                    alt={carDetails.car_name || "Car Image"}
                    className="w-full h-80 object-cover mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                />

                {/* Thumbnails */}
                <div className="flex space-x-2 mb-4">
                    {carDetails.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Thumbnail ${index + 1}`} // Fixed the alt attribute
                            className="w-24 h-24 object-cover rounded-lg shadow transition-transform transform hover:scale-110 cursor-pointer"
                            onClick={() => setMainImage(image)} // Change main image on click
                        />
                    ))}
                </div>

                {/* Thank you message */}
                <div className="bg-gray-200 p-4 rounded-lg shadow-lg text-center">
                    <h3 className="text-xl font-semibold text-gray-700">Thank you for considering our car for your rental needs!</h3>
                    <p className="text-gray-600">We appreciate your interest and hope to provide you with the best service.</p>
                </div>
            </div>

            {/* Left Side: Car Details */}
            <div className="w-1/2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{carDetails.car_name}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p className="flex items-center">
                            <FaCar className="mr-2 text-blue-600" />
                            <strong>Model:</strong>
                        </p>
                        <p>{carDetails.model}</p>

                        <p className="flex items-center">
                            <FaCalendarCheck className="mr-2 text-green-600" />
                            <strong>Color:</strong>
                        </p>
                        <p>{carDetails.color}</p>

                        <p className="flex items-center">
                            <FaFileAlt className="mr-2 text-orange-600" />
                            <strong>Engine Type:</strong>
                        </p>
                        <p>{carDetails.engineType}</p>

                        <p className="flex items-center">
                            <FaCertificate className="mr-2 text-purple-600" />
                            <strong>Fuel Type:</strong>
                        </p>
                        <p>{carDetails.fuelType}</p>

                        <p className="flex items-center">
                            <FaMoneyBillWave className="mr-2 text-red-600" />
                            <strong>Rental Price:</strong>
                        </p>
                        <p>₹{carDetails.rentalPrice}/day</p>

                        <p className="flex items-center">
                            <FaFileAlt className="mr-2 text-orange-600" />
                            <strong>Insurance Policy Number:</strong>
                        </p>
                        <p>{carDetails.insurancePolicyNumber}</p>

                        <p className="flex items-center">
                            <FaCalendarCheck className="mr-2 text-green-600" />
                            <strong>Insurance Expiry:</strong>
                        </p>
                        <p>{new Date(carDetails.insuranceExpiry).toLocaleDateString()}</p>

                        <p className="flex items-center">
                            <FaIdCard className="mr-2 text-indigo-600" />
                            <strong>Pollution Certificate Number:</strong>
                        </p>
                        <p>{carDetails.pollutionCertificateNumber}</p>

                        <p className="flex items-center">
                            <FaCalendarCheck className="mr-2 text-green-600" />
                            <strong>Pollution Expiry:</strong>
                        </p>
                        <p>{new Date(carDetails.pollutionExpiry).toLocaleDateString()}</p>

                        <p className="flex items-center">
                            <FaIdCard className="mr-2 text-indigo-600" />
                            <strong>RC Number:</strong>
                        </p>
                        <p>{carDetails.rcNumber}</p>

                        <p className="flex items-center">
                            <FaCalendarCheck className="mr-2 text-green-600" />
                            <strong>RC Expiry:</strong>
                        </p>
                        <p>{new Date(carDetails.rcExpiry).toLocaleDateString()}</p>
                    </div>

                    <button className="bg-red-600 mt-4 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-red-500 transition duration-200 ease-in-out shadow-lg transform hover:scale-105">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CarDetail;