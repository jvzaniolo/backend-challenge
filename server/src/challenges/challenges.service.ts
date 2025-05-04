import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { GetChallengesArgs } from './dto/get-challenges.args';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  findMany({ title, description, page, perPage }: GetChallengesArgs): Promise<Challenge[]> {
    return this.challengeRepository.find({
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
