import {OfferDataInterface, OfferReturnData} from '../OfferInterface'

export interface OfferAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: OfferDataInterface | OfferDataInterface[] |OfferReturnData|OfferReturnData[]| undefined,
        providerId?: string;
     
    };
}