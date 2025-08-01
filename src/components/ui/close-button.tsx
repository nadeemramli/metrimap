import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CloseButtonProps {
  onClose: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CloseButton({
  onClose,
  className = "",
  size = "md",
}: CloseButtonProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      className={`${sizeClasses[size]} p-0 rounded-full hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group ${className}`}
      title="Close"
    >
      <X className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
    </Button>
  );
}
