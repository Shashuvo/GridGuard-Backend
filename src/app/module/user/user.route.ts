import { Router } from 'express';
import { auth } from '../../middleware/checkAuth';
import { Role } from '../../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import { UpdateMyProfileValidationZodSchema } from './user.validation';
import { UserController } from './user.controller';


const router = Router();

router.patch(
  "/update-my-profile",
  auth(Role.ADMIN, Role.SUPER_ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  validateRequest(UpdateMyProfileValidationZodSchema),
  UserController.updateMyProfile,
);

export const UserRoutes = router;