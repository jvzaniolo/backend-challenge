import { Test } from '@nestjs/testing';
import { Challenge } from './challenge.entity';
import { ChallengesResolver } from './challenges.resolver';
import { ChallengesService } from './challenges.service';

const challengesArray = [
  {
    id: 'test-id-1',
    title: 'Back-end Challenge',
    description: 'This is a back-end challenge',
    createdAt: new Date(),
  },
  {
    id: 'test-id-2',
    title: 'Front-end Challenge',
    description: 'This is a front-end challenge',
    createdAt: new Date(),
  },
];
const challenge: Challenge = {
  id: 'test-id',
  title: 'Test Challenge',
  description: 'This is a test challenge',
  createdAt: new Date(),
};

describe('ChallengesResolver', () => {
  let service: ChallengesService;
  let resolver: ChallengesResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChallengesResolver,
        {
          provide: ChallengesService,
          useValue: {
            findMany: jest.fn().mockReturnValue(challengesArray),
            create: jest.fn().mockImplementation((challenge: Challenge) => ({
              ...challenge,
              id: 'test-id',
              createdAt: new Date(),
            })),
            update: jest.fn().mockImplementation((_id: string, challenge: Challenge) => ({
              ...challenge,
              id: 'test-id',
              createdAt: new Date(),
            })),
            delete: jest.fn().mockImplementation(() => ({
              ...challenge,
              id: 'test-id',
              createdAt: new Date(),
            })),
          },
        },
      ],
    }).compile();

    service = module.get(ChallengesService);
    resolver = module.get(ChallengesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should query the challenges', async () => {
    const result = await resolver.challenges({ perPage: 10 });

    expect(result).toEqual(challengesArray);
  });

  it('should create a challenge', async () => {
    const createSpy = jest.spyOn(service, 'create');
    const newChallenge = await resolver.createChallenge(challenge.title, challenge.description);

    expect(newChallenge).toEqual(
      expect.objectContaining({
        id: 'test-id',
        title: challenge.title,
        description: challenge.description,
      }),
    );
    expect(createSpy).toHaveBeenCalledWith({
      title: challenge.title,
      description: challenge.description,
    });
  });

  it('should update a challenge', async () => {
    const updateSpy = jest.spyOn(service, 'update');
    const updatedChallenge = await resolver.updateChallenge(
      challenge.id,
      'Updated Title',
      'Updated Description',
    );

    expect(updatedChallenge).toEqual(
      expect.objectContaining({
        id: 'test-id',
        title: 'Updated Title',
        description: 'Updated Description',
      }),
    );
    expect(updateSpy).toHaveBeenCalledWith(challenge.id, {
      title: 'Updated Title',
      description: 'Updated Description',
    });
  });

  it('should delete a challenge', async () => {
    const deleteSpy = jest.spyOn(service, 'delete');
    const deletedChallenge = await resolver.deleteChallenge(challenge.id);

    expect(deletedChallenge).toEqual(
      expect.objectContaining({
        id: 'test-id',
        title: challenge.title,
        description: challenge.description,
      }),
    );
    expect(deleteSpy).toHaveBeenCalledWith(challenge.id);
  });
});
