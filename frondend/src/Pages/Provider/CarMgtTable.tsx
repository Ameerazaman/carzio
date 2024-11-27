import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import { updateStatusCar } from '../../Api/Provider';

interface TableProps {
  tableData: Array<{ [key: string]: any }>;
}

const CarMgtTable: React.FC<TableProps> = ({ tableData: initialTableData }) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(initialTableData);

  const handleEdit = async (id: string) => {
    navigate(`/provider/edit_car/${id}`);
  };

  const handleStatus = async (id: string) => {
    let result = await updateStatusCar(id);
    if (result) {
      setTableData((prevTableData) =>
        prevTableData.map((data) =>
          data.id === id ? { ...data, isBlocked: !data.isBlocked } : data
        )
      );
    }
  };

  return (
    <div className="overflow-x-auto sm:overflow-visible"> {/* Enable horizontal scroll for smaller screens */}
      <table className="min-w-full bg-white border-collapse">
        <thead>
        <tr className="bg-gray-800 text-white text-sm leading-normal">
            <th className="py-2 px-4 border-b text-left">No</th>
            <th className="py-2 px-4 border-b text-left">Car Name</th>
            <th className="py-2 px-4 border-b text-left">Image</th>
            <th className="py-2 px-4 border-b text-left">Rent/Day</th>
            <th className="py-2 px-4 border-b text-left">RcNumber</th>
            <th className="py-2 px-4 border-b text-left">Edit</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData && tableData.length > 0 ? (
            tableData.map((data, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{data?.car_name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  {data?.images?.length > 0 ? (
                    <img
                      src={data.images[0]}
                      alt={data.car_name || 'Car'}
                      className="w-16 h-auto"
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="py-2 px-4 border-b">{data?.rentalPrice || 'N/A'}</td>
                <td className="py-2 px-4 border-b">{data?.rcNumber || 'N/A'}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleEdit(data?.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleStatus(data?.id)}
                    className={`py-1 px-3 rounded-full ${data?.isBlocked ? 'bg-red-600 text-white' : 'bg-green-600 text-white'} cursor-pointer`}
                  >
                    {data?.isBlocked ? 'Blocked' : 'Active'}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No cars found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CarMgtTable;


