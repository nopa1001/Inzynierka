import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { icons } from "lucide-react";

type IconType = {
  [key: string]: React.ComponentType<any>;
};

type Props = {
  children: React.ReactNode;
  href: string;
  icon?: string;
};

export const NavbarItem: React.FC<Props> = ({ children, href, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  const Icon = icon ? (icons as IconType)[icon] : null;

  const className = cn(
    "flex flex-row gap-4 px-4 py-2 text-sm font-semibold items-center rounded-lg hover:bg-muted/80 cursor-pointer",
    {
      "bg-muted/60": isActive,
    }
  );

  return (
    <Link to={href}>
      <li className={className}>
        {icon && Icon && (
          <span>
            <Icon />
          </span>
        )}
        {children}
      </li>
    </Link>
  );
};
