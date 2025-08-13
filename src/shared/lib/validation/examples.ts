// Example usage of Prisma + Zod for end-to-end type safety

import { PrismaClient } from "@prisma/client";
import {
  z,
  CreateUserSchema,
  CreateMetricCardSchema,
  UpdateMetricCardSchema,
  MetricCardWhereSchema,
} from "./zod";

// Example: Create a new user with validation
export async function createValidatedUser(userData: unknown) {
  // Parse and validate incoming data against Prisma's expected input
  const validatedData = CreateUserSchema.parse(userData);

  // Now TypeScript knows this is properly typed
  const prisma = new PrismaClient();
  return await prisma.users.create({
    data: validatedData,
  });
}

// Example: Create a new metric card with validation
export async function createValidatedMetricCard(cardData: unknown) {
  const validatedData = CreateMetricCardSchema.parse(cardData);

  const prisma = new PrismaClient();
  return await prisma.metric_cards.create({
    data: validatedData,
  });
}

// Example: Update metric card with partial validation
export async function updateValidatedMetricCard(
  id: string,
  updateData: unknown
) {
  const validatedData = UpdateMetricCardSchema.parse(updateData);

  const prisma = new PrismaClient();
  return await prisma.metric_cards.update({
    where: { id },
    data: validatedData,
  });
}

// Example: Query with validated filters
export async function findMetricCardsWithValidation(filters: unknown) {
  const validatedFilters = MetricCardWhereSchema.parse(filters);

  const prisma = new PrismaClient();
  return await prisma.metric_cards.findMany({
    where: validatedFilters,
  });
}

// Example: Runtime validation of existing data
export function validateExistingUser(user: unknown) {
  try {
    return {
      isValid: true,
      data: CreateUserSchema.parse(user),
      errors: null,
    };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      errors: error instanceof z.ZodError ? error.issues : [error],
    };
  }
}
