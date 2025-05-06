import { randomUUID } from 'node:crypto';
import { Submission } from '../../submissions/entities/submission';

export class Challenge {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public createdAt: Date,
    public submissions?: Submission[],
  ) {}

  static create({
    id = randomUUID(),
    title,
    description,
    createdAt = new Date(),
    submissions,
  }: {
    title: string;
    description: string;
    id?: string;
    createdAt?: Date;
    submissions?: Submission[];
  }): Challenge {
    return new Challenge(id, title, description, createdAt, submissions);
  }
}
