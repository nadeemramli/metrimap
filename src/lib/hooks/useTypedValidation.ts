// React hook for form validation using Zod schemas with Prisma types

import { useState, useCallback } from "react";
import { z } from "zod";
import {
  validate,
  type ValidationResult,
} from "@/lib/services/typed-operations";

// Generic validation hook
export function useValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(true);

  const validateField = useCallback(
    (fieldName: string, value: unknown): boolean => {
      try {
        // Try to validate just this field
        schema.parse({ [fieldName]: value });

        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });

        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldError = error.issues.find((issue) =>
            issue.path.includes(fieldName)
          );

          if (fieldError) {
            setErrors((prev) => ({
              ...prev,
              [fieldName]: fieldError.message,
            }));
          }
        }

        return false;
      }
    },
    [schema]
  );

  const validateAll = useCallback(
    (data: unknown): ValidationResult<T> => {
      try {
        const validatedData = schema.parse(data);
        setErrors({});
        setIsValid(true);
        return { success: true, data: validatedData };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMap: Record<string, string> = {};

          error.issues.forEach((issue) => {
            const fieldName = issue.path.join(".");
            errorMap[fieldName] = issue.message;
          });

          setErrors(errorMap);
          setIsValid(false);

          return { success: false, errors: error.issues };
        }

        throw error;
      }
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      return errors[fieldName];
    },
    [errors]
  );

  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      return !!errors[fieldName];
    },
    [errors]
  );

  return {
    errors,
    isValid,
    validateField,
    validateAll,
    clearErrors,
    getFieldError,
    hasFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}

// Specific validation hooks for common entities
export function useProjectValidation() {
  return {
    create: useValidation(validate.project.create as any),
    update: useValidation(validate.project.update as any),
  };
}

export function useMetricCardValidation() {
  return {
    create: useValidation(validate.metricCard.create as any),
    update: useValidation(validate.metricCard.update as any),
  };
}

export function useRelationshipValidation() {
  return {
    create: useValidation(validate.relationship.create as any),
    update: useValidation(validate.relationship.update as any),
  };
}

export function useEvidenceItemValidation() {
  return {
    create: useValidation(validate.evidenceItem.create as any),
    update: useValidation(validate.evidenceItem.update as any),
  };
}

// Form field wrapper component helper
export interface ValidatedFieldProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  validator: ReturnType<typeof useValidation>;
  children: (props: {
    error?: string;
    hasError: boolean;
    onBlur: () => void;
  }) => React.ReactNode;
}

export function ValidatedField({
  name,
  value,
  onChange,
  validator,
  children,
}: ValidatedFieldProps) {
  const handleBlur = () => {
    validator.validateField(name, value);
  };

  const handleChange = (newValue: unknown) => {
    onChange(newValue);
    // Optionally validate on change (debounced)
    validator.validateField(name, newValue);
  };

  return children({
    error: validator.getFieldError(name),
    hasError: validator.hasFieldError(name),
    onBlur: handleBlur,
  });
}

// Example usage hook for project forms
export function useProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: [] as string[],
  });

  const validation = useProjectValidation().create;

  const updateField = useCallback((field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (onSubmit: (data: any) => Promise<void>) => {
      const result = validation.validateAll(formData);

      if (result.success) {
        try {
          await onSubmit(result.data);
          return { success: true };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }

      return { success: false, errors: validation.errors };
    },
    [formData, validation]
  );

  return {
    formData,
    updateField,
    handleSubmit,
    validation,
    isValid: validation.isValid && !validation.hasErrors,
  };
}
