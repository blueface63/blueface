export interface GoogleChatSpace {
  name: string; // e.g., 'spaces/AAA...'
  displayName?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE' | string;
  type?: string;
  singleUserBotDm?: boolean;
  threaded?: boolean;
  spaceDetails?: {
    description?: string;
    guidelines?: string;
  };
}

export interface GoogleChatMessage {
  name: string; // e.g., 'spaces/AAA.../messages/BBB...'
  text: string;
  createTime: string;
  sender?: {
    name?: string;
    displayName?: string;
    avatarUrl?: string;
    type?: 'HUMAN' | 'BOT' | string;
    email?: string;
  };
  formattedText?: string;
  cardsV2?: any[];
}

export interface GoogleChatMember {
  name: string;
  state?: string;
  role?: 'ROLE_MEMBER' | 'ROLE_MANAGER' | string;
  member?: {
    name?: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
}

const CHAT_BASE_URL = 'https://chat.googleapis.com/v1';

/**
 * Fetch all accessible Google Chat Spaces for the authenticated user
 */
export const fetchGoogleChatSpaces = async (accessToken: string): Promise<GoogleChatSpace[]> => {
  const response = await fetch(`${CHAT_BASE_URL}/spaces`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to fetch spaces (${response.status})`);
  }

  const data = await response.json();
  return data.spaces || [];
};

/**
 * Create a new Space in Google Chat
 */
export const createGoogleChatSpace = async (
  accessToken: string,
  displayName: string,
  description?: string
): Promise<GoogleChatSpace> => {
  const body: any = {
    displayName,
    spaceType: 'SPACE'
  };

  if (description) {
    body.spaceDetails = { description };
  }

  const response = await fetch(`${CHAT_BASE_URL}/spaces`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to create space (${response.status})`);
  }

  return await response.json();
};

/**
 * Fetch messages from a Google Chat Space
 */
export const fetchGoogleChatMessages = async (
  accessToken: string,
  spaceName: string,
  pageSize: number = 30
): Promise<GoogleChatMessage[]> => {
  // spaceName format is typically 'spaces/XYZ'
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(`${CHAT_BASE_URL}/${cleanSpace}/messages?pageSize=${pageSize}&orderBy=createTime%20desc`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to fetch messages (${response.status})`);
  }

  const data = await response.json();
  const msgs: GoogleChatMessage[] = data.messages || [];
  // Sort oldest to newest for standard chat view
  return msgs.sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime());
};

/**
 * Send a message into a Google Chat Space
 */
export const sendGoogleChatMessage = async (
  accessToken: string,
  spaceName: string,
  text: string
): Promise<GoogleChatMessage> => {
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(`${CHAT_BASE_URL}/${cleanSpace}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to send message (${response.status})`);
  }

  return await response.json();
};

/**
 * Fetch members in a space
 */
export const fetchGoogleChatMembers = async (
  accessToken: string,
  spaceName: string
): Promise<GoogleChatMember[]> => {
  const cleanSpace = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const response = await fetch(`${CHAT_BASE_URL}/${cleanSpace}/members`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to list members (${response.status})`);
  }

  const data = await response.json();
  return data.memberships || [];
};

/**
 * Delete a message from Google Chat
 */
export const deleteGoogleChatMessage = async (
  accessToken: string,
  messageName: string
): Promise<boolean> => {
  const response = await fetch(`${CHAT_BASE_URL}/${messageName}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `Failed to delete message (${response.status})`);
  }

  return true;
};
