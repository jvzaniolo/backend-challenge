import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../../entities/challenge.entity';

@Injectable()
export class ChallengesRepository {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  create(input: { title: string; description: string }): Promise<Challenge> {
    const challenge = this.challengeRepository.create(input);
    return this.challengeRepository.save(challenge);
  }

  async update({
    id,
    title,
    description,
  }: {
    id: string;
    title?: string;
    description?: string;
  }): Promise<Challenge | null> {
    const challenge = await this.challengeRepository.findOneBy({ id });
    if (!challenge) {
      return null;
    }
    this.challengeRepository.merge(challenge, {
      title,
      description,
    });
    return this.challengeRepository.save(challenge);
  }

  async delete({ id }: { id: string }): Promise<Challenge | null> {
    const challenge = await this.challengeRepository.findOneBy({ id });
    if (!challenge) {
      return null;
    }
    await this.challengeRepository.delete(id);
    return challenge;
  }
}
