// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutComment_threadsInputObjectSchema } from './projectsCreateWithoutComment_threadsInput.schema';
import { projectsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedCreateWithoutComment_threadsInput.schema';
import { projectsCreateOrConnectWithoutComment_threadsInputObjectSchema } from './projectsCreateOrConnectWithoutComment_threadsInput.schema';
import { projectsUpsertWithoutComment_threadsInputObjectSchema } from './projectsUpsertWithoutComment_threadsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema';
import { projectsUpdateToOneWithWhereWithoutComment_threadsInputObjectSchema } from './projectsUpdateToOneWithWhereWithoutComment_threadsInput.schema';
import { projectsUpdateWithoutComment_threadsInputObjectSchema } from './projectsUpdateWithoutComment_threadsInput.schema';
import { projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedUpdateWithoutComment_threadsInput.schema'

export const projectsUpdateOneRequiredWithoutComment_threadsNestedInputObjectSchema: z.ZodType<Prisma.projectsUpdateOneRequiredWithoutComment_threadsNestedInput, Prisma.projectsUpdateOneRequiredWithoutComment_threadsNestedInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutComment_threadsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutComment_threadsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]).optional()
}).strict();
export const projectsUpdateOneRequiredWithoutComment_threadsNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutComment_threadsInputObjectSchema).optional(),
  upsert: z.lazy(() => projectsUpsertWithoutComment_threadsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => projectsUpdateToOneWithWhereWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUpdateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedUpdateWithoutComment_threadsInputObjectSchema)]).optional()
}).strict();
