import { Injectable } from '@nestjs/common';
import { Challenge } from './challenge.model';

@Injectable()
export class ChallengeService {
  findMany(): Promise<Challenge[]> {
    return Promise.resolve([
      {
        id: '1',
        title: 'Sample Challenge',
        description: 'This is a sample challenge description.',
        createdAt: new Date(),
      },
    ]);
  }
}
