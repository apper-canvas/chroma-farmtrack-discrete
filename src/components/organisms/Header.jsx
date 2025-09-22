import React, { useContext } from "react";
import { useSelector } from "react-redux";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "../../App";

const Header = ({ setSidebarOpen }) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    await logout();
  };


  return (
    <header className="bg-white shadow-lg border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <ApperIcon name="Sprout" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                FarmTrack Pro
              </h1>
              <p className="text-xs text-gray-500">Agriculture Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {/* Mobile menu button */}
<div className="flex items-center space-x-4">
            {isAuthenticated && user && (
              <div className="hidden lg:flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <ApperIcon name="LogOut" className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
    </header>
  );
};

export default Header;