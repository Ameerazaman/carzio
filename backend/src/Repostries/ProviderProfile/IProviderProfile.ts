import { ProviderAdressInterface } from "../../Interface/ProviderInterface";

export interface IProviderProfileRepository {

    checkProviderAddress(providerId: string): Promise<ProviderAdressInterface | null>,

    saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAdressInterface | null>,

    editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAdressInterface | null>,

    updateprofileImage(images: string, id: string): Promise<ProviderAdressInterface | null>

}