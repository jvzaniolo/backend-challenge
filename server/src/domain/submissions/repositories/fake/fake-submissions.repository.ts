import { Submission, SubmissionStatus } from '../../entities/submission';
import { SubmissionsRepository } from '../submissions-repository.interface';

export class FakeSubmissionsRepository implements SubmissionsRepository {
  private submissions: Submission[] = [];

  async create(submission: Submission) {
    this.submissions.push(submission);
  }

  async update(id: string, input: Partial<Submission>) {
    const submissionIndex = this.submissions.findIndex((submission) => submission.id === id);
    if (submissionIndex === -1) {
      return null;
    }

    this.submissions[submissionIndex] = Object.assign(this.submissions[submissionIndex], input);

    return this.submissions[submissionIndex];
  }

  async findById(id: string) {
    return this.submissions.find((submission) => submission.id === id) || null;
  }

  async findMany({
    page,
    perPage,
    status,
    dateRange,
    challengeTitle,
  }: {
    page?: number;
    perPage: number;
    status?: SubmissionStatus;
    dateRange?: { startDate: Date; endDate: Date };
    challengeTitle?: string;
  }) {
    const filteredSubmissions = this.submissions.filter((submission) => {
      const matchesStatus = status ? submission.status === status : true;
      const matchesChallengeTitle = challengeTitle
        ? submission.challenge?.title.includes(challengeTitle)
        : true;
      const matchesDateRange =
        dateRange &&
        submission.createdAt >= dateRange.startDate &&
        submission.createdAt <= dateRange.endDate;

      return matchesStatus && matchesChallengeTitle && (!dateRange || matchesDateRange);
    });

    const paginatedSubmissions = filteredSubmissions.slice(
      (page ? page - 1 : 0) * perPage,
      (page ? page - 1 : 0) * perPage + perPage,
    );
    return {
      items: paginatedSubmissions,
      pagination: {
        total: filteredSubmissions.length,
        page: page || 1,
        perPage,
      },
    };
  }
}
