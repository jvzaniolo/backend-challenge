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

    await expect(
      challengesRepository.findMany({
        title: 'Back-end Challenge',
        perPage: 10,
      }),
    ).resolves.toEqual([newChallenge]);

    await sut.execute({
      id: newChallenge.id,
    });

    await expect(
      challengesRepository.findMany({
        title: 'Back-end Challenge',
        perPage: 10,
      }),
    ).resolves.toEqual([]);
  });

  it('should throw an error if the challenge does not exist', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toThrow('Challenge not found');
  });
});
