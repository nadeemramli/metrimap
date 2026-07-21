export { z } from 'zod';

// Re-export the most useful generated schemas for validation.
// NOTE: Create/Update use the *Unchecked* variants — services build flat
// column payloads (project_id, created_by, …), which the checked variants
// reject in favor of nested relation objects (CVS-337).

// Create Input schemas (for validating incoming data)
export { evidence_itemsUncheckedCreateInputObjectSchema as CreateEvidenceItemSchema } from '@/lib/prisma/generated/schemas/objects/evidence_itemsUncheckedCreateInput.schema';
export { groupsUncheckedCreateInputObjectSchema as CreateGroupSchema } from '@/lib/prisma/generated/schemas/objects/groupsUncheckedCreateInput.schema';
export { metric_cardsUncheckedCreateInputObjectSchema as CreateMetricCardSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsUncheckedCreateInput.schema';
export { project_collaboratorsUncheckedCreateInputObjectSchema as CreateProjectCollaboratorSchema } from '@/lib/prisma/generated/schemas/objects/project_collaboratorsUncheckedCreateInput.schema';
export { projectsUncheckedCreateInputObjectSchema as CreateProjectSchema } from '@/lib/prisma/generated/schemas/objects/projectsUncheckedCreateInput.schema';
export { relationshipsUncheckedCreateInputObjectSchema as CreateRelationshipSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsUncheckedCreateInput.schema';
export { tagsUncheckedCreateInputObjectSchema as CreateTagSchema } from '@/lib/prisma/generated/schemas/objects/tagsUncheckedCreateInput.schema';
export { usersUncheckedCreateInputObjectSchema as CreateUserSchema } from '@/lib/prisma/generated/schemas/objects/usersUncheckedCreateInput.schema';

// Update Input schemas (for validating updates)
export { evidence_itemsUncheckedUpdateInputObjectSchema as UpdateEvidenceItemSchema } from '@/lib/prisma/generated/schemas/objects/evidence_itemsUncheckedUpdateInput.schema';
export { groupsUncheckedUpdateInputObjectSchema as UpdateGroupSchema } from '@/lib/prisma/generated/schemas/objects/groupsUncheckedUpdateInput.schema';
export { metric_cardsUncheckedUpdateInputObjectSchema as UpdateMetricCardSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsUncheckedUpdateInput.schema';
export { project_collaboratorsUncheckedUpdateInputObjectSchema as UpdateProjectCollaboratorSchema } from '@/lib/prisma/generated/schemas/objects/project_collaboratorsUncheckedUpdateInput.schema';
export { projectsUncheckedUpdateInputObjectSchema as UpdateProjectSchema } from '@/lib/prisma/generated/schemas/objects/projectsUncheckedUpdateInput.schema';
export { relationshipsUncheckedUpdateInputObjectSchema as UpdateRelationshipSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsUncheckedUpdateInput.schema';
export { tagsUncheckedUpdateInputObjectSchema as UpdateTagSchema } from '@/lib/prisma/generated/schemas/objects/tagsUncheckedUpdateInput.schema';
export { usersUncheckedUpdateInputObjectSchema as UpdateUserSchema } from '@/lib/prisma/generated/schemas/objects/usersUncheckedUpdateInput.schema';

// Where Input schemas (for filtering/querying)
export { metric_cardsWhereInputObjectSchema as MetricCardWhereSchema } from '@/lib/prisma/generated/schemas/objects/metric_cardsWhereInput.schema';
export { projectsWhereInputObjectSchema as ProjectWhereSchema } from '@/lib/prisma/generated/schemas/objects/projectsWhereInput.schema';
export { relationshipsWhereInputObjectSchema as RelationshipWhereSchema } from '@/lib/prisma/generated/schemas/objects/relationshipsWhereInput.schema';
export { usersWhereInputObjectSchema as UserWhereSchema } from '@/lib/prisma/generated/schemas/objects/usersWhereInput.schema';

// Comments and notifications (for collaboration service)
export { changelogUncheckedCreateInputObjectSchema as CreateChangelogSchema } from '@/lib/prisma/generated/schemas/objects/changelogUncheckedCreateInput.schema';
export { changelogUncheckedUpdateInputObjectSchema as UpdateChangelogSchema } from '@/lib/prisma/generated/schemas/objects/changelogUncheckedUpdateInput.schema';
export { comment_mentionsUncheckedCreateInputObjectSchema as CreateCommentMentionSchema } from '@/lib/prisma/generated/schemas/objects/comment_mentionsUncheckedCreateInput.schema';
export { comment_threadsUncheckedCreateInputObjectSchema as CreateCommentThreadSchema } from '@/lib/prisma/generated/schemas/objects/comment_threadsUncheckedCreateInput.schema';
export { comment_threadsUncheckedUpdateInputObjectSchema as UpdateCommentThreadSchema } from '@/lib/prisma/generated/schemas/objects/comment_threadsUncheckedUpdateInput.schema';
export { commentsUncheckedCreateInputObjectSchema as CreateCommentSchema } from '@/lib/prisma/generated/schemas/objects/commentsUncheckedCreateInput.schema';
export { commentsUncheckedUpdateInputObjectSchema as UpdateCommentSchema } from '@/lib/prisma/generated/schemas/objects/commentsUncheckedUpdateInput.schema';
export { notificationsUncheckedCreateInputObjectSchema as CreateNotificationSchema } from '@/lib/prisma/generated/schemas/objects/notificationsUncheckedCreateInput.schema';
export { notificationsUncheckedUpdateInputObjectSchema as UpdateNotificationSchema } from '@/lib/prisma/generated/schemas/objects/notificationsUncheckedUpdateInput.schema';

// Convenience object with all schemas grouped
export const ZodSchemas = {
  // Create schemas
  User: {
    Create: '@/lib/prisma/generated/schemas/objects/usersUncheckedCreateInput.schema',
    Update: '@/lib/prisma/generated/schemas/objects/usersUncheckedUpdateInput.schema',
    Where: '@/lib/prisma/generated/schemas/objects/usersWhereInput.schema',
  },
  Project: {
    Create: '@/lib/prisma/generated/schemas/objects/projectsUncheckedCreateInput.schema',
    Update: '@/lib/prisma/generated/schemas/objects/projectsUncheckedUpdateInput.schema',
    Where: '@/lib/prisma/generated/schemas/objects/projectsWhereInput.schema',
  },
  MetricCard: {
    Create:
      '@/lib/prisma/generated/schemas/objects/metric_cardsUncheckedCreateInput.schema',
    Update:
      '@/lib/prisma/generated/schemas/objects/metric_cardsUncheckedUpdateInput.schema',
    Where:
      '@/lib/prisma/generated/schemas/objects/metric_cardsWhereInput.schema',
  },
  Relationship: {
    Create:
      '@/lib/prisma/generated/schemas/objects/relationshipsUncheckedCreateInput.schema',
    Update:
      '@/lib/prisma/generated/schemas/objects/relationshipsUncheckedUpdateInput.schema',
    Where:
      '@/lib/prisma/generated/schemas/objects/relationshipsWhereInput.schema',
  },
} as const;
