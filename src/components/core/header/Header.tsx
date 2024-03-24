import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Link } from "@/lib/intl/navigation";

import { SignOutButton } from "./SignOutButton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Lang from "@/components/core/lang/Lang";
import { UserRound, UserRoundCog } from "lucide-react";
import Logo from "../brand/Logo";

// Utils
import { poppins } from "@/lib/utils/fonts";
import { getInitials } from "@/lib/utils/initials";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="fixed top-0 z-40 flex w-full transition-all border-b border-border/15 backdrop-blur-xl bg-background/60">
      <div className="container flex items-center justify-between h-14 max-w-screen-2xl">
        <nav className="flex items-center gap-3 text-sm md:gap-6">
          <Link
            href="/"
            className="flex items-center"
            title="Vehicle Manager: LogicAuto"
          >
            <img src="/logo3.png" alt="Logo" width={100} height={100} />
          </Link>
        
          <Link
            href="/pricing"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pricing
          </Link>
        </nav>
        <div className="relative flex items-center justify-end gap-2 space-x-2 text-sm md:justify-end">
          {/* Sign In and Sign Up buttons */}
          {!session && (
            <>
              <Button asChild size="sm">
                <Link href="/signin" className="m-0">
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signin" className="m-0">
                  Sign Up
                </Link>
              </Button>
            </>
          )}

          {/* User Menu */}
          {session && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session?.user?.image as string} />
                  <AvatarFallback className="uppercase">
                    {getInitials(session?.user?.name as string)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={2}
                alignOffset={-5}
                className="border-border/20"
              >
                <DropdownMenuLabel>
                  <p>{session?.user?.name}</p>
                  <p className="text-xs font-normal text-foreground/60">
                    {session?.user?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/account">
                    <span className="flex items-center gap-1">
                      <UserRoundCog className="h-4" /> Account
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={`/users/${session.user.id}`}>
                    <span className="flex items-center gap-1">
                      <UserRound className="h-4" /> Profile
                    </span>
                  </Link>
                </DropdownMenuItem>
                {/* Language Switcher */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Lang />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Sign Out */}
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
