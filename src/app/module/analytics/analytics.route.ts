import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { AnalyticsController } from "./analytics.controller";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.get(
	"/admin-analytics",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	AnalyticsController.getAdminAnalytics,
);

router.get(
	"/customer-analytics",
	auth(Role.CUSTOMER),
	AnalyticsController.getCustomerAnalytics,
);

router.get(
	"/technician-analytics",
	auth(Role.TECHNICIAN),
	AnalyticsController.getTechnicianAnalytics,
);

export const AnalyticsRoutes = router;
