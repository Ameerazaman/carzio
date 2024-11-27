import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { getDashboardConstData } from '../../Api/Admin';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

const AdminDashboard: React.FC = () => {
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalProviders, setTotalProviders] = useState<number>(0);
    const [totalCars, setTotalCars] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [carRevenueData, setCarRevenueData] = useState<{ carName: string, amount: number }[]>([]);
    const [carBookingData, setCarBookingData] = useState<{ carName: string; count: number }[]>([]);
    const [carBookingTotal, setCarBookingTotal] = useState<number>(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const result = await getDashboardConstData();
            setTotalUsers(result.data.totalUsers);
            setTotalProviders(result.data.totalProviders);
            setTotalCars(result.data.totalCars);

            setTotalRevenue(result.data.revenue);
            setCarRevenueData(result.data.revenueByCar);
            setCarBookingData(result.data.totalBookingCount);
            setCarBookingTotal(result.data.totalBooking);
        };

        fetchDashboardData();
    }, []);
    
    // Doughnut chart options
    const doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}`,
                },
            },
        },
    };

    // Doughnut data for individual charts
    const userDoughnutData = {
        labels: ['Total Users'],
        datasets: [
            {
                label: 'Users',
                data: [totalUsers],
                backgroundColor: ['#FF6347'],
                borderWidth: 1,
            },
        ],
    };

    const providerDoughnutData = {
        labels: ['Total Providers'],
        datasets: [
            {
                label: 'Providers',
                data: [totalProviders],
                backgroundColor: ['#4CAF50'],
                borderWidth: 1,
            },
        ],
    };

    const carDoughnutData = {
        labels: ['Total Cars'],
        datasets: [
            {
                label: 'Cars',
                data: [totalCars],
                backgroundColor: ['#1E90FF'],
                borderWidth: 1,
            },
        ],
    };

    const carBookingDoughnutData = {
        labels: ['Total Car Bookings'],
        datasets: [
            {
                label: 'Bookings',
                data: [carBookingTotal],
                backgroundColor: ['#FFD700'],
                borderWidth: 1,
            },
        ],
    };

    // Line chart options for revenue and car booking
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
    };

    const revenueLineChartData = {
        labels: carRevenueData.map((entry) => entry.carName),
        datasets: [
            {
                label: 'Revenue ($)',
                data: carRevenueData.map((entry) => entry.amount),
                borderColor: '#FF6347',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };

    const carBookingBarChartData = {
        labels: carBookingData.map(item => item.carName),
        datasets: [
            {
                label: 'Car Bookings',
                data: carBookingData.map(item => item.count),
                borderColor: '#FF6347',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };

    return (
        <div className="dashboard-container p-6 bg-white rounded-lg shadow-lg">
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="stat-item text-center">
                    <h3 className="text-xl font-semibold">Total Users</h3>
                    <div className="text-3xl text-blue-500">{totalUsers}</div>
                    <Doughnut data={userDoughnutData} options={doughnutOptions} height={100} width={100} />
                </div>
                <div className="stat-item text-center">
                    <h3 className="text-xl font-semibold">Total Providers</h3>
                    <div className="text-3xl text-green-500">{totalProviders}</div>
                    <Doughnut data={providerDoughnutData} options={doughnutOptions} height={100} width={100} />
                </div>
                <div className="stat-item text-center">
                    <h3 className="text-xl font-semibold">Total Cars</h3>
                    <div className="text-3xl text-red-500">{totalCars}</div>
                    <Doughnut data={carDoughnutData} options={doughnutOptions} height={100} width={100} />
                </div>
                <div className="stat-item text-center">
                    <h3 className="text-xl font-semibold">Total Car Bookings</h3>
                    <div className="text-3xl text-yellow-500">{carBookingTotal}</div>
                    <Doughnut data={carBookingDoughnutData} options={doughnutOptions} height={100} width={100} />
                </div>
            </div>

            {/* Revenue and Car Bookings Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="w-full">
                    <h3 className="text-xl font-semibold mb-3">Total Revenue</h3>
                    <div className="text-3xl text-green-600">{totalRevenue.toLocaleString()}</div>
                    <Line data={revenueLineChartData} options={lineChartOptions} height={200} />
                </div>
                <div className="w-full">
                    <h3 className="text-xl font-semibold mb-3">Car Bookings</h3>
                    <Bar data={carBookingBarChartData} options={lineChartOptions} height={200} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
