import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Applications', href: '/dashboard', active: false },
    { label: 'Analytics', href: '#', active: false },
    { label: 'Calendar', href: '#', active: false }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userMenuItems = [
    { label: 'Profile', href: '#', icon: 'User' },
    { label: 'Settings', href: '#', icon: 'Settings' },
    { label: 'Help & Support', href: '#', icon: 'HelpCircle' },
    { label: 'Sign Out', onClick: handleSignOut, icon: 'LogOut' }
  ];

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border shadow-tier-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Briefcase" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-text-primary leading-none">
                Job Tracker
              </h1>
              <span className="text-xs text-text-secondary font-mono">
                v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <a
              key={item?.label}
              href={item?.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover-elevate ${
                item?.active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              {item?.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">

          {/* Notifications */}
          <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150">
            <Icon name="Bell" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <Icon name="ChevronDown" size={16} />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-tier-2 animate-fade-in">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">{getUserDisplayName()}</p>
                  <p className="text-xs text-text-secondary">{getUserEmail()}</p>
                </div>
                <div className="py-2">
                  {userMenuItems?.map((item) => (
                    <a
                      key={item?.label}
                      href={item?.href}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-colors duration-150"
                      onClick={item?.onClick}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-muted rounded-lg transition-colors duration-150"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface animate-slide-up">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <a
                key={item?.label}
                href={item?.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  item?.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item?.label}
              </a>
            ))}
          </nav>
        </div>
      )}
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-[-1] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Overlay for user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;