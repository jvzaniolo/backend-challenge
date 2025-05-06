import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { Submission, SubmissionStatus } from '../../entities/submission.entity';
import { FakeSubmissionsRepository } from '../../repositories/fake/fake-submissions.repository';
import { SubmissionsRepository } from '../../repositories/typeorm/submissions.repository';
import { ListSubmissionsUseCase } from './list-submissions';

function makeSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: randomUUID(),
    challengeId: randomUUID(),
    repositoryUrl: 'https://github.com/example/repo-1',
    grade: null,
    status: SubmissionStatus.Pending,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('List submissions use case', () => {
  let sut: ListSubmissionsUseCase;
  let submissionsRepository: SubmissionsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListSubmissionsUseCase,
        {
          provide: SubmissionsRepository,
          useClass: FakeSubmissionsRepository,
        },
      ],
    }).compile();

    sut = module.get(ListSubmissionsUseCase);
    submissionsRepository = module.get(SubmissionsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return an array of submissions', async () => {
    await submissionsRepository.create({
      challengeId: randomUUID(),
      repositoryUrl: 'https://github.com/example/repo-1',
    });
    await submissionsRepository.create({
      challengeId: randomUUID(),
      repositoryUrl: 'https://github.com/example/repo-2',
    });

    const result = await sut.execute({ perPage: 10 });

    expect(result).toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            grade: null,
            status: SubmissionStatus.Pending,
            repositoryUrl: 'https://github.com/example/repo-1',
          }),
          expect.objectContaining({
            grade: null,
            status: SubmissionStatus.Pending,
            repositoryUrl: 'https://github.com/example/repo-2',
          }),
        ],
      }),
    );
  });

  it('should return an empty array if no submissions are found', async () => {
    const result = await sut.execute({ perPage: 10 });

    expect(result).toEqual(
      expect.objectContaining({
        items: [],
      }),
    );
  });

  it('should filter submissions by status', async () => {
    await submissionsRepository.create({
      challengeId: randomUUID(),
      repositoryUrl: 'https://github.com/example/repo-1',
    });

    const result = await sut.execute({ status: SubmissionStatus.Pending, perPage: 10 });

    expect(result).toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            grade: null,
            status: SubmissionStatus.Pending,
            repositoryUrl: 'https://github.com/example/repo-1',
          }),
        ],
      }),
    );
  });

  it('should filter submissions by challengeId', async () => {
    const challengeId = randomUUID();
    await submissionsRepository.create({
      challengeId,
      repositoryUrl: 'https://github.com/example/repo-1',
    });

    const result = await sut.execute({ challengeId, perPage: 10 });

    expect(result).toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            grade: null,
            status: SubmissionStatus.Pending,
            repositoryUrl: 'https://github.com/example/repo-1',
          }),
        ],
      }),
    );
  });

  it('should filter submissions by date range', async () => {
    await submissionsRepository.create(
      makeSubmission({
        createdAt: new Date('2025-05-02'),
      }),
    );
    await submissionsRepository.create(
      makeSubmission({
        createdAt: new Date('2025-05-05'),
      }),
    );

    const result = await sut.execute({
      dateRange: {
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-04'),
      },
      perPage: 10,
    });

    expect(result).toEqual(
      expect.objectContaining({
        items: [
          expect.objectContaining({
            createdAt: new Date('2025-05-02'),
          }),
        ],
      }),
    );
  });

  it('should return paginated results', async () => {
    for (let i = 0; i < 25; i++) {
      await submissionsRepository.create(makeSubmission());
    }

    const result = await sut.execute({ perPage: 10, page: 2 });

    expect(result.items.length).toBe(10);
    expect(result.pagination.total).toBe(25);
    expect(result.pagination.perPage).toBe(10);
    expect(result.pagination.page).toBe(2);
  });
});
