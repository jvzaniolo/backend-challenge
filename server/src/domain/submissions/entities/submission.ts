import { randomUUID } from 'node:crypto';
import { Optional } from '~/core/types/optional';
import { Challenge } from '../../challenges/entities/challenge';

export enum SubmissionStatus {
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

export interface SubmissionInterface {
  id: string;
  challengeId: string;
  repositoryUrl: string;
  status: SubmissionStatus;
  createdAt: Date;
  grade?: number | null;
  challenge?: Challenge | null;
}

export class Submission {
  protected constructor(private props: SubmissionInterface) {}

  static create({
    id = randomUUID(),
    challengeId,
    repositoryUrl,
    status = SubmissionStatus.Pending,
    grade = null,
    createdAt = new Date(),
    challenge,
  }: Optional<SubmissionInterface, 'id' | 'status' | 'createdAt'>): Submission {
    return new Submission({ id, challengeId, repositoryUrl, status, createdAt, grade, challenge });
  }

  get id() {
    return this.props.id;
  }

  get challengeId() {
    return this.props.challengeId;
  }

  get repositoryUrl() {
    return this.props.repositoryUrl;
  }

  get status() {
    return this.props.status;
  }

  set status(status: SubmissionStatus) {
    this.props.status = status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get grade() {
    return this.props.grade;
  }

  set grade(grade: number | null | undefined) {
    this.props.grade = grade;
  }

  get challenge() {
    return this.props.challenge;
  }
}
