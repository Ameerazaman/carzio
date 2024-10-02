import React from 'react';

function Table() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Car</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-700 transition duration-300">
            <td className="border border-gray-300 px-4 py-2">1</td>
            <td className="border border-gray-300 px-4 py-2">John Doe</td>
            <td className="border border-gray-300 px-4 py-2">Toyota Camry</td>
            <td className="border border-gray-300 px-4 py-2">Active</td>
          </tr>
          <tr className="hover:bg-gray-700 transition duration-300">
            <td className="border border-gray-300 px-4 py-2">2</td>
            <td className="border border-gray-300 px-4 py-2">Jane Smith</td>
            <td className="border border-gray-300 px-4 py-2">Honda Accord</td>
            <td className="border border-gray-300 px-4 py-2">Inactive</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
