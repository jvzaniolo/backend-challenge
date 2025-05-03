import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.model';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  findMany(): Promise<Challenge[]> {
    return this.challengeRepository.find();
  }

  create({ title, description }: { title: string; description: string }): Promise<Challenge> {
    const challenge = this.challengeRepository.create({
      title,
      description,
    });
    return this.challengeRepository.save(challenge);
  }

  async update(
    id: string,
    { title, description }: { title?: string; description?: string },
  ): Promise<Challenge> {
    await this.challengeRepository.update(id, {
      title,
      description,
    });
    return this.challengeRepository.findOneByOrFail({ id });
  }
}
