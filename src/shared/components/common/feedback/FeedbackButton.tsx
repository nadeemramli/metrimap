import { MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface FeedbackButtonProps {
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "link"
    | "destructive"
    | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function FeedbackButton({
  className = "",
  variant = "outline",
  size = "default",
}: FeedbackButtonProps) {
  const handleFeedbackClick = () => {
    // Trigger Userback widget manually
    if (window.Userback) {
      window.Userback.open();
    } else {
      console.warn("Userback widget not available");
    }
  };

  return (
    <Button
      onClick={handleFeedbackClick}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
    >
      <MessageSquare className="h-4 w-4" />
      Give Feedback
    </Button>
  );
}
