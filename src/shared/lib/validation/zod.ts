export { z } from 'zod';

// Re-export the most useful generated schemas for validation

// Create Input schemas (for validating incoming data)
export { evidence_itemsCreateInputObjectSchema as CreateEvidenceItemSchema } from '@/lib/prisma/generated/schemas/objects/evidence_itemsCreateInput.schema';
export { groupsCreateInputObjectSchema as CreateGroupSchema } from '@/lib/prisma/generated/schemas/objects/groupsCreateInput.schema';
export { metric_cardsCreateInputObjectSchema as CreateMetricCardSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsCreateInput.schema';
export { project_collaboratorsCreateInputObjectSchema as CreateProjectCollaboratorSchema } from '@/lib/prisma/generated/schemas/objects/project_collaboratorsCreateInput.schema';
export { projectsCreateInputObjectSchema as CreateProjectSchema } from '@/lib/prisma/generated/schemas/objects/projectsCreateInput.schema';
export { relationshipsCreateInputObjectSchema as CreateRelationshipSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsCreateInput.schema';
export { tagsCreateInputObjectSchema as CreateTagSchema } from '@/lib/prisma/generated/schemas/objects/tagsCreateInput.schema';
export { usersCreateInputObjectSchema as CreateUserSchema } from '@/lib/prisma/generated/schemas/objects/usersCreateInput.schema';

// Update Input schemas (for validating updates)
export { evidence_itemsUpdateInputObjectSchema as UpdateEvidenceItemSchema } from '@/lib/prisma/generated/schemas/objects/evidence_itemsUpdateInput.schema';
export { groupsUpdateInputObjectSchema as UpdateGroupSchema } from '@/lib/prisma/generated/schemas/objects/groupsUpdateInput.schema';
export { metric_cardsUpdateInputObjectSchema as UpdateMetricCardSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsUpdateInput.schema';
export { project_collaboratorsUpdateInputObjectSchema as UpdateProjectCollaboratorSchema } from '@/lib/prisma/generated/schemas/objects/project_collaboratorsUpdateInput.schema';
export { projectsUpdateInputObjectSchema as UpdateProjectSchema } from '@/lib/prisma/generated/schemas/objects/projectsUpdateInput.schema';
export { relationshipsUpdateInputObjectSchema as UpdateRelationshipSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsUpdateInput.schema';
export { tagsUpdateInputObjectSchema as UpdateTagSchema } from '@/lib/prisma/generated/schemas/objects/tagsUpdateInput.schema';
export { usersUpdateInputObjectSchema as UpdateUserSchema } from '@/lib/prisma/generated/schemas/objects/usersUpdateInput.schema';

// Where Input schemas (for filtering/querying)
export { metric_cardsWhereInputObjectSchema as MetricCardWhereSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsWhereInput.schema';
export { projectsWhereInputObjectSchema as ProjectWhereSchema } from '@/lib/prisma/generated/schemas/objects/projectsWhereInput.schema';
export { relationshipsWhereInputObjectSchema as RelationshipWhereSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsWhereInput.schema';
export { usersWhereInputObjectSchema as UserWhereSchema } from '@/lib/prisma/generated/schemas/objects/usersWhereInput.schema';

// Comments and notifications (for collaboration service)
export { changelogCreateInputObjectSchema as CreateChangelogSchema } from '@/lib/prisma/generated/schemas/objects/changelogCreateInput.schema';
export { changelogUpdateInputObjectSchema as UpdateChangelogSchema } from '@/lib/prisma/generated/schemas/objects/changelogUpdateInput.schema';
export { comment_mentionsCreateInputObjectSchema as CreateCommentMentionSchema } from '@/lib/prisma/generated/schemas/objects/comment_mentionsCreateInput.schema';
export { comment_threadsCreateInputObjectSchema as CreateCommentThreadSchema } from '@/lib/prisma/generated/schemas/objects/comment_threadsCreateInput.schema';
export { comment_threadsUpdateInputObjectSchema as UpdateCommentThreadSchema } from '@/lib/prisma/generated/schemas/objects/comment_threadsUpdateInput.schema';
export { commentsCreateInputObjectSchema as CreateCommentSchema } from '@/lib/prisma/generated/schemas/objects/commentsCreateInput.schema';
export { commentsUpdateInputObjectSchema as UpdateCommentSchema } from '@/lib/prisma/generated/schemas/objects/commentsUpdateInput.schema';
export { notificationsCreateInputObjectSchema as CreateNotificationSchema } from '@/lib/prisma/generated/schemas/objects/notificationsCreateInput.schema';
export { notificationsUpdateInputObjectSchema as UpdateNotificationSchema } from '@/lib/prisma/generated/schemas/objects/notificationsUpdateInput.schema';

// Convenience object with all schemas grouped
export const ZodSchemas = {
  // Create schemas
  User: {
    Create: '@/lib/prisma/generated/schemas/objects/usersCreateInput.schema',
    Update: '@/lib/prisma/generated/schemas/objects/usersUpdateInput.schema',
    Where: '@/lib/prisma/generated/schemas/objects/usersWhereInput.schema',
  },
  Project: {
    Create: '@/lib/prisma/generated/schemas/objects/projectsCreateInput.schema',
    Update: '@/lib/prisma/generated/schemas/objects/projectsUpdateInput.schema',
    Where: '@/lib/prisma/generated/schemas/objects/projectsWhereInput.schema',
  },
  MetricCard: {
    Create:
      '@/lib/prisma/generated/schemas/objects/metric_cardsCreateInput.schema',
    Update:
      '@/lib/prisma/generated/schemas/objects/metric_cardsUpdateInput.schema',
    Where:
      '@/lib/prisma/generated/schemas/objects/metric_cardsWhereInput.schema',
  },
  Relationship: {
    Create:
      '@/lib/prisma/generated/schemas/objects/relationshipsCreateInput.schema',
    Update:
      '@/lib/prisma/generated/schemas/objects/relationshipsUpdateInput.schema',
    Where:
      '@/lib/prisma/generated/schemas/objects/relationshipsWhereInput.schema',
  },
} as const;
