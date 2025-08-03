# Metric Mapping Canvas

A modern web application for creating, managing, and visualizing metric relationships and causal models. Built with React Flow for interactive canvas functionality, Supabase for data persistence, and TypeScript for type safety.

## Features

- **Interactive Canvas**: Drag-and-drop interface for creating and connecting metric cards
- **Relationship Mapping**: Visualize causal relationships between metrics with different relationship types
- **Group Management**: Organize metrics into collapsible groups for better organization
- **Real-time Collaboration**: Auto-save functionality with visual feedback
- **Advanced Filtering**: Filter metrics by category, tags, owners, and relationship types
- **Layout Algorithms**: Automatic layout with multiple direction options (Top-Bottom, Bottom-Top, Left-Right, Right-Left)
- **Search & Navigation**: Quick search and advanced search capabilities
- **Keyboard Shortcuts**: Comprehensive keyboard shortcuts for efficient workflow

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Canvas Engine**: React Flow (@xyflow/react)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd metric-mapping
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── canvas/          # Canvas-specific components
│   ├── ui/             # Reusable UI components
│   └── search/         # Search functionality
├── lib/
│   ├── stores/         # Zustand stores
│   ├── supabase/       # Supabase client and services
│   └── utils/          # Utility functions
├── pages/              # Page components
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

## Key Features

### Canvas Operations

- **Multi-selection**: Shift+Click to select multiple nodes
- **Grouping**: Select nodes and group them together
- **Auto-layout**: Apply automatic layout algorithms
- **Connection Validation**: Smart connection validation with visual feedback

### Data Management

- **Auto-save**: Real-time saving with visual status indicators
- **Undo/Redo**: Track changes and provide undo functionality
- **Bulk Operations**: Delete, duplicate, and manage multiple items

### User Experience

- **Responsive Design**: Works on desktop and touch devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized rendering and state management

## Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting

### State Management

- Zustand for global state
- React Flow for canvas state
- Supabase for data persistence

### Testing

```bash
npm run test
```

### Building

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
