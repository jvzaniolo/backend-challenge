import { Injectable } from '@nestjs/common';
import { Submission, SubmissionStatus } from '../../entities/submission.entity';
import { SubmissionsRepository } from '../../repositories/typeorm/submissions.repository';

@Injectable()
export class UpdateSubmissionUseCase {
  constructor(private readonly submissionsRepository: SubmissionsRepository) {}

  async execute(args: {
    submissionId: string;
    status: SubmissionStatus;
    grade: number;
  }): Promise<{ submission: Submission }> {
    const submission = await this.submissionsRepository.update({
      id: args.submissionId,
      status: args.status,
      grade: args.grade,
    });
    if (!submission) {
      throw new Error('Submission not found.');
    }
    return { submission };
  }
}
