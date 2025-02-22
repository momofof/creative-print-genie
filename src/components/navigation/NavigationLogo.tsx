
import { Link } from "react-router-dom";

const NavigationLogo = () => {
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="text-2xl font-semibold">
        PrintGenie
      </Link>
    </div>
  );
};

export default NavigationLogo;
