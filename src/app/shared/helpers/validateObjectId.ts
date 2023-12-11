import { BadRequestException } from '@nestjs/common';

import { splitDtoField } from '@helpers/splitDto';

export const validateObjectId = ({ value }: { value: string }): undefined | string[] => {
  const arrayOfValue = splitDtoField(value);

  if (!arrayOfValue.length) return;
  arrayOfValue.map((el) => {
    if (!/^[0-9a-fA-F]{24}$/.test(el)) {
      throw new BadRequestException('Invalid ObjectId format!');
    }
  });
  console.log(arrayOfValue);
  return arrayOfValue;
};
