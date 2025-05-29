// Types
export interface Resource {
  inode_type: 'directory' | 'file';
  inode_path: {
    path: string;
  };
  resource_id: string;
  status?: string;
  children?: Resource[];
  knowledge_base_id?: string;
  modified_at: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface AuthRequestBody {
  email: string;
  password: string;
  gotrue_meta_security: Record<string, never>;
}
