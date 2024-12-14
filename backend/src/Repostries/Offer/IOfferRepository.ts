import { OfferDataInterface } from "../../Interface/OfferInterface"

export interface IOfferRepository {

    addOffer(offer: OfferDataInterface): Promise<OfferDataInterface | null>

    fetchOffer(page: number, limit: number): Promise<OfferDataInterface[] | null>

    editOffer(offerId: string): Promise<OfferDataInterface | null>

    updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferDataInterface | null>

    updateStatusOffer(offerId: string): Promise<OfferDataInterface | null>

    countOffers(): Promise<number | null>

    fetchOfferForUser(): Promise<OfferDataInterface[] | null>

    checkOfferForBooking(carName: string): Promise<OfferDataInterface | null>

}