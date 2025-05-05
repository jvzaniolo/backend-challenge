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
}
