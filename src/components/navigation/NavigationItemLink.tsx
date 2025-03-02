
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavigationItemLinkProps {
  to: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavigationItemLink: React.FC<NavigationItemLinkProps> = ({
  to,
  className,
  onClick,
  children
}) => {
  return (
    <Link
      to={to}
      className={cn(
        "text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors flex items-center",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavigationItemLink;
