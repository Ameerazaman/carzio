export interface DashboardInterface {
    totalCars: number;
    totalProviders?: number;
    totalUsers?: number;
    revenue: number;
    totalBookingCount?: { carName: string; count: number }[]; 
    totalBooking :number,
    revenueByCar:{carName:string,amount:number}[]
  }
  
