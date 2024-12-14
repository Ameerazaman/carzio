import { ProfileInterface } from "../../Interface/Profileinterface";
import UserProfileModel from "../../Model/User/ProfileModel";
import { BaseRepository } from "../BaseRepostry";
import { IProfileUserRepository } from "./IProfileUser";

export class ProfileUserRepository extends BaseRepository<typeof UserProfileModel> implements IProfileUserRepository {
    constructor() {
        super(UserProfileModel);

    }

      // ***********************check profile******************
      async checkProfile(userId: string): Promise<ProfileInterface | null> {
        const data = await this.model.findOne({ userId: userId })
        if (data) {
            return {
                _id: data._id,
                userId: data.userId ?? undefined,
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                phone: data.phone ?? undefined,
                adharNo: data.adharNo ?? undefined,
                gender: data.gender ?? undefined
            } as ProfileInterface;
        }
        return null;
    }
    // **********************88save profile********************

    async saveProfile(profileData: ProfileInterface): Promise<ProfileInterface | null> {
        try {
            const savedProfile = await this.model.create(profileData)
            return savedProfile as ProfileInterface;
        } catch (error) {

            return null;
        }
    }
    // *************************Edit profile************************

    async editProfile(profileData: ProfileInterface, profileId: string): Promise<ProfileInterface | null> {
        try {

            const updatedProfile = await this.model.findOneAndUpdate(
                { _id: profileId },
                profileData,
                { new: true }
            );
            if (updatedProfile) {
                return updatedProfile as ProfileInterface;
            }
            return null;
        } catch (error) {

            return null;
        }
    }
}