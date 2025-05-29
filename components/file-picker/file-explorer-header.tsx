"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownAZ, ArrowUpAZ, Calendar, ChevronDown } from 'lucide-react';

interface FileExplorerHeaderProps {
  sortBy: 'name' | 'date';
  setSortBy: (value: 'name' | 'date') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (value: 'asc' | 'desc') => void;
  onSelectAll: (checked: boolean) => void;
  selectAll: boolean;
  itemCount: number;
}

export default function FileExplorerHeader({
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  onSelectAll,
  selectAll,
  itemCount,
}: FileExplorerHeaderProps) {
  return (
    <div className="border-b border-border p-2 flex items-center gap-2">
      <Checkbox 
        checked={selectAll} 
        onCheckedChange={onSelectAll}
        disabled={itemCount === 0}
        aria-label="Select all items"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            Sort: {sortBy === 'name' ? 'Name' : 'Date'}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSortBy('name')}>
            <ArrowDownAZ className="mr-2 h-4 w-4" />
            Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortBy('date')}>
            <Calendar className="mr-2 h-4 w-4" />
            Date
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
      >
        {sortDirection === 'asc' ? (
          <ArrowUpAZ className="h-4 w-4" />
        ) : (
          <ArrowDownAZ className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}