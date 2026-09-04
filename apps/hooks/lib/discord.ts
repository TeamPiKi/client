export type DiscordMessageT = { id: string; content: string; timestamp: string };

const API_BASE = 'https://discord.com/api/v10';

const discordRequest = async (path: string, init?: RequestInit) => {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) throw new Error('DISCORD_BOT_TOKEN 환경변수가 없습니다');

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Discord API 실패 (${init?.method ?? 'GET'} ${path} → HTTP ${response.status}) ${await response.text()}`
    );
  }
  return response;
};

const requireChannelId = () => {
  const channelId = process.env.DISCORD_DEPLOY_CHANNEL_ID;
  if (!channelId) throw new Error('DISCORD_DEPLOY_CHANNEL_ID 환경변수가 없습니다');
  return channelId;
};

/** 외부 텍스트가 섞여도 멘션이 울리지 않도록 파싱 차단 */
const messageBody = (content: string) => JSON.stringify({ content, allowed_mentions: { parse: [] } });

export const sendDiscordMessage = async (content: string) => {
  await discordRequest(`/channels/${requireChannelId()}/messages`, {
    method: 'POST',
    body: messageBody(content),
  });
};

export const listRecentMessages = async (): Promise<DiscordMessageT[]> => {
  const response = await discordRequest(`/channels/${requireChannelId()}/messages?limit=50`);
  return (await response.json()) as DiscordMessageT[];
};

export const postChannelMessage = async (content: string): Promise<DiscordMessageT> => {
  const response = await discordRequest(`/channels/${requireChannelId()}/messages`, {
    method: 'POST',
    body: messageBody(content),
  });
  return (await response.json()) as DiscordMessageT;
};

export const editChannelMessage = async (messageId: string, content: string) => {
  await discordRequest(`/channels/${requireChannelId()}/messages/${messageId}`, {
    method: 'PATCH',
    body: messageBody(content),
  });
};

/** 메시지에서 스레드 생성 (스레드 id == 메시지 id) — 이미 있으면 400이 오므로 무시 */
export const ensureThreadOnMessage = async (messageId: string, name: string) => {
  try {
    await discordRequest(`/channels/${requireChannelId()}/messages/${messageId}/threads`, {
      method: 'POST',
      body: JSON.stringify({ name, auto_archive_duration: 10080 }),
    });
  } catch {
    /* 스레드가 이미 존재 */
  }
};

export const postThreadMessage = async (threadId: string, content: string) => {
  await discordRequest(`/channels/${threadId}/messages`, { method: 'POST', body: messageBody(content) });
};

/** 링크 라벨 인젝션(](url)) 차단용 Markdown 특수문자 이스케이프 */
export const escapeMarkdown = (text: string) => text.replace(/[[\]`\\]/g, '\\$&');
