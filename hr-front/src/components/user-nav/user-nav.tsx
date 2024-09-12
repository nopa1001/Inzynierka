import { useUser } from "@/hooks/api/user/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/api/authentication/use-logout";

export function UserNav() {
  const { data } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    const navigateUrl = `/login?redirect=${location.pathname}`;

    logout();
    navigate(navigateUrl);
  };

  const avatarFallbackText = `${data?.name?.charAt(0)} ${data?.surname?.charAt(
    0
  )}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative rounded-full h-12 w-12">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatars/03.png" alt="@shadcn" />
              <AvatarFallback>{avatarFallbackText}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {data?.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {data?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/profile">Profil</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="text-sm font-bold">
        {data?.name} {data?.surname}
      </span>
    </>
  );
}
