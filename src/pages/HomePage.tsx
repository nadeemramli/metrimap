import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface CanvasProject {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  tags: string[];
  collaborators: string[];
}

// Mock data for now - will be replaced with Supabase data
const mockProjects: CanvasProject[] = [
  {
    id: "1",
    name: "SaaSCo Q3 Growth Model",
    description: "Customer acquisition and revenue optimization analysis",
    lastModified: "2024-01-15",
    tags: ["Marketing", "Finance", "In Progress"],
    collaborators: ["JD", "SK", "AM"]
  },
  {
    id: "2", 
    name: "User Retention Analytics",
    description: "Comprehensive user behavior and retention mapping",
    lastModified: "2024-01-10",
    tags: ["Product", "Analytics", "Complete"],
    collaborators: ["AM", "RP"]
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => project.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const handleCreateCanvas = () => {
    // Generate new canvas ID and navigate
    const newId = Date.now().toString();
    navigate(`/canvas/${newId}`);
  };

  const handleOpenCanvas = (canvasId: string) => {
    navigate(`/canvas/${canvasId}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Metrimap</h1>
            <p className="text-lg text-muted-foreground">
              Visual business architecture & metric mapping
            </p>
          </div>
          <Button onClick={handleCreateCanvas} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Canvas
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search canvases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenCanvas(project.id)}
              className="group border border-border rounded-lg p-6 bg-card hover:bg-accent cursor-pointer transition-colors"
            >
              {/* Canvas Thumbnail Placeholder */}
              <div className="w-full h-32 bg-muted rounded-md mb-4 flex items-center justify-center text-muted-foreground">
                Canvas Preview
              </div>

              {/* Project Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-card-foreground group-hover:text-accent-foreground">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Modified {project.lastModified}
                  </span>
                  <div className="flex -space-x-1">
                    {project.collaborators.map((collaborator, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium border-2 border-background"
                      >
                        {collaborator}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No canvases found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedTags.length > 0 
                ? "Try adjusting your search or filters" 
                : "Create your first canvas to get started"}
            </p>
            <Button onClick={handleCreateCanvas} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Canvas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}