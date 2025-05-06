import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from '~/domain/submissions/entities/submission';
import { SubmissionSchema } from './submission.schema';

@Entity('challenge')
export class ChallengeSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SubmissionSchema, (submission) => submission.challenge)
  submissions?: Submission[];
}
