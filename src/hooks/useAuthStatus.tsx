
import { useState } from "react";

export const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return { isLoggedIn };
};
