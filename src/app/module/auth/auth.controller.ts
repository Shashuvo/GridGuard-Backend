import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const registerCustomer = catchAsync(async (req: Request, res: Response) => {
	
	const payload = req.body;
	await AuthService.registerCustomer(payload);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Verification OTP sent",
		data: null,
	});
});

const verifyCustomerEmail = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const result = await AuthService.verifyCustomerEmail(payload);

	const { accessToken, refreshToken, user, customer } = result;

	// res.cookie("accessToken", accessToken, {
	// 	httpOnly: true,
	// 	secure: false,
	// 	sameSite: "none",
	// 	maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
	// });
	// res.cookie("refreshToken", refreshToken, {
	// 	httpOnly: true,
	// 	secure: false,
	// 	sameSite: "none",
	// 	maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	// });

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Account created successfully",
		data: {
			user,
			customer,
			accessToken,
			refreshToken,
		},
	});
});

export const AuthController = {
	registerCustomer,
	verifyCustomerEmail,
};