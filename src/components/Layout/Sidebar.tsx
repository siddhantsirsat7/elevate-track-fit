
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Dumbbell,
  Target,
  History,
  BarChart2,
  Settings,
  User
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/workouts", icon: Dumbbell, label: "Workouts" },
    { to: "/goals", icon: Target, label: "Goals" },
    { to: "/history", icon: History, label: "History" },
    { to: "/progress", icon: BarChart2, label: "Progress" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/settings", icon: Settings, label: "Settings" }
  ];

  return (
    <div className="w-64 h-screen bg-sidebar fixed left-0 top-0 pt-16 hidden md:block">
      <div className="p-4">
        <div className="space-y-1 mt-4">
          {links.map(link => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              isActive={
                link.to === "/" 
                  ? currentPath === "/" 
                  : currentPath.startsWith(link.to)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
