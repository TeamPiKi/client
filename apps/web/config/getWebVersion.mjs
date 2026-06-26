import { execSync } from 'node:child_process';

const WEB_VERSION_TAG_PREFIX = 'web-v';

/** web-v* 태그 문자열에서 버전 추출 */
const parseWebVersionFromTag = tag => {
  if (!tag?.startsWith(WEB_VERSION_TAG_PREFIX)) return null;
  return tag.slice(WEB_VERSION_TAG_PREFIX.length);
};

const logWebVersion = (webVersion, source) => {
  console.log(`[WEB VERSION] ${webVersion} (source: ${source})`);
};

/** GitHub API로 최신 web-v* 태그 조회 */
const getWebVersionFromGitHubApi = async () => {
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const repo = process.env.VERCEL_GIT_REPO_SLUG;

  if (!owner || !repo) {
    console.log('[WEB VERSION] GitHub API: VERCEL_GIT_REPO_OWNER/SLUG 없음');
    return null;
  }

  try {
    const headers = { Accept: 'application/vnd.github+json' };
    const token = process.env.GITHUB_TOKEN;

    if (token) headers.Authorization = `Bearer ${token}`;

    const perPage = 100;
    let page = 1;
    let latestTag = null;

    while (true) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/tags?per_page=${perPage}&page=${page}`,
        { headers, signal: AbortSignal.timeout(10_000) }
      );

      if (!response.ok) {
        console.log(`[WEB VERSION] GitHub API 실패: ${response.status}`);
        return null;
      }

      const tags = await response.json();

      if (!Array.isArray(tags)) {
        console.log('[WEB VERSION] GitHub API: 예상치 못한 응답');
        return null;
      }

      for (const tag of tags) {
        const tagName = tag.name;
        if (!tagName?.startsWith(WEB_VERSION_TAG_PREFIX)) continue;

        if (
          !latestTag ||
          tagName.localeCompare(latestTag, undefined, { numeric: true }) > 0
        )
          latestTag = tagName;
      }

      if (tags.length < perPage) break;
      page += 1;
    }

    const webVersion = parseWebVersionFromTag(latestTag);
    if (!webVersion) {
      console.log('[WEB VERSION] GitHub API: web-v* 태그 없음');
      return null;
    }

    logWebVersion(webVersion, 'github-api');
    return webVersion;
  } catch {
    console.log('[WEB VERSION] GitHub API 요청 실패');
    return null;
  }
};

/** 로컬 git describe로 web-v* 태그 조회 */
const getWebVersionFromGitDescribe = () => {
  try {
    const tag = execSync(`git describe --tags --match "${WEB_VERSION_TAG_PREFIX}*" --abbrev=0`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();

    const webVersion = parseWebVersionFromTag(tag);
    if (!webVersion) return null;

    logWebVersion(webVersion, 'git-describe');
    return webVersion;
  } catch {
    console.log('[WEB VERSION] git describe 실패');
    return null;
  }
};

/** 로컬 git tag -l로 최신 web-v* 태그 조회 */
const getWebVersionFromGitTagList = () => {
  try {
    const tag = execSync(`git tag -l "${WEB_VERSION_TAG_PREFIX}*" --sort=-version:refname`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    })
      .trim()
      .split('\n')[0];

    const webVersion = parseWebVersionFromTag(tag);
    if (!webVersion) {
      console.log('[WEB VERSION] git tag -l: web-v* 태그 없음');
      return null;
    }

    logWebVersion(webVersion, 'git-tag-list');
    return webVersion;
  } catch {
    console.log('[WEB VERSION] git tag -l 실패');
    return null;
  }
};

/** 최신 web-v* git 태그에서 버전 문자열 추출. 없으면 null */
export const getWebVersion = async () => {
  const vercelRef = process.env.VERCEL_GIT_COMMIT_REF;

  if (vercelRef?.startsWith(WEB_VERSION_TAG_PREFIX)) {
    const webVersion = parseWebVersionFromTag(vercelRef);
    if (webVersion) {
      logWebVersion(webVersion, 'vercel-git-commit-ref');
      return webVersion;
    }
  }

  if (process.env.VERCEL) {
    const fromApi = await getWebVersionFromGitHubApi();
    if (fromApi) return fromApi;

    console.log('[WEB VERSION] 최종 실패: null 반환');
    return null;
  }

  const fromDescribe = getWebVersionFromGitDescribe();
  if (fromDescribe) return fromDescribe;

  const fromTagList = getWebVersionFromGitTagList();
  if (fromTagList) return fromTagList;

  console.log('[WEB VERSION] 최종 실패: null 반환');
  return null;
};
