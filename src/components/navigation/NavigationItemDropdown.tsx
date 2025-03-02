
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

interface NavigationItemDropdownProps {
  title: string;
  children: Array<{ title: string; link: string }>;
  className?: string;
}

const NavigationItemDropdown: React.FC<NavigationItemDropdownProps> = ({
  title,
  children,
  className
}) => {
  return (
    <NavigationMenuItem className={className}>
      <NavigationMenuTrigger className="bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
        <span className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white">
          {title}
        </span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 w-[200px]">
          {children.map((child, index) => (
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
};

export default NavigationItemDropdown;
