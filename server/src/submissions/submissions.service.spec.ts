import { ClientKafkaProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '~/challenges/challenge.entity';
import { Submission, SubmissionStatus } from './submission.entity';
import { SubmissionsService } from './submissions.service';

const challenge: Challenge = {
  id: '1',
  title: 'Challenge 1',
  description: 'Description 1',
  createdAt: new Date(),
};

const submissions: Submission[] = [
  {
    id: '1',
    challengeId: '1',
    repositoryUrl: 'https://github.com/user/repo',
    status: SubmissionStatus.Pending,
    createdAt: new Date('2025-05-01'),
    challenge: challenge,
  },
  {
    id: '2',
    challengeId: '2',
    repositoryUrl: 'https://github.com/user/repo',
    status: SubmissionStatus.Error,
    createdAt: new Date('2025-05-04'),
    challenge: null,
  },
];

describe('SubmissionsService', () => {
  let service: SubmissionsService;
  let repository: Repository<Submission>;
  let submissionKafkaClient: ClientKafkaProxy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubmissionsService,
        {
          provide: getRepositoryToken(Submission),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([submissions, submissions.length]),
            create: jest.fn().mockReturnValue(submissions[0]),
            save: jest.fn().mockResolvedValue(submissions[0]),
            update: jest.fn(),
            merge: jest.fn().mockImplementation((obj, ...values) => {
              return Object.assign(obj, ...values);
            }),
          },
        },
        {
          provide: getRepositoryToken(Challenge),
          useValue: {
            findOneBy: jest.fn().mockImplementation((query: { id: string }) => {
              return Promise.resolve([challenge].find((c) => c.id === query.id));
            }),
          },
        },
        {
          provide: 'SUBMISSION_KAFKA',
          useValue: {
            send: jest.fn().mockReturnValue({
              subscribe: jest.fn().mockImplementation(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get(SubmissionsService);
    repository = module.get(getRepositoryToken(Submission));
    submissionKafkaClient = module.get('SUBMISSION_KAFKA');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitChallenge()', () => {
    it('should create a submission', async () => {
      const result = await service.submitChallenge({
        challengeId: '1',
        repositoryUrl: 'https://github.com/user/repo',
      });

      expect(result).toEqual(submissions[0]);
    });

    it('should throw an error if the repository URL is not a valid GitHub URL', async () => {
      const updateSpy = jest.spyOn(repository, 'update');

      await expect(
        service.submitChallenge({
          challengeId: '1',
          repositoryUrl: 'invalid-url',
        }),
      ).rejects.toThrow('Invalid GitHub repository URL.');
      expect(updateSpy).toHaveBeenCalledWith(submissions[0].id, {
        status: SubmissionStatus.Error,
      });
    });

    it('should throw an error if the challenge does not exist', async () => {
      const updateSpy = jest.spyOn(repository, 'update');

      await expect(
        service.submitChallenge({
          challengeId: '999',
          repositoryUrl: 'https://github.com/user/repo',
        }),
      ).rejects.toThrow('Challenge not found.');
      expect(updateSpy).toHaveBeenCalledWith(submissions[0].id, {
        status: SubmissionStatus.Error,
      });
    });

    it('should send a message to corrections microservice', async () => {
      const sendSpy = jest.spyOn(submissionKafkaClient, 'send');

      const result = await service.submitChallenge({
        challengeId: '1',
        repositoryUrl: 'https://github.com/user/repo',
      });

      expect(result).toEqual(submissions[0]);
      expect(sendSpy).toHaveBeenCalledWith('challenge.correction', {
        submissionId: result.id,
        repositoryUrl: 'https://github.com/user/repo',
      });
    });
  });

  describe('findMany()', () => {
    it('should return all submissions', async () => {
      const result = await service.findMany({ perPage: 10 });

      expect(result).toEqual({
        items: submissions,
        pagination: {
          page: 1,
          perPage: 10,
          total: submissions.length,
        },
      });
    });

    it('should return an empty array if there are no submissions', async () => {
      jest.spyOn(repository, 'findAndCount').mockResolvedValueOnce([[], 0]);

      const result = await service.findMany({ perPage: 10 });

      expect(result).toEqual({ items: [], pagination: { page: 1, perPage: 10, total: 0 } });
    });

    it('should filter submissions by challenge title', async () => {
      const challengeTitle = 'Challenge 1';
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([
          submissions.filter((submission) => submission.challenge?.title.includes(challengeTitle)),
          1,
        ]);

      const result = await service.findMany({ challengeTitle, perPage: 10 });

      expect(result).toEqual({
        items: [submissions[0]],
        pagination: { page: 1, perPage: 10, total: 1 },
      });
    });

    it('should filter submissions by status', async () => {
      const status = SubmissionStatus.Error;
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([
          submissions.filter((submission) => submission.status === status),
          1,
        ]);

      const result = await service.findMany({ status, perPage: 10 });

      expect(result).toEqual({
        items: [submissions[1]],
        pagination: { page: 1, perPage: 10, total: 1 },
      });
    });

    it('should filter submissions by date range', async () => {
      const dateRange = {
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-02'),
      };
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([
          submissions.filter(
            (submission) =>
              submission.createdAt >= dateRange.startDate &&
              submission.createdAt <= dateRange.endDate,
          ),
          1,
        ]);

      const result = await service.findMany({ dateRange, perPage: 10 });

      expect(result).toEqual({
        items: [submissions[0]],
        pagination: { page: 1, perPage: 10, total: 1 },
      });
    });

    it('should paginate the results', async () => {
      const page = 2;
      const perPage = 1;
      const skip = (page - 1) * perPage;
      jest
        .spyOn(repository, 'findAndCount')
        .mockResolvedValueOnce([submissions.slice(skip, page * perPage), submissions.length]);

      const result = await service.findMany({ page, perPage });

      expect(result).toEqual({
        items: [submissions[1]],
        pagination: { page, perPage, total: submissions.length },
      });
    });
  });
});
