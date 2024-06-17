import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUniqueArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isUniqueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const arr: string[] = Array.from([value]).flat();

          if (!Array.isArray(arr)) {
            return false;
          }
          const uniqueValues = new Set(arr);
          return uniqueValues.size === arr.length;
        },
      },
    });
  };
}
