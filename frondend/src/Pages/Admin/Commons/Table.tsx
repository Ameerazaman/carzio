import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { editCoupon, editOffer, editProvider, editUser, updateStatus, updateStatusCar, updateStatusCoupon, updateStatusOffer, updateStatusProvider } from '../../../Api/Admin';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

interface TableProps {
  tableData: Array<{ [key: string]: any }>;
  header: string;
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
      navigate(`/admin/edit_${header}/${id}`);
    }
    else if (header === 'coupons') {
      await editCoupon(id);
      navigate(`/admin/edit_${header}/${id}`);
    }
    else if (header === "offers") {
      await editOffer(id);
      navigate(`/admin/edit_${header}/${id}`);
    }
    else {
      await editProvider(id)
      navigate(`/admin/edit_${header}/${id}`)
    }
  };



  const handleStatus = async (id: string) => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to change the status or delete it?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, change status',
        cancelButtonText: 'No, cancel',
      });
  
      if (result.isConfirmed) {
        console.log("id check", id);
        let statusUpdateResult;
  
        if (header === "user") {
          statusUpdateResult = await updateStatus(id);
        } else if (header === "cars") {
          console.log("Handling car status update");
          statusUpdateResult = await updateStatusCar(id);
        } else if (header === 'coupons') {
          console.log("Handling car status update");
          statusUpdateResult = await updateStatusCoupon(id);
        } else if (header === "offers") {
          console.log("Handling offer status update");
          statusUpdateResult = await updateStatusOffer(id);
        } else {
          statusUpdateResult = await updateStatusProvider(id);
        }
  
        if (statusUpdateResult) {
          // Show success alert
          Swal.fire({
            title: 'Success!',
            text: 'Status updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          if (statusUpdateResult) {
            setTableData((prevTableData) =>
              prevTableData.map((data) =>
                data.id === id
                  ? {
                      ...data,
                      isBlocked: data.hasOwnProperty('isBlocked') ? !data.isBlocked : data.isBlocked,
                      isActive: data.hasOwnProperty('isActive') ? !data.isActive : data.isActive,
                    }
                  : data
              )
            );
          }
          
        }
      } else {
       
      }
    } catch (error) {
    
      
      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong while updating the status.',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
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
              <th className="py-2 px-4 border-b text-left">Status</th>
            </>
          ) : header === "coupons" ? (
            <>
              <th className="py-2 px-4 border-b text-left">No</th>
              <th className="py-2 px-4 border-b text-left">Code</th>
              <th className="py-2 px-4 border-b text-left">Discount (%)</th>
              <th className="py-2 px-4 border-b text-left">Min Rent Amt</th>
              <th className="py-2 px-4 border-b text-left">Start Date</th>
              <th className="py-2 px-4 border-b text-left">End Date</th>
              <th className="py-2 px-4 border-b text-left">Edit</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
            </>
          ) : (
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
                  <td className="py-2 px-4 border-b">{data.minRentalAmount || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{new Date(data.startDate).toLocaleDateString() || "N/A"}</td>
                  <td className="py-2 px-4 border-b">{new Date(data.endDate).toLocaleDateString() || "N/A"}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleEdit(data.id)} className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button onClick={() => handleStatus(data?.id)} className={`py-1 px-3 rounded-full ${data?.isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} cursor-pointer`}>
                      {data?.isActive ? 'Active' : 'Block'}
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
                    <button
                      onClick={() => handleStatus(data?.id)}
                      className={`py-1 px-3 rounded-full ${data?.isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                        } cursor-pointer`}
                    >
                      {data?.isActive ? 'Active' : 'Block'}
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

