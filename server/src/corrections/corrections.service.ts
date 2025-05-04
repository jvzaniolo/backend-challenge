import { Inject, Injectable } from '@nestjs/common';
import { ClientKafkaProxy } from '@nestjs/microservices';
import { z } from 'zod';
import { SubmissionStatus } from '~/submissions/submission.entity';

const CorrectionResponseSchema = z.object({
  repositoryUrl: z.string().url(),
  grade: z.number(),
  status: z.nativeEnum(SubmissionStatus),
});

@Injectable()
export class CorrectionsService {
  constructor(
    @Inject('CORRECTIONS_SERVICE')
    private readonly correctionsService: ClientKafkaProxy,
  ) {}

  /**
   * Sends a correction request to the corrections service.
   * @param data - The data to send to the corrections service.
   * @returns The response from the corrections service.
   */
  async send(data: {
    submissionId: string;
    repositoryUrl: string;
  }): Promise<z.infer<typeof CorrectionResponseSchema>> {
    let possibleCorrection: unknown;

    try {
      possibleCorrection = await new Promise((resolve, reject) => {
        this.correctionsService.send('challenge.correction', data).subscribe({
          next: resolve,
          error: reject,
        });
      });
    } catch {
      throw new Error('Error while connecting to the corrections service.');
    }

    return CorrectionResponseSchema.parse(possibleCorrection);
  }
}
