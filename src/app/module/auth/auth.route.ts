import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { UserValidation } from "./auth.validation";


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

export const AuthRoutes = router;