import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'data is wrong' })
  name: string;
  @Length(5, 255)
  description: string;
  @IsDateString()
  when: string | Date;
  @Length(5, 255, { groups: ['create'] })
  @Length(5, 20, { groups: ['update'] })
  address: string;
}
