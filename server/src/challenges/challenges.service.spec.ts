import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { ILike, Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { ChallengesService } from './challenges.service';

const challengesArray = [
  {
    id: randomUUID(),
    title: 'Back-end Challenge',
    description: 'This is a back-end challenge',
    createdAt: new Date(),
  },
  {
    id: randomUUID(),
    title: 'Front-end Challenge',
    description: 'This is a front-end challenge',
    createdAt: new Date(),
  },
];

const oneChallenge = {
  id: randomUUID(),
  title: 'Back-end Challenge',
  description: 'This is a back-end challenge',
  createdAt: new Date(),
};

describe('ChallengesService', () => {
  let service: ChallengesService;
  let repository: Repository<Challenge>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: getRepositoryToken(Challenge),
          useValue: {
            create: jest.fn().mockResolvedValue(oneChallenge),
            find: jest.fn().mockResolvedValue(challengesArray),
            save: jest.fn().mockResolvedValue(oneChallenge),
            findOneBy: jest.fn().mockResolvedValue(oneChallenge),
            delete: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ChallengesService);
    repository = module.get(getRepositoryToken(Challenge));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMany()', () => {
    it('should return an array of challenges', async () => {
      const result = await service.findMany({ perPage: 10 });

      expect(result).toEqual(challengesArray);
    });

    it('should filter challenges by title', async () => {
      const title = 'Back-end Challenge';
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(challengesArray.filter((challenge) => challenge.title.includes(title)));
      const result = await service.findMany({ title, perPage: 10 });

      expect(findSpy).toHaveBeenCalledWith({
        skip: undefined,
        take: 10,
        where: {
          title: ILike(`%${title}%`),
          description: undefined,
        },
        relations: {
          submissions: true,
        },
      });
      expect(result).toEqual([
        expect.objectContaining({
          title: 'Back-end Challenge',
          description: 'This is a back-end challenge',
        }),
      ]);
    });

    it('should filter challenges by description', async () => {
      const description = 'front-end';
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(
          challengesArray.filter((challenge) => challenge.description.includes(description)),
        );
      const result = await service.findMany({ description, perPage: 10 });

      expect(findSpy).toHaveBeenCalledWith({
        skip: undefined,
        take: 10,
        where: {
          title: undefined,
          description: ILike(`%${description}%`),
        },
        relations: {
          submissions: true,
        },
      });
      expect(result).toEqual([
        expect.objectContaining({
          title: 'Front-end Challenge',
          description: 'This is a front-end challenge',
        }),
      ]);
    });

    it('should paginate results', async () => {
      const page = 2;
      const perPage = 1;
      const findSpy = jest
        .spyOn(repository, 'find')
        .mockResolvedValue(challengesArray.slice((page - 1) * perPage, page * perPage));
      const result = await service.findMany({ page, perPage });

      expect(findSpy).toHaveBeenCalledWith({
        skip: (page - 1) * perPage,
        take: perPage,
        where: {
          title: undefined,
          description: undefined,
        },
        relations: {
          submissions: true,
        },
      });
      expect(result).toEqual([
        expect.objectContaining({
          title: 'Front-end Challenge',
          description: 'This is a front-end challenge',
        }),
      ]);
    });
  });

  describe('create()', () => {
    it('should successfully insert a challenge', async () => {
      await expect(
        service.create({
          title: 'Back-end Challenge',
          description: 'This is a back-end challenge',
        }),
      ).resolves.toEqual(expect.objectContaining(oneChallenge));
    });
  });

  describe('update()', () => {
    it('should update a challenge', async () => {
      const mergeSpy = jest.spyOn(repository, 'merge');
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        createdAt: new Date(),
      });
      const returnValue = await service.update('1', {
        title: 'Updated Title',
        description: 'Updated Description',
      });

      expect(mergeSpy).toHaveBeenCalledWith(oneChallenge, {
        title: 'Updated Title',
        description: 'Updated Description',
      });
      expect(returnValue).toEqual(
        expect.objectContaining({
          title: 'Updated Title',
          description: 'Updated Description',
        }),
      );
    });

    it('should throw an error when trying to update a non-existing challenge', async () => {
      const mergeSpy = jest.spyOn(repository, 'merge');
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.update('1', {
          title: 'Updated Title',
          description: 'Updated Description',
        }),
      ).rejects.toThrow('Challenge not found');

      expect(mergeSpy).not.toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('delete()', () => {
    it('should call delete with the passed value', async () => {
      const deleteSpy = jest.spyOn(repository, 'delete');
      const returnValue = await service.delete('1');

      expect(deleteSpy).toHaveBeenCalledWith('1');
      expect(returnValue).toEqual(oneChallenge);
    });

    it('should throw an error when trying to delete a non-existing challenge', async () => {
      const deleteSpy = jest.spyOn(repository, 'delete');
      const findOneBySpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow('Challenge not found');

      expect(deleteSpy).not.toHaveBeenCalled();
      expect(findOneBySpy).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
