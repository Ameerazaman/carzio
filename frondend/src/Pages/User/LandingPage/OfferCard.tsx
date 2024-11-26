import React, { useEffect, useState } from 'react';
import { FaCar, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { OfferFormData } from '../../../Interface/OfferInterface';
import { getOffer } from '../../../Api/User';

const OfferCard: React.FC = () => {
    const [offerCards, setOfferCards] = useState<OfferFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const result = await getOffer();
               
                if (result && Array.isArray(result?.data?.data)) {
                    setOfferCards(result.data.data);
                } else {
                    setOfferCards([]);
                }
            } catch (err) {
                setError('Failed to fetch offers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading offers...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200">
            <br />
            <header className="relative bg-white p-4 text-center shadow-lg rounded-b-lg">
                <h1 className="relative z-10 text-4xl font-bold mb-1 text-gray-900">
                    Current Offers
                </h1>
                <p className="relative z-10 text-md text-gray-700 mt-1">
                    Grab the best deals on our rentals!
                </p>
            </header>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {offerCards.map((offer) => (
                        <div
                            key={offer.id}
                            className="relative overflow-hidden border-4 border-red-500 rounded-lg shadow-lg p-4 hover:shadow-xl transition bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300"
                        >
                            <div className="absolute inset-0 transform -skew-y-3 bg-white"></div>
                            <div className="relative z-10">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{offer.offerTitle}</h2>
                                <p className="flex items-center text-gray-700 mb-1">
                                    <FaCar className="mr-2 text-red-600" /> Available for: {offer.carName}
                                </p>
                                <p className="flex items-center text-gray-700 mb-1">
                                    <FaCalendarAlt className="mr-2 text-red-600" /> Valid from: {new Date(offer.startDate).toLocaleDateString()} to {new Date(offer.endDate).toLocaleDateString()}
                                </p>
                                <p className="flex items-center text-gray-700 mb-1">
                                    <FaPercent className="mr-2 text-red-600" /> Discount: {offer.discountPercentage}% off
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferCard;
