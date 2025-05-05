import { isGithubRepo } from './is-github-repo';

describe('isGithubRepo()', () => {
  it('should return true if the URL is a valid GitHub repository URL', () => {
    const validUrls = [
      'https://github.com/user/github-repo',
      'https://github.com/user/github-repo.git',
      'https://www.github.com/user/github-repo',
    ];

    validUrls.forEach((url) => {
      expect(isGithubRepo(url)).toBe(true);
    });
  });

  it('should return false if the URL is not a valid GitHub repository URL', () => {
    const invalidUrls = [
      'https://gitlab.com/user/github-repo',
      'git@github.com/user/github-repo.git',
    ];

    invalidUrls.forEach((url) => {
      expect(isGithubRepo(url)).toBe(false);
    });
  });
});
