import axios, { AxiosError, AxiosInstance } from 'axios';
import { STACK_AI_BACKEND_URL, SUPABASE } from '@/lib/constants';
import {
  AuthRequestBody,
  AuthResponse,
  Resource,
} from '@/types/google-drive';

export const GoogleDriveSession = axios.create();

// Authentication
export async function getAuthHeaders(): Promise<{
  Authorization: string;
}> {
  const authApi: AxiosInstance = axios.create({
    baseURL: SUPABASE.AUTH_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Apikey: SUPABASE.ANON_KEY,
    },
  });

  try {
    const { data } = await authApi.post<AuthResponse>(
      '/auth/v1/token?grant_type=password',
      {
        email: SUPABASE.EMAIL_ADDRESS,
        password: SUPABASE.PASSWORD,
        gotrue_meta_security: {},
      } as AuthRequestBody
    );

    console.log('Authentication successful:', data.access_token);

    return {
      Authorization: `Bearer ${data.access_token}`,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Authentication failed (${error.response?.status}): ${
          typeof error.response?.data === 'string'
            ? error.response.data
            : JSON.stringify(error.response?.data)
        }`
      );
    }
    throw new Error('Authentication failed with unknown error');
  }
}

// Initialize session with auth headers
(async () => {
  const authHeaders = await getAuthHeaders();
  GoogleDriveSession.defaults.headers.common = {
    ...GoogleDriveSession.defaults.headers.common,
    ...authHeaders,
  };
})();

// API Functions
export async function getConnection() {
  const connectionListUrl = `${STACK_AI_BACKEND_URL}/connections?connection_provider=gdrive`;

  try {
    const response = await GoogleDriveSession.get(connectionListUrl);
    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch connections: ${response.status}`
      );
    }
    return response.data[1];
  } catch (error) {
    console.error('Error fetching connection:', error);
    throw error;
  }
}

export async function getConnectionUrls() {
  const response = await getConnection();
  const connection_id = response.connection_id;

  return {
    connectionResourcesUrl: `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources`,
    childrenResourcesUrl: `${STACK_AI_BACKEND_URL}/connections/${connection_id}/resources/children`,
  };
}

export async function getRootResources(): Promise<Resource[]> {
  const { childrenResourcesUrl } = await getConnectionUrls();

  try {
    const response = await GoogleDriveSession.get(
      childrenResourcesUrl
    );
    const resources = response.data.data || response.data;
    return resources;
  } catch (error) {
    console.error('Error fetching root resources:', error);
    throw error;
  }
}

export async function getFolderContents(
  resourceId: string
): Promise<Resource[]> {
  const { childrenResourcesUrl } = await getConnectionUrls();
  const params = new URLSearchParams({ resource_id: resourceId });

  try {
    const response = await GoogleDriveSession.get(
      `${childrenResourcesUrl}?${params}`
    );
    const resources = response.data.data || response.data;
    return resources;
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    throw error;
  }
}

export async function indexResource(resourceId: string) {
  console.log('Indexing resource:', resourceId);
  try {
    // Create a new knowledge base for the resource
    const { connectionResourcesUrl } = await getConnectionUrls();
    const connection = await getConnection();

    const createKbResponse = await GoogleDriveSession.post(
      `${STACK_AI_BACKEND_URL}/knowledge_bases`,
      {
        connection_id: connection.connection_id,
        connection_source_ids: [resourceId],
        name: `Knowledge Base for ${resourceId}`,
        description: 'Created via File Picker',
        indexing_params: {
          ocr: false,
          unstructured: true,
          embedding_params: {
            embedding_model: 'text-embedding-ada-002',
            api_key: null,
          },
          chunker_params: {
            chunk_size: 1500,
            chunk_overlap: 500,
            chunker: 'sentence',
          },
        },
        org_level_role: null,
        cron_job_id: null,
      }
    );

    const knowledgeBaseId = createKbResponse.data.knowledge_base_id;

    // Get org ID for sync
    const orgResponse = await GoogleDriveSession.get(
      `${STACK_AI_BACKEND_URL}/organizations/me/current`
    );
    const orgId = orgResponse.data.org_id;

    // Trigger sync to start indexing
    const res = await GoogleDriveSession.get(
      `${STACK_AI_BACKEND_URL}/knowledge_bases/sync/trigger/${knowledgeBaseId}/${orgId}`
    );
    console.log('Sync triggered:', res.data);

    console.log('✅ Sync triggered to index resource:', resourceId);
    console.log(createKbResponse.data);
    return createKbResponse.data;
  } catch (error) {
    console.error('Error indexing resource:', error);
    throw error;
  }
}

export async function deIndexResource(resourceId: string) {
  try {
    // Get the resource to access its knowledge base ID and path
    const { connectionResourcesUrl } = await getConnectionUrls();
    const resourceResponse = await GoogleDriveSession.get(
      `${connectionResourcesUrl}?${new URLSearchParams({
        resource_id: resourceId,
      })}`
    );

    const resource = resourceResponse.data;
    const knowledgeBaseId = resource.knowledge_base_id;
    const resourcePath = resource.inode_path.path;

    if (
      !knowledgeBaseId ||
      knowledgeBaseId === '00000000-0000-0000-0000-000000000000'
    ) {
      throw new Error(
        '❌ Resource is not indexed or has no valid knowledge base.'
      );
    }

    // Remove from knowledge base
    await GoogleDriveSession.delete(
      `${STACK_AI_BACKEND_URL}/knowledge_bases/${knowledgeBaseId}/resources?${new URLSearchParams(
        { resource_path: resourcePath }
      )}`
    );
  } catch (error) {
    console.error('Error de-indexing resource:', error);
    throw error;
  }
}

export async function removeResource(resourceId: string) {
  await deIndexResource(resourceId);
}
