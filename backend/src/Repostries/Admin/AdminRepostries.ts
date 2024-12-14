
import { adminInterface } from "../../Interface/AdminInterface";
import adminModel from "../../Model/Admin/AdminModel";
import { IAdminRepository } from "./IAdminRepostry";
import { BaseRepository } from "../BaseRepostry";


export class AdminRepository extends BaseRepository<typeof adminModel> implements IAdminRepository {
  constructor() {
    super(adminModel);
  }
// ************************check email exist or not***********************
  async emailExistCheck(email: string): Promise<adminInterface | null> {
    try {
      const existingAdmin =   await this.model.findOne({ email });

      return existingAdmin as adminInterface;

    } catch (error) {

      return null;
    }
  }


  // *****************8get adminby Id*********************8

  async getAdminById(id: string): Promise<adminInterface | null> {
    try {

      const existingUser = await this.model.findById(id);

      return existingUser as adminInterface;
    } catch (error) {

      return null;
    }
  }

}
