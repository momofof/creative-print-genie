
import React from "react";

interface ProfileHeaderProps {
  firstName: string | null;
}

const ProfileHeader = ({ firstName }: ProfileHeaderProps) => {
  return (
    <section className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Bonjour {firstName || ""}!</h1>
      <p className="text-gray-600">
        Consultez vos commandes ou modifiez vos informations personnelles. Des questions? Notre service client est là pour vous aider.
        <br />
        Nous sommes heureux de vous aider!
      </p>
    </section>
  );
};

export default ProfileHeader;
