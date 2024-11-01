import React, { useState } from 'react';
import { CouponFormData } from '../../Interface/CouponFormData';


const AddCoupon: React.FC = () => {
    const [formData, setFormData] = useState<CouponFormData>({
        code: '',
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
        if (!formData.code) newErrors.code = "Coupon code is required.";
        if (formData.discountPercentage <= 0) newErrors.discountPercentage = "Discount percentage must be greater than zero.";
        if (!formData.startDate) newErrors.startDate = "Start date is required.";
        if (!formData.endDate) newErrors.endDate = "End date is required.";
        if (formData.endDate < formData.startDate) newErrors.endDate = "End date must be after start date.";
        
        // Validation for Max Discount Amount
        if (formData.maxDiscountAmount < 0) {
            newErrors.maxDiscountAmount = "Max discount amount cannot be less than zero.";
        } else if (formData.maxDiscountAmount > (formData.discountPercentage / 100) * formData.minRentalAmount && formData.minRentalAmount > 0) {
            newErrors.maxDiscountAmount = "Max discount amount cannot exceed the calculated discount based on the min rental amount.";
        }

        // Validation for Min Rental Amount
        if (formData.minRentalAmount < 0) {
            newErrors.minRentalAmount = "Min rental amount cannot be less than zero.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log('Coupon Data:', formData);
            // Here you would usually make a POST request to your backend
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto bg-white shadow-lg rounded">
            <br /><br />
            <h2 className="text-lg font-bold mb-3 text-center">Create Coupon</h2>

            <div className="mb-3">
                <label className="block text-gray-700">Coupon Code</label>
                <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
            </div>

            <div className="mb-3">
                <label className="block text-gray-700">Discount Percentage</label>
                <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.discountPercentage ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.discountPercentage && <p className="text-red-500 text-sm">{errors.discountPercentage}</p>}
            </div>

            {/* Pair of inputs in a flex container */}
            <div className="flex space-x-2 mb-3">
                <div className="flex-1">
                    <label className="block text-gray-700">Max Discount Amount</label>
                    <input
                        type="number"
                        name="maxDiscountAmount"
                        value={formData.maxDiscountAmount}
                        onChange={handleChange}
                        className={`w-full px-2 py-1 border rounded ${errors.maxDiscountAmount ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.maxDiscountAmount && <p className="text-red-500 text-sm">{errors.maxDiscountAmount}</p>}
                </div>

                <div className="flex-1">
                    <label className="block text-gray-700">Min Rental Amount</label>
                    <input
                        type="number"
                        name="minRentalAmount"
                        value={formData.minRentalAmount}
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
                    value={formData.startDate}
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
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-2 py-1 border rounded ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700">Max Usage Limit</label>
                <input
                    type="number"
                    name="maxUsageLimit"
                    value={formData.maxUsageLimit}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border rounded"
                />
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default AddCoupon;
