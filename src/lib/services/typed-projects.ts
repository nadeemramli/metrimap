// Typed project service layer that wraps existing Supabase operations with Prisma types and Zod validation

import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/shared/lib/supabase/types";
import * as projectsService from "@/shared/lib/supabase/services/projects";
import {
  validate,
  type Project,
  type MetricCard,
  type Relationship,
  type Group,
  ValidationResult,
} from "./typed-operations";

// Enhanced project type with related data
export interface ProjectWithRelations extends Project {
  metric_cards?: MetricCard[];
  relationships?: Relationship[];
  groups?: Group[];
  collaborators?: Array<{
    role: string;
    permissions: string[];
    user: {
      id: string;
      name: string;
      email: string;
      avatar_url?: string;
    };
  }>;
}

// Typed wrapper for getUserProjects
export async function getUserProjects(
  userId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<ProjectWithRelations[]> {
  // Use existing service but with enhanced typing
  const projects = await projectsService.getUserProjects(
    userId,
    authenticatedClient
  );
  // Return type is now properly typed
  return projects as ProjectWithRelations[];
}

// Typed wrapper for getProjectById
export async function getProjectById(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<ProjectWithRelations | null> {
  // Use existing service but return typed result
  const project = await projectsService.getProjectById(
    projectId,
    authenticatedClient
  );
  return project as ProjectWithRelations | null;
}

// Validated project creation
export async function createProject(
  projectData: unknown,
  authenticatedClient?: SupabaseClient<Database>
): Promise<{ success: boolean; project?: Project; errors?: string[] }> {
  // Validate input data
  const validation = validate.project.create(projectData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors?.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ),
    };
  }

  try {
    // Use existing service with validated data
    const project = await projectsService.createProject(
      validation.data as Parameters<typeof projectsService.createProject>[0],
      authenticatedClient
    );

    return {
      success: true,
      project: project as Project,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
}

// Validated project update
export async function updateProject(
  projectId: string,
  updateData: unknown,
  authenticatedClient?: SupabaseClient<Database>
): Promise<{ success: boolean; project?: Project; errors?: string[] }> {
  // Validate input data
  const validation = validate.project.update(updateData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.errors?.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ),
    };
  }

  try {
    // Use existing service with validated data
    const project = await projectsService.updateProject(
      projectId,
      validation.data as Parameters<typeof projectsService.updateProject>[1],
      authenticatedClient
    );

    return {
      success: true,
      project: project as Project,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
}

// Typed wrapper for deleteProject
export async function deleteProject(
  projectId: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<{ success: boolean; errors?: string[] }> {
  try {
    await projectsService.deleteProject(projectId, authenticatedClient);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
}

// Typed wrapper for duplicateProject
export async function duplicateProject(
  projectId: string,
  newName: string,
  authenticatedClient?: SupabaseClient<Database>
): Promise<{ success: boolean; project?: Project; errors?: string[] }> {
  try {
    const project = await projectsService.duplicateProject(
      projectId,
      newName,
      authenticatedClient
    );

    return {
      success: true,
      project: project as Project,
    };
  } catch (error) {
    return {
      success: false,
      errors: [
        error instanceof Error ? error.message : "Unknown error occurred",
      ],
    };
  }
}

// Helper to validate project search/filter parameters
export function validateProjectFilters(
  filters: unknown
): ValidationResult<ProjectWhereInput> {
  return validate.project.where(filters);
}

// Example usage functions
export const examples = {
  // Create a project with validation
  async createValidatedProject(data: unknown) {
    const result = await createProject(data);

    if (result.success) {
      console.log("Project created:", result.project);
      return result.project;
    } else {
      console.error("Validation errors:", result.errors);
      throw new Error(`Project creation failed: ${result.errors?.join(", ")}`);
    }
  },

  // Update project with partial data
  async updateProjectSafely(projectId: string, updates: unknown) {
    const result = await updateProject(projectId, updates);

    if (result.success) {
      return result.project;
    } else {
      throw new Error(`Project update failed: ${result.errors?.join(", ")}`);
    }
  },

  // Get project with type safety
  async getTypedProject(projectId: string): Promise<ProjectWithRelations> {
    const project = await getProjectById(projectId);

    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    return project;
  },
} as const;
