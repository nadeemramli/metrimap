# Prisma + Zod Integration Guide

Complete guide for using Prisma ORM and Zod validation in the Metric Mapping application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Generated Files](#generated-files)
4. [Type Safety](#type-safety)
5. [Validation Layer](#validation-layer)
6. [Service Layer](#service-layer)
7. [React Integration](#react-integration)
8. [Best Practices](#best-practices)
9. [Migration Guide](#migration-guide)
10. [Troubleshooting](#troubleshooting)

## Overview

We've implemented end-to-end type safety using:

- **Prisma**: Type-safe database client and schema introspection
- **Zod**: Runtime validation with TypeScript integration
- **Generated Types**: Auto-generated from database schema

**Key Benefits:**

- 🔒 End-to-end type safety from database to UI
- ✅ Runtime validation with compile-time types
- 🚀 Auto-generated schemas from database
- 🔄 Seamless integration with existing Supabase operations
- 📝 Better developer experience with IntelliSense

## Architecture

```
Database (Supabase)
    ↓ (prisma db pull)
Prisma Schema
    ↓ (prisma generate)
├── Prisma Client (types)
└── Zod Schemas (validation)
    ↓
Service Layer (validation + operations)
    ↓
React Components (type-safe forms)
```

## Generated Files

### Prisma Schema

```
prisma/schema.prisma          # Database schema mirror
```

### Generated Types & Validation

```
prisma/generated/
├── schemas/objects/          # Zod validation schemas
│   ├── usersCreateInput.schema.ts
│   ├── usersUpdateInput.schema.ts
│   ├── projectsCreateInput.schema.ts
│   └── ...
└── client/                   # Prisma client (auto-generated)
```

### Service Layer

```
src/lib/services/
├── typed-operations.ts       # Core validation functions
├── typed-projects.ts         # Project operations with validation
└── typed-canvas.ts          # Canvas operations with validation
```

### React Integration

```
src/lib/hooks/
└── useTypedValidation.ts    # React hooks for form validation

src/components/forms/
└── TypedProjectForm.tsx     # Example typed form component
```

## Type Safety

### Database Types

```typescript
import type {
  users as User,
  projects as Project,
  metric_cards as MetricCard,
} from "@prisma/client";

// These types exactly match your database schema
const project: Project = {
  id: "uuid",
  name: "Project Name",
  description: "Description",
  created_at: new Date(),
  // ... all fields are typed
};
```

### Input Validation Types

```typescript
import {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectWhereInput,
} from "@/lib/services/typed-operations";

// These are inferred from Zod schemas, ensuring runtime validation matches types
const createData: CreateProjectInput = {
  name: "New Project",
  description: "Project description",
  // TypeScript will enforce required fields and types
};
```

## Validation Layer

### Basic Validation

```typescript
import { validate } from "@/lib/services/typed-operations";

// Validate project creation data
const result = validate.project.create(unknownData);

if (result.success) {
  // result.data is fully typed and validated
  console.log(result.data.name); // TypeScript knows this is a string
} else {
  // result.errors contains detailed validation errors
  console.error(result.errors);
}
```

### Service Layer Validation

```typescript
import { createProject } from "@/lib/services/typed-projects";

const result = await createProject({
  name: "My Project",
  description: "Project description",
  tags: ["analytics", "dashboard"],
});

if (result.success) {
  // result.project is fully typed
  console.log(`Created: ${result.project.name}`);
} else {
  // result.errors contains human-readable error messages
  console.error("Validation failed:", result.errors);
}
```

## Service Layer

### Typed Project Operations

```typescript
import * as typedProjects from "@/lib/services/typed-projects";

// All operations include validation and proper typing
const projects = await typedProjects.getUserProjects(userId);
const project = await typedProjects.getProjectById(projectId);

// Create with validation
const createResult = await typedProjects.createProject({
  name: "New Project",
  description: "Description",
});

// Update with validation
const updateResult = await typedProjects.updateProject(projectId, {
  name: "Updated Name",
});
```

### Canvas Operations

```typescript
import { useTypedCanvasOperations } from "@/lib/services/typed-canvas";

const { createCard, updateCard, validate } = useTypedCanvasOperations();

// Create card with validation
try {
  const card = await createCard({
    title: "New Metric",
    category: "Data/Metric",
    position: { x: 100, y: 100 },
  });
  console.log("Card created:", card);
} catch (error) {
  console.error("Validation failed:", error.message);
}
```

## React Integration

### Form Validation Hook

```typescript
import { useProjectValidation } from '@/lib/hooks/useTypedValidation';

function ProjectForm() {
  const validation = useProjectValidation().create;
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validation.validateAll(formData);

    if (result.success) {
      // Submit validated data
      submitProject(result.data);
    } else {
      // Show validation errors
      console.log(validation.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        onBlur={() => validation.validateField('name', formData.name)}
      />
      {validation.hasFieldError('name') && (
        <span className="error">{validation.getFieldError('name')}</span>
      )}
    </form>
  );
}
```

### Complete Form Example

See `src/components/forms/TypedProjectForm.tsx` for a complete implementation with:

- Real-time validation
- Error display
- Type-safe form handling
- Integration with service layer

## Best Practices

### 1. Always Validate Input

```typescript
// ❌ Don't use raw data
const project = await createProject(rawUserInput);

// ✅ Always validate first
const validation = validate.project.create(rawUserInput);
if (validation.success) {
  const project = await createProject(validation.data);
}
```

### 2. Use Service Layer

```typescript
// ❌ Don't use Prisma client directly in components
import { PrismaClient } from "@prisma/client";

// ✅ Use typed service layer
import { createProject } from "@/lib/services/typed-projects";
```

### 3. Handle Validation Errors Properly

```typescript
// ✅ Provide user-friendly error messages
const result = validate.project.create(data);
if (!result.success) {
  const errorMessages = result.errors.map(
    (error) => `${error.path.join(".")}: ${error.message}`
  );
  showUserError(errorMessages.join(", "));
}
```

### 4. Leverage TypeScript IntelliSense

```typescript
// TypeScript will auto-complete and type-check all fields
const project: Project = {
  id: "uuid",
  name: "Project",
  // IntelliSense shows all available fields
  // TypeScript ensures all required fields are present
};
```

## Migration Guide

### 1. Gradual Migration

You can migrate components gradually:

```typescript
// Old approach
import type { CanvasProject } from "@/lib/types";
import { createProject } from "@/lib/supabase/services/projects";

// New approach
import type { Project } from "@/lib/services/typed-operations";
import { createProject } from "@/lib/services/typed-projects";
```

### 2. Legacy Compatibility

The new services wrap existing Supabase operations:

```typescript
// typed-projects.ts wraps the original projects service
import * as originalService from "@/lib/supabase/services/projects";

export async function createProject(data: unknown) {
  const validation = validate.project.create(data);
  if (validation.success) {
    return originalService.createProject(validation.data);
  }
  // Handle validation errors
}
```

### 3. Component Updates

Update forms to use validation hooks:

```typescript
// Before
const [errors, setErrors] = useState({});
const validateForm = (data) => {
  /* manual validation */
};

// After
const validation = useProjectValidation().create;
// Automatic validation with type safety
```

## Troubleshooting

### Schema Sync Issues

If types don't match database:

```bash
# Pull latest schema from Supabase
npm run prisma:pull

# Regenerate types and validation
npm run prisma:generate
```

### Validation Errors

Common validation issues:

```typescript
// Check required fields
const validation = validate.project.create(data);
console.log(validation.errors); // Shows missing/invalid fields

// Check field types
console.log(typeof data.created_at); // Should be Date or string
```

### Type Conflicts

If you see TypeScript errors:

1. Restart TypeScript server
2. Run `npm run prisma:types`
3. Check import paths in `src/lib/validation/zod.ts`

### Performance Considerations

- Prisma client is used for types only, not database operations
- Validation happens at runtime, minimal performance impact
- Zod schemas are pre-generated, not created at runtime

## Development Workflow

### 1. Database Changes

```bash
# After making database changes in Supabase
npm run prisma:pull    # Sync schema
npm run prisma:generate # Regenerate types
```

### 2. Adding New Validations

1. Update Prisma schema (if needed)
2. Run `prisma generate`
3. Export new schemas in `src/lib/validation/zod.ts`
4. Create service layer functions
5. Add React hooks if needed

### 3. Testing Validations

```typescript
import { validate } from "@/lib/services/typed-operations";

// Test in development
const testData = { name: "", description: null };
const result = validate.project.create(testData);
console.log(result.errors); // See what validation fails
```

## Summary

This integration provides:

- **Type Safety**: End-to-end types from database to UI
- **Runtime Validation**: Zod ensures data integrity
- **Developer Experience**: Auto-completion and error catching
- **Maintainability**: Single source of truth for types
- **Gradual Adoption**: Can be implemented incrementally

The system maintains compatibility with existing Supabase operations while adding a robust validation and type safety layer.
