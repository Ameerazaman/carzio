import React from 'react';

import { walletInterface } from '../../../Interface/WalletInterface';

interface walletDataUserProps {
  walletData: walletInterface[]; // Use the Booking interface for typing
}

function WalletTable({ walletData }: walletDataUserProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-sm leading-normal">
              <th className="py-3 px-6 text-left">Transaction ID</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Type</th>
              <th className="py-3 px-6 text-left">Amount</th>

            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {walletData.map((transaction) => (
              <tr key={transaction._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{transaction._id}</td>

                <td className="py-3 px-6 text-left">{transaction.Description}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${transaction.TransactionType === "Credit"
                      ? "bg-green-200 text-green-600"
                      : "bg-red-200 text-red-600"
                      }`}
                  >
                    {transaction.TransactionType}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{transaction.Amount}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WalletTable;

