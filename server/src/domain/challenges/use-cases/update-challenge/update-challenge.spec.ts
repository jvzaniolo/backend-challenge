import { Test } from '@nestjs/testing';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { ChallengesRepository } from '../../repositories/typeorm/challenges.repository';
import { UpdateChallengeUseCase } from './update-challenge';

describe('Update challenge use case', () => {
  let sut: UpdateChallengeUseCase;
  let challengesRepository: ChallengesRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateChallengeUseCase,
        {
          provide: ChallengesRepository,
          useClass: FakeChallengesRepository,
        },
      ],
    }).compile();

    sut = module.get(UpdateChallengeUseCase);
    challengesRepository = module.get(ChallengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should update a challenge', async () => {
    const newChallenge = await challengesRepository.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });

    const { challenge } = await sut.execute({
      id: newChallenge.id,
      title: 'Full-stack Challenge',
      description: 'This is a full-stack challenge',
    });

    expect(challenge).toBeDefined();
    expect(challenge.title).toBe('Full-stack Challenge');
    expect(challenge.description).toBe('This is a full-stack challenge');
  });

  it('should throw an error if the challenge does not exist', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-id',
        title: 'Full-stack Challenge',
        description: 'This is a full-stack challenge',
      }),
    ).rejects.toThrow('Challenge not found');
  });
});
