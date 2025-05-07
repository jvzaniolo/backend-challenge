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

    const data = await fakeChallengesRepository.findById(challenge.id);

    expect(data).toBeDefined();
    expect(data?.id).toBeDefined();
    expect(data?.title).toBe('Back-end Challenge');
    expect(data?.description).toBe('This is a back-end challenge');
    expect(data?.createdAt).toBeInstanceOf(Date);
    expect(data?.submissions).toHaveLength(0);
  });
});
