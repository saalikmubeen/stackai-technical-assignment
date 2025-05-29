export interface Folder {
  id: string;
  name: string;
  path: string;
  modifiedTime: string;
}

export interface File {
  id: string;
  name: string;
  path: string;
  modifiedTime: string;
  mimeType?: string;
}

export type FileItem = (File | Folder) & { type: 'file' | 'folder' };