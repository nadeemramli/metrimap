// Typed service layer that combines Prisma types with Supabase operations
// This provides end-to-end type safety without changing our database operations

import { PrismaClient } from "@prisma/client";
import type {
  users as PrismaUser,
  projects as PrismaProject,
  metric_cards as PrismaMetricCard,
  relationships as PrismaRelationship,
  evidence_items as PrismaEvidenceItem,
  groups as PrismaGroup,
  tags as PrismaTag,
} from "@prisma/client";

import {
  z,
  CreateUserSchema,
  CreateProjectSchema,
  CreateMetricCardSchema,
  CreateRelationshipSchema,
  CreateEvidenceItemSchema,
  CreateGroupSchema,
  UpdateUserSchema,
  UpdateProjectSchema,
  UpdateMetricCardSchema,
  UpdateRelationshipSchema,
  UpdateEvidenceItemSchema,
  UpdateGroupSchema,
  UserWhereSchema,
  ProjectWhereSchema,
  MetricCardWhereSchema,
  RelationshipWhereSchema,
} from "@/shared/lib/validation/zod";

// Re-export Prisma types for use throughout the app
export type {
  PrismaUser as User,
  PrismaProject as Project,
  PrismaMetricCard as MetricCard,
  PrismaRelationship as Relationship,
  PrismaEvidenceItem as EvidenceItem,
  PrismaGroup as Group,
  PrismaTag as Tag,
};

// Validated input types (inferred from Zod schemas)
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type CreateMetricCardInput = z.infer<typeof CreateMetricCardSchema>;
export type CreateRelationshipInput = z.infer<typeof CreateRelationshipSchema>;
export type CreateEvidenceItemInput = z.infer<typeof CreateEvidenceItemSchema>;
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type UpdateMetricCardInput = z.infer<typeof UpdateMetricCardSchema>;
export type UpdateRelationshipInput = z.infer<typeof UpdateRelationshipSchema>;
export type UpdateEvidenceItemInput = z.infer<typeof UpdateEvidenceItemSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;

export type UserWhereInput = z.infer<typeof UserWhereSchema>;
export type ProjectWhereInput = z.infer<typeof ProjectWhereSchema>;
export type MetricCardWhereInput = z.infer<typeof MetricCardWhereSchema>;
export type RelationshipWhereInput = z.infer<typeof RelationshipWhereSchema>;

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError["issues"];
}

// Generic validation helper
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues };
    }
    throw error;
  }
}

// Specific validation functions for each entity
export const validate = {
  user: {
    create: (data: unknown): ValidationResult<CreateUserInput> =>
      validateData(CreateUserSchema, data),
    update: (data: unknown): ValidationResult<UpdateUserInput> =>
      validateData(UpdateUserSchema, data),
    where: (data: unknown): ValidationResult<UserWhereInput> =>
      validateData(UserWhereSchema, data),
  },

  project: {
    create: (data: unknown): ValidationResult<CreateProjectInput> =>
      validateData(CreateProjectSchema, data),
    update: (data: unknown): ValidationResult<UpdateProjectInput> =>
      validateData(UpdateProjectSchema, data),
    where: (data: unknown): ValidationResult<ProjectWhereInput> =>
      validateData(ProjectWhereSchema, data),
  },

  metricCard: {
    create: (data: unknown): ValidationResult<CreateMetricCardInput> =>
      validateData(CreateMetricCardSchema, data),
    update: (data: unknown): ValidationResult<UpdateMetricCardInput> =>
      validateData(UpdateMetricCardSchema, data),
    where: (data: unknown): ValidationResult<MetricCardWhereInput> =>
      validateData(MetricCardWhereSchema, data),
  },

  relationship: {
    create: (data: unknown): ValidationResult<CreateRelationshipInput> =>
      validateData(CreateRelationshipSchema, data),
    update: (data: unknown): ValidationResult<UpdateRelationshipInput> =>
      validateData(UpdateRelationshipSchema, data),
    where: (data: unknown): ValidationResult<RelationshipWhereInput> =>
      validateData(RelationshipWhereSchema, data),
  },

  evidenceItem: {
    create: (data: unknown): ValidationResult<CreateEvidenceItemInput> =>
      validateData(CreateEvidenceItemSchema, data),
    update: (data: unknown): ValidationResult<UpdateEvidenceItemInput> =>
      validateData(UpdateEvidenceItemSchema, data),
  },

  group: {
    create: (data: unknown): ValidationResult<CreateGroupInput> =>
      validateData(CreateGroupSchema, data),
    update: (data: unknown): ValidationResult<UpdateGroupInput> =>
      validateData(UpdateGroupSchema, data),
  },
} as const;

// Prisma client singleton for type operations (read-only queries)
let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      // Configure for production
      log:
        process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
    });
  }
  return prismaClient;
}

// Helper to safely disconnect Prisma (for cleanup)
export async function disconnectPrisma(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

// Example typed query helpers (these use Prisma for types but can delegate to Supabase)
export const typedQueries = {
  // Get projects with full typing
  async findProjects(where?: ProjectWhereInput): Promise<PrismaProject[]> {
    // This is an example - in practice, you'd use your existing Supabase operations
    // but with the validated input and typed return
    const prisma = getPrismaClient();
    return prisma.projects.findMany({ where });
  },

  // Get metric cards with relationships
  async findMetricCardsWithRelationships(
    projectId: string
  ): Promise<(PrismaMetricCard & { relationships: PrismaRelationship[] })[]> {
    const prisma = getPrismaClient();
    // Example of a complex query with proper typing
    return prisma.metric_cards.findMany({
      where: { project_id: projectId },
      include: {
        // Note: This would need relations defined in schema for this to work
        // For now, we'd make separate queries and combine
      },
    }) as PrismaMetricCard & { relationships: PrismaRelationship[] };
  },
} as const;

// Validation middleware for API routes
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = validateData(schema, data);
    if (!result.success) {
      const errorMessage = result.errors
        ?.map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }
    return result.data!;
  };
}

// Example middleware instances
export const validateCreateProject =
  createValidationMiddleware(CreateProjectSchema);
export const validateUpdateProject =
  createValidationMiddleware(UpdateProjectSchema);
export const validateCreateMetricCard = createValidationMiddleware(
  CreateMetricCardSchema
);
export const validateUpdateMetricCard = createValidationMiddleware(
  UpdateMetricCardSchema
);
