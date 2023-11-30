import { ResumeDto } from '@app/resumes/dto/resume.dto';

function normalizeDto(dto: ResumeDto, prefix: string): Record<string, string>[] {
  const { author, ...rest } = dto;
  const entities: Record<string, string>[] = [];

  Object.keys(rest).forEach((key) => {
    const count = +key[key.length - 1] - 1;
    const prefixHere = `${prefix}${count + 1}`;

    if (key.endsWith(prefixHere)) {
      entities[count] = {
        ...entities[count],
        author,
        [key.replace(prefixHere, '')]: rest[key],
      };
    }
  });

  return entities.filter((e) => e.id);
}

export default normalizeDto;
