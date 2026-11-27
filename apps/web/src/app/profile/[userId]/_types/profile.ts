/**
 * 보는 사람과 프로필 주인의 관계
 * - SELF: 내 프로필
 * - NOT_FRIEND: 친구가 아닌 사용자. 게스트가 볼 때와 나를 차단한 사용자도 여기 포함
 * - FRIEND: 내가 친구로 추가한 사용자
 * - BLOCKED: 내가 차단한 사용자
 *
 * NOTE: 나를 차단한 사용자는 NOT_FRIEND + foldersHidden 으로 내려와 차단 사실이 드러나지 않는다
 */
export type ProfileRelationT = 'SELF' | 'NOT_FRIEND' | 'FRIEND' | 'BLOCKED';

export type ProfileFolderT = {
  folderId: number;
  name: string;
  wishCount: number;
  /** 최근 위시 최대 3개. 이미지가 없는 위시는 null */
  coverImageUrls: (string | null)[];
};

export type ProfileT = {
  userId: string;
  nickname: string;
  profileImage: string;
  relation: ProfileRelationT;
  /**
   * 폴더를 볼 수 없으면 true. 이때 folders 는 빈 배열
   * - 상대가 프로필 비공개 · 상대가 나를 차단 · 내가 상대를 차단
   * - 공개 폴더가 0개인 경우는 false
   */
  foldersHidden: boolean;
  /** 공개 폴더만 */
  folders: ProfileFolderT[];
};

export type GetProfileResponseT = ProfileT;
