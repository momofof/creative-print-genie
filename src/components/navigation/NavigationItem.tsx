
import React from 'react';
import { NavigationItemInfo } from '@/types/product';
import NavigationItemLink from './NavigationItemLink';
import NavigationItemDropdown from './NavigationItemDropdown';
import NavigationItemMobile from './NavigationItemMobile';
import { LucideProps } from 'lucide-react';

interface NavigationItemProps {
  title?: string;
  link?: string;
  children?: Array<{ title: string; link: string }>;
  icon?: React.ComponentType<LucideProps>;
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
        <NavigationItemMobile
          title={itemTitle || ''}
          children={itemChildren}
          onItemClick={onItemClick}
        />
      );
    }

    return (
      <NavigationItemDropdown
        title={itemTitle || ''}
        children={itemChildren}
        className={className}
      />
    );
  }

  // Without dropdown
  if (mobile) {
    return (
      <NavigationItemMobile
        title={itemTitle || ''}
        link={itemLink}
        icon={ItemIcon}
        onItemClick={onItemClick}
      />
    );
  }

  return (
    <NavigationItemLink to={itemLink || "#"} className={className} onClick={onItemClick}>
      {ItemIcon && <ItemIcon size={18} className="mr-2" />}
      {itemTitle}
    </NavigationItemLink>
  );
};

export default NavigationItem;
