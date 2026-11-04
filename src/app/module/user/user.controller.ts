import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { RequestUser } from "../../middleware/checkAuth";

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as RequestUser;
  
    const result = await UserService.updateMyProfile(req.body, user);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
});

 export const UserController = {
	updateMyProfile,
};