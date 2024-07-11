import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Интерцептор для проверки актуальности версии приложения
 */
@Injectable()
export class AppVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const appVersion = req.headers['app-version'];

    if (!appVersion || appVersion !== '1.0.8') {
      throw new HttpException(
        'Пожалуйста, обновите ваше приложение до последней версии!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return next.handle();
  }
}
