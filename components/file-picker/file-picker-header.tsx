"use client";

import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Loader2 } from 'lucide-react';

interface FilePickerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCount: number;
  onIndexSelected: () => void;
  onDeIndexSelected: () => void;
  isIndexing: boolean;
  isDeIndexing: boolean;
}

export function FilePickerHeader({
  searchQuery,
  setSearchQuery,
  selectedCount,
  onIndexSelected,
  onDeIndexSelected,
  isIndexing,
  isDeIndexing,
}: FilePickerHeaderProps) {
  return (
    <header className="border-b border-border p-4 flex items-center justify-between bg-card">
      <div className="flex items-center flex-1 gap-4">
        <h1 className="text-xl font-semibold hidden md:block">Google Drive</h1>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <>
            <Button 
              size="sm" 
              onClick={onIndexSelected}
              className="hidden sm:inline-flex"
              disabled={isIndexing}
            >
              {isIndexing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Index Selected (${selectedCount})`
              )}
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onDeIndexSelected}
              className="hidden sm:inline-flex"
              disabled={isDeIndexing}
            >
              {isDeIndexing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'De-index Selected'
              )}
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}