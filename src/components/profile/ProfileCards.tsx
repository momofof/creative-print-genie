
import React from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProfileCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <Card className="bg-gray-50 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mes Commandes</h2>
            <ChevronRight className="text-gray-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Mon Compte</h2>
            <ChevronRight className="text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCards;
