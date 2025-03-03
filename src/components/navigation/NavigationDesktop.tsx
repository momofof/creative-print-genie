
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
      
      <div className="hidden lg:flex items-center gap-4">
        <NavigationSearch onClick={() => setShowSearch(!showSearch)} />
        <NavigationCart />
        {!isLoggedIn && <NavigationLoginItems isLoggedIn={isLoggedIn} hideAuth={hideAuth} />}
        {isLoggedIn && <NavigationUserAvatar isSupplier={isSupplier} />}
        {!isLoggedIn && <NavigationActions hideAuth={hideAuth} />}
      </div>
    </>
  );
};

export default NavigationDesktop;
