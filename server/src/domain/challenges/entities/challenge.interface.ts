import { Submission } from '../../submissions/entities/submission';

export interface ChallengeInterface {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  submissions?: Submission[];
}
