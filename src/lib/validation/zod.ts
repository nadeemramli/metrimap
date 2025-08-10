export { z } from "zod";

// Re-export the most useful generated schemas for validation

// Create Input schemas (for validating incoming data)
export { usersCreateInputObjectSchema as CreateUserSchema } from "../prisma/generated/schemas/objects/usersCreateInput.schema";
export { projectsCreateInputObjectSchema as CreateProjectSchema } from "../prisma/generated/schemas/objects/projectsCreateInput.schema";
export { metric_cardsCreateInputObjectSchema as CreateMetricCardSchema } from "../prisma/generated/schemas/objects/metric_cardsCreateInput.schema";
export { relationshipsCreateInputObjectSchema as CreateRelationshipSchema } from "../prisma/generated/schemas/objects/relationshipsCreateInput.schema";
export { evidence_itemsCreateInputObjectSchema as CreateEvidenceItemSchema } from "../prisma/generated/schemas/objects/evidence_itemsCreateInput.schema";
export { tagsCreateInputObjectSchema as CreateTagSchema } from "../prisma/generated/schemas/objects/tagsCreateInput.schema";
export { groupsCreateInputObjectSchema as CreateGroupSchema } from "../prisma/generated/schemas/objects/groupsCreateInput.schema";

// Update Input schemas (for validating updates)
export { usersUpdateInputObjectSchema as UpdateUserSchema } from "../prisma/generated/schemas/objects/usersUpdateInput.schema";
export { projectsUpdateInputObjectSchema as UpdateProjectSchema } from "../prisma/generated/schemas/objects/projectsUpdateInput.schema";
export { metric_cardsUpdateInputObjectSchema as UpdateMetricCardSchema } from "../prisma/generated/schemas/objects/metric_cardsUpdateInput.schema";
export { relationshipsUpdateInputObjectSchema as UpdateRelationshipSchema } from "../prisma/generated/schemas/objects/relationshipsUpdateInput.schema";
export { evidence_itemsUpdateInputObjectSchema as UpdateEvidenceItemSchema } from "../prisma/generated/schemas/objects/evidence_itemsUpdateInput.schema";
export { tagsUpdateInputObjectSchema as UpdateTagSchema } from "../prisma/generated/schemas/objects/tagsUpdateInput.schema";
export { groupsUpdateInputObjectSchema as UpdateGroupSchema } from "../prisma/generated/schemas/objects/groupsUpdateInput.schema";

// Where Input schemas (for filtering/querying)
export { usersWhereInputObjectSchema as UserWhereSchema } from "../prisma/generated/schemas/objects/usersWhereInput.schema";
export { projectsWhereInputObjectSchema as ProjectWhereSchema } from "../prisma/generated/schemas/objects/projectsWhereInput.schema";
export { metric_cardsWhereInputObjectSchema as MetricCardWhereSchema } from "../prisma/generated/schemas/objects/metric_cardsWhereInput.schema";
export { relationshipsWhereInputObjectSchema as RelationshipWhereSchema } from "../prisma/generated/schemas/objects/relationshipsWhereInput.schema";

// Convenience object with all schemas grouped
export const ZodSchemas = {
  // Create schemas
  User: {
    Create: "../../../prisma/generated/schemas/objects/usersCreateInput.schema",
    Update: "../../../prisma/generated/schemas/objects/usersUpdateInput.schema",
    Where: "../../../prisma/generated/schemas/objects/usersWhereInput.schema",
  },
  Project: {
    Create:
      "../../../prisma/generated/schemas/objects/projectsCreateInput.schema",
    Update:
      "../../../prisma/generated/schemas/objects/projectsUpdateInput.schema",
    Where:
      "../../../prisma/generated/schemas/objects/projectsWhereInput.schema",
  },
  MetricCard: {
    Create:
      "../../../prisma/generated/schemas/objects/metric_cardsCreateInput.schema",
    Update:
      "../../../prisma/generated/schemas/objects/metric_cardsUpdateInput.schema",
    Where:
      "../../../prisma/generated/schemas/objects/metric_cardsWhereInput.schema",
  },
  Relationship: {
    Create:
      "../../../prisma/generated/schemas/objects/relationshipsCreateInput.schema",
    Update:
      "../../../prisma/generated/schemas/objects/relationshipsUpdateInput.schema",
    Where:
      "../../../prisma/generated/schemas/objects/relationshipsWhereInput.schema",
  },
} as const;
