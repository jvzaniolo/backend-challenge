import { randomUUID } from 'node:crypto';
import { Optional } from '~/core/types/optional';
import { Submission } from '../../submissions/entities/submission';

export interface ChallengeInterface {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  submissions?: Submission[];
}

export class Challenge {
  protected constructor(protected props: ChallengeInterface) {}

  static create({
    id = randomUUID(),
    title,
    description,
    createdAt = new Date(),
    submissions = [],
  }: Optional<ChallengeInterface, 'id' | 'createdAt'>): Challenge {
    return new Challenge({ id, title, description, createdAt, submissions });
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
  }

  get description() {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get submissions() {
    return this.props.submissions;
  }
}
