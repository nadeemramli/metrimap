import type { GroupNode } from "@/shared/types";

/**
 * Generate an incremental group name
 * Finds the next available "Untitled Group X" name
 */
export function generateIncrementalGroupName(existingGroups: GroupNode[]): string {
  const baseName = "Untitled Group";
  const existingNames = new Set(existingGroups.map(group => group.name));
  
  // Find the next available number
  let counter = 1;
  let newName = `${baseName} ${counter}`;
  
  while (existingNames.has(newName)) {
    counter++;
    newName = `${baseName} ${counter}`;
  }
  
  return newName;
}

/**
 * Create a new group with automatic naming
 */
export function createNewGroup(
  position: { x: number; y: number },
  size: { width: number; height: number },
  existingGroups: GroupNode[]
): Omit<GroupNode, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: generateIncrementalGroupName(existingGroups),
    position,
    size,
    isCollapsed: false,
    zIndex: 0,
    nodeIds: [], // Empty group initially
  };
}

/**
 * Get default group size based on canvas dimensions
 */
export function getDefaultGroupSize(): { width: number; height: number } {
  return {
    width: 400,
    height: 300,
  };
}

/**
 * Calculate optimal group position (center of viewport)
 */
export function getDefaultGroupPosition(): { x: number; y: number } {
  // Default to center of viewport
  return {
    x: 200,
    y: 200,
  };
} 