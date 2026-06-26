export type NotificationTypeT =
  | 'TOURNAMENT_JOINED'
  | 'TOURNAMENT_ITEM_ADDED'
  | 'TOURNAMENT_ITEM_DELETED'
  | 'TOURNAMENT_STARTED'
  | 'TOURNAMENT_PLAYED_FROM_LINK'
  | 'TOURNAMENT_COMPLETED'
  | 'TOURNAMENT_RESULT_READY'
  | 'ITEM_PARSING_COMPLETED'
  | 'ITEM_PARSING_FAILED'
  | 'ANNOUNCEMENT';

export type NotificationKindT = 'WISH' | 'TOURNAMENT';

export type SilentSyncSsePayloadT =
  | {
      type: 'TOURNAMENT_ITEM_PARSED';
      tournamentId: number;
      tournamentItemId: number;
      status: 'READY' | 'FAILED';
    }
  | {
      type: 'UNREAD_COUNT_CHANGED';
      unreadCount: number;
    };

export type NotificationSsePayloadT = {
  id: number;
  type: NotificationTypeT;
  category: string;
  title: string;
  body: string;
  imageUrl: string;
  refId: number;
  isRead: boolean;
  createdAt: string;
  /** ITEM_PARSING_COMPLETED / ITEM_PARSING_FAILED 일 때만 존재 */
  kind?: NotificationKindT;
  /** kind === 'TOURNAMENT' 일 때만 존재 */
  tournamentId?: number;
  /** kind === 'TOURNAMENT' 일 때만 존재 */
  tournamentItemId?: number;
};
