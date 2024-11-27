import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { notificaionDetails, verifyNotification } from '../../Api/Admin';

const NotificationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [carDetails, setCarDetails] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  let navigate = useNavigate()
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (id) {
        try {
          const result = await notificaionDetails(id);
          setCarDetails(result?.data);
          setLoading(false);
        } catch (err) {
          setError('Error fetching car details');
          setLoading(false);
        }
      }
    };
    fetchCarDetails();
  }, [id]);

  const handleNotificationVerification = async (action: string) => {
    if (id) {

      const result = await verifyNotification(id, action);
      if (result) {
        
          navigate('/admin/notifications')
        // Optionally, display a success message or refresh data
      } else {
       
      }
    }
  };



  if (loading)
    return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  if (error)
    return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Car Information */}
            <div className="space-y-4">
              {[
                { label: 'Car Name', value: carDetails.car_name },
                { label: 'Model', value: carDetails.model },
                { label: 'Rental Price', value: `₹${carDetails.rentalPrice} / day` },
                { label: 'Engine Type', value: carDetails.engineType },
                { label: 'Fuel Type', value: carDetails.fuelType },
                { label: 'Color', value: carDetails.color },
                { label: 'RC Number', value: carDetails.rcNumber },
                { label: 'RC Expiry', value: new Date(carDetails.rcExpiry).toLocaleDateString() },
                { label: 'Insurance Expiry', value: new Date(carDetails.insuranceExpiry).toLocaleDateString() },
                { label: 'Pollution Certificate Expiry', value: new Date(carDetails.pollutionExpiry).toLocaleDateString() },
              ].map((detail, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <p className="text-gray-700 font-bold">{detail.label}:</p>
                  <p className="text-gray-900 font-medium">{detail.value || 'N/A'}</p>
                </div>
              ))}
            </div>

            {/* Car Images and Actions */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-700 font-bold">Car Images</p>
                <div className="flex space-x-4 overflow-x-auto mt-2">
                  {carDetails.images?.map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Car Image ${index + 1}`}
                      className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Accept and Reject Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleNotificationVerification("Accept")}
                  className="w-full py-3 px-5 flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-all rounded-lg shadow-md transform hover:scale-105"
                >
                  <FaCheckCircle className="mr-2 text-xl" /> Accept
                </button>
                <button
                  onClick={() => handleNotificationVerification("Reject")}
                  className="w-full py-3 px-5 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 transition-all rounded-lg shadow-md transform hover:scale-105"
                >
                  <FaTimesCircle className="mr-2 text-xl" /> Reject
                </button>
              </div>



              {/* Success/Error Messages */}
              {message && <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>}
              {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetails;


