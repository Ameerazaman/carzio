import { UserAddressInterface } from "../../Interface/UserAddressInterface";
import UserAddressModel from "../../Model/User/AddressModel";
import { BaseRepository } from "../BaseRepostry";
import { IUserAddressRepository } from "./IUserAddressRepository";

export class UserAddressRepository extends BaseRepository<typeof UserAddressModel> implements IUserAddressRepository {
    constructor() {
        super(UserAddressModel);
    }

      //******************** */ check Address**************************
      async checkAddress(userId: string): Promise<UserAddressInterface | null> {
        try {
            const checkAddress = await this.model.findOne({ userId: userId })
            if (checkAddress) {
                return checkAddress as UserAddressInterface;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // ***************save address*********************8
    async saveAddress(addressData: UserAddressInterface): Promise<UserAddressInterface | null> {
        try {

            const savedAddress = await this.model.create(addressData);
            return savedAddress as UserAddressInterface;
        } catch (error) {

            return null;
        }
    }
    // *************************Edit Address************************

    async editAddress(addressData: UserAddressInterface, addressId: string): Promise<UserAddressInterface | null> {
        try {
            const updatedAddress = await this.model.findOneAndUpdate(
                { _id: addressId },
                addressData,
                { new: true }
            );
            if (updatedAddress) {
                return updatedAddress as UserAddressInterface;
            }
            return null;
        } catch (error) {
            return null;
        }
    }
}