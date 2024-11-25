

export interface CarDataInterface {
    car_name: string;
    model: string;
    rentalPrice: string;
    engineType: string;
    fuelType: string;
    color: string;
    images: string[]; // This will store the image URLs for preview
    uploadedFiles?: File[]; // New field to store actual File objects
    rcNumber: string;
    rcExpiry: string;
    insurancePolicyNumber: string;
    insuranceExpiry: string;
    pollutionCertificateNumber: string;
    pollutionExpiry: string;
    providerId?: string;
    id?:string;
    
}
