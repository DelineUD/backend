import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

/** Проверяет, что параметр id запроса соответствует авторизованному пользаку */
@Injectable()
export class UserIsResidentFromParams implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const params = request.params;
    const user = request.user;

    return user._id.toString() === params._id;
  }
}
