'use client';

import {
  LucideFolder,
  LucideHome,
  FileText,
  Boxes,
  Globe2,
  MessageSquare,
  Database,
  Share2,
  Slack,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const integrations = [
  { name: 'Google Drive', icon: LucideHome, path: '/', active: true },
  { name: 'Files', icon: FileText, path: '/files', active: false },
  {
    name: 'Websites',
    icon: Globe2,
    path: '/websites',
    active: false,
  },
  { name: 'Text', icon: MessageSquare, path: '/text', active: false },
  {
    name: 'Confluence',
    icon: Database,
    path: '/confluence',
    active: false,
  },
  { name: 'Notion', icon: Boxes, path: '/notion', active: false },
  {
    name: 'OneDrive',
    icon: Share2,
    path: '/onedrive',
    active: false,
  },
  {
    name: 'SharePoint',
    icon: Share2,
    path: '/sharepoint',
    active: false,
  },
  { name: 'Slack', icon: Slack, path: '/slack', active: false },
];

export default function Sidebar({
  currentPath,
  onNavigate,
}: SidebarProps) {
  const SidebarContent = () => (
    <div className="space-y-1">
      {integrations.map((integration) => (
        <button
          key={integration.path}
          onClick={() =>
            integration.active && onNavigate(integration.path)
          }
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-left',
            integration.path === currentPath && integration.active
              ? 'bg-primary/10 text-primary'
              : integration.active
              ? 'hover:bg-accent'
              : 'opacity-50 cursor-not-allowed'
          )}
        >
          <integration.icon size={18} />
          {integration.name}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Integrations</h2>
            </div>
            <div className="p-2">
              <SidebarContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-border bg-card h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Integrations</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
