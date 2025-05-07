import { randomUUID } from 'node:crypto';
import { Submission, SubmissionStatus } from '../../entities/submission';
import { FakeSubmissionsRepository } from '../../repositories/fake/fake-submissions.repository';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';
import { UpdateSubmissionUseCase } from './update-submission';

describe('Update submission use case', () => {
  let sut: UpdateSubmissionUseCase;
  let submissionsRepository: SubmissionsRepository;

  beforeEach(async () => {
    submissionsRepository = new FakeSubmissionsRepository();

    sut = new UpdateSubmissionUseCase(submissionsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should update a submission', async () => {
    const newSubmission = Submission.create({
      challengeId: randomUUID(),
      repositoryUrl: 'https://github.com/user/repo',
    });
    await submissionsRepository.create(newSubmission);

    const { submission } = await sut.execute(newSubmission.id, {
      status: SubmissionStatus.Done,
      grade: 8,
    });

    expect(submission).toEqual(
      expect.objectContaining({
        repositoryUrl: 'https://github.com/user/repo',
        grade: 8,
        status: SubmissionStatus.Done,
      }),
    );
  });

  it('should throw an error if submission not found', async () => {
    const challengeId = randomUUID();

    await submissionsRepository.create(
      Submission.create({
        challengeId,
        repositoryUrl: 'https://github.com/user/repo',
      }),
    );

    await expect(
      sut.execute('non-existing-id', {
        status: SubmissionStatus.Done,
        grade: 8,
      }),
    ).rejects.toThrow('Submission not found');
  });
});
