
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface NavigationItemProps {
  item: {
    title: string;
    link: string;
    children?: Array<{ title: string; link: string }>;
  };
  onItemClick?: () => void;
  mobile?: boolean;
}

const NavigationItem = ({ item, onItemClick, mobile = false }: NavigationItemProps) => {
  if (mobile) {
    return (
      <div>
        <Link
          to={item.link}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50"
          onClick={onItemClick}
        >
          {item.title}
        </Link>
        {item.children && (
          <div className="pl-4 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.title}
                to={child.link}
                className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-accent hover:bg-gray-50"
                onClick={onItemClick}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <Link
        to={item.link}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-accent flex items-center"
      >
        {item.title}
        {item.children && <ChevronDown className="ml-1 h-4 w-4" />}
      </Link>
      {item.children && (
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1">
            {item.children.map((child) => (
              <Link
                key={child.title}
                to={child.link}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationItem;
