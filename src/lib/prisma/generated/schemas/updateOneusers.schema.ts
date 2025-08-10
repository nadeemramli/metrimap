import { z } from "zod";
import { usersSelectObjectSchema } from "./objects/usersSelect.schema.js";
import { usersUpdateInputObjectSchema } from "./objects/usersUpdateInput.schema.js";
import { usersUncheckedUpdateInputObjectSchema } from "./objects/usersUncheckedUpdateInput.schema.js";
import { usersWhereUniqueInputObjectSchema } from "./objects/usersWhereUniqueInput.schema.js";

export const usersUpdateOneSchema = z.object({
  select: usersSelectObjectSchema.optional(),
  data: z.union([
    usersUpdateInputObjectSchema,
    usersUncheckedUpdateInputObjectSchema,
  ]),
  where: usersWhereUniqueInputObjectSchema,
});
