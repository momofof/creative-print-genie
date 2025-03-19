
import React from 'react';
import NewArrivalsSection from './NewArrivalsSection';
import PromotionalBanner from './PromotionalBanner';
import DesignServiceBanner from './DesignServiceBanner';
import RecentlyViewedSection from './RecentlyViewedSection';

interface ProductsPromotionalSectionsProps {
  categoryTitle: string;
}

const ProductsPromotionalSections = ({ categoryTitle }: ProductsPromotionalSectionsProps) => {
  return (
    <>
      <NewArrivalsSection categoryTitle={categoryTitle} />
      <PromotionalBanner />
      <DesignServiceBanner />
      <RecentlyViewedSection categoryTitle={categoryTitle} />
    </>
  );
};

export default ProductsPromotionalSections;
