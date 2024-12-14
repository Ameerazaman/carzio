import { OfferDataInterface } from "../../Interface/OfferInterface";
import Offer from "../../Model/Admin/OfferModel";
import { BaseRepository } from "../BaseRepostry";
import { IOfferRepository } from "./IOfferRepository";

export class OfferRepository extends BaseRepository<typeof Offer> implements IOfferRepository {
    constructor() {
        super(Offer);
    }
    // *******************************Add Offer******************
    async addOffer(offer: OfferDataInterface): Promise<OfferDataInterface | null> {
        try {

            const newOffer = new Offer({
                carName: offer.carName,
                offerTitle: offer.offerTitle,
                startDate: new Date(offer.startDate),
                endDate: new Date(offer.endDate),
                discountPercentage: offer.discountPercentage,
            });
            const savedOffer = (await newOffer.save()) as unknown as OfferDataInterface;
            console.log(savedOffer)
            return {
                carName: savedOffer.carName,
                offerTitle: savedOffer.offerTitle,
                startDate: savedOffer.startDate,
                endDate: savedOffer.endDate,
                discountPercentage: savedOffer.discountPercentage,
                id: savedOffer.id?.toString() || "",
                isActive: savedOffer?.isActive
            };
        } catch (error) {

            return null;
        }
    }
    // ********************************fetch offers*********************
    async fetchOffer(page: number, limit: number): Promise<OfferDataInterface[] | null> {
        try {

            const skip = (page - 1) * limit;
            const data = await this.model
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit) as OfferDataInterface[];

            const offers: OfferDataInterface[] = data.map((offer: OfferDataInterface) => ({
                carName: offer.carName,
                offerTitle: offer.offerTitle,
                startDate: offer.startDate,
                endDate: offer.endDate,
                discountPercentage: offer.discountPercentage,
                id: offer.id?.toString() || "",
                isActive: offer?.isActive
            }));

            return offers;
        } catch (error) {
            return null;
        }
    }
    // **************************edit Offer*************************8
    async editOffer(offerId: string): Promise<OfferDataInterface | null> {
        try {
            let check = await this.model.findById(offerId);
            if (check) {
                return {
                    carName: check.carName,
                    offerTitle: check.offerTitle,
                    startDate: check.startDate,
                    endDate: check.endDate,
                    discountPercentage: check.discountPercentage,
                    id: check._id?.toString() || "",
                    isActive: check?.isActive
                }
            }
            return null;
        }
        catch (error) {

            return null;
        }
    }

    // *******************************update Offer********************
    async updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferDataInterface | null> {
        try {

            const updatedOffer = await this.model.findByIdAndUpdate(
                id,
                {
                    carName: offerData.carName,
                    offerTitle: offerData.offerTitle,
                    startDate: offerData.startDate,
                    endDate: offerData.endDate,
                    discountPercentage: offerData.discountPercentage,
                },
                { new: true }
            )
            return updatedOffer;
        } catch (error) {

            return null;
        }
    }
    // ***********************updateStatus offer********************88
    async updateStatusOffer(offerId: string): Promise<OfferDataInterface | null> {
        try {
            let offer = await this.model.findById(offerId);

            if (!offer) {

                return null;
            }
            const updateOffer = await Offer.findByIdAndUpdate(
                offer,
                { isActive: !offer.isActive },
                { new: true }
            );

            return updateOffer as OfferDataInterface;
        } catch (error) {

            return null;
        }
    }

    // ***************************total offers*******************************
    async countOffers(): Promise<number | null> {
        try {
            const countOffers = await Offer.countDocuments();
            return countOffers;
        } catch (error) {
            return null;
        }
    }

     // *************************fetch offer8*******************888
     async fetchOfferForUser(): Promise<OfferDataInterface[] | null> {
        try {

            const data = await this.model.find().sort({ createdAt: -1 }) as OfferDataInterface[]; // Array of OfferDataInterface documents

            const offers: OfferDataInterface[] = data.map((offer: OfferDataInterface) => ({
                carName: offer.carName,
                offerTitle: offer.offerTitle,
                startDate: offer.startDate,
                endDate: offer.endDate,
                discountPercentage: offer.discountPercentage,
                id: offer.id?.toString() || "",
                isActive: offer.isActive ?? true,
            }));

            return offers;
        } catch (error) {
            return null;
        }
    }

    
    // ******************check offer for booking******************
    async checkOfferForBooking(carName: string): Promise<OfferDataInterface | null> {
        try {
            const offer = await this.model.findOne({
                carName: { $regex: new RegExp(`^${carName}$`, 'i') },
            });
            if (offer) {
                return offer as OfferDataInterface
            }
            return null;
        } catch (error) {
            return null;
        }
    }

}