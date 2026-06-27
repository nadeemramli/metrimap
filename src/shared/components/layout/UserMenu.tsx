import { useUser, SignOutButton, useClerk } from "@clerk/react-router";
import { LogOut, User, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAppStore } from "@/lib/stores";

export function UserMenu() {
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const devUser = useAppStore((s) => s.user);
  const isDev = import.meta.env.DEV;

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

  const handleOpenProfile = () => {
    if (typeof clerk?.openUserProfile === "function") {
      clerk.openUserProfile();
    } else {
      console.warn("Clerk user profile is not available in this environment");
    }
  };

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
      <DropdownMenuContent className="w-64" align="end" forceMount>
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
        <DropdownMenuItem onClick={handleOpenProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenProfile}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFeedbackClick}>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Give Feedback</span>
        </DropdownMenuItem>
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
