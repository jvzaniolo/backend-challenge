import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Challenge } from '../../entities/challenge.entity';
import { ChallengesRepositoryInterface } from '../challenges-repository.interface';

@Injectable()
export class ChallengesRepository implements ChallengesRepositoryInterface {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async create(input: { title: string; description: string }): Promise<Challenge> {
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
      items,
      pagination: {
        total: count,
        page: page || 1,
        perPage,
      },
    };
  }
}
