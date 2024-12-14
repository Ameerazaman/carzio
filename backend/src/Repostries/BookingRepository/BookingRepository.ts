import mongoose from "mongoose";
import { BookingInterface } from "../../Interface/BookingInterface";
import BookingModel from "../../Model/User/BookingModel";
import { BaseRepository } from "../BaseRepostry";
import { IBookingRepository } from "./IBookingRepository";
import { BookingDateInterface } from "../../Interface/AuthServices/BookingDateAuthInterface";
import { CarDataInterface } from "../../Interface/CarInterface";



export class BookingRepository extends BaseRepository<typeof BookingModel> implements IBookingRepository {
  constructor() {
    super(BookingModel);
  }

  // ***************************booking history*****************

  async getBookingHistory(page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;

      const bookingHistory = await this.model.aggregate([
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails',
          },
        },
        { $unwind: '$bookingDetails' },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);
      return bookingHistory.length ? bookingHistory : null;
    } catch (error) {
      return null;
    }
  }
  // / ***************************specific booking details*****************

  async specificBookingDetails(bookingId: string): Promise<BookingInterface | null> {
    try {

      const objectId = new mongoose.Types.ObjectId(bookingId);

      const bookingHistory = await this.model.aggregate([
        { $match: { _id: objectId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" },
            UserAddressObjectId: { $toObjectId: "$UserAddressId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails'
          }
        },
        { $unwind: '$bookingDetails' },
        {
          $lookup: {
            from: 'useraddressmodels',
            localField: 'UserAddressObjectId',
            foreignField: '_id',
            as: 'userAddress'
          }
        },
        { $unwind: '$userAddress' }
      ]);

      return bookingHistory[0] || null;
    } catch (error) {
      return null;
    }
  }
  //  // *******************************update status for booking*****************

  async updateStatusOfBooking(bookingId: string, status: string): Promise<BookingInterface | null> {
    try {
      const updatedBooking = await this.model.findByIdAndUpdate(
        bookingId,
        { status: status },
        { new: true }
      );
      return updatedBooking as BookingInterface
    } catch (error) {
      return null;
    }

  }

  // **************************car bookings based one car***********************  
  async CountBookingCar(): Promise<{ carName: string, count: number }[]> {
    try {
      const bookingCountByCar = await this.model.aggregate([
        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        {
          $unwind: '$carDetails',
        },
        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
          },
        },

        {
          $project: {
            carName: '$_id',
            count: 1,
            _id: 0,
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);
      return bookingCountByCar;
    } catch (error) {
      return [];
    }
  }


  // ********************************revenue based on each car*******************
  async totalRevenue(): Promise<number | null> {
    try {
      const bookings = await this.model.find();
      const totalCompletedAmount = bookings
        .filter((booking: BookingInterface) => booking.status === "Completed")
        .reduce((sum: number, booking: BookingInterface) => sum + booking.total_Amt, 0);
      return totalCompletedAmount / 2;
    } catch (error) {

      return null;
    }
  }
  // ***************************total Bookings*******************************
  async countBooking(): Promise<number | null> {
    try {
      const countBooking = await this.model.countDocuments();
      return countBooking;
    } catch (error) {
      return null;
    }
  }
  // **************************revenue based on car*********************

  async revenueByCar(): Promise<{ carName: string, amount: number }[]> {
    try {
      const bookingCountByCar = await this.model.aggregate([

        {
          $match: {
            status: 'Completed',
          },
        },

        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },

        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },

        {
          $unwind: '$carDetails',
        },

        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
            amount: { $sum: '$total_Amt' },
          },
        },

        {
          $project: {
            carName: '$_id',
            count: 1,
            amount: 1,
            _id: 0,
          },
        },

        {
          $sort: {
            amount: -1,
          },
        },
      ]);

      return bookingCountByCar;
    } catch (error) {

      return [];
    }
  }

  // **********************************Sales Report****************
  async fetchSalesReport(page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const completedBookings = await this.model.find({ status: 'Completed' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit) as BookingInterface[];
      return completedBookings;
    } catch (error) {

      return null;
    }
  }

  // **************************car bookings based one car***********************
  async CountBookingCarForProvider(providerId: string): Promise<{ carName: string, count: number }[]> {
    try {
      const bookingCountByCar = await this.model.aggregate([
        {
          $match: {
            providerId: providerId,
          },
        },
        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        {
          $unwind: '$carDetails',
        },
        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            carName: '$_id',
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]);
      return bookingCountByCar;
    } catch (error) {
      return [];
    }
  }

  // ********************************revenue based on each car*******************
  async totalRevenueForProvider(providerId: string): Promise<number | null> {
    try {

      const bookings = await this.model.find({
        providerId: providerId,
        status: "Completed"
      });


      const totalCompletedAmount = bookings.reduce(
        (sum:number, booking:BookingInterface) => sum + booking.total_Amt,
        0
      );

      return totalCompletedAmount / 2;
    } catch (error) {
      return null;
    }
  }

  // ***************************total Bookings*******************************
  async countBookingForProvider(providerId: string): Promise<number | null> {
    try {

      const countBooking = await this.model.countDocuments({ providerId: providerId });
      return countBooking;
    } catch (error) {
      return null;
    }
  }

  // *************************************revenue based on car**********************

  async revenueByCarForProvider(providerId: string): Promise<{ carName: string, amount: number }[]> {
    try {
      const bookingCountByCar = await this.model.aggregate([
        {
          $match: {
            status: 'Completed',
            providerId: providerId,
          },
        },
        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        {
          $unwind: '$carDetails',
        },
        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
            amount: { $sum: '$total_Amt' },
          },
        },
        {
          $project: {
            carName: '$_id',
            count: 1,
            amount: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            amount: -1,
          },
        },
      ]);
      return bookingCountByCar;
    } catch (error) {
      return [];
    }
  }

  // **********************************Sales Report****************

  async fetchSalesReportForProvider(page: number, limit: number, providerId: string): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const completedBookings = await this.model.find({ status: 'Completed', providerId: providerId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit) as BookingInterface[];
      return completedBookings;
    } catch (error) {
      return null;
    }
  }


  // ***************************booking history*****************

  async getBookingHistoryForProvider(providerId: string, page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const bookingHistory = await this.model.aggregate([
        { $match: { providerId: providerId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails',
          },
        },
        { $unwind: '$bookingDetails' },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);

      return bookingHistory
    } catch (error) {
      return null;
    }
  }
  // ***************************specific booking details*****************

  async specificBookingDetailsForProvider(bookingId: string): Promise<BookingInterface | null> {
    try {
      const objectId = new mongoose.Types.ObjectId(bookingId);

      const bookingHistory = await this.model.aggregate([
        { $match: { _id: objectId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" },
            UserAddressObjectId: { $toObjectId: "$UserAddressId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails'
          }
        },
        { $unwind: '$bookingDetails' },
        {
          $lookup: {
            from: 'useraddressmodels',
            localField: 'UserAddressObjectId',
            foreignField: '_id',
            as: 'userAddress'
          }
        },
        { $unwind: '$userAddress' }
      ]);

      return bookingHistory[0] || null;
    } catch (error) {
      return null;
    }
  }
  // *******************************update status for booking**********************

  async updateStatusOfBookingForProvider(bookingId: string, status: string): Promise<BookingInterface | null> {
    try {
      const updatedBooking = await this.model.findByIdAndUpdate(
        bookingId,
        { status: status },
        { new: true }
      );
      return updatedBooking as BookingInterface
    } catch (error) {
      return null;
    }
  }

  // **********************************save Booking**********************

  async saveBookingData(bookingData: BookingInterface): Promise<BookingInterface | null> {
    try {
      const savedBooking = await this.model.create(bookingData);
      return savedBooking as BookingInterface;
    } catch (error) {

      return null;
    }
  }

  // ***************************booking history*****************

  async getBookingHistoryForUser(userId: string, page: number, limit: number): Promise<BookingInterface[] | null> {
    try {

      const bookingHistory = await this.model.aggregate([
        { $match: { UserId: userId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails',
          },
        },
        { $unwind: '$bookingDetails' },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]);

      return bookingHistory
    } catch (error) {
      return null;
    }
  }

  // ******************************count bookingHistory****************

  async countBookingHistoryForUser(userId: string): Promise<number | null> {
    try {
      const total = await this.model.aggregate([
        { $match: { UserId: userId } }])
      return total.length;
    } catch (error) {

      return null;
    }
  }

  // ***************************specific booking details*****************



  async specificBookingDetailsForUser(bookingId: string): Promise<BookingInterface | null> {
    try {

      const objectId = new mongoose.Types.ObjectId(bookingId);

      const bookingHistory = await this.model.aggregate([
        { $match: { _id: objectId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" },
            UserAddressObjectId: { $toObjectId: "$UserAddressId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails'
          }
        },
        { $unwind: '$bookingDetails' },
        {
          $lookup: {
            from: 'useraddressmodels',
            localField: 'UserAddressObjectId',
            foreignField: '_id',
            as: 'userAddress'
          }
        },
        { $unwind: '$userAddress' }
      ]);

      return bookingHistory[0] || null;
    } catch (error) {
      return null;
    }
  }

  // *******************************update status for booking*****************

  async cancelBookingByUser(bookingId: string): Promise<BookingInterface | null> {
    try {
      const updatedBooking = await this.model.findByIdAndUpdate(
        bookingId,
        { status: 'Cancelled' },
        { new: true }
      );
      return updatedBooking as BookingInterface
    } catch (error) {
      return null;
    }
  }

  // ****************************check booked or not **********************
  async checkBookedOrNot(carId: string): Promise<BookingDateInterface[] | null> {
    try {
      const check = await this.model.find({ CarsId: carId })

      const result = await BookingModel.find({ CarsId: carId }, { IssueDate: 1, ReturnDate: 1 }).lean();

      const transformedResult = result.map(doc => ({
        issueDate: doc.IssueDate,
        returnDate: doc.ReturnDate
      }));

      return transformedResult;
    } catch (error) {

      return null;
    }
  }

  // ************************************car availabilty in date***************************
  async findUnavailableCars(startDate: string, endDate: string): Promise<string[]> {

    const bookedCars = await BookingModel.find({
      $or: [
        { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
      ],
    }).select('CarsId');

    return bookedCars.map((booking) => booking.CarsId);
  }

  // **************************search car availabiltyu*****************
async findBookedCarIds(startDate: string, endDate: string): Promise<string[]> {
        const bookedCars = await BookingModel.find({
            $or: [
                { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
            ],
        }).select('CarsId');

        return bookedCars.map((booking) => booking.CarsId);
    }

}