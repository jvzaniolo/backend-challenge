import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { SubmissionStatus } from '~/domain/submissions/entities/submission';
import { ChallengeSchema } from './challenge.schema';

@Entity('submission')
export class SubmissionSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  challengeId: string;

  @Column()
  repositoryUrl: string;

  @Column({ nullable: true, type: 'float' })
  grade?: number | null;

  @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.Pending })
  status: SubmissionStatus = SubmissionStatus.Pending;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ChallengeSchema, (challenge) => challenge.submissions, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'challengeId' })
  challenge?: Challenge | null;
}
