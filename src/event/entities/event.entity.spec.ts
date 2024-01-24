import { EventEntity } from './event.entity';

test('EventEntity should be initialized with constructor', () => {
  const event = new EventEntity({
    name: 'Testing Name',
    description: 'Description event',
  });

  expect(event).toEqual({
    name: 'Testing Name',
    description: 'Description event',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined,
  });
});
