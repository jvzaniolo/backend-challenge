import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubmissionStatus } from '../../entities/submission.entity';
import { UpdateSubmissionUseCase } from './update-submission';

@Controller()
export class UpdateSubmissionController {
  constructor(private readonly updateSubmissionUseCase: UpdateSubmissionUseCase) {}

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
    await this.updateSubmissionUseCase.execute(data);
  }
}
