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
  grade?: number | null;
  createdAt: Date;
  challenge?: Challenge | null;
}
