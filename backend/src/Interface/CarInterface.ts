import mongoose, { ObjectId } from "mongoose";
export interface CarDataInterface {
    car_name: string;
    model: string;
    rentalPrice: string;
    engineType: string;
    isBlocked:boolean;
    fuelType: string;
    color: string;
    images: string[];
    rcNumber: string;
    rcExpiry: string;
    insurancePolicyNumber: string;
    insuranceExpiry: string;
    pollutionCertificateNumber: string;
    pollutionExpiry: string;
    providerId:string |undefined;
    createdAt:string;
    id?: string | undefined;
 
}