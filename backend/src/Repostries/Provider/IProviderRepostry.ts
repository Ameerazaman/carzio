
import {  ProviderInterface } from "../../Interface/ProviderInterface";

export interface IProviderRepository {
    
    getProviderById(id: string): Promise<ProviderInterface | null> ,

    emailExistCheck(email: string): Promise<ProviderInterface | null>,

    editProvider(providerId: string): Promise<ProviderInterface | null>

    updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null>,

    updateStatusprovider(providerId: string): Promise<ProviderInterface | null>

    fetchProviders(page: number, limit: number): Promise<ProviderInterface[] | null>

    countProviders(): Promise<number | null>

    changePassword(email: string, password: string): Promise<ProviderInterface | null> ,
   
    saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null>,

}