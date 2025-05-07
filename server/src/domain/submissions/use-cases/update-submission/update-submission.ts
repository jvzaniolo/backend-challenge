import { Injectable } from '@nestjs/common';
import { SubmissionStatus } from '../../entities/submission';
import { SubmissionNotFoundError } from '../../errors/submission-not-found';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';

@Injectable()
export class UpdateSubmissionUseCase {
  constructor(private readonly submissionsRepository: SubmissionsRepository) {}

  async execute(id: string, input: { status: SubmissionStatus; grade: number }) {
    const submission = await this.submissionsRepository.update(id, input);
    if (!submission) {
      throw new SubmissionNotFoundError();
    }
    return { submission };
  }
}
