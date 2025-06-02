'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from './icons/HomeIcon';
import BoxIcon from './icons/BoxIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import UsersIcon from './icons/UsersIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ImageIcon from './icons/ImageIcon';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Products', path: '/admin/products', icon: BoxIcon },
  { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingBagIcon },
  { name: 'Customers', path: '/admin/customers', icon: UsersIcon },
  { name: 'Analytics', path: '/admin/analytics', icon: ChartBarIcon },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-60 md:w-64 bg-slate-900 h-full flex flex-col shrink-0">
      {/* Logo/Brand */}
      <div className="p-4 md:p-6 border-b border-slate-700">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          3D Store Admin
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Management Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 md:p-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 md:p-6 border-t border-slate-700">
        <p className="text-slate-400 text-xs">
          © 2024 3D Model Store
        </p>
      </div>
    </div>
  );
};

export default Sidebar;