export class InvalidGitHubURLError extends Error {
  constructor() {
    super(`Invalid GitHub repository URL.`);
  }
}
