import {OfferDataInterface} from '../OfferInterface'

export interface OfferAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: OfferDataInterface | OfferDataInterface[]| undefined,
        providerId?: string;
     
    };
}