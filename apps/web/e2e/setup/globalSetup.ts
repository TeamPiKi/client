import { MOCK_API_PORT } from '../consts';
import { startMockApiServer } from './mockApiServer';

/** 테스트 러너 프로세스에서 SSR 목 스텁 서버를 띄우고, 종료 시 함께 내린다 */
const globalSetup = async () => {
  /** null 이면 다른 세션(UI 모드 등)이 띄운 기존 스텁을 재사용 — 내리지 않는다 */
  const server = await startMockApiServer(MOCK_API_PORT);

  return () =>
    new Promise<void>(resolve => {
      if (!server) return resolve();
      server.close(() => resolve());
    });
};

export default globalSetup;
