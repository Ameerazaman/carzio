import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaCar, FaTag, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { OfferFormData } from '../../Interface/OfferInterface';
import { addOffer } from '../../Api/Admin';
import { useNavigate } from 'react-router-dom';

interface Errors {
    carName?: string;
    offerTitle?: string;
    startDate?: string;
    endDate?: string;
    discountPercentage?: string;
}

function AddOffer() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<OfferFormData>({
        carName: '',
        offerTitle: '',
        startDate: '',
        endDate: '',
        discountPercentage: ''
    });

    const [errors, setErrors] = useState<Errors>({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors: Errors = {};
        const today = new Date();
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        if (!formData.carName) newErrors.carName = 'Car name is required';
        if (!formData.offerTitle) newErrors.offerTitle = 'Offer title is required';
        
        // Validate Start Date
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        } else if (startDate < today) {
            newErrors.startDate = 'Start date cannot be in the past';
        }

        // Validate End Date
        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        } else if (endDate < today) {
            newErrors.endDate = 'End date cannot be in the past';
        } else if (startDate > endDate) {
            newErrors.endDate = 'End date cannot be before start date';
        }

        // Validate Discount Percentage
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
                const result = await addOffer(formData);
                if (result?.data) {
                    navigate('/admin/offers');
                }
            } catch (error) {
            
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-red-600 text-center mb-6">Add Offer</h2>
                <form onSubmit={handleSubmit}>
                    {/* Car Name and Offer Title */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Car Name */}
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
                                 
                                />
                                {errors.carName && <p className="text-red-500 text-sm">{errors.carName}</p>}
                            </div>
                        </div>

                        {/* Offer Title */}
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
                                    
                                />
                                {errors.offerTitle && <p className="text-red-500 text-sm">{errors.offerTitle}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Start Date */}
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
                              
                            />
                            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                        </div>
                    </div>

                    {/* End Date */}
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
                                
                            />
                            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Discount Percentage */}
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
                              
                            />
                            {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button type="submit" className="bg-gray-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                            Add Offer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddOffer;
