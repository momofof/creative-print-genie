
import NavigationItem from "./NavigationItem";
import { productCategories } from "@/data/productData";
import { Briefcase } from "lucide-react";

interface NavigationItemsProps {
  className?: string;
}

const NavigationItems = ({ className = "" }: NavigationItemsProps) => {
  // Create subcategories navigation items for the Catalogue section
  const catalogueSubItems = productCategories.map(category => ({
    title: category.title,
    link: `/products/${category.id}`
  }));

  const navItems = [
    {
      title: "Catalogue",
      link: "/products",
      children: catalogueSubItems
    },
    {
      title: "Services",
      link: "/services",
      children: [
        { title: "Design personnalisé", link: "/custom-design" },
        { title: "Support technique", link: "/support" },
      ],
    },
    {
      title: "Pro",
      link: "/pro",
      icon: Briefcase,
    },
  ];

  return (
    <div className={`hidden lg:flex items-center space-x-1 ${className}`}>
      {navItems.map((item) => (
        <NavigationItem key={item.title} item={item} />
      ))}
    </div>
  );
};

export default NavigationItems;
