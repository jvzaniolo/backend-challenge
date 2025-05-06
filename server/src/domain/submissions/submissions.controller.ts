import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubmissionStatus } from './entities/submission.entity';
import { SubmissionsService } from './submissions.service';

@Controller()
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @MessagePattern('challenge.correction.reply')
  async handle(
    @Payload()
    data: {
      submissionId: string;
      status: SubmissionStatus;
      grade: number;
      repositoryUrl: string;
    },
  ) {
    await this.submissionsService.update(data);
  }
}
