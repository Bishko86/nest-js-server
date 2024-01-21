import { IsEnum } from 'class-validator';
import { AttendeeAnswer } from 'src/enums/attendee-answer.enum';
import { EventEntity } from '../entities/event.entity';
import { User } from 'src/auth/user.entity';

export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswer)
  answer: AttendeeAnswer;

  name: string;

  event: EventEntity;

  user: User;
}
