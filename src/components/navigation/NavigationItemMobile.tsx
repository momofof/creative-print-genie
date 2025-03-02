
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from "lucide-react";

interface NavigationItemMobileProps {
  title: string;
  link?: string;
  children?: Array<{ title: string; link: string }>;
  icon?: React.ComponentType<{ size: number; className?: string }>;
  onItemClick?: () => void;
}

const NavigationItemMobile: React.FC<NavigationItemMobileProps> = ({
  title,
  link,
  children,
  icon: Icon,
  onItemClick
}) => {
  if (children && children.length > 0) {
    return (
      <div className="mobile-nav-item">
        <div className="flex items-center justify-between py-2 font-medium text-neutral-800 dark:text-neutral-200">
          <span>{title}</span>
          <ChevronDown size={16} />
        </div>
        <div className="pl-4 mt-1 space-y-1">
          {children.map((child, index) => (
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
    <Link
      to={link || "#"}
      className="mobile-nav-item block py-2 font-medium text-neutral-800 dark:text-neutral-200"
      onClick={onItemClick}
    >
      <div className="flex items-center">
        {Icon && <Icon size={18} className="mr-2" />}
        {title}
      </div>
    </Link>
  );
};

export default NavigationItemMobile;
