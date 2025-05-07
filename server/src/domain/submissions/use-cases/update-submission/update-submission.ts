import { Injectable } from '@nestjs/common';
import { SubmissionStatus } from '../../entities/submission';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class UpdateSubmissionUseCase {
  constructor(private readonly submissionsRepository: SubmissionsRepository) {}

  async execute(args: { submissionId: string; status: SubmissionStatus; grade: number }) {
    const submission = await this.submissionsRepository.update(args.submissionId, {
      status: args.status,
      grade: args.grade,
    });
    if (!submission) {
      throw new Error('Submission not found.');
    }
    return { submission };
  }
}
