
import { useState } from "react";

export const useNavigationAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSupplier, setIsSupplier] = useState(false);

  return { isLoggedIn, isSupplier };
};
