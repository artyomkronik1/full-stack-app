import { Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MetadataModule } from './metadata/metadata.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MetadataModule,
    ThrottlerModule.forRoot({
      ttl: 1,  // Global TTL (Time to Live) in seconds
      limit: 5, // Global limit for requests
    }),
  ],

})
export class AppModule { }
