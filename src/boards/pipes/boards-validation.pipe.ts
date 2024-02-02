import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../entity/boards.enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);

    return index !== -1;
  }

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value}는 status option이 아닙니다.`);
    }

    return value;
  }
}
