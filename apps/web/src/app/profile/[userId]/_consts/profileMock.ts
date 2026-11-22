import type { ProfileT } from '../_types/profile';

/**
 * TEMP: 프로필 조회 API 연동 전 목데이터
 * - relation · isPublic 만 바꿔서 관계별 화면 확인
 * - 게스트 화면은 게스트로 로그인해 relation NONE 으로 확인
 */
export const PROFILE_MOCK: Omit<ProfileT, 'userId'> = {
  nickname: '난폭한 북극곰',
  profileImage: 'https://picsum.photos/seed/piki-profile/200/200',
  relation: 'NONE',
  isPublic: true,
  folders: [
    {
      id: 1,
      name: '겨울 대비',
      wishCount: 12,
      coverImageUrls: [
        'https://picsum.photos/seed/piki-folder-1/400/400',
        'https://picsum.photos/seed/piki-folder-2/400/400',
        'https://picsum.photos/seed/piki-folder-3/400/400',
      ],
    },
    {
      id: 2,
      name: '크리스마스',
      wishCount: 5,
      coverImageUrls: [
        'https://picsum.photos/seed/piki-folder-4/400/400',
        'https://picsum.photos/seed/piki-folder-5/400/400',
      ],
    },
    {
      id: 3,
      name: '이름이 아주 긴 폴더는 말줄임으로 보여요',
      wishCount: 1,
      coverImageUrls: ['https://picsum.photos/seed/piki-folder-6/400/400'],
    },
    {
      id: 4,
      name: '빈 폴더',
      wishCount: 0,
      coverImageUrls: [],
    },
  ],
};
