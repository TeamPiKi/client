import type { FolderT } from '@/types/folder';

/**
 * 보는 사람과 프로필 주인의 관계
 * - ME: 내 프로필
 * - NONE: 친구가 아닌 사용자. 게스트가 볼 때와 나를 차단한 사용자도 여기 포함
 * - FRIEND: 내가 친구로 추가한 사용자
 * - BLOCKED: 내가 차단한 사용자
 *
 * NOTE: 나를 차단한 사용자는 NONE + 비공개 프로필로 내려와 차단 사실이 드러나지 않는다
 */
export type ProfileRelationT = 'ME' | 'NONE' | 'FRIEND' | 'BLOCKED';

export type ProfileFolderT = Pick<FolderT, 'id' | 'name' | 'wishCount' | 'coverImageUrls'>;

export type ProfileT = {
  userId: number;
  nickname: string;
  profileImage: string;
  relation: ProfileRelationT;
  isPublic: boolean;
  /** 공개 폴더만 */
  folders: ProfileFolderT[];
};
