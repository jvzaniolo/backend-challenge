import { Challenge } from '~/domain/challenges/entities/challenge';
import { ChallengesRepository } from '../../../challenges/repositories/challenges.repository';
import { FakeChallengesRepository } from '../../../challenges/repositories/fake/fake-challenges.repository';
import { SubmissionStatus } from '../../entities/submission';
import { FakeSubmissionsRepository } from '../../repositories/fake/fake-submissions.repository';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';
import { SubmitChallengeUseCase } from './submit-challenge';

describe('Submit challenge use case', () => {
  let sut: SubmitChallengeUseCase;
  let challengesRepository: ChallengesRepository;
  let submissionsRepository: SubmissionsRepository;

  beforeEach(async () => {
    challengesRepository = new FakeChallengesRepository();
    submissionsRepository = new FakeSubmissionsRepository();

    sut = new SubmitChallengeUseCase(challengesRepository, submissionsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should submit a challenge for correction', async () => {
    const challenge = Challenge.create({
      title: 'Test Challenge',
      description: 'Test Description',
    });
    await challengesRepository.create(challenge);

    const { submission } = await sut.execute({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/repo',
    });

    expect(submission).toBeDefined();
    expect(submission.id).toBeDefined();
    expect(submission.grade).toBeNull();
    expect(submission.status).toEqual(SubmissionStatus.Pending);
  });

  it('should throw an error if the repository URL is invalid', async () => {
    const challenge = Challenge.create({
      title: 'Test Challenge',
      description: 'Test Description',
    });
    await challengesRepository.create(challenge);

    await expect(
      sut.execute({
        challengeId: challenge.id,
        repositoryUrl: 'invalid-url',
      }),
    ).rejects.toThrow('Invalid GitHub repository URL.');

    const submission = await submissionsRepository.findMany({
      perPage: 1,
    });

    expect(submission).toBeDefined();
    expect(submission.items).toEqual([
      expect.objectContaining({
        status: SubmissionStatus.Error,
      }),
    ]);
  });

  it('should throw an error if the challenge does not exist', async () => {
    await expect(
      sut.execute({
        challengeId: 'non-existing-challenge-id',
        repositoryUrl: 'https://github.com/user/repo',
      }),
    ).rejects.toThrow('Challenge not found.');

    const submission = await submissionsRepository.findMany({ perPage: 10 });

    expect(submission).toBeDefined();
    expect(submission.items).toEqual([
      expect.objectContaining({
        status: SubmissionStatus.Error,
      }),
    ]);
  });
});
