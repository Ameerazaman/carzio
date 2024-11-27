import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';
import { getDashboardConstData } from '../../Api/Provider';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from '../Common/Navbar';

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const ProviderDashboard: React.FC = () => {
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
  const providerId = provider?._id;

  const [totalCars, setTotalCars] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [carRevenueData, setCarRevenueData] = useState<{ carName: string; amount: number }[]>([]);
  const [carBookingData, setCarBookingData] = useState<{ carName: string; count: number }[]>([]);
  const [carBookingTotal, setCarBookingTotal] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (providerId) {
        const result = await getDashboardConstData(providerId);

        setTotalCars(result.data.totalCars);
        setTotalRevenue(result.data.revenue);
        setCarRevenueData(result.data.revenueByCar);
        setCarBookingData(result.data.totalBookingCount);
        setCarBookingTotal(result.data.totalBooking);
      }
    };

    fetchDashboardData();
  }, [providerId]);

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

  const revenueDoughnutData = {
    labels: ['Revenue'],
    datasets: [
      {
        label: 'Total Revenue',
        data: [totalRevenue],
        backgroundColor: ['#28a745'],
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
    labels: carBookingData.map((item) => item.carName),
    datasets: [
      {
        label: 'Car Bookings',
        data: carBookingData.map((item) => item.count),
        borderColor: '#FF6347',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg min-h-screen">
     
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Total Cars</h3>
          <div className="text-3xl text-red-500">{totalCars}</div>
          <Doughnut data={carDoughnutData} options={doughnutOptions} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Total Bookings</h3>
          <div className="text-3xl text-yellow-500">{carBookingTotal}</div>
          <Doughnut data={carBookingDoughnutData} options={doughnutOptions} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">Total Revenue</h3>
          <div className="text-3xl text-green-500">${totalRevenue.toLocaleString()}</div>
          <Doughnut data={revenueDoughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Revenue Trends</h3>
          <Line data={revenueLineChartData} options={lineChartOptions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Car Bookings</h3>
          <Bar data={carBookingBarChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
