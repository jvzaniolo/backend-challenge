import { ClientKafkaProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';
import { ChallengesRepository } from '../../../challenges/repositories/challenges.repository';
import { FakeChallengesRepository } from '../../../challenges/repositories/fake/fake-challenges.repository';
import { SubmissionStatus } from '../../entities/submission.entity';
import { FakeSubmissionsRepository } from '../../repositories/fake/fake-submissions.repository';
import { SubmissionsRepository } from '../../repositories/submissions-repository.interface';
import { SubmitChallengeUseCase } from './submit-challenge';

describe('Submit challenge use case', () => {
  let sut: SubmitChallengeUseCase;
  let challengesRepository: ChallengesRepository;
  let submissionsRepository: SubmissionsRepository;
  let kafkaClient: ClientKafkaProxy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SubmitChallengeUseCase,
        {
          provide: SubmissionsRepository,
          useClass: FakeSubmissionsRepository,
        },
        {
          provide: ChallengesRepository,
          useClass: FakeChallengesRepository,
        },
        {
          provide: 'SUBMISSION_KAFKA',
          useValue: {
            send: jest.fn().mockReturnValue({
              subscribe: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    sut = module.get(SubmitChallengeUseCase);
    kafkaClient = module.get('SUBMISSION_KAFKA');
    challengesRepository = module.get(ChallengesRepository);
    submissionsRepository = module.get(SubmissionsRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should submit a challenge for correction', async () => {
    const challenge = await challengesRepository.create({
      title: 'Test Challenge',
      description: 'Test Description',
    });

    const submission = await sut.execute({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/repo',
    });

    expect(submission).toBeDefined();
    expect(submission.id).toBeDefined();
    expect(submission.grade).toBeNull();
    expect(submission.status).toEqual(SubmissionStatus.Pending);
  });

  it('should throw an error if the repository URL is invalid', async () => {
    const challenge = await challengesRepository.create({
      title: 'Test Challenge',
      description: 'Test Description',
    });

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

  it('should send a message to the Kafka topic `challenge.correction`', async () => {
    const challenge = await challengesRepository.create({
      title: 'Test Challenge',
      description: 'Test Description',
    });

    const submission = await sut.execute({
      challengeId: challenge.id,
      repositoryUrl: 'https://github.com/user/repo',
    });

    const sendSpy = jest.spyOn(kafkaClient, 'send');

    expect(sendSpy).toHaveBeenCalledWith('challenge.correction', {
      submissionId: submission.id,
      repositoryUrl: submission.repositoryUrl,
    });
    expect(sendSpy).toHaveBeenCalledTimes(1);
  });
});
