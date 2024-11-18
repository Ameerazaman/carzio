export interface walletInterface {
    _id: string; 
    UserId: string;
    Description: string;
    TransactionType: "Credit" | "Debit"; 
    Amount: number;
    bookingId:string;
    totalAmt:number
  }
  