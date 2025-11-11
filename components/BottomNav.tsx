import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bot, BookOpenCheck, HeartPulse, CheckCircle2, UsersRound } from 'lucide-react';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const baseClasses = "flex flex-col items-center justify-center w-full h-full transition-colors duration-300";
  const inactiveClasses = "text-gray-400";
  const activeClasses = "text-lilac-light";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className="text-xs font-semibold mt-1">{label}</span>
    </NavLink>
  );
};

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg h-16 bg-white/70 dark:bg-dark-card/70 backdrop-blur-lg rounded-2xl shadow-lg flex justify-around items-center z-50">
      <NavItem
        to="/"
        label="Rilane"
        icon={<Bot size={24} />}
      />
      <NavItem
        to="/guias"
        label="Guias"
        icon={<BookOpenCheck size={24} />}
      />
      <NavItem
        to="/diario"
        label="Diário"
        icon={<HeartPulse size={24} />}
      />
      <NavItem
        to="/tarefas"
        label="Tarefas"
        icon={<CheckCircle2 size={24} />}
      />
      <NavItem
        to="/comunidade"
        label="Comunidade"
        icon={<UsersRound size={24} />}
      />
    </nav>
  );
};

export default BottomNav;
