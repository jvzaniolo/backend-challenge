export function isGithubRepo(url: string): boolean {
  const regex = /^(https?:\/\/)?(www\.)?(github\.com)\/[^/]+\/[^/]+(\.git)?$/;
  return regex.test(url);
}
