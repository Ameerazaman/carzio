import React, { useEffect, useState } from 'react';
import Navbar, { User } from '../../Pages/Common/Navbar';
import WalletTable from '../../Pages/User/LandingPage/WalletTable';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { getWalletPage } from '../../Api/User';
import { walletInterface } from '../../Interface/WalletInterface';
import Pagination from '../../Pages/Common/Pagination';
import Footer from '../../Pages/Common/Footer';
import Loading from '../../Pages/Common/Loading';

function WalletPage() {
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const [walletData, setWallet] = useState<walletInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0); // Ensure total is a number
  const limit = 10;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (user?._id) {
        try {
          const result = await getWalletPage(user._id, page, limit); // Pass them as separate arguments
          setWallet(result.data.data);
          setTotalPages(result.data.totalPage || 1);
          setTotal(result.data.totalAmount || 0); // Default to 0 if totalAmount is undefined
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
      {loading ? (
        <div className="text-center text-lg text-gray-500"><Loading/></div>
      ) : walletData && walletData.length > 0 ? (
        <>
          {/* Wallet Table */}
          <br />
          <div className="text-center flex flex-col items-center space-y-4">
            {/* Cartoon Wallet Icon */}


            {/* Wallet Balance Text */}
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">
              Total Wallet Balance:{" "}
              <span className="text-3xl font-extrabold">{`₹${total.toFixed(2)}`}</span>
            </h2>
          </div>



          <WalletTable walletData={walletData} />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen flex-col">
          {/* Empty Wallet Message */}
          <div className="text-2xl font-semibold text-gray-600 mb-4 animate-pulse">Your wallet is empty</div>
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center animate-bounce">
            {/* Empty Wallet Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3ZM5 4V16H15V4H5ZM6 6H14V7H6V6Z" clipRule="evenodd" />
            </svg>

          </div>
          <p className="text-lg text-gray-500 mt-4 animate-fade-in">Looks like you haven't made any transactions yet. Start adding funds to your wallet to see your balance here!</p>
        </div>
      )}
     <div className="mt-12">
                <Footer />
            </div>
    </div>
  );
}

export default WalletPage;

