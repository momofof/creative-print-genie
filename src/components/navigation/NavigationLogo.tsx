
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NavigationLogo = () => {
  const navigate = useNavigate();

  return <div className="flex items-center gap-1 sm:gap-3">
      <Link to="/" className="text-2xl font-semibold">
        PrintGenie
      </Link>
    </div>;
};

export default NavigationLogo;
