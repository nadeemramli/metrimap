# Prisma + Zod Quick Reference

Fast reference for common patterns and file locations.

## 📁 Key Files & Locations

### Schema & Generated Files

```
prisma/schema.prisma                     # Database schema (read-only mirror)
prisma/generated/schemas/objects/        # Generated Zod schemas
node_modules/.prisma/client/             # Generated Prisma client
```

### Service Layer

```
src/lib/services/typed-operations.ts    # Core validation functions
src/lib/services/typed-projects.ts      # Project operations
src/lib/services/typed-canvas.ts        # Canvas operations
```

### React Integration

```
src/lib/hooks/useTypedValidation.ts     # Form validation hooks
src/components/forms/TypedProjectForm.tsx # Example component
src/lib/validation/zod.ts               # Zod schema exports
```

## 🚀 Quick Commands

```bash
# Sync schema from Supabase and regenerate types
npm run prisma:types

# Just regenerate from existing schema
npm run prisma:generate

# Pull schema without regenerating
npm run prisma:pull
```

## 🔧 Common Patterns

### Import Types

```typescript
// Database types (exact schema match)
import type {
  users as User,
  projects as Project,
  metric_cards as MetricCard,
} from "@prisma/client";

// Input validation types (for forms)
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/lib/services/typed-operations";
```

### Validate Data

```typescript
import { validate } from "@/lib/services/typed-operations";

// Single validation
const result = validate.project.create(data);
if (result.success) {
  // Use result.data (fully typed)
} else {
  // Handle result.errors
}
```

### Service Operations

```typescript
import { createProject, updateProject } from "@/lib/services/typed-projects";

// Auto-validated operations
const result = await createProject(formData);
if (result.success) {
  console.log(result.project); // Typed project
}
```

### React Forms

```typescript
import { useProjectValidation } from "@/lib/hooks/useTypedValidation";

const validation = useProjectValidation().create;

// In component
validation.validateField("name", value);
validation.validateAll(formData);
validation.hasFieldError("name");
validation.getFieldError("name");
```

## 📋 Validation Schema Names

### Create Schemas

- `CreateUserSchema`
- `CreateProjectSchema`
- `CreateMetricCardSchema`
- `CreateRelationshipSchema`
- `CreateEvidenceItemSchema`
- `CreateGroupSchema`

### Update Schemas

- `UpdateUserSchema`
- `UpdateProjectSchema`
- `UpdateMetricCardSchema`
- `UpdateRelationshipSchema`
- `UpdateEvidenceItemSchema`
- `UpdateGroupSchema`

### Query Schemas

- `UserWhereSchema`
- `ProjectWhereSchema`
- `MetricCardWhereSchema`
- `RelationshipWhereSchema`

## 🎯 Quick Examples

### Form with Validation

```typescript
function MyForm() {
  const validation = useProjectValidation().create;
  const [data, setData] = useState({ name: '', description: '' });

  const handleSubmit = async () => {
    const result = validation.validateAll(data);
    if (result.success) {
      const project = await createProject(result.data);
    }
  };

  return (
    <form>
      <input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        onBlur={() => validation.validateField('name', data.name)}
      />
      {validation.hasFieldError('name') &&
        <span>{validation.getFieldError('name')}</span>
      }
    </form>
  );
}
```

### Service Layer Usage

```typescript
// Create with validation
const result = await createProject({
  name: "My Project",
  description: "Description",
});

// Update with validation
const updateResult = await updateProject(id, {
  name: "New Name",
});

// Error handling
if (!result.success) {
  console.error(result.errors);
}
```

### Canvas Operations

```typescript
import { useTypedCanvasOperations } from "@/lib/services/typed-canvas";

const { createCard, updateCard } = useTypedCanvasOperations();

// Validated card creation
const card = await createCard({
  title: "New Card",
  category: "Data/Metric",
  position: { x: 100, y: 100 },
});
```

## 🐛 Debugging

### Check Validation Errors

```typescript
const result = validate.project.create(data);
console.log({
  success: result.success,
  errors: result.errors,
  data: result.data,
});
```

### Inspect Generated Schemas

```typescript
import { CreateProjectSchema } from "@/lib/validation/zod";
console.log(CreateProjectSchema.safeParse(data));
```

### Type Information

```typescript
import type { Project } from "@/lib/services/typed-operations";

// TypeScript will show you all available properties
const project: Project = {
  // Ctrl+Space here to see all fields
};
```

## ⚡ Performance Tips

- Validation is lightweight (pre-generated schemas)
- Prisma client used for types only, not DB operations
- Existing Supabase operations unchanged
- Validation errors provide detailed field-level feedback

## 🔄 Workflow

1. **Make DB changes** → in Supabase dashboard
2. **Sync schema** → `npm run prisma:pull`
3. **Generate types** → `npm run prisma:generate`
4. **Use in code** → Import types and validation
5. **Handle errors** → Check validation results

## 📚 Full Documentation

For complete details, see:

- [Integration Guide](./PRISMA_ZOD_INTEGRATION_GUIDE.md)
- [Setup Documentation](./PRISMA_ZOD_SETUP.md)
