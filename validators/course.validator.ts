import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  coverImageUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().min(0).optional(),
}).passthrough();

export const updateCourseSchema = createCourseSchema.partial();
