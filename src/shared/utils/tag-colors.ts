// Utility function to assign consistent colors to tags based on their content
export const getTagColor = (tag: string): "blue" | "green" | "purple" | "orange" | "pink" | "indigo" | "teal" | "yellow" | "red" | "gray" => {
  const colors: Array<"blue" | "green" | "purple" | "orange" | "pink" | "indigo" | "teal" | "yellow" | "red" | "gray"> = [
    "blue", "green", "purple", "orange", "pink", "indigo", "teal", "yellow", "red", "gray"
  ];
  
  // Create a simple hash from the tag string to consistently assign colors
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = ((hash << 5) - hash) + tag.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Function to get a color variant for any string content
export const getColorVariant = (content: string): "blue" | "green" | "purple" | "orange" | "pink" | "indigo" | "teal" | "yellow" | "red" | "gray" => {
  return getTagColor(content);
}; 