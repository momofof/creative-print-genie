
import NavigationSearch from "./NavigationSearch";
import NavigationCart from "./NavigationCart";
import NavigationLoginItems from "./NavigationLoginItems";
import NavigationUserAvatar from "./NavigationUserAvatar";
import NavigationActions from "./NavigationActions";
import NavigationItems from "./NavigationItems";

interface NavigationDesktopProps {
  isLoggedIn: boolean;
  isSupplier: boolean;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  hideAuth: boolean;
}

const NavigationDesktop = ({
  isLoggedIn,
  isSupplier,
  showSearch,
  setShowSearch,
  hideAuth
}: NavigationDesktopProps) => {
  
  return (
    <>
      <NavigationItems />
      
      <div className="hidden lg:flex items-center space-x-3">
        <NavigationSearch 
          onClick={() => setShowSearch(!showSearch)} 
          className="p-2.5"
        />
        <NavigationCart className="p-2.5" />
        {!isLoggedIn && <NavigationLoginItems isLoggedIn={isLoggedIn} hideAuth={hideAuth} className="p-2.5" />}
        {isLoggedIn && <NavigationUserAvatar isSupplier={isSupplier} />}
        {!isLoggedIn && <NavigationActions hideAuth={hideAuth} />}
      </div>
    </>
  );
};

export default NavigationDesktop;
