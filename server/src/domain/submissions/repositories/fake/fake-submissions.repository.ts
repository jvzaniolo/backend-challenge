import {
  PaginatedSubmissions,
  Submission,
  SubmissionStatus,
} from '../../entities/submission.entity';
import { ListSubmissionsArgs } from '../../use-cases/list-submissions/list-submissions.args';
import { SubmissionsRepositoryInterface } from '../submissions-repository.interface';

export class FakeSubmissionsRepository implements SubmissionsRepositoryInterface {
  private submissions: Submission[] = [];

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

  async findMany({
    page,
    perPage,
    status,
    dateRange,
    challengeTitle,
  }: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
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
