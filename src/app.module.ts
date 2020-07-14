import {
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  DynamicModule,
} from '@nestjs/common';
import { CorsMiddleware } from './middleware/cors-middleware';
import { WebhookValidationMiddleware } from './middleware/webhook-validation-middleware';

import { AppService } from './app.service';
import { CiEventsModule } from './components/ci-events/ci-events.module';

export class AppModule implements NestModule {
  public static forRoot(): DynamicModule {
    return {
      module: AppModule,
      imports: [CiEventsModule],
      providers: [AppService],
    };
  }
  configure(consumer: MiddlewareConsumer) {
    const webhookUrls = ['/cloud-ci-events'];
    for (const webhookUrl of webhookUrls) {
      consumer.apply(WebhookValidationMiddleware).forRoutes({
        path: webhookUrl,
        method: RequestMethod.OPTIONS,
      });
    }
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
