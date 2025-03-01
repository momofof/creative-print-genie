
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileCards from "@/components/profile/ProfileCards";
import SupportSection from "@/components/profile/SupportSection";
import ProfileFooter from "@/components/profile/ProfileFooter";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { useProfileData } from "@/hooks/useProfileData";

const Profile = () => {
  const { isLoading, profile, handleSignOut } = useProfileData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <ProfileHeader firstName={profile?.first_name} />
        <ProfileCards />
        <SupportSection />
        
        <div className="mt-12">
          <Button variant="destructive" onClick={handleSignOut}>
            Se déconnecter
          </Button>
        </div>
        
        <Separator className="my-16" />
        
        <ProfileFooter />
      </main>
    </div>
  );
};

export default Profile;
