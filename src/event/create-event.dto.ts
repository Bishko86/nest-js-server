export class CreateEventDto {
  name: string;
  description: string;
  when: string | Date;
  address: string;
}
