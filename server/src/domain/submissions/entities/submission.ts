import { randomUUID } from 'node:crypto';
import { Challenge } from '../../challenges/entities/challenge';

export enum SubmissionStatus {
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

export class Submission {
  constructor(
    public id: string,
    public challengeId: string,
    public repositoryUrl: string,
    public status: SubmissionStatus,
    public createdAt: Date,
    public grade?: number | null,
    public challenge?: Challenge | null,
  ) {}

  static create({
    id = randomUUID(),
    challengeId,
    repositoryUrl,
    status = SubmissionStatus.Pending,
    grade = null,
    createdAt = new Date(),
    challenge,
  }: {
    id?: string;
    challengeId: string;
    repositoryUrl: string;
    status?: SubmissionStatus;
    grade?: number | null;
    createdAt?: Date;
    challenge?: Challenge | null;
  }): Submission {
    return new Submission(id, challengeId, repositoryUrl, status, createdAt, grade, challenge);
  }
}
