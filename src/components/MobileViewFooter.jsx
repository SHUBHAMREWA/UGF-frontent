import React, { useState, useEffect } from 'react';
import "./MobileViewFooter.css";
import { IoHome } from "react-icons/io5";
import { TbGift } from "react-icons/tb";
import { FaHandHoldingHeart } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import authService from '../services/authService';
import { ChevronDown, LogOut, X, Heart } from 'lucide-react';
import { Button } from './ui/button';

// Logo Component (Sourced from Navbar)
const Logo = () => (
    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground fill-primary-foreground" />
        </div>
        <span className="text-base sm:text-lg font-semibold text-foreground hidden sm:block">
            United Global Federation India
        </span>
        <span className="text-sm font-semibold text-foreground sm:hidden">
            UGF
        </span>
    </Link>
);

const MobileViewFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    
    // Menu States (Same as Navbar)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    let cureentLoc = location?.pathname?.slice(1) || '';

    // Navigation Links (Same as Navbar)
    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Campaigns", path: "/campaigns" },
        { name: "Programs", path: "/programs" },
        { name: "Tenders", path: "/tenders" },
        { name: "Events", path: "/events" },
        { name: "Gallery", path: "/gallery" },
        { name: "ERF", path: "/sn-arya-mitra" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" }
    ];

    useEffect(() => { 
        setIsMenuOpen(false); 
        setActiveSubmenu(null); 
    }, [location.pathname]);

    useEffect(() => { 
        document.body.style.overflow = isMenuOpen ? 'hidden' : ''; 
    }, [isMenuOpen]);

    const toggleSubmenu = (name) => setActiveSubmenu(activeSubmenu === name ? null : name);
    
    const handleLogout = async () => { 
        await authService.logout(); 
        logout(); 
        navigate('/'); 
    };

    const isActive = (path) => location.pathname === path;
    const isSubmenuActive = (items) => items.some(item => isActive(item.path));

    return (
        <>
            <div className={`max-w-full z-40 left-0 mobile-view-footer`}>
                <div className={`flex justify-between px-4 relative items-center py-2 `}>
                    <button
                        onClick={() => navigate("/donate")}
                        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[70%]
                          text-primary-foreground px-3 py-2 rounded-full border-background border-2  bg-primary
                          flex flex-col items-center justify-center `}>
                        <span className={`text-[12px]`}>donate</span>
                        <FaHandHoldingHeart className='text-2xl' />
                    </button>
                    
                    <Link
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${cureentLoc == "" ? 'text-primary' : "text-muted-foreground"}`}
                        to="/">
                        <IoHome className={`text-2xl`} />
                        <span className="text-[10px] sm:text-xs">Home</span>
                    </Link>
                    
                    <Link
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${cureentLoc == "campaigns" ? 'text-primary' : "text-muted-foreground"}`}
                        to="/campaigns">
                        <TbGift className={`text-2xl`} />
                        <span className="text-[10px] sm:text-xs">Campaigns</span>
                    </Link>
                    
                    <Link
                        to="/sn-arya-mitra"
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${cureentLoc == "sn-arya-mitra" ? 'text-primary' : "text-muted-foreground"}`}
                    >
                        <IoIosPeople className={`text-3xl`} />
                        <span className="text-[10px] sm:text-xs">ERF</span>
                    </Link>
                    
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${isMenuOpen ? 'text-primary' : "text-muted-foreground"}`}>
                        <HiOutlineMenuAlt3 className={`text-2xl`} />
                        <span className="text-[10px] sm:text-xs">Menu</span>
                    </button>
                </div>
            </div>

            {/* Same Side Menu Logic as Navbar */}
            {isMenuOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[50] lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-full bg-background z-[60] flex flex-col lg:hidden border-r border-border">
                        <div className="flex items-center justify-between h-16 border-b border-border px-6">
                            <Logo />
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="h-10 w-10 rounded-lg flex items-center justify-center text-foreground hover:bg-accent"
                            >
                                <X className="w-6 h-6" />
                            </button>
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
        </>
    )
}

export default MobileViewFooter
