import { Test } from '@nestjs/testing';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { ChallengesRepository } from '../../repositories/typeorm/challenges.repository';
import { DeleteChallengeUseCase } from './delete-challenge';

describe('Delete challenge use case', () => {
  let sut: DeleteChallengeUseCase;
  let challengesRepository: ChallengesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteChallengeUseCase,
        {
          provide: ChallengesRepository,
          useClass: FakeChallengesRepository,
        },
      ],
    }).compile();

    sut = module.get(DeleteChallengeUseCase);
    challengesRepository = module.get(ChallengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should delete a new challenge', async () => {
    const newChallenge = await challengesRepository.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });

    const { challenge } = await sut.execute({
      id: newChallenge.id,
    });

    expect(challenge).toBeDefined();
    expect(challenge.title).toBe('Full-stack Challenge');
    expect(challenge.description).toBe('This is a full-stack challenge');
  });
});
