'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as api from '@/lib/api/google-drive';
import { useToast } from '@/hooks/use-toast';
import { File, Folder } from '@/types/file-explorer';
import { Resource } from '@/types/google-drive';

export function useFileExplorer() {
  const [currentPath, setCurrentPath] = useState('/');
  const [currentResourceId, setCurrentResourceId] = useState<
    string | null
  >(null);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    'asc'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch resources
  const {
    data: resources = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['resources', currentResourceId],
    queryFn: () =>
      currentResourceId
        ? api.getFolderContents(currentResourceId)
        : api.getRootResources(),
  });

  // Index mutations with optimistic updates
  const indexMutation = useMutation({
    mutationFn: api.indexResource,
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['resources'] });
      const previousResources = queryClient.getQueryData([
        'resources',
      ]);

      queryClient.setQueryData(
        ['resources'],
        (old: Resource[] = []) =>
          old.map((r) =>
            r.resource_id === resourceId
              ? { ...r, status: 'indexing' }
              : r
          )
      );

      return { previousResources };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource indexed successfully',
      });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ['resources'],
        context?.previousResources
      );
      toast({
        title: 'Error',
        description: 'Failed to index resource',
        variant: 'destructive',
      });
    },
  });

  const deIndexMutation = useMutation({
    mutationFn: api.deIndexResource,
    onMutate: async (resourceId) => {
      await queryClient.cancelQueries({ queryKey: ['resources'] });
      const previousResources = queryClient.getQueryData([
        'resources',
      ]);

      queryClient.setQueryData(
        ['resources'],
        (old: Resource[] = []) =>
          old.map((r) =>
            r.resource_id === resourceId
              ? { ...r, status: 'deindexing' }
              : r
          )
      );

      return { previousResources };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource de-indexed successfully',
      });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(
        ['resources'],
        context?.previousResources
      );
      toast({
        title: 'Error',
        description: 'Failed to de-index resource',
        variant: 'destructive',
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: api.removeResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Success',
        description: 'Resource removed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove resource',
        variant: 'destructive',
      });
    },
  });

  // Transform and filter resources based on search
  const { folders, files, indexedItems } = useMemo(() => {
    const filteredResources = resources.filter((r: Resource) =>
      r.inode_path.path
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    return {
      folders: filteredResources
        .filter((r: Resource) => r.inode_type === 'directory')
        .map((r: Resource) => ({
          id: r.resource_id,
          name: r.inode_path.path.split('/').pop() || '',
          path: r.inode_path.path,
          modifiedTime: r.modified_at,
        })),

      files: filteredResources
        .filter((r: Resource) => r.inode_type === 'file')
        .map((r: Resource) => ({
          id: r.resource_id,
          name: r.inode_path.path.split('/').pop() || '',
          path: r.inode_path.path,
          modifiedTime: r.modified_at,
          mimeType: 'application/octet-stream',
        })),

      indexedItems: filteredResources.reduce(
        (acc: Record<string, boolean>, r: Resource) => {
          acc[r.resource_id] = r.status === 'indexed';
          return acc;
        },
        {}
      ),
    };
  }, [resources, searchQuery]);

  // Navigation
  const navigateToPath = useCallback(
    (path: string) => {
      setCurrentPath(path);
      const resource = resources.find(
        (r: Resource) => r.inode_path.path === path
      );
      setCurrentResourceId(resource?.resource_id || null);
    },
    [resources]
  );

  // Generate breadcrumbs
  const breadcrumbs = useMemo(
    () =>
      currentPath
        .split('/')
        .filter(Boolean)
        .map((segment, index, array) => {
          const path = '/' + array.slice(0, index + 1).join('/');
          return { name: segment, path };
        }),
    [currentPath]
  );

  return {
    currentPath,
    navigateToPath,
    isLoading,
    error,
    files,
    folders,
    indexedItems,
    indexItem: indexMutation.mutateAsync,
    deIndexItem: deIndexMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    searchQuery,
    setSearchQuery,
    breadcrumbs,
    isIndexing: indexMutation.isPending,
    isDeIndexing: deIndexMutation.isPending,
  };
}
