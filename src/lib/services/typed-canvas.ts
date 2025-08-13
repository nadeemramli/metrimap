// Typed canvas operations that integrate with existing CanvasPage functionality
// Provides validation and type safety for canvas operations

import type { CanvasProject } from "@/shared/types";
import {
  validate,
  type MetricCard,
  type Relationship,
  type Group,
} from "./typed-operations";

// Enhanced canvas project type that extends legacy type with Prisma types
export interface TypedCanvasProject
  extends Omit<CanvasProject, "nodes" | "edges" | "groups"> {
  nodes: MetricCard[];
  edges: Relationship[];
  groups: Group[];
}

// Validation helpers for canvas operations
export const canvasValidation = {
  // Validate metric card creation
  validateCreateCard: (cardData: unknown) => {
    return validate.metricCard.create(cardData);
  },

  // Validate metric card update
  validateUpdateCard: (cardData: unknown) => {
    return validate.metricCard.update(cardData);
  },

  // Validate relationship creation
  validateCreateRelationship: (relationshipData: unknown) => {
    return validate.relationship.create(relationshipData);
  },

  // Validate relationship update
  validateUpdateRelationship: (relationshipData: unknown) => {
    return validate.relationship.update(relationshipData);
  },

  // Validate group creation
  validateCreateGroup: (groupData: unknown) => {
    return validate.group.create(groupData);
  },

  // Validate bulk operations
  validateBulkCardUpdate: (cardsData: unknown[]) => {
    const results = cardsData.map((cardData) =>
      validate.metricCard.update(cardData)
    );
    const failed = results.filter((result) => !result.success);

    return {
      success: failed.length === 0,
      validData: results.filter((r) => r.success).map((r) => r.data),
      errors: failed.flatMap((r) => r.errors || []),
    };
  },
} as const;

// Canvas operation helpers with validation
export const typedCanvasOperations = {
  // Create a new metric card with validation
  async createMetricCardSafely(
    cardData: unknown,
    onSuccess: (card: MetricCard) => void,
    onError: (errors: string[]) => void
  ) {
    const validation = canvasValidation.validateCreateCard(cardData);

    if (!validation.success) {
      const errorMessages = validation.errors?.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ) || ["Validation failed"];
      onError(errorMessages);
      return null;
    }

    try {
      // Here you would call your existing canvas card creation logic
      // with the validated data
      const createdCard = validation.data as MetricCard;
      onSuccess(createdCard);
      return createdCard;
    } catch (error) {
      onError([error instanceof Error ? error.message : "Unknown error"]);
      return null;
    }
  },

  // Update metric card with validation
  async updateMetricCardSafely(
    cardId: string,
    updateData: unknown,
    onSuccess: (card: MetricCard) => void,
    onError: (errors: string[]) => void
  ) {
    const validation = canvasValidation.validateUpdateCard(updateData);

    if (!validation.success) {
      const errorMessages = validation.errors?.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ) || ["Validation failed"];
      onError(errorMessages);
      return null;
    }

    try {
      // Here you would call your existing card update logic
      // with the validated data
      const updatedCard = { id: cardId, ...validation.data } as MetricCard;
      onSuccess(updatedCard);
      return updatedCard;
    } catch (error) {
      onError([error instanceof Error ? error.message : "Unknown error"]);
      return null;
    }
  },

  // Create relationship with validation
  async createRelationshipSafely(
    relationshipData: unknown,
    onSuccess: (relationship: Relationship) => void,
    onError: (errors: string[]) => void
  ) {
    const validation =
      canvasValidation.validateCreateRelationship(relationshipData);

    if (!validation.success) {
      const errorMessages = validation.errors?.map(
        (e) => `${e.path.join(".")}: ${e.message}`
      ) || ["Validation failed"];
      onError(errorMessages);
      return null;
    }

    try {
      const createdRelationship = validation.data as Relationship;
      onSuccess(createdRelationship);
      return createdRelationship;
    } catch (error) {
      onError([error instanceof Error ? error.message : "Unknown error"]);
      return null;
    }
  },

  // Validate and transform legacy canvas data to typed format
  transformCanvasProject(legacyProject: CanvasProject): {
    success: boolean;
    project?: TypedCanvasProject;
    errors?: string[];
  } {
    try {
      // Validate each component of the canvas project
      const nodeValidations = legacyProject.nodes.map((node) =>
        canvasValidation.validateUpdateCard(node)
      );

      const edgeValidations = legacyProject.edges.map((edge) =>
        canvasValidation.validateUpdateRelationship(edge)
      );

      const failedNodes = nodeValidations.filter((v) => !v.success);
      const failedEdges = edgeValidations.filter((v) => !v.success);

      if (failedNodes.length > 0 || failedEdges.length > 0) {
        const errors = [
          ...failedNodes.flatMap(
            (v) => v.errors?.map((e) => `Node: ${e.message}`) || []
          ),
          ...failedEdges.flatMap(
            (v) => v.errors?.map((e) => `Edge: ${e.message}`) || []
          ),
        ];

        return { success: false, errors };
      }

      // All validations passed, create typed project
      const typedProject: TypedCanvasProject = {
        ...legacyProject,
        nodes: nodeValidations.map((v) => v.data!),
        edges: edgeValidations.map((v) => v.data!),
        groups: legacyProject.groups, // Groups validation would go here
      };

      return { success: true, project: typedProject };
    } catch (error) {
      return {
        success: false,
        errors: [
          error instanceof Error
            ? error.message
            : "Unknown transformation error",
        ],
      };
    }
  },
} as const;

// React hook for canvas operations with validation
export function useTypedCanvasOperations() {
  const createCard = async (cardData: unknown): Promise<MetricCard | null> => {
    return new Promise((resolve, reject) => {
      typedCanvasOperations.createMetricCardSafely(
        cardData,
        (card) => resolve(card),
        (errors) => reject(new Error(errors.join(", ")))
      );
    });
  };

  const updateCard = async (
    cardId: string,
    updateData: unknown
  ): Promise<MetricCard | null> => {
    return new Promise((resolve, reject) => {
      typedCanvasOperations.updateMetricCardSafely(
        cardId,
        updateData,
        (card) => resolve(card),
        (errors) => reject(new Error(errors.join(", ")))
      );
    });
  };

  const createRelationship = async (
    relationshipData: unknown
  ): Promise<Relationship | null> => {
    return new Promise((resolve, reject) => {
      typedCanvasOperations.createRelationshipSafely(
        relationshipData,
        (relationship) => resolve(relationship),
        (errors) => reject(new Error(errors.join(", ")))
      );
    });
  };

  return {
    createCard,
    updateCard,
    createRelationship,
    validate: canvasValidation,
  };
}
