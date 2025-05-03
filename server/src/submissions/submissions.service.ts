import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  findMany(): Promise<Submission[]> {
    return this.submissionsRepository.find();
  }

  create({
    challengeId,
    repositoryUrl,
  }: {
    challengeId: string;
    repositoryUrl: string;
  }): Promise<Submission> {
    const submission = this.submissionsRepository.create({
      challengeId,
      repositoryUrl,
    });
    return this.submissionsRepository.save(submission);
  }
}
