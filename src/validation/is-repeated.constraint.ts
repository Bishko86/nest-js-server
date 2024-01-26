import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsRepeated(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isRepeated',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!args.object.hasOwnProperty(property)) {
            return false;
          }

          return value === args.object[property];
        },
        defaultMessage(): string {
          return `${propertyName} needs to be identical to ${property}`;
        },
      },
    });
  };
}
