import { z } from "zod";
import { usersSelectObjectSchema } from "./objects/usersSelect.schema.js";
import { usersCreateInputObjectSchema } from "./objects/usersCreateInput.schema.js";
import { usersUncheckedCreateInputObjectSchema } from "./objects/usersUncheckedCreateInput.schema.js";

export const usersCreateOneSchema = z.object({
  select: usersSelectObjectSchema.optional(),
  data: z.union([
    usersCreateInputObjectSchema,
    usersUncheckedCreateInputObjectSchema,
  ]),
});
