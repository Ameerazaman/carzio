import React, { useEffect, useState } from 'react';
import Navbar, { User } from '../../Pages/Common/Navbar';
import WalletTable from '../../Pages/User/LandingPage/WalletTable';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { getWalletPage } from '../../Api/User';
import { walletInterface } from '../../Interface/WalletInterface';
import Pagination from '../../Pages/Common/Pagination';
import { FaWallet } from 'react-icons/fa'; // Wallet icon

function WalletPage() {
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const [walletData, setWallet] = useState<walletInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (user?._id) {
        try {
          const result = await getWalletPage(user._id, page, limit); // Pass them as separate arguments
          setWallet(result.data.data);
          setTotalPages(result.data.totalPage || 1);
          setTotal(result.data.totalAmount);
          setLoading(false);
        } catch (error) {
          setError("Error fetching booking history.");
          setLoading(false);
        }
      }
    };

    fetchBookingHistory();
  }, [user, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      
      {/* Total Wallet Balance Section with Yellow to Red Gradient Background */}
      <div className="flex items-center justify-center bg-gradient-to-r from-yellow-400 to-red-500 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Total Wallet Balance</h2>
          <div className="border-b-2 border-white mb-2"></div>
          <p className="text-4xl font-bold">{`₹${total.toFixed(2)}`}</p>
        </div>
      </div>

      {/* Wallet Table */}
      <WalletTable walletData={walletData} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default WalletPage;
