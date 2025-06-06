'use client';

import { useState } from 'react';
import { Folder, File, FileItem } from '@/types/file-explorer';
import FileList from './file-list';
import { Breadcrumbs } from './breadcrumbs';
import FileExplorerHeader from './file-explorer-header';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

interface FileExplorerProps {
  currentPath: string;
  navigateToPath: (path: string) => void;
  isLoading: boolean;
  error: Error | null;
  files: File[];
  folders: Folder[];
  indexedItems: Record<string, boolean>;
  onRemoveItem: (args: {
    knowledgeBaseId: string;
    resourcePath: string;
  }) => Promise<void>;
  onIndexItem: (id: string) => Promise<void>;
  onDeIndexItem: (args: {
    knowledgeBaseId: string;
    resourcePath: string;
    resourceId: string;
  }) => Promise<void>;
  sortBy: 'name' | 'date';
  setSortBy: (value: 'name' | 'date') => void;
  sortDirection: 'asc' | 'desc';
  setSortDirection: (value: 'asc' | 'desc') => void;
  selectedItems: FileItem[];
  onSelectItems: (items: FileItem[]) => void;
  breadcrumbs: { name: string; path: string }[];
}

export default function FileExplorer({
  currentPath,
  navigateToPath,
  isLoading,
  error,
  files,
  folders,
  indexedItems,
  onRemoveItem,
  onIndexItem,
  onDeIndexItem,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
  selectedItems,
  onSelectItems,
  breadcrumbs,
}: FileExplorerProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [loadingItems, setLoadingItems] = useState<
    Record<string, boolean>
  >({});

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allItems = [
        ...files.map((file) => ({ ...file, type: 'file' as const })),
        ...folders.map((folder) => ({
          ...folder,
          type: 'folder' as const,
        })),
      ];
      onSelectItems(allItems);
    } else {
      onSelectItems([]);
    }
  };

  const handleSelectItem = (item: FileItem, checked: boolean) => {
    if (checked) {
      onSelectItems([...selectedItems, item]);
    } else {
      onSelectItems(
        selectedItems.filter(
          (selectedItem) => selectedItem.id !== item.id
        )
      );
    }
  };

  const handleIndexItem = async (id: string) => {
    setLoadingItems((prev) => ({ ...prev, [id]: true }));
    try {
      await onIndexItem(id);
    } finally {
      setLoadingItems((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeIndexItem = async (item: FileItem) => {
    setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
    try {
      await onDeIndexItem({
        knowledgeBaseId: item.knowledge_base_id,
        resourcePath: item.path,
        resourceId: item.id,
      });
    } finally {
      setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const allItems: FileItem[] = [
    ...folders.map((folder) => ({
      ...folder,
      type: 'folder' as const,
    })),
    ...files.map((file) => ({ ...file, type: 'file' as const })),
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Card className="flex-1 border-0 rounded-none flex flex-col h-full">
        <Breadcrumbs
          items={breadcrumbs}
          onNavigate={navigateToPath}
        />

        <FileExplorerHeader
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          onSelectAll={handleSelectAll}
          selectAll={selectAll}
          itemCount={allItems.length}
        />

        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load files: {error.message}
            </AlertDescription>
          </Alert>
        ) : allItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            This folder is empty
          </div>
        ) : (
          <FileList
            items={allItems}
            onNavigate={navigateToPath}
            indexedItems={indexedItems}
            onIndexItem={handleIndexItem}
            onDeIndexItem={handleDeIndexItem}
            selectedItems={selectedItems.map((item) => item.id)}
            onSelectItem={handleSelectItem}
            sortBy={sortBy}
            sortDirection={sortDirection}
            loadingItems={loadingItems}
          />
        )}
      </Card>
    </div>
  );
}
