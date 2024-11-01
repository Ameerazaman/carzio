import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTrashAlt } from 'react-icons/fa';
import { deleteOffer, editOffer, editProvider, editUser, notificaionDetails, updateStatus, updateStatusCar, updateStatusProvider } from '../../../Api/Admin';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface TableProps {
  tableData: Array<{ [key: string]: any }>;
  header: string; // New header prop
}

const Table: React.FC<TableProps> = ({ tableData: initialTableData, header }) => {

  const [tableData, setTableData] = useState(initialTableData);
  let navigate = useNavigate();

  useEffect(() => {
    console.log(tableData, 'data');
  }, [tableData]);

  const handleEdit = async (id: string) => {
    if (header === "user") {
      await editUser(id);
      navigate(`/admin/edit_${header}/${id}`); // Use header to determine the correct route (user or provider)
    }
    else if (header === "offers") {
      await editOffer(id);
      navigate(`/admin/edit_${header}/${id}`); // Use header to determine the correct route (user or provider)
    }
    else {
      await editProvider(id)
      navigate(`/admin/edit_${header}/${id}`)
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteOffer(id);

      if (result) {
        console.log("Offer deleted successfully:", result); 
        navigate('/admin/offers'); 
      } else {
        console.error("Offer not found or could not be deleted."); 
      }
    } catch (error) {
      console.error("Error while deleting offer:", error);
    }
  }


  const handleStatus = async (id: string) => {
    try {
      let result;

      if (header === "user") {
        result = await updateStatus(id);
      } else if (header === "cars") {
        console.log("Handling car status update");
        result = await updateStatusCar(id);
      } else {
        result = await updateStatusProvider(id);
      }

      if (result) {
        setTableData((prevTableData) =>
          prevTableData.map((data) =>
            data.id === id ? { ...data, isBlocked: !data.isBlocked } : data
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);

    }
  };

  return (
    <table className="min-w-full bg-white border-collapse">
      <thead>
        <tr>
          {header === "notification" ? (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Car Name</th>
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Rent/Day</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Details</th>
            </>
          ) : header === "cars" ? (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Car Name</th>
              <th className="py-2 px-4 border-b text-left">Image</th>
              <th className="py-2 px-4 border-b text-left">Rent/Day</th>
              <th className="py-2 px-4 border-b text-left">RcNumber</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </>
          ) : header === "offers" ? (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Offer Name</th>
              <th className="py-2 px-4 border-b text-left">Discount (%)</th>
              <th className="py-2 px-4 border-b text-left">carName</th>
              <th className="py-2 px-4 border-b text-left">End Date</th>
              <th className="py-2 px-4 border-b text-left">Edit</th>
              <th className="py-2 px-4 border-b text-left">Delete</th>
            </>
          ) :header === "coupons" ? (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Code</th>
              <th className="py-2 px-4 border-b text-left">Discount (%)</th>
              <th className="py-2 px-4 border-b text-left">Max Discount</th>
              <th className="py-2 px-4 border-b text-left">Start Date</th>
              <th className="py-2 px-4 border-b text-left">End Date</th>
              <th className="py-2 px-4 border-b text-left">Edit</th>
              <th className="py-2 px-4 border-b text-left">Delete</th>
            </>
          ) :  (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">{header === "user" ? "Username" : "Provider Name"}</th>
              <th className="py-2 px-4 border-b text-left">Edit</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {tableData?.length > 0 ? (
          tableData.map((data, index) => (
            <tr key={index}>
              {header === 'notification' ? (
                <>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{data?.car_name || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {data?.images?.length > 0 ? (
                      <img
                        src={data.images[0]}
                        alt={data.car_name}
                        className="w-16 h-auto"
                      />) : (
                      "No Image"
                    )}
                  </td>
                  {/* <td><img src='C:\Users\ameer\Desktop\Rent-a-car\backend\Src\Uploads\1729336431595-download (1).jpeg'></img></td>  */}

                  <td className="py-2 px-4 border-b">{data.rentalPrice}</td>
                  <td className="py-2 px-4 border-b">{data.createdAt}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <Link to={`/admin/notifications_details/${data.id}`}>
                      <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        View Details
                      </button>
                    </Link>

                  </td>
                </>
              ) : header === 'cars' ? (
                <>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{data?.car_name || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    {data?.images?.length > 0 ? (
                      <img
                        src={data.images[0]}
                        alt={data.car_name}
                        className="w-16 h-auto"
                      />) : (
                      "No Image"
                    )}
                  </td>

                  <td className="py-2 px-4 border-b">{data.rentalPrice}</td>
                  <td className="py-2 px-4 border-b">{data.rcNumber}</td>

                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleStatus(data?.id)}
                      className={`py-1 px-3 rounded-full ${data?.isBlocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                        } cursor-pointer`}
                    >
                      {data?.isBlocked ? 'Blocked' : 'Active'}
                    </button>


                  </td>
                </>
              ) : header === 'coupons' ? (
                <>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{data.code || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{data.discountPercentage || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{data.maxDiscountAmount || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{new Date(data.startDate).toLocaleDateString() || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{new Date(data.endDate).toLocaleDateString() || "N/A"}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleEdit(data.id)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleDelete(data.id)} className="text-red-600 hover:text-red-800 ml-2">
                      <FaTrashAlt />
                    </button>
                  </td>
                </>
              ) : header === 'offers' ? (
                <>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{data?.offerTitle || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{data?.discountPercentage}%</td>
                  <td className="py-2 px-4 border-b">{data?.carName}</td>
                  <td className="py-2 px-4 border-b">{data?.endDate}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleEdit(data?.id)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() =>
                      handleDelete(data?.id)} className="text-red-600 hover:text-red-800 ml-2">
                      <FaTrashAlt />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{data?.email || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{header === 'user' ? data?.username || "N/A" : data?.usernamev || "N/A"}</td> {/* Adjust the data */}
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleEdit(data?.id)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => handleStatus(data?.id)}
                      className={`py-1 px-3 rounded-full ${data?.isBlocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                        } cursor-pointer`}
                    >
                      {data?.isBlocked ? 'Blocked' : 'Active'}
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={header === "notification" ? 5 : 6} className="text-center py-4">No {header}s found</td>
          </tr>
        )}
      </tbody>
    </table>
  );

};

export default Table;

