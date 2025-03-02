
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItemInfo } from '@/types/product';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  title?: string;
  link?: string;
  children?: Array<{ title: string; link: string }>;
  icon?: React.ComponentType;
  onItemClick?: () => void;
  mobile?: boolean;
  item?: NavigationItemInfo;
  className?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  title, 
  link,
  children,
  icon: Icon,
  onItemClick,
  mobile = false,
  item,
  className
}) => {
  // If item prop is provided, use its values
  const itemTitle = item?.title || title;
  const itemLink = item?.link || link;
  const itemChildren = item?.children || children;
  const ItemIcon = item?.icon || Icon;

  if (itemChildren && itemChildren.length > 0) {
    // With dropdown
    if (mobile) {
      return (
        <div className="mobile-nav-item">
          <div className="flex items-center justify-between py-2 font-medium text-neutral-800 dark:text-neutral-200">
            <span>{itemTitle}</span>
            <ChevronDown size={16} />
          </div>
          <div className="pl-4 mt-1 space-y-1">
            {itemChildren.map((child, index) => (
              <Link
                key={index}
                to={child.link}
                className="block py-1.5 text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                onClick={onItemClick}
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <NavigationMenuItem className={className}>
        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
          <span className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white">
            {itemTitle}
          </span>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid gap-3 p-6 w-[200px]">
            {itemChildren.map((child, index) => (
              <li key={index}>
                <NavigationMenuLink asChild>
                  <Link
                    to={child.link}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <div className="font-medium leading-none">{child.title}</div>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  // Without dropdown
  if (mobile) {
    return (
      <Link
        to={itemLink || "#"}
        className="mobile-nav-item block py-2 font-medium text-neutral-800 dark:text-neutral-200"
        onClick={onItemClick}
      >
        <div className="flex items-center">
          {ItemIcon && <ItemIcon className={className} size={18} className="mr-2" />}
          {itemTitle}
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={itemLink || "#"}
      className={cn(
        "text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors flex items-center",
        className
      )}
    >
      {ItemIcon && <ItemIcon size={18} className="mr-2" />}
      {itemTitle}
    </Link>
  );
};

export default NavigationItem;
