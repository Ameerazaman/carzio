var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
var Report = function (_a) {
    var initialTableData = _a.tableData;
    var _b = useState(initialTableData), tableData = _b[0], setTableData = _b[1];
    useEffect(function () { }, [tableData]);
    var downloadCSV = function () {
        if (!tableData || tableData.length === 0) {
            alert("No data available to download!");
            return;
        }
        // CSV headers
        var headers = ["No", "Issue Date", "Return Date", "Amount", "Time", "Payment", "Date"];
        // Map data to rows with formatted dates
        var rows = tableData.map(function (data, index) {
            var formatDate = function (date) {
                return date ? new Date(date).toLocaleDateString("en-US") : "N/A";
            };
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
        var csvContent = __spreadArray([
            headers.join(",")
        ], rows.map(function (row) { return row.map(function (item) { return "\"".concat(item, "\""); }).join(","); }), true).join("\n");
        // Create a Blob for the CSV
        var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        // Trigger download
        var a = document.createElement("a");
        a.href = url;
        a.download = "Sales_Report.csv";
        document.body.appendChild(a); // Append to body to make it clickable
        a.click();
        document.body.removeChild(a); // Remove element after download
        // Revoke URL
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "p-6 bg-gray-100 min-h-screen", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx("button", { onClick: downloadCSV, className: "px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700", disabled: !tableData || tableData.length === 0, children: "Download CSV" }) }), _jsx("div", { className: "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200", children: _jsxs("table", { className: "min-w-full table-auto border-collapse bg-white", children: [_jsx("thead", { className: "bg-gray-300", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "No" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Issue Date" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Return Date" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Amount" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Time" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Payment" }), _jsx("th", { className: "p-3 border-b text-sm md:text-base", children: "Date" })] }) }), _jsx("tbody", { children: tableData.map(function (data, index) { return (_jsxs("tr", { className: "hover:bg-gray-100", children: [_jsx("td", { className: "p-3 border-b text-sm md:text-base", children: index + 1 }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.IssueDate || "N/A" }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.ReturnDate || "N/A" }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.total_Amt || "N/A" }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.PickUpTime || "N/A" }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.Payment || "N/A" }), _jsx("td", { className: "p-3 border-b text-sm md:text-base", children: data.createdAt || "N/A" })] }, data.id || index)); }) })] }) })] }));
};
export default Report;
