import { Test } from '@nestjs/testing';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { ChallengesRepository } from '../../repositories/typeorm/challenges.repository';
import { CreateChallengeUseCase } from './create-challenge';

describe('Create challenge use case', () => {
  let sut: CreateChallengeUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateChallengeUseCase,
        {
          provide: ChallengesRepository,
          useClass: FakeChallengesRepository,
        },
      ],
    }).compile();

    sut = module.get(CreateChallengeUseCase);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a new challenge', async () => {
    const { challenge } = await sut.execute({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });

    expect(challenge).toBeDefined();
    expect(challenge.title).toBe('Back-end Challenge');
    expect(challenge.description).toBe('This is a back-end challenge');
  });
});
