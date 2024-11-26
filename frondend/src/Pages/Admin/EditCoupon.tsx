import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editCoupon, updateCoupon } from '../../Api/Admin';
import { CouponFormData } from '../../Interface/CouponFormData';
interface EditCouponProps {
    header: string;
}
const EditCoupon: React.FC<EditCouponProps> = ({ header }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
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

    useEffect(() => {
        const fetchCouponData = async () => {
            if (id) {
                try {
                    const response = await editCoupon(id);
                    if (response?.data) {
                        setFormData({
                            ...response.data,
                            startDate: response.data.startDate ? new Date(response.data.startDate).toISOString().split('T')[0] : '',
                            endDate: response.data.endDate ? new Date(response.data.endDate).toISOString().split('T')[0] : '',
                        });
                    }
                } catch (error) {
         
                }
            }
        };

        fetchCouponData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
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
        if (!formData.endDate) newErrors.endDate = "End date is required.";
        if (formData.endDate < formData.startDate) newErrors.endDate = "End date must be after start date.";
        if (formData.minRentalAmount <= 0) newErrors.minRentalAmount = "Min rental amount must be greater than zero.";
        if (formData.maxDiscountAmount < 0) newErrors.maxDiscountAmount = "Max discount amount cannot be less than zero.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            try {
                if (id) {
                    const result = await updateCoupon(id, formData);
                    if (result?.data) {
                        navigate('/admin/coupon');
                    }
                }
            } catch (error) {
               
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto bg-white shadow-lg rounded">
            <h2 className="text-lg font-bold mb-3 text-center">Edit Coupon</h2>

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

            <div className="mb-3">
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

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                Update Coupon
            </button>
        </form>
    );
};

export default EditCoupon;
