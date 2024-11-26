import React, { useState } from 'react';
import { CouponFormData } from '../../Interface/CouponFormData';
import { createCoupon } from '../../Api/Admin';
import { useNavigate } from 'react-router-dom';

const AddCoupon: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CouponFormData>({

        discountPercentage: 0,
        maxDiscountAmount: 0,
        minRentalAmount: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        userId: '',
        maxUsageLimit: 0,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};


        if (formData.discountPercentage <= 0) newErrors.discountPercentage = "Discount percentage must be greater than zero.";
        if (!formData.startDate) newErrors.startDate = "Start date is required.";
        if (!formData.minRentalAmount) newErrors.minRentalAmount = "Min rental amount is required.";
        if (!formData.endDate) newErrors.endDate = "End date is required.";
        if (formData.endDate < formData.startDate) newErrors.endDate = "End date must be after start date.";

        // Validation for Max Discount Amount
        if (formData.maxDiscountAmount < 0) {
            newErrors.maxDiscountAmount = "Max discount amount cannot be less than zero.";
        }

        // Validation for Min Rental Amount
        if (formData.minRentalAmount < 0) {
            newErrors.minRentalAmount = "Min rental amount cannot be less than zero.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
           
            const result = await createCoupon(formData);
            if (result) {
                navigate('/admin/coupon');
            }
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto bg-white shadow-lg rounded">
            <h2 className="text-lg font-bold mb-3 text-center">Create Coupon</h2>

            <div className="mb-3">
                <label className="block text-gray-700">Discount Percentage</label>
                <input
                    type="number"
                    name="discountPercentage"
                    placeholder="Enter discount percentage"
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage}</p>}
            </div>

            <div className="flex space-x-2 mb-3">
                <div className="flex-1">
                    <label className="block text-gray-700">Min Rental Amount</label>
                    <input
                        type="number"
                        name="minRentalAmount"
                        placeholder="Enter min rental amount"
                        onChange={handleChange}
                        className={`w-full px-2 py-1 border rounded ${errors.minRentalAmount ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.minRentalAmount && <p className="text-red-500 text-sm">{errors.minRentalAmount}</p>}
                </div>
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Start Date</label>
                <input
                    type="date"
                    name="startDate"
                    placeholder="Select start date"
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">End Date</label>
                <input
                    type="date"
                    name="endDate"
                    placeholder="Select end date"
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default AddCoupon;
