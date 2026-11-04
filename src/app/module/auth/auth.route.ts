import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./auth.validation";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";


const router = Router();

router.post(
	"/register",
	validateRequest(UserValidation.CustomerRegistrationZodSchema),
	AuthController.registerCustomer,
);

router.post(
	"/verify-email",
	validateRequest(UserValidation.CustomerEmailVerifyZodSchema),
	AuthController.verifyCustomerEmail,
);

router.post("/login", AuthController.loginUser);

router.get(
	"/me",
	auth(Role.ADMIN, Role.TECHNICIAN, Role.CUSTOMER, Role.SUPER_ADMIN),
	AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
	"/forgot-password",
	validateRequest(UserValidation.ForgotPasswordZodSchema),
	AuthController.forgotPassword,
);
router.post(
	"/reset-password",
	validateRequest(UserValidation.ResetPasswordZodSchema),
	AuthController.resetPassword,
);

export const AuthRoutes = router;