import { adminInterface } from "../../Interface/AdminInterface";


export interface IAdminRepository {
    
    emailExistCheck(email: string): Promise<adminInterface | null>,

    getAdminById(id: string): Promise<adminInterface | null>

}