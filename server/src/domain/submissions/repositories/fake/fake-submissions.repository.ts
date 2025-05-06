import { Submission } from '../../entities/submission';
import { SubmissionStatus } from '../../entities/submission.interface';
import { SubmissionsRepository } from '../submissions-repository.interface';

export class FakeSubmissionsRepository implements SubmissionsRepository {
  private submissions: Submission[] = [];

  async create(submission: Submission): Promise<Submission> {
    const newSubmission = Submission.create(submission);
    this.submissions.push(newSubmission);
    return newSubmission;
  }

  async update(input: {
    id: string;
    grade?: number;
    status?: SubmissionStatus;
  }): Promise<Submission | null> {
    const submission = this.submissions.find((submission) => submission.id === input.id);
    if (!submission) {
      return null;
    }
    Object.assign(submission, {
      grade: input.grade ?? submission.grade,
      status: input.status ?? submission.status,
    });
    return submission;
  }

  async findBy(input: { id: string }): Promise<Submission | null> {
    return this.submissions.find((submission) => submission.id === input.id) || null;
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
