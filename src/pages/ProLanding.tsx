
import React from "react";
import Navigation from "@/components/Navigation";
import ProLandingHeader from "@/components/pro/ProLandingHeader";
import ProLandingActions from "@/components/pro/ProLandingActions";
import { useAuthStatus } from "@/hooks/useAuthStatus";

const ProLanding = () => {
  const { isLoggedIn } = useAuthStatus();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <ProLandingHeader />
        <ProLandingActions isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
};

export default ProLanding;
