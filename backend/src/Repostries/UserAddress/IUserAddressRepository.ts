import { UserAddressInterface } from "../../Interface/UserAddressInterface"

export interface IUserAddressRepository {

    checkAddress(userId: string): Promise<UserAddressInterface | null>

    saveAddress(addressData: UserAddressInterface): Promise<UserAddressInterface | null>

    editAddress(addressData: UserAddressInterface, addressId: string): Promise<UserAddressInterface | null>

}