import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import authService from '../services/authService';
import { ChevronDown, LogOut, LayoutDashboard, X, Heart, AlignJustify, Palette, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import logo from './logo.JPG'

const Logo = () => (
  <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
   <img src={logo} alt="logo" style={{ width: "160px", height: "60px" }} className="rounded-lg flex items-center justify-center flex-shrink-0" />
  </Link>
);

const AvatarDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.avatar-dropdown')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') toggleDropdown(); };
  const handleLogout = () => { setIsOpen(false); onLogout(); };
  const handleDashboard = () => {
    setIsOpen(false);
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'subadmin') navigate('/subadmin');
    else navigate('/dashboard');
  };
  
  const getInitials = (email) => email ? email.charAt(0).toUpperCase() : "U";

  return (
    <div className="avatar-dropdown relative">
      <button
        className="flex items-center space-x-2 p-2 rounded-xl hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base">
          {getInitials(user?.email)}
        </div>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-48 shadow-lg border z-[100] bg-card">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
          </div>
          <div className="py-1">
            <button
              onClick={handleDashboard}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

const FloatingHamburger = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open menu"
      className="
        fixed top-2 right-4 z-[9999]
        hidden lg:hidden
        h-12 w-12
        rounded-xl
        bg-primary
        text-primary-foreground
        shadow-lg
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-ring
      "
    >
      <AlignJustify className="w-8 h-8" />
    </button>
  );
};

const FloatingClose = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Close menu"
      className="
        fixed top-2 right-4 z-[9999]
        hidden lg:hidden
        h-12 w-12
        rounded-xl
        bg-primary
        text-primary-foreground
        shadow-lg
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-ring
      "
    >
      <X className="w-8 h-8" />
    </button>
  );
};

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-switcher')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="theme-switcher relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex gap-1 items-center justify-center p-2 rounded-xl border border-border bg-card text-foreground hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Toggle theme"
      >   
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-48 shadow-lg border z-[100] bg-card p-2 overflow-hidden">
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">SELECT THEME</div>
          <div className="grid grid-cols-1 gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === t.id 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border border-black/10" 
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.name}</span>
                </div>
                {theme === t.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navLinks = [
    { name: "Home", path: "/" },
    // { name: "About", path: "/about", submenu: [{ name: "Our Story", path: "/about" }, { name: "Our Mission", path: "/mission" }, { name: "Our Vision", path: "/vision" }] },
    { name: "Campaigns", path: "/campaigns" },
    { name: "Programs", path: "/programs" },
    { name: "Tenders", path: "/tenders" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "ERF", path: "/sn-arya-mitra" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  useEffect(() => { setIsMenuOpen(false); setActiveSubmenu(null); }, [location.pathname]);
  useEffect(() => { document.body.style.overflow = isMenuOpen ? 'hidden' : ''; }, [isMenuOpen]);

  const toggleSubmenu = (name) => setActiveSubmenu(activeSubmenu === name ? null : name);
  const handleLogout = async () => { await authService.logout(); logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;
  const isSubmenuActive = (items) => items.some(item => isActive(item.path));

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="w-full px-6">
        <div className="flex items-center justify-between  h-16 sm:h-20">
          <Logo />

          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => (
              link.submenu ? (
                <div key={link.name} className="relative group">
                  <button
                    className={`flex items-center space-x-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                      isSubmenuActive(link.submenu) 
                        ? 'text-primary font-semibold' 
                        : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => toggleSubmenu(link.name)}
                    aria-expanded={activeSubmenu === link.name}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  {activeSubmenu === link.name && (
                    <Card className="absolute top-full left-0 mt-2 w-48 shadow-lg border z-[100]">
                      <div className="py-2">
                        {link.submenu.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActive(sub.path) 
                                ? 'text-primary font-semibold bg-accent' 
                                : 'text-foreground hover:bg-accent'
                            }`}
                            onClick={() => setActiveSubmenu(null)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    isActive(link.path) 
                      ? 'text-primary font-semibold' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={() => setActiveSubmenu(null)}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center space-x-3 relative">
            <ThemeSwitcher />
            {currentUser ? (
              <AvatarDropdown user={currentUser} onLogout={handleLogout} />
            ) : (
              <>
                <Button asChild variant="ghost" className="hidden lg:inline-flex">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="hidden lg:inline-flex">
                  <Link to="/donate">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[50] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full bg-background z-[60] flex flex-col lg:hidden border-r border-border">
            <div className="flex items-center justify-between h-16 border-b border-border px-6">
              <Logo />
              <div className="flex items-center space-x-2">
                <ThemeSwitcher />
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
              {navLinks.map(link => (
                link.submenu ? (
                  <div key={link.name} className="space-y-1">
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-colors ${
                        isSubmenuActive(link.submenu) 
                          ? 'text-primary font-semibold bg-accent' 
                          : 'text-foreground hover:bg-accent'
                      }`}
                      onClick={() => toggleSubmenu(link.name)}
                      aria-expanded={activeSubmenu === link.name}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${activeSubmenu === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    {activeSubmenu === link.name && (
                      <div className="ml-4 space-y-1">
                        {link.submenu.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className={`block px-4 py-2 rounded-lg transition-colors ${
                              isActive(sub.path) 
                                ? 'text-primary font-semibold bg-accent' 
                                : 'text-foreground hover:bg-accent'
                            }`}
                            onClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'text-primary font-semibold bg-accent' 
                        : 'text-foreground hover:bg-accent'
                    }`}
                    onClick={() => { setIsMenuOpen(false); setActiveSubmenu(null); }}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>

            {!currentUser && (
              <div className="p-6 border-t border-border space-y-3">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/donate">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate
                  </Link>
                </Button>
              </div>
            )}

            {currentUser && (
              <div className="p-6 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}


      {!isMenuOpen && (
        <FloatingHamburger onClick={() => setIsMenuOpen(true)} />
      )}

      {isMenuOpen && (
        <FloatingClose onClick={() => setIsMenuOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
