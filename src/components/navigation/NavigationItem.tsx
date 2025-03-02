
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export interface NavigationItemProps {
  route: string;
  label: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export const NavigationItem: React.FC<NavigationItemProps> = ({
  route,
  label,
  onClick,
  className,
  children,
}) => {
  if (children) {
    return (
      <NavigationMenu className={className}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-teal-500 to-teal-600 p-6 no-underline outline-none focus:shadow-md"
                      href="/products"
                      onClick={onClick}
                    >
                      <div className="mt-4 mb-2 text-lg font-medium text-white">
                        Nos Produits
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Découvrez notre large sélection de produits personnalisables pour tous vos besoins.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/products/textile" title="Textile" onClick={onClick}>
                  T-shirts, sweatshirts, vêtements et accessoires imprimables.
                </ListItem>
                <ListItem href="/products/accessories" title="Accessoires" onClick={onClick}>
                  Mugs, sacs, casquettes et autres articles personnalisables.
                </ListItem>
                <ListItem href="/supplier/register" title="Devenir fournisseur" onClick={onClick}>
                  Proposez vos produits imprimables sur notre plateforme.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  return (
    <NavLink
      to={route}
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-accent",
          isActive ? "text-accent" : "text-gray-700",
          className
        )
      }
      onClick={onClick}
    >
      {label}
    </NavLink>
  );
};

export default NavigationItem;
