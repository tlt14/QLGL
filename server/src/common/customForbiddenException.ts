// Tạo một CustomForbiddenException
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomForbiddenException extends HttpException {
  constructor() {
    super('Access denied', HttpStatus.FORBIDDEN);
  }
}
