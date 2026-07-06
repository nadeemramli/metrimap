import { useUser, SignOutButton } from "@clerk/react-router";
import {
  LogOut,
  Settings,
  SlidersHorizontal,
  MessageSquare,
  Monitor,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAppStore } from "@/lib/stores";

export function UserMenu({
  side = "bottom",
  align = "end",
}: {
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
} = {}) {
  const { user: clerkUser } = useUser();
  const devUser = useAppStore((s) => s.user);
  const isDev = import.meta.env.DEV;
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Prefer Clerk user when available; otherwise use development user from app store
  const user =
    clerkUser ||
    (isDev && devUser
      ? {
          fullName: devUser.name,
          imageUrl: "",
          emailAddresses: [{ emailAddress: devUser.email }],
          firstName: devUser.name?.split(" ")[0] ?? "",
          lastName: devUser.name?.split(" ").slice(1).join(" ") ?? "",
        }
      : null);

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;

  const handleFeedbackClick = () => {
    // Trigger Userback widget manually
    if (window.Userback) {
      window.Userback.open();
    } else {
      console.warn("Userback widget not available");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
            <AvatarFallback className="text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        side={side}
        align={align}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-start gap-3">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium leading-none">
                {user.fullName || "User"}
              </p>
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <Separator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings/workspace')}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <span>Workspace Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFeedbackClick}>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Give Feedback</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="night">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Night</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <SignOutButton>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
