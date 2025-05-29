'use client';

import { File, Folder, FileItem } from '@/types/file-explorer';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  FileText,
  FolderIcon,
  Trash2,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface FileListProps {
  items: FileItem[];
  onNavigate: (path: string) => void;
  indexedItems: Record<string, boolean>;
  onIndexItem: (id: string) => Promise<void>;
  onDeIndexItem: (id: string) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  selectedItems: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  sortBy: 'name' | 'date';
  sortDirection: 'asc' | 'desc';
  loadingItems: Record<string, boolean>;
}

export default function FileList({
  items,
  onNavigate,
  indexedItems,
  onIndexItem,
  onDeIndexItem,
  onRemoveItem,
  selectedItems,
  onSelectItem,
  sortBy,
  sortDirection,
  loadingItems,
}: FileListProps) {
  const sortedItems = [...items].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }

    if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      return sortDirection === 'asc'
        ? new Date(a.modifiedTime).getTime() -
            new Date(b.modifiedTime).getTime()
        : new Date(b.modifiedTime).getTime() -
            new Date(a.modifiedTime).getTime();
    }
  });

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="min-w-[640px]">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="w-12 p-2 text-left"></th>
              <th className="w-12 p-2 text-left"></th>
              <th className="p-2 text-left font-medium">Name</th>
              <th className="p-2 text-left font-medium hidden sm:table-cell">
                Modified
              </th>
              <th className="w-24 p-2 text-left font-medium hidden sm:table-cell">
                Status
              </th>
              <th className="w-16 p-2 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const isIndexed = indexedItems[item.id];
              const isFolder = item.type === 'folder';
              const isLoading = loadingItems[item.id];

              return (
                <tr
                  key={item.id}
                  className={cn(
                    'hover:bg-muted/50 transition-colors',
                    isSelected && 'bg-primary/10'
                  )}
                >
                  <td className="p-2">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onSelectItem(item.id, checked === true)
                      }
                    />
                  </td>
                  <td className="p-2">
                    {isFolder ? (
                      <FolderIcon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-gray-500" />
                    )}
                  </td>
                  <td className="p-2">
                    {isFolder ? (
                      <button
                        onClick={() => onNavigate(item.path)}
                        className="hover:underline text-left font-medium"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </td>
                  <td className="p-2 text-sm text-muted-foreground hidden sm:table-cell">
                    {formatDistanceToNow(
                      new Date(item.modifiedTime),
                      {
                        addSuffix: true,
                      }
                    )}
                  </td>
                  <td className="p-2 hidden sm:table-cell">
                    {isLoading ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Processing
                      </Badge>
                    ) : isIndexed ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      >
                        Indexed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                      >
                        Not Indexed
                      </Badge>
                    )}
                  </td>
                  <td className="p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isIndexed ? (
                          <DropdownMenuItem
                            onClick={() => onDeIndexItem(item.id)}
                            disabled={isLoading}
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            De-index
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => onIndexItem(item.id)}
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Index
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
