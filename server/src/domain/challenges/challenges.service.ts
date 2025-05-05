import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Challenge, PaginatedChallenge } from './challenge.entity';
import { GetChallengesArgs } from './dto/get-challenges.args';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async findMany({
    title,
    description,
    page,
    perPage,
  }: GetChallengesArgs): Promise<PaginatedChallenge> {
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
    const challenge = await this.challengeRepository.findOneBy({ id });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    this.challengeRepository.merge(challenge, {
      title,
      description,
    });
    return await this.challengeRepository.save(challenge);
  }

  async delete(id: string): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOneBy({ id });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    await this.challengeRepository.delete(id);
    return challenge;
  }
}
