import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Submission {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  challengeId: string;

  @Field()
  @Column()
  repositoryUrl: string;

  @Field(() => Float, { nullable: true })
  @Column()
  grade: number;

  @Field({ defaultValue: 'Pending', description: 'Defaults to `Pending`' })
  @Column({ default: 'Pending' })
  status: 'Pending' | 'Done' | 'Error';

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
