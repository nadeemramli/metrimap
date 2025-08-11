export { z } from 'zod';

// Re-export the most useful generated schemas for validation

// Create Input schemas (for validating incoming data)
export { evidence_itemsCreateInputObjectSchema as CreateEvidenceItemSchema } from '../prisma/generated/schemas/objects/evidence_itemsCreateInput.schema';
export { groupsCreateInputObjectSchema as CreateGroupSchema } from '../prisma/generated/schemas/objects/groupsCreateInput.schema';
export { metric_cardsCreateInputObjectSchema as CreateMetricCardSchema } from '../prisma/generated/schemas/objects/metric_cardsCreateInput.schema';
export { project_collaboratorsCreateInputObjectSchema as CreateProjectCollaboratorSchema } from '../prisma/generated/schemas/objects/project_collaboratorsCreateInput.schema';
export { projectsCreateInputObjectSchema as CreateProjectSchema } from '../prisma/generated/schemas/objects/projectsCreateInput.schema';
export { relationshipsCreateInputObjectSchema as CreateRelationshipSchema } from '../prisma/generated/schemas/objects/relationshipsCreateInput.schema';
export { tagsCreateInputObjectSchema as CreateTagSchema } from '../prisma/generated/schemas/objects/tagsCreateInput.schema';
export { usersCreateInputObjectSchema as CreateUserSchema } from '../prisma/generated/schemas/objects/usersCreateInput.schema';

// Update Input schemas (for validating updates)
export { evidence_itemsUpdateInputObjectSchema as UpdateEvidenceItemSchema } from '../prisma/generated/schemas/objects/evidence_itemsUpdateInput.schema';
export { groupsUpdateInputObjectSchema as UpdateGroupSchema } from '../prisma/generated/schemas/objects/groupsUpdateInput.schema';
export { metric_cardsUpdateInputObjectSchema as UpdateMetricCardSchema } from '../prisma/generated/schemas/objects/metric_cardsUpdateInput.schema';
export { project_collaboratorsUpdateInputObjectSchema as UpdateProjectCollaboratorSchema } from '../prisma/generated/schemas/objects/project_collaboratorsUpdateInput.schema';
export { projectsUpdateInputObjectSchema as UpdateProjectSchema } from '../prisma/generated/schemas/objects/projectsUpdateInput.schema';
export { relationshipsUpdateInputObjectSchema as UpdateRelationshipSchema } from '../prisma/generated/schemas/objects/relationshipsUpdateInput.schema';
export { tagsUpdateInputObjectSchema as UpdateTagSchema } from '../prisma/generated/schemas/objects/tagsUpdateInput.schema';
export { usersUpdateInputObjectSchema as UpdateUserSchema } from '../prisma/generated/schemas/objects/usersUpdateInput.schema';

// Where Input schemas (for filtering/querying)
export { metric_cardsWhereInputObjectSchema as MetricCardWhereSchema } from '../prisma/generated/schemas/objects/metric_cardsWhereInput.schema';
export { projectsWhereInputObjectSchema as ProjectWhereSchema } from '../prisma/generated/schemas/objects/projectsWhereInput.schema';
export { relationshipsWhereInputObjectSchema as RelationshipWhereSchema } from '../prisma/generated/schemas/objects/relationshipsWhereInput.schema';
export { usersWhereInputObjectSchema as UserWhereSchema } from '../prisma/generated/schemas/objects/usersWhereInput.schema';

// Comments and notifications (for collaboration service)
export { changelogCreateInputObjectSchema as CreateChangelogSchema } from '../prisma/generated/schemas/objects/changelogCreateInput.schema';
export { changelogUpdateInputObjectSchema as UpdateChangelogSchema } from '../prisma/generated/schemas/objects/changelogUpdateInput.schema';
export { comment_mentionsCreateInputObjectSchema as CreateCommentMentionSchema } from '../prisma/generated/schemas/objects/comment_mentionsCreateInput.schema';
export { comment_threadsCreateInputObjectSchema as CreateCommentThreadSchema } from '../prisma/generated/schemas/objects/comment_threadsCreateInput.schema';
export { comment_threadsUpdateInputObjectSchema as UpdateCommentThreadSchema } from '../prisma/generated/schemas/objects/comment_threadsUpdateInput.schema';
export { commentsCreateInputObjectSchema as CreateCommentSchema } from '../prisma/generated/schemas/objects/commentsCreateInput.schema';
export { commentsUpdateInputObjectSchema as UpdateCommentSchema } from '../prisma/generated/schemas/objects/commentsUpdateInput.schema';
export { notificationsCreateInputObjectSchema as CreateNotificationSchema } from '../prisma/generated/schemas/objects/notificationsCreateInput.schema';
export { notificationsUpdateInputObjectSchema as UpdateNotificationSchema } from '../prisma/generated/schemas/objects/notificationsUpdateInput.schema';

// Convenience object with all schemas grouped
export const ZodSchemas = {
  // Create schemas
  User: {
    Create: '../../../prisma/generated/schemas/objects/usersCreateInput.schema',
    Update: '../../../prisma/generated/schemas/objects/usersUpdateInput.schema',
    Where: '../../../prisma/generated/schemas/objects/usersWhereInput.schema',
  },
  Project: {
    Create:
      '../../../prisma/generated/schemas/objects/projectsCreateInput.schema',
    Update:
      '../../../prisma/generated/schemas/objects/projectsUpdateInput.schema',
    Where:
      '../../../prisma/generated/schemas/objects/projectsWhereInput.schema',
  },
  MetricCard: {
    Create:
      '../../../prisma/generated/schemas/objects/metric_cardsCreateInput.schema',
    Update:
      '../../../prisma/generated/schemas/objects/metric_cardsUpdateInput.schema',
    Where:
      '../../../prisma/generated/schemas/objects/metric_cardsWhereInput.schema',
  },
  Relationship: {
    Create:
      '../../../prisma/generated/schemas/objects/relationshipsCreateInput.schema',
    Update:
      '../../../prisma/generated/schemas/objects/relationshipsUpdateInput.schema',
    Where:
      '../../../prisma/generated/schemas/objects/relationshipsWhereInput.schema',
  },
} as const;
