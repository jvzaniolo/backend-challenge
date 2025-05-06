import { ChallengesRepository } from '../../repositories/challenges.repository';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { ListChallengesUseCase } from './list-challenges';

describe('List challenges use case', () => {
  let sut: ListChallengesUseCase;
  let challengesRepository: ChallengesRepository;

  beforeEach(async () => {
    challengesRepository = new FakeChallengesRepository();
    sut = new ListChallengesUseCase(challengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return an array of challenges', async () => {
    await challengesRepository.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });
    await challengesRepository.create({
      title: 'Front-end Challenge',
      description: 'This is a front-end challenge',
    });

    const result = await sut.execute({ perPage: 10 });

    expect(result).toEqual({
      items: [
        expect.objectContaining({
          title: 'Back-end Challenge',
          description: 'This is a back-end challenge',
        }),
        expect.objectContaining({
          title: 'Front-end Challenge',
          description: 'This is a front-end challenge',
        }),
      ],
      pagination: { total: 2, page: 1, perPage: 10 },
    });
  });

  it('should filter challenges by title', async () => {
    await challengesRepository.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });

    const result = await sut.execute({ title: 'Back', perPage: 10 });

    expect(result).toEqual({
      items: [
        expect.objectContaining({
          title: 'Back-end Challenge',
          description: 'This is a back-end challenge',
        }),
      ],
      pagination: { total: 1, page: 1, perPage: 10 },
    });
  });

  it('should filter challenges by description', async () => {
    await challengesRepository.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });
    const result = await sut.execute({ description: 'back-end', perPage: 10 });

    expect(result).toEqual({
      items: [
        expect.objectContaining({
          title: 'Back-end Challenge',
          description: 'This is a back-end challenge',
        }),
      ],
      pagination: { total: 1, page: 1, perPage: 10 },
    });
  });
});
