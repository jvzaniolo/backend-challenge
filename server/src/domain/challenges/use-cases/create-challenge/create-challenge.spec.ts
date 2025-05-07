import { Challenge } from '../../entities/challenge';
import { ChallengesRepository } from '../../repositories/challenges.repository';
import { FakeChallengesRepository } from '../../repositories/fake/fake-challenges.repository';
import { CreateChallengeUseCase } from './create-challenge';

describe('Create challenge use case', () => {
  let sut: CreateChallengeUseCase;
  let fakeChallengesRepository: ChallengesRepository;

  beforeEach(async () => {
    fakeChallengesRepository = new FakeChallengesRepository();
    sut = new CreateChallengeUseCase(fakeChallengesRepository);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a new challenge', async () => {
    const challenge = Challenge.create({
      title: 'Back-end Challenge',
      description: 'This is a back-end challenge',
    });

    await sut.execute(challenge);

    expect(challenge).toBeDefined();
    expect(challenge.id).toBeDefined();
    expect(challenge.title).toBe('Back-end Challenge');
    expect(challenge.description).toBe('This is a back-end challenge');
    expect(challenge.createdAt).toBeInstanceOf(Date);
    expect(challenge.submissions).toHaveLength(0);
  });
});
