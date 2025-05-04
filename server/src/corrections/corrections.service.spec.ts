import { Test } from '@nestjs/testing';
import { CorrectionsService } from './corrections.service';

const correction = {
  repositoryUrl: 'https://github.com/user/repo',
  status: 'Done',
  grade: 10,
};

describe('CorrectionsService', () => {
  let service: CorrectionsService;
  let client: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CorrectionsService,
        {
          provide: 'CORRECTIONS_SERVICE',
          useValue: {
            subscribeToResponseOf: jest.fn(),
            connect: jest.fn(),
            close: jest.fn(),
            send: jest.fn().mockReturnValue({
              subscribe: jest.fn().mockImplementation((callback) => {
                callback.next(correction);
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get(CorrectionsService);
    client = module.get('CORRECTIONS_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a submission to the corrections service', async () => {
    const result = await service.send({
      submissionId: '1',
      repositoryUrl: 'https://github.com/user/repo',
    });

    expect(result).toEqual(correction);
  });

  it('should throw an error if the corrections service is not available', async () => {
    jest.spyOn(client, 'send').mockReturnValueOnce({
      subscribe: jest.fn().mockImplementation((callback) => {
        callback.error(new Error('Service unavailable'));
      }),
    });

    await expect(
      service.send({
        submissionId: '1',
        repositoryUrl: 'https://github.com/user/repo',
      }),
    ).rejects.toThrow('Error while connecting to the corrections service.');
  });
});
