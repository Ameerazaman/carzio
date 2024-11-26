import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaCalendarCheck, FaFileAlt, FaCertificate, FaIdCard, FaMoneyBillWave, FaBook, FaCommentDots } from 'react-icons/fa';
import { carDetail } from '../../../Api/User';
import { CarDataInterface } from '../../../Interface/CarInterface';
import ChatPage from './ChatPage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';

function CarDetail() {

    const { id } = useParams<{ id: string }>();
    const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
    const username = user?.username ?? ''
    const userId = user?._id ?? '';
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
        id: '' // Ensure this value is set from the provider data
    });
    const providerId = carDetails?.providerId ?? ''
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null); // Initialize mainImage as null
    const [error, setError] = useState('');
    const [review, setReview] = useState<string[] | null>(null);
    const [ratings, setRatings] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for chat
    const toggleModal = () => {
        setIsModalOpen((prevState) => !prevState);  // Toggle the modal visibility
    };

    let navigate = useNavigate();

    useEffect(() => {
        const fetchCarDetails = async () => {
            if (id) {
                try {
                    const result = await carDetail(id);
                    let carData = result?.data?.data;
                    const formatDate = (dateString: string) => {
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
                    };
                    setRatings(result?.data?.ratings);
                    setReview(result?.data?.review);
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
                    if (result?.data?.data?.images && result.data.data.images.length > 0) {
                        setMainImage(result.data.data.images[0]);
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

    // Handle opening and closing the modal

    return (
        <div className="flex p-6 bg-gray-100">

            <div className="w-1/2 pr-6">

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
                <div className="mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
                    <ul className="space-y-4">
                        {review && review.length > 0 ? (
                            review.map((r, index) => (
                                <li key={index} className="bg-gray-200 p-4 rounded-lg shadow-lg">
                                    <p className="text-gray-800 font-medium">Review {index + 1}:</p>
                                    <p className="text-gray-700 mt-2">{r}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600 italic">No reviews available for this car.</p>
                        )}
                    </ul>
                </div>

            </div>


            {/* Left Side: Car Details */}
            <div className="w-1/2">

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">{carDetails.car_name}</h2>
                    <div className="flex mb-4">
                        {Array.from({ length: 5 }, (_, index) => (
                            <span
                                key={index}
                                className={`text-2xl ${index < Math.round(ratings) ? "text-yellow-500" : "text-gray-300"
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
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
                    <div className="mt-6">


                    </div>



                    <div className="flex flex-row items-center justify-center space-x-6">
                        {/* Book Now Button */}
                        <Link to={`/booking_details/${id}`}>
                            <button className="flex items-center bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105 space-x-3">
                                <FaBook className="text-white text-xl" /> {/* Book Icon */}
                                <span>Book Now</span>
                            </button>
                        </Link>

                        {/* Chat with Provider Button */}
                        <button
                            onClick={toggleModal}
                            className="flex items-center bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105 space-x-3"
                        >
                            <FaCommentDots className="text-white text-xl" /> {/* Chat Icon */}
                            <span>Chat with Provider</span>
                        </button>
                    </div>



                </div>
            </div>



            {/* Modal: Chat */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative space-between" style={{ backgroundImage: 'url("/images/chat.avif")' }}>
                        {/* Close button */}
                        <button
                            onClick={toggleModal}  // Make sure to toggle modal state here
                            className="absolute top-2 right-2 text-red-800 hover:text-red-900 font-bold z-60"
                        >
                            X
                        </button>

                        <ChatPage senderId={userId} receiverId={providerId} username={username} />
                    </div>
                </div>
            )}

        </div>
    );
}

export default CarDetail;