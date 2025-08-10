import { z } from "zod";
import { usersSelectObjectSchema } from "./objects/usersSelect.schema.js";
import { usersWhereUniqueInputObjectSchema } from "./objects/usersWhereUniqueInput.schema.js";
import { usersCreateInputObjectSchema } from "./objects/usersCreateInput.schema.js";
import { usersUncheckedCreateInputObjectSchema } from "./objects/usersUncheckedCreateInput.schema.js";
import { usersUpdateInputObjectSchema } from "./objects/usersUpdateInput.schema.js";
import { usersUncheckedUpdateInputObjectSchema } from "./objects/usersUncheckedUpdateInput.schema.js";

export const usersUpsertSchema = z.object({
  select: usersSelectObjectSchema.optional(),
  where: usersWhereUniqueInputObjectSchema,
  create: z.union([
    usersCreateInputObjectSchema,
    usersUncheckedCreateInputObjectSchema,
  ]),
  update: z.union([
    usersUpdateInputObjectSchema,
    usersUncheckedUpdateInputObjectSchema,
  ]),
});
