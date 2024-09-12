import { NavbarItem } from "../navbar-item/navbar-item";
import { UserNav } from "../user-nav/user-nav";
import { useMenuItems } from "@/hooks/api/ui/use-menu-items";

export const Navbar = () => {
  const { data: menuItems } = useMenuItems();

  return (
    <nav className="w-72 border-r h-screen flex flex-col">
      <div className="h-48 flex justify-center items-center py-4 px-6">
        <span className="text-2xl font-bold">Menu</span>
      </div>
      <ul className="flex-1 gap-2 flex flex-col p-4">
        {menuItems?.attributes.navItems.map((item) => {
          return (
            <NavbarItem key={item.href} href={item.href} icon={item.icon}>
              {item.name}
            </NavbarItem>
          );
        })}
      </ul>
      <div className="flex flex-row justify-start items-center gap-4 h-24 border-t p-4">
        <UserNav />
      </div>
    </nav>
  );
};
