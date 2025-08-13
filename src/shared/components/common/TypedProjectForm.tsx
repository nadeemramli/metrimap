// Example form component demonstrating Prisma + Zod integration
// This shows how to use the new typed validation in React components

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { X, Plus } from "lucide-react";

import { useProjectForm } from "@/shared/hooks/useTypedValidation";
import { createProject } from "@/lib/services/typed-projects";
import type { Project } from "@/lib/services/typed-operations";

interface TypedProjectFormProps {
  onSuccess?: (project: Project) => void;
  onCancel?: () => void;
  initialData?: Partial<{
    name: string;
    description: string;
    tags: string[];
  }>;
}

export default function TypedProjectForm({
  onSuccess,
  onCancel,
  initialData,
}: TypedProjectFormProps) {
  const { formData, updateField, handleSubmit, validation, isValid } =
    useProjectForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [newTag, setNewTag] = useState("");

  // Initialize form with provided data
  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateField(key, value);
        }
      });
    }
  }, [initialData, updateField]);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateField(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const result = await handleSubmit(async (validatedData) => {
        // Use our typed service to create the project
        const createResult = await createProject(validatedData);

        if (!createResult.success) {
          throw new Error(
            createResult.errors?.join(", ") || "Failed to create project"
          );
        }

        if (createResult.project && onSuccess) {
          onSuccess(createResult.project);
        }
      });

      if (!result.success) {
        setSubmitError(result.error || "Validation failed");
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              onBlur={() => validation.validateField("name", formData.name)}
              placeholder="Enter project name"
              className={
                validation.hasFieldError("name") ? "border-red-500" : ""
              }
            />
            {validation.hasFieldError("name") && (
              <p className="text-sm text-red-500">
                {validation.getFieldError("name")}
              </p>
            )}
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              onBlur={() =>
                validation.validateField("description", formData.description)
              }
              placeholder="Describe your project"
              rows={3}
              className={
                validation.hasFieldError("description") ? "border-red-500" : ""
              }
            />
            {validation.hasFieldError("description") && (
              <p className="text-sm text-red-500">
                {validation.getFieldError("description")}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Validation Summary */}
          {validation.hasErrors && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fix the following errors:
                <ul className="list-disc list-inside mt-2">
                  {Object.entries(validation.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Error */}
          {submitError && (
            <Alert variant="destructive">
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 p-4 bg-gray-50 rounded">
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify(
                {
                  formData,
                  isValid,
                  errors: validation.errors,
                  hasErrors: validation.hasErrors,
                },
                null,
                2
              )}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
