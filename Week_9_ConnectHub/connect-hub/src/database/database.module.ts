import { Module, Global } from '@nestjs/common';
import { Pool } from '@neondatabase/serverless';

@Global()
@Module({
  providers: [
    {
      provide: 'NEON_POOL',
      useFactory: (): Pool => {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
          throw new Error('DATABASE_URL environment variable is not defined');
        }
        return new Pool({ connectionString });
      },
    },
  ],
  exports: ['NEON_POOL'],
})
export class DatabaseModule {}
