import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Submission } from 'src/submissions/submission.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
