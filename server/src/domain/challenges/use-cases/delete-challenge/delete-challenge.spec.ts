import { Challenge } from '../../entities/challenge';
import { ChallengeNotFoundError } from '../../errors/challenge-not-found';
import { ChallengesRepository } from '../../repositories/challenges.repository';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { DeleteChallengeUseCase } from './delete-challenge';

describe('Delete challenge use case', () => {
  let sut: DeleteChallengeUseCase;
  let challengesRepository: ChallengesRepository;

  beforeEach(async () => {
    challengesRepository = new FakeChallengesRepository();
    sut = new DeleteChallengeUseCase(challengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should delete a challenge', async () => {
    const newChallenge = Challenge.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });
    await challengesRepository.create(newChallenge);

    await expect(challengesRepository.findById(newChallenge.id)).resolves.toBeDefined();

    await sut.execute({ id: newChallenge.id });

    await expect(challengesRepository.findById(newChallenge.id)).resolves.toBeNull();
  });

  it('should throw an error if the challenge does not exist', async () => {
    await expect(
      sut.execute({
        id: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ChallengeNotFoundError);
  });
});
