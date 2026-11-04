import z from "zod";

export const UpdateMyProfileValidationZodSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  contactNumber: z.string().trim().optional(),
  address: z.string().trim().optional(),
});
