const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER!;
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO!;

export function getGitHubRepo() {
  return `https://github.com/${OWNER}/${REPO}`;
}

export function getLatestRelease() {
  return `https://github.com/${OWNER}/${REPO}/releases/latest`;
}

export function getRelease(tag: string) {
  return `https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`;
}

export function getDownload(tag: string, asset: string) {
  return `https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${asset}`;
}