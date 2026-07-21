// @ts-nocheck
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { projectsCreateWithoutComment_threadsInputObjectSchema } from './projectsCreateWithoutComment_threadsInput.schema';
import { projectsUncheckedCreateWithoutComment_threadsInputObjectSchema } from './projectsUncheckedCreateWithoutComment_threadsInput.schema';
import { projectsCreateOrConnectWithoutComment_threadsInputObjectSchema } from './projectsCreateOrConnectWithoutComment_threadsInput.schema';
import { projectsWhereUniqueInputObjectSchema } from './projectsWhereUniqueInput.schema'

export const projectsCreateNestedOneWithoutComment_threadsInputObjectSchema: z.ZodType<Prisma.projectsCreateNestedOneWithoutComment_threadsInput, Prisma.projectsCreateNestedOneWithoutComment_threadsInput> = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutComment_threadsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
export const projectsCreateNestedOneWithoutComment_threadsInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => projectsCreateWithoutComment_threadsInputObjectSchema), z.lazy(() => projectsUncheckedCreateWithoutComment_threadsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => projectsCreateOrConnectWithoutComment_threadsInputObjectSchema).optional(),
  connect: z.lazy(() => projectsWhereUniqueInputObjectSchema).optional()
}).strict();
