import { MOCK_API_PORT } from '../consts';
import { startMockApiServer } from './mockApiServer';

/** 테스트 러너 프로세스에서 SSR 목 스텁 서버를 띄우고, 종료 시 함께 내린다 */
const globalSetup = async () => {
  const server = await startMockApiServer(MOCK_API_PORT);

  return () =>
    new Promise<void>(resolve => {
      server.close(() => resolve());
    });
};

export default globalSetup;
