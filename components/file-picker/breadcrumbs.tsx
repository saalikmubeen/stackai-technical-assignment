"use client";

import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { name: string; path: string }[];
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center p-4 overflow-x-auto" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 flex-nowrap">
        <li>
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center text-primary hover:text-primary/90"
          >
            <Home className="h-4 w-4" />
          </button>
        </li>
        
        {items.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" aria-hidden="true" />
            {index === items.length - 1 ? (
              <span className="font-medium">{item.name}</span>
            ) : (
              <button
                onClick={() => onNavigate(item.path)}
                className="hover:text-primary hover:underline"
              >
                {item.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}