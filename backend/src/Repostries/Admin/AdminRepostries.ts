
import { adminInterface } from "../../Interface/AdminInterface";
import { UserInterface } from "../../Interface/UserInterface";
import userModel from "../../Model/User/UserModel";
import adminModel from "../../Model/Admin/AdminModel";
import providerModel from "../../Model/Provider/ProviderModel";
import { ProviderInterface } from "../../Interface/ProviderInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import CarNotification from "../../Model/Provider/CarNotification";
import CarModel from "../../Model/Provider/CarModel";
// Assuming OtpDocument is defined for the Otp schema
interface UserDocument extends Document {
  email: string;
  password: string;
  username?: string;
  _id: string;
  isBlocked: boolean
}

export class AdminRepository {
  // This function checks if an email exists in the provider database
  async emailExistCheck(email: string): Promise<adminInterface | null> {
    try {
      const existingAdmin = await adminModel.findOne({ email });
      console.log(existingAdmin, "repostries")
      return existingAdmin as adminInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
      return null;
    }
  }

  async fetchUsers(): Promise<UserInterface[] | null> {
    try {
      // Fetch users from the database, providing the expected document type
      const data = await userModel.find() as UserDocument[]; // This returns an array of Mongoose documents

      console.log("Users in management", data);

      // Map the documents to UserInterface
      const users: UserInterface[] = data.map((user: UserDocument) => ({
        id: user._id.toString(), // Convert ObjectId to string for 'id'
        email: user.email, // Access fields directly, since they're strongly typed
        password: user.password,
        username: user.username || undefined,
        isBlocked: user.isBlocked  // Optional field
      }));

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }

  async fetchProviders(): Promise<UserInterface[] | null> {
    try {
      // Fetch users from the database, providing the expected document type
      const data = await providerModel.find() as UserDocument[]; // This returns an array of Mongoose documents


      console.log()
      // Map the documents to UserInterface
      const providers: UserInterface[] = data.map((provider: UserDocument) => ({
        id: provider._id.toString(), // Convert ObjectId to string for 'id'
        email: provider.email, // Access fields directly, since they're strongly typed
        password: provider.password,
        username: provider.username || undefined,
        isBlocked: provider.isBlocked // Optional field
      }));

      return providers;
    } catch (error) {
      console.error("Error fetching provider:", error);
      return null;
    }
  }

  async editUser(userId: string): Promise<UserInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(userId, "userId in editUser");

      // Pass userId directly to findById (no need for an object)
      let check = await userModel.findById(userId);

      console.log(check, "check");

      if (check) {
        return {
          _id: check._id.toString(),
          username: check.username,
          email: check.email,
          password: check.password
        } as UserInterface;
      }
      return null;
    }
    catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }


  async updateUser(userData: UserInterface, id: string): Promise<UserInterface | null> {
    try {
      console.log("repostry in edit Profile", userData)
      const editUser = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          username: userData.username,
          email: userData.email,

        },
        { new: true } // To return the updated document
      ).lean<UserInterface>(); // Convert to plain JS object

      console.log(editUser, "editUser after saving");
      return editUser; // Return the updated object as the correct type
    } catch (error) {
      console.error("Error saving user:", error);
      return null; // Return null on error
    }
  }

  async updateStatus(userId: string): Promise<UserInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(userId, "userId in updateStatus");

      // Find the user by ID
      let user = await userModel.findById(userId);

      if (!user) {
        console.error("User not found");
        return null;
      }

      // Toggle the `isBlocked` status
      const updateUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        { isBlocked: !user.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated user document
      );

      return updateUser as UserInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }


  async editProvider(providerId: string): Promise<ProviderInterface | null> {
    try {
      // Log the providerId to ensure it's passed correctly
      console.log(providerId, "provider in editUser");

      // Pass userId directly to findById (no need for an object)
      let check = await providerModel.findById(providerId);

      console.log(check, "check");

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
      console.error("Error fetching provider:", error);
      return null;
    }
  }


  async updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null> {
    try {
      console.log("repostry in edit provider", providerData)
      const editProvider = await providerModel.findByIdAndUpdate(
        { _id: id },
        {
          username: providerData.username,
          email: providerData.email,

        },
        { new: true } // To return the updated document
      ).lean<ProviderInterface>(); // Convert to plain JS object

      console.log(editProvider, "editProvider after saving");
      return editProvider; // Return the updated object as the correct type
    } catch (error) {
      console.error("Error saving provider:", error);
      return null; // Return null on error
    }
  }

  async updateStatusprovider(providerId: string): Promise<ProviderInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(providerId, "providerId in updateStatus");

      // Find the provider by ID
      let provider = await providerModel.findById(providerId);
      console.log(provider, "provider when find")
      if (!provider) {
        console.error("provider not found");
        return null;
      }


      const updateProvider = await providerModel.findByIdAndUpdate(
        providerId, // pass the providerId directly
        { isBlocked: !provider.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated provider document
      );

      console.log(updateProvider, "update provider")

      return updateProvider as ProviderInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

  async getAdminById(id: string): Promise<adminInterface | null> {
    try {
      console.log(id, "refresh tojken id")
      const existingUser = await adminModel.findById(id);
      console.log(existingUser, "exist user")
      return existingUser as adminInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
      return null;
    }
  }

  // *******************fetch Notifications from Car Documents***************
  async fetchNotification(): Promise<CarDataInterface[] | null> {
    try {
      // Fetch car documents from the database
      const data = await CarNotification.find() as CarDataInterface[]; // This returns an array of Mongoose documents

      // Map the car documents to CarDataInterface
      const notification: CarDataInterface[] = data.map((carDocument: any) => ({
        id: carDocument._id?.toString(), // Ensure _id exists, and convert it to string
        car_name: carDocument.car_name,
        model: carDocument.model,
        rentalPrice: carDocument.rentalPrice,
        engineType: carDocument.engineType,
        fuelType: carDocument.fuelType,
        color: carDocument.color,
        images: carDocument.images, // Assuming 'images' is an array
        rcNumber: carDocument.rcNumber,
        rcExpiry: carDocument.rcExpiry,
        insurancePolicyNumber: carDocument.insurancePolicyNumber,
        insuranceExpiry: carDocument.insuranceExpiry,
        pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
        pollutionExpiry: carDocument.pollutionExpiry,
        isStatus: carDocument.isStatus,
        providerId: carDocument.providerId ? carDocument.providerId.toString() : undefined, // Handle optional providerId
        createdAt: carDocument.createdAt,
      }));
      console.log(notification, "notifications")
      return notification;
    } catch (error) {
      console.error("Error fetching car data:", error);
      return null;
    }
  }
  // ******************************get car details for notification*******************
  async carNotificationById(id: string): Promise<CarDataInterface | null> {
    try {

      const carDocumentExist = await CarNotification.findById(id);
      console.log(carDocumentExist, "car document")
      return carDocumentExist as CarDataInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
      return null;
    }
  }
  //**********************verify notification(car notification details addto car model and deleted notifcation***********)
  async verifyNotification(id: string, value: string): Promise<CarDataInterface | null> {
    try {
      let carDocument;

      if (value === "Accept") {
        carDocument = await CarNotification.findById(id);
        console.log(carDocument, "car document in notification");

        if (carDocument) {
          // Create a new CarModel document, mapping only the relevant fields
          const newCar = new CarModel({
            car_name: carDocument.car_name,
            model: carDocument.model,
            rentalPrice: carDocument.rentalPrice,
            engineType: carDocument.engineType,
            fuelType: carDocument.fuelType,
            color: carDocument.color,
            images: carDocument.images,
            rcNumber: carDocument.rcNumber,
            rcExpiry: carDocument.rcExpiry,
            insurancePolicyNumber: carDocument.insurancePolicyNumber,
            insuranceExpiry: carDocument.insuranceExpiry,
            pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
            pollutionExpiry: carDocument.pollutionExpiry,
            providerId: carDocument.providerId,
            isBlocked: false, // Default value as per your schema
          });

          // Save the new car document to CarModel
          await newCar.save();
        }
      }

      // Delete the notification once the process is complete
      const result = await CarNotification.deleteOne({ _id: id });

      return result;
    } catch (error) {
      console.log("Error verifying notification:", error); // More detailed log
      return null;
    }
  }


  // ******************************fetch car for car management**********************
  async fetchCars(): Promise<CarDataInterface[] | null> {
    try {
      const carDocuments = await CarModel.find() as CarDataInterface[]; // Fetch car documents

      const cars: CarDataInterface[] = carDocuments.map((car: CarDataInterface) => ({
        car_name: car.car_name,
        model: car.model,
        rentalPrice: car.rentalPrice,
        engineType: car.engineType,
        fuelType: car.fuelType,
        color: car.color,
        images: car.images,
        rcNumber: car.rcNumber,
        rcExpiry: car.rcExpiry,
        insurancePolicyNumber: car.insurancePolicyNumber,
        insuranceExpiry: car.insuranceExpiry,
        pollutionCertificateNumber: car.pollutionCertificateNumber,
        pollutionExpiry: car.pollutionExpiry,
        providerId: car.providerId,
        isStatus: car.isStatus,
        createdAt: car.createdAt,
        id: car.id
      }));

      return cars;
    } catch (error) {
      console.error("Error fetching cars:", error);
      return null;
    }
  }

  // *******************************change status of car*****************
  async updateStatusCar(carId: string): Promise<CarDataInterface | null> {
    try {
      // Log the carId to ensure it's passed correctly
      console.log(carId, "providerId in updateStatus");

      // Find the provider by ID
      let car = await CarModel.findById(carId);
      console.log(car, "provider when find")
      if (!car) {
        console.error("provider not found");
        return null;
      }


      const updateCar = await CarModel.findByIdAndUpdate(
        car, // pass the providerId directly
        { isBlocked: !car.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated provider document
      );

      console.log(updateCar, "update car")

      return updateCar as CarDataInterface;
    } catch (error) {
      console.error("Error updating car status:", error);
      return null;
    }
  }
}


