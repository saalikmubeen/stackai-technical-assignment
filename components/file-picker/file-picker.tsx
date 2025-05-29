'use client';

import { useState } from 'react';
import { useFileExplorer } from '@/hooks/use-file-explorer';
import Sidebar from './sidebar';
import FileExplorer from './file-explorer';
import { FilePickerHeader } from './file-picker-header';
import { useToast } from '@/hooks/use-toast';

export default function FilePicker() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isIndexingBulk, setIsIndexingBulk] = useState(false);
  const [isDeIndexingBulk, setIsDeIndexingBulk] = useState(false);
  const { toast } = useToast();

  const {
    currentPath,
    navigateToPath,
    isLoading,
    error,
    files,
    folders,
    indexedItems,
    indexItem,
    deIndexItem,
    removeItem,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    breadcrumbs,
    isIndexing,
    isDeIndexing,
  } = useFileExplorer();

  const handleSelectItems = (itemIds: string[]) => {
    setSelectedItems(itemIds);
  };

  const handleIndexSelected = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to index',
        variant: 'destructive',
      });
      return;
    }

    setIsIndexingBulk(true);
    try {
      await Promise.all(selectedItems.map((id) => indexItem(id)));
      toast({
        title: 'Success',
        description: `${selectedItems.length} item(s) indexed successfully`,
      });
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to index selected items',
        variant: 'destructive',
      });
    } finally {
      setIsIndexingBulk(false);
    }
  };

  const handleDeIndexSelected = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select at least one item to de-index',
        variant: 'destructive',
      });
      return;
    }

    setIsDeIndexingBulk(true);
    try {
      await Promise.all(selectedItems.map((id) => deIndexItem(id)));
      toast({
        title: 'Success',
        description: `${selectedItems.length} item(s) de-indexed successfully`,
      });
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to de-index selected items',
        variant: 'destructive',
      });
    } finally {
      setIsDeIndexingBulk(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <FilePickerHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCount={selectedItems.length}
        onIndexSelected={handleIndexSelected}
        onDeIndexSelected={handleDeIndexSelected}
        isIndexing={isIndexingBulk}
        isDeIndexing={isDeIndexingBulk}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPath={currentPath}
          onNavigate={navigateToPath}
        />
        <FileExplorer
          currentPath={currentPath}
          navigateToPath={navigateToPath}
          isLoading={isLoading}
          error={error}
          files={files}
          folders={folders}
          indexedItems={indexedItems}
          onRemoveItem={removeItem}
          onIndexItem={indexItem}
          onDeIndexItem={deIndexItem}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          selectedItems={selectedItems}
          onSelectItems={handleSelectItems}
          breadcrumbs={breadcrumbs}
        />
      </div>
    </div>
  );
}
