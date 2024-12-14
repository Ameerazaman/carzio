import mongoose from "mongoose";

import { ProviderInterface } from "../../Interface/ProviderInterface";
import providerModel from "../../Model/Provider/ProviderModel";
import { IProviderRepository } from "./IProviderRepostry";
import { BaseRepository } from "../BaseRepostry";



export class ProviderRepository extends BaseRepository<typeof providerModel> implements IProviderRepository {
    constructor() {
        super(providerModel);

    }
    //*******************check provider for tooken validation*************

    async getProviderById(id: string): Promise<ProviderInterface | null> {
        try {

            const existingProvider = await this.model.findById(id);

            return existingProvider as ProviderInterface;
        } catch (error) {

            return null;
        }
    }
    //****This function checks if an email exists in the provider database********
    async emailExistCheck(email: string): Promise<ProviderInterface | null> {
        try {
            const existingUser = await this.model.findOne({ email });

            return existingUser as ProviderInterface;
        } catch (error) {

            return null;
        }
    }
    // **************************change password**********************
    async changePassword(email: string, password: string): Promise<ProviderInterface | null> {
        try {
            const changeUserpassword = await this.model.findOneAndUpdate({ email: email, password: password });
            return changeUserpassword as ProviderInterface;
        } catch (error) {

            return null;
        }
    }
    // ***************************fetch providers******************
    async fetchProviders(page: number, limit: number): Promise<ProviderInterface[] | null> {
        try {
            const skip = (page - 1) * limit;

            const data = await this.model
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean() as ProviderInterface[];

            return data as ProviderInterface[]
        } catch (error) {
            return null;
        }
    }
    // **********************edit provider*********************

    async editProvider(providerId: string): Promise<ProviderInterface | null> {
        try {

            let check = await this.model.findById(providerId);

            if (check) {
                return {
                    _id: check._id.toString(),
                    username: check.username,
                    email: check.email,
                    password: check.password
                } as ProviderInterface;
            }
            return null;
        }
        catch (error) {
            return null;
        }
    }

    // ***************************update provider************************

    async updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null> {
        try {

            const editProvider = await this.model.findByIdAndUpdate(
                { _id: id },
                {
                    username: providerData.username,
                    email: providerData.email,

                },
                { new: true }
            )

            return editProvider;
        } catch (error) {

            return null;
        }
    }

    // *****************************update ststus provider**************

    async updateStatusprovider(providerId: string): Promise<ProviderInterface | null> {
        try {
            let provider = await this.model.findById(providerId);

            if (!provider) {

                return null;
            }
            const updateProvider = await this.model.findByIdAndUpdate(
                providerId,
                { isBlocked: !provider.isBlocked },
                { new: true }
            );

            return updateProvider as ProviderInterface;
        } catch (error) {
            return null;
        }
    }

    //**********************/ Count Providers*******************
    async countProviders(): Promise<number | null> {
        try {
            const countProviders = await this.model.countDocuments();
            return countProviders;
        } catch (error) {
            return null;
        }
    }

    // *************************Save provider***************************

    async saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            console.log(providerData, "providerdata")
            const newUser = new providerModel(providerData);

            await newUser.save();
            return newUser as ProviderInterface;
        } catch (error) {

            return null;
        }
    }

}








