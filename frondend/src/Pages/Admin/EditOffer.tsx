import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaCar, FaTag, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { OfferFormData } from '../../Interface/OfferInterface';
import { useNavigate, useParams } from 'react-router-dom';
import { editOffer, updateOffer } from '../../Api/Admin';

interface Errors {
    carName?: string;
    offerTitle?: string;
    startDate?: string;
    endDate?: string;
    discountPercentage?: string;
}

interface EditOfferProps {
    header: string;
}

const EditOffer: React.FC<EditOfferProps> = ({ header }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<OfferFormData>({
        carName: '',
        offerTitle: '',
        startDate: '',
        endDate: '',
        discountPercentage: ''
    });

    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        const fetchOfferData = async () => {
            try {
                if (id) {
                    const response = await editOffer(id);
                    if (response?.data) {
                        const fetchedData = response.data;
                        setFormData({
                            ...fetchedData,
                            startDate: fetchedData.startDate ? new Date(fetchedData.startDate).toISOString().split('T')[0] : '',
                            endDate: fetchedData.endDate ? new Date(fetchedData.endDate).toISOString().split('T')[0] : ''
                        });
                    }
                }
            } catch (error) {
            
            }
        };

        fetchOfferData();
    }, [id]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors: Errors = {};

        if (!formData.carName) newErrors.carName = 'Car name is required';
        if (!formData.offerTitle) newErrors.offerTitle = 'Offer title is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = 'End date cannot be before start date';
        }
        if (!formData.discountPercentage) {
            newErrors.discountPercentage = 'Discount percentage is required';
        } else if (Number(formData.discountPercentage) < 0 || Number(formData.discountPercentage) > 100) {
            newErrors.discountPercentage = 'Discount percentage must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                if (id) {
                    const result = await updateOffer(id, formData);
                    if (result?.data) {
                        navigate('/admin/offers');
                    }
                } else {
                    console.warn("No ID found for updating the offer.");
                }
            } catch (error) {
                console.error('Error updating offer:', error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Edit Offer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="carName">Car Name</label>
                            <div className="relative">
                                <FaCar className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                                <input
                                    type="text"
                                    id="carName"
                                    name="carName"
                                    value={formData.carName}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.carName ? 'border-red-500' : ''}`}
                                    placeholder="Enter car name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2" htmlFor="offerTitle">Offer Title</label>
                            <div className="relative">
                                <FaTag className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                                <input
                                    type="text"
                                    id="offerTitle"
                                    name="offerTitle"
                                    value={formData.offerTitle}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.offerTitle ? 'border-red-500' : ''}`}
                                    placeholder="Enter offer title"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="startDate">Start Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={`w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.startDate ? 'border-red-500' : ''}`}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="endDate">End Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className={`w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.endDate ? 'border-red-500' : ''}`}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="discountPercentage">Discount Percentage</label>
                        <div className="relative">
                            <FaPercent className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" />
                            <input
                                type="number"
                                id="discountPercentage"
                                name="discountPercentage"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className={`w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ${errors.discountPercentage ? 'border-red-500' : ''}`}
                                placeholder="Enter discount percentage"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="bg-gray-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            Update Offer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOffer;
