# Team Guide: Using Prisma + Zod for Type Safety

## Where to Check Prisma Schema and Zod Validation

### 📁 File Locations Quick Reference

#### Database Schema (Read-Only)

```
prisma/schema.prisma
```

This file mirrors your Supabase database schema. **DO NOT** edit this manually - it's automatically generated from your database.

#### Generated Zod Schemas

```
prisma/generated/schemas/objects/
├── usersCreateInput.schema.ts
├── usersUpdateInput.schema.ts
├── projectsCreateInput.schema.ts
├── metric_cardsCreateInput.schema.ts
└── ... (all other schemas)
```

These are auto-generated validation schemas. **DO NOT** edit these files.

#### Your Code Entry Points

```
src/lib/validation/zod.ts          # Import Zod schemas here
src/lib/services/typed-operations.ts   # Core validation functions
src/lib/services/typed-projects.ts     # Project-specific operations
```

## 🔍 How to Check Schema

### 1. Database Schema

To see what fields are available in your database:

```bash
# Open the schema file
cat prisma/schema.prisma

# Or update it from database
npm run prisma:pull
```

### 2. Available Validation Schemas

To see what Zod validations are available:

```bash
# List all generated schemas
ls prisma/generated/schemas/objects/

# View a specific schema
cat prisma/generated/schemas/objects/projectsCreateInput.schema.ts
```

### 3. In Your IDE

- Open `src/lib/validation/zod.ts` to see exported schemas
- TypeScript will show you available properties with IntelliSense

## 🛠️ How to Use

### Basic Validation

```typescript
import { validate } from "@/lib/services/typed-operations";

// Validate project creation
const result = validate.project.create({
  name: "My Project",
  description: "Project description",
});

if (result.success) {
  // result.data is typed and validated
  console.log(result.data.name);
} else {
  // result.errors contains detailed validation info
  console.error(result.errors);
}
```

### In React Components

```typescript
import { useProjectValidation } from "@/lib/hooks/useTypedValidation";

function MyForm() {
  const validation = useProjectValidation().create;

  // Validate a single field
  validation.validateField("name", "Project Name");

  // Validate entire form
  const result = validation.validateAll(formData);

  // Check for errors
  if (validation.hasFieldError("name")) {
    console.log(validation.getFieldError("name"));
  }
}
```

### Service Layer (Recommended)

```typescript
import { createProject } from "@/lib/services/typed-projects";

// Automatic validation + database operation
const result = await createProject({
  name: "New Project",
  description: "Description",
});

if (result.success) {
  // result.project is fully typed
  console.log(`Created: ${result.project.name}`);
} else {
  // result.errors contains user-friendly messages
  console.error(result.errors);
}
```

## 🔄 Updating Schema

### When Database Changes

```bash
# 1. Pull latest schema from Supabase
npm run prisma:pull

# 2. Regenerate types and validation
npm run prisma:generate

# Or do both at once
npm run prisma:types
```

### After Schema Updates

1. Restart your TypeScript server
2. Check that imports still work
3. Update your code if new fields are available

## 🎯 Common Patterns

### Form Validation

```typescript
// src/components/MyForm.tsx
import { useProjectValidation } from '@/lib/hooks/useTypedValidation';

function ProjectForm() {
  const validation = useProjectValidation().create;
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async () => {
    const result = validation.validateAll(formData);
    if (result.success) {
      // Submit validated data
      await createProject(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        onBlur={() => validation.validateField('name', formData.name)}
      />
      {validation.hasFieldError('name') && (
        <span className="error">
          {validation.getFieldError('name')}
        </span>
      )}
    </form>
  );
}
```

### API Validation

```typescript
// In your API routes or components
import { validateCreateProject } from "@/lib/services/typed-operations";

function handleCreateProject(data: unknown) {
  try {
    const validatedData = validateCreateProject(data);
    // validatedData is now typed and validated
    return createProject(validatedData);
  } catch (error) {
    // Validation failed
    console.error("Invalid data:", error.message);
  }
}
```

### Type Checking

```typescript
import type { Project, MetricCard } from "@/lib/services/typed-operations";

// These types exactly match your database schema
const project: Project = {
  id: "uuid",
  name: "Project Name",
  description: "Description",
  // TypeScript will enforce all required fields
};
```

## 🏗️ Project Structure

### What Each File Does

**`prisma/schema.prisma`**

- Mirrors Supabase database
- Read-only, auto-generated
- Defines all table structures

**`src/lib/validation/zod.ts`**

- Exports validation schemas
- Your main import point for Zod validations
- Maps database schema to validation functions

**`src/lib/services/typed-operations.ts`**

- Core validation functions
- Type definitions
- Generic validation helpers

**`src/lib/services/typed-projects.ts`**

- Project-specific operations
- Wraps existing Supabase services with validation
- Returns typed results

**`src/lib/hooks/useTypedValidation.ts`**

- React hooks for form validation
- Real-time field validation
- Easy integration with forms

**`src/components/forms/TypedProjectForm.tsx`**

- Example implementation
- Shows complete form with validation
- Reference for new forms

## 🚨 Important Notes

### DO NOT Edit These Files

- `prisma/schema.prisma` (auto-generated)
- `prisma/generated/` (auto-generated)
- `node_modules/.prisma/` (auto-generated)

### DO Edit These Files

- `src/lib/validation/zod.ts` (to export new schemas)
- Your components and services (to use validation)
- Documentation (to help the team)

### Best Practices

1. **Always validate user input** before processing
2. **Use service layer** for operations (not direct Prisma)
3. **Handle validation errors** gracefully in UI
4. **Update schema** when database changes
5. **Use TypeScript** to catch errors early

## 🐛 Troubleshooting

### "Schema not found" Error

```bash
npm run prisma:generate
```

### "Type doesn't exist" Error

```bash
npm run prisma:pull
npm run prisma:generate
# Restart TypeScript server in IDE
```

### Validation Always Fails

- Check the schema: `cat prisma/generated/schemas/objects/yourModel.schema.ts`
- Verify field names match database
- Check required vs optional fields

### Performance Issues

- Validation is lightweight (pre-generated schemas)
- Prisma client is for types only, not DB operations
- Use service layer (it wraps existing Supabase operations)

## 📞 Need Help?

1. **Check the schema**: `prisma/schema.prisma`
2. **Look at examples**: `src/components/forms/TypedProjectForm.tsx`
3. **Read the integration guide**: `docs/PRISMA_ZOD_INTEGRATION_GUIDE.md`
4. **Quick reference**: `docs/PRISMA_ZOD_QUICK_REFERENCE.md`

## 🎉 Benefits You Get

- ✅ **Type Safety**: End-to-end types from database to UI
- 🛡️ **Runtime Validation**: Catch invalid data before it hits the database
- 🚀 **Auto-completion**: IDE shows you all available fields
- 🔧 **Easy Debugging**: Clear error messages show exactly what's wrong
- 📝 **Better DX**: Less bugs, more confidence in your code
