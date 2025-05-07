import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Challenge } from '~/domain/challenges/entities/challenge';
import { ChallengesRepository } from '~/domain/challenges/repositories/challenges.repository';
import { ChallengeMapper } from '../mappers/challenge.mapper';
import { ChallengeSchema } from '../schema/challenge.schema';

@Injectable()
export class TypeORMChallengesRepository implements ChallengesRepository {
  constructor(
    @InjectRepository(ChallengeSchema)
    private readonly challengeRepository: Repository<ChallengeSchema>,
  ) {}

  async create(input: Challenge) {
    const challenge = this.challengeRepository.create(ChallengeMapper.toDatabase(input));
    await this.challengeRepository.save(challenge);
  }

  async update(id: string, challenge: Partial<Challenge>) {
    const data = await this.challengeRepository.findOneBy({ id });
    if (!data) {
      return null;
    }
    this.challengeRepository.merge(data, challenge);
    return ChallengeMapper.toDomain(await this.challengeRepository.save(data));
  }

  async delete(id: string) {
    const challenge = await this.challengeRepository.findOneBy({ id });
    if (!challenge) {
      return null;
    }
    await this.challengeRepository.delete(id);
    return ChallengeMapper.toDomain(challenge);
  }

  async findById(id: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { id },
      relations: {
        submissions: true,
      },
    });
    if (!challenge) {
      return null;
    }
    return ChallengeMapper.toDomain(challenge);
  }

  async findMany({
    page,
    perPage = 10,
    title,
    description,
  }: {
    page?: number;
    perPage?: number;
    title?: string;
    description?: string;
  }) {
    const [items, count] = await this.challengeRepository.findAndCount({
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage,
      where: {
        title: title ? ILike(`%${title}%`) : undefined,
        description: description ? ILike(`%${description}%`) : undefined,
      },
      relations: {
        submissions: true,
      },
    });

    return {
      items: items.map(ChallengeMapper.toDomain),
      pagination: {
        total: count,
        page: page || 1,
        perPage,
      },
    };
  }
}
