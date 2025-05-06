import { Injectable } from '@nestjs/common';
import { PaginatedSubmissions } from '../../entities/submission.entity';
import { SubmissionsRepository } from '../../repositories/typeorm/submissions.repository';
import { ListSubmissionsArgs } from './list-submissions.args';

@Injectable()
export class ListSubmissionsUseCase {
  constructor(private readonly submissionsRepository: SubmissionsRepository) {}

  async execute(args: ListSubmissionsArgs): Promise<PaginatedSubmissions> {
    const { items, pagination } = await this.submissionsRepository.findMany(args);
    return { items, pagination };
  }
}
