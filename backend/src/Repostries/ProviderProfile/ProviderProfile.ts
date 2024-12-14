import { ProviderAdressInterface } from "../../Interface/ProviderInterface";
import providerProfile from "../../Model/Provider/ProviderProfilel";
import { BaseRepository } from "../BaseRepostry";
import { IProviderProfileRepository } from "./IProviderProfile";

export class ProviderProfileRepository extends BaseRepository<typeof providerProfile> implements IProviderProfileRepository {
    constructor() {
        super(providerProfile);
    }

     // *******************************check provider Address********************
     async checkProviderAddress(providerId: string): Promise<ProviderAdressInterface | null> {
        try {

            const check = await this.model.findOne({ providerId });
           
            if (check) {

                return {
                    _id: check._id.toString(),
                    name: check.name,
                    email: check.email,
                    phone: check.phone,
                    city: check.city,
                    state: check.state,
                    pinNumber: check.pinNumber,
                    image: check.image
                } as ProviderAdressInterface;
            }
            return null;
        } catch (error) {

            return null;
        }
    }

    // ***********************************save profile for provider*****************************
    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAdressInterface | null> {
        try {

            const newUser = new providerProfile({
                name: providerData.name,
                providerId: providerData.providerId,
                email: providerData.email,
                city: providerData.city,
                state: providerData.state,
                pinNumber: providerData.pinNumber,
                phone: providerData.phone,
            });

            const savedUser = await newUser.save();

            return {
                _id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                city: savedUser.city,
                state: savedUser.state,
                pinNumber: savedUser.pinNumber,

            } as ProviderAdressInterface;
        } catch (error) {
            ;
            return null;
        }
    }

    // *********************************edit profile******************************

    async editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAdressInterface | null> {
        try {

            const editAddress = await this.model.findByIdAndUpdate(
                
                { _id: id },
                {
                    name: providerData.name,
                    providerId: providerData.providerId,
                    email: providerData.email,
                    city: providerData.city,
                    state: providerData.state,
                    pinNumber: providerData.pinNumber,
                    phone: providerData.phone,
                },
                { new: true }
            )

            return editAddress;
        } catch (error) {
            return null;
        }
    }
    // *********************************update Image**********************
    async updateprofileImage(images: string, id: string): Promise<ProviderAdressInterface | null> {
        try {
            const profile = await this.model.findById(id);
            if (!profile) {
                return null;
            }

            const updatedProfile = await this.model.findByIdAndUpdate(
                id,
                { image: images },
                { new: true }
            );

            return updatedProfile as ProviderAdressInterface;
        } catch (error) {

            return null;
        }
    }

}