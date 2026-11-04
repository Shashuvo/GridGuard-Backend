import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { AppError } from "../../utils/AppError";
import { IUpdateMyProfilePayload } from "./user.interface";
import httpStatus from "http-status";

const updateMyProfile = async (
    payload: IUpdateMyProfilePayload,
    user: RequestUser,
  ) => {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.userId, isDeleted: false },
    });
  
    if (!existingUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: { name: payload.name },
      omit: { password: true },
    });
  
    // update customer or technician profile if name changed
    if (payload.name) {
      if (existingUser.role === "CUSTOMER") {
        await prisma.customer.update({
          where: { userId: user.userId },
          data: {
            contactNumber: payload.contactNumber,
            address: payload.address,
          },
        });
      }
  
      if (existingUser.role === "TECHNICIAN") {
        await prisma.technician.update({
          where: { userId: user.userId },
          data: {
            contactNumber: payload.contactNumber,
            address: payload.address,
          },
        });
      }
    }
  
    return updatedUser;
  };

  export const UserService = {
	updateMyProfile,
};