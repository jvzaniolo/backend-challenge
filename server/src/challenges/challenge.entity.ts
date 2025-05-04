import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Submission } from '~/submissions/submission.entity';

@Entity()
@ObjectType()
export class Challenge {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Submission], { nullable: true })
  @OneToMany(() => Submission, (submission) => submission.challenge)
  submissions?: Submission[];
}
