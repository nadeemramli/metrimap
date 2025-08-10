import { z } from "zod";
import { usersSelectObjectSchema } from "./objects/usersSelect.schema.js";
import { usersWhereUniqueInputObjectSchema } from "./objects/usersWhereUniqueInput.schema.js";

export const usersFindUniqueSchema = z.object({
  select: usersSelectObjectSchema.optional(),
  where: usersWhereUniqueInputObjectSchema,
});
