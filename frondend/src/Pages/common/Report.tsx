import React, { useState, useEffect } from "react";

interface TableProps {
  tableData: Array<{ [key: string]: any }>;
}

const Report: React.FC<TableProps> = ({ tableData: initialTableData }) => {
  const [tableData, setTableData] = useState(initialTableData);

  useEffect(() => {
   
  }, [tableData]);

  const downloadCSV = () => {
    if (!tableData || tableData.length === 0) {
      alert("No data available to download!");
      return;
    }
  
    // CSV headers
    const headers = ["No", "Issue Date", "Return Date", "Amount", "Time", "Payment", "Date"];
  
    // Map data to rows with formatted dates
    const rows = tableData.map((data, index) => {
      const formatDate = (date: string) =>
        date ? new Date(date).toLocaleDateString("en-US") : "N/A";
  
      return [
        index + 1,
        formatDate(data.IssueDate), // Format Issue Date
        formatDate(data.ReturnDate), // Format Return Date
        data.total_Amt || "N/A",
        data.PickUpTime || "N/A",
        data.Payment || "N/A",
        new Date(data.createdAt).toLocaleDateString("en-US") || "N/A", // Format createdAt
      ];
    });
  
    // Combine headers and rows into CSV string
    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) => row.map((item) => `"${item}"`).join(",")), // Quote values for safety
    ].join("\n");
  
    // Create a Blob for the CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
  
    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sales_Report.csv";
    document.body.appendChild(a); // Append to body to make it clickable
    a.click();
    document.body.removeChild(a); // Remove element after download
  
    // Revoke URL
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Sales Report</h1>

      {/* Button aligned to the right */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          disabled={!tableData || tableData.length === 0} // Disable if no data
        >
          Download CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="w-full bg-white text-left border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="p-3 border-b">No</th>
              <th className="p-3 border-b">Issue Date</th>
              <th className="p-3 border-b">Return Date</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Time</th>
              <th className="p-3 border-b">Payment</th>
              <th className="p-3 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={data.id || index} className="hover:bg-gray-100">
                <td className="p-3 border-b">{index + 1}</td>
                <td className="p-3 border-b">{data.IssueDate || "N/A"}</td>
                <td className="p-3 border-b">{data.ReturnDate || "N/A"}</td>
                <td className="p-3 border-b">{data.total_Amt || "N/A"}</td>
                <td className="p-3 border-b">{data.PickUpTime || "N/A"}</td>
                <td className="p-3 border-b">{data.Payment || "N/A"}</td>
                <td className="p-3 border-b">{data.createdAt || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
