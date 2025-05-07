import { Challenge } from '../../entities/challenge';
import { ChallengesRepository } from '../../repositories/challenges.repository';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { UpdateChallengeUseCase } from './update-challenge';

describe('Update challenge use case', () => {
  let sut: UpdateChallengeUseCase;
  let challengesRepository: ChallengesRepository;

  beforeEach(async () => {
    challengesRepository = new FakeChallengesRepository();
    sut = new UpdateChallengeUseCase(challengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should update a challenge', async () => {
    const newChallenge = Challenge.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });
    await challengesRepository.create(newChallenge);

    const { challenge } = await sut.execute(newChallenge.id, {
      title: 'Full-stack Challenge',
      description: 'This is a full-stack challenge',
    });

    expect(challenge).toBeDefined();
    expect(challenge.title).toBe('Full-stack Challenge');
    expect(challenge.description).toBe('This is a full-stack challenge');
  });

  it('should throw an error if the challenge does not exist', async () => {
    await expect(
      sut.execute('non-existing-id', {
        title: 'Full-stack Challenge',
        description: 'This is a full-stack challenge',
      }),
    ).rejects.toThrow('Challenge not found');
  });
});
