import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { SubmissionStatus } from '../../entities/submission.entity';
import { FakeSubmissionsRepository } from '../../repositories/fake/fake-submissions.repository';
import { SubmissionsRepository } from '../../repositories/typeorm/submissions.repository';
import { UpdateSubmissionUseCase } from './update-submission';

describe('Update submission use case', () => {
  let sut: UpdateSubmissionUseCase;
  let submissionsRepository: SubmissionsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateSubmissionUseCase,
        {
          provide: SubmissionsRepository,
          useClass: FakeSubmissionsRepository,
        },
      ],
    }).compile();

    sut = module.get(UpdateSubmissionUseCase);
    submissionsRepository = module.get(SubmissionsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should update a submission', async () => {
    const challengeId = randomUUID();
    const newSubmission = await submissionsRepository.create({
      challengeId,
      repositoryUrl: 'https://github.com/user/repo',
    });

    await expect(submissionsRepository.findMany({ challengeId, perPage: 10 })).resolves.toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            repositoryUrl: 'https://github.com/user/repo',
            status: SubmissionStatus.Pending,
            grade: null,
          }),
        ],
      }),
    );

    const { submission } = await sut.execute({
      submissionId: newSubmission.id,
      status: SubmissionStatus.Done,
      grade: 8,
    });

    expect(submission).toBeDefined();
    await expect(submissionsRepository.findMany({ challengeId, perPage: 10 })).resolves.toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            repositoryUrl: 'https://github.com/user/repo',
            grade: 8,
            status: SubmissionStatus.Done,
          }),
        ],
      }),
    );
  });

  it('should throw an error if submission not found', async () => {
    const challengeId = randomUUID();
    await submissionsRepository.create({
      challengeId,
      repositoryUrl: 'https://github.com/user/repo',
    });

    await expect(
      sut.execute({
        submissionId: randomUUID(),
        status: SubmissionStatus.Done,
        grade: 8,
      }),
    ).rejects.toThrow('Submission not found');
  });
});
