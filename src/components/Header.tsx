import { Link } from "react-router-dom";
import { useAuth } from "../pages/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Calendar } from "lucide-react";

const Header = () => {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <header className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-white"
        >
          MiniLuma
        </Link>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-10 w-20 rounded"></div>
      </header>
    );
  }
  const { user, signInWithGoogle, logout } = auth;

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
        MiniLuma
      </Link>
      <nav className="flex items-center space-x-">
        {user ? (
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 dark:bg-blue-500 dark:hover:bg-blue-600">
                <Calendar className="w-4 h-4" />
                My Events
              </button>
            </Link>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={user.photoURL || "https://github.com/shadcn.png"}
                alt={user.displayName || "User"}
              />
              <AvatarFallback>
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={signInWithGoogle}
          >
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
