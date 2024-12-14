import { ProfileInterface } from "../../Interface/Profileinterface"

export interface IProfileUserRepository {

    checkProfile(userId: string): Promise<ProfileInterface | null>

    saveProfile(profileData: ProfileInterface): Promise<ProfileInterface | null>

    editProfile(profileData: ProfileInterface, profileId: string): Promise<ProfileInterface | null>

}