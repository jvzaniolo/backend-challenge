export class SubmissionNotFoundError extends Error {
  constructor() {
    super(`Submission not found.`);
  }
}
