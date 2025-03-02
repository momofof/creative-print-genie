
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavigationItemInfo } from "@/types/product";

export interface NavigationItemProps {
  route?: string;
  label?: string;
  item?: NavigationItemInfo;
  onClick?: () => void;
  onItemClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  mobile?: boolean;
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
  item,
  onClick,
  onItemClick,
  className,
  children,
  mobile
}) => {
  // Handle item prop if provided
  if (item) {
    const { title, link, children: itemChildren, icon: Icon } = item;
    
    if (mobile) {
      return (
        <div className="w-full">
          {itemChildren ? (
            <div className="w-full">
              <div className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                <span>{title}</span>
              </div>
              <div className="pl-6 mt-1 space-y-1 mb-2">
                {itemChildren.map((child, idx) => (
                  <NavLink
                    key={idx}
                    to={child.link}
                    className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                    onClick={onItemClick}
                  >
                    {child.title}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              to={link}
              className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
              onClick={onItemClick}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              <span>{title}</span>
            </NavLink>
          )}
        </div>
      );
    }
    
    if (itemChildren) {
      return (
        <NavigationMenu className={className}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-teal-500 to-teal-600 p-6 no-underline outline-none focus:shadow-md"
                        href="/products"
                        onClick={onClick || onItemClick}
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
                  {itemChildren.map((child, idx) => (
                    <ListItem
                      key={idx}
                      href={child.link}
                      title={child.title}
                      onClick={onClick || onItemClick}
                    >
                      Description du {child.title}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      );
    }
    
    return (
      <NavLink
        to={link}
        className={({ isActive }) =>
          cn(
            "text-sm font-medium transition-colors hover:text-accent",
            isActive ? "text-accent" : "text-gray-700",
            className
          )
        }
        onClick={onClick || onItemClick}
      >
        {Icon && <Icon className="h-4 w-4 mr-2 inline" />}
        {title}
      </NavLink>
    );
  }

  // Original implementation
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
      to={route || "#"}
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
