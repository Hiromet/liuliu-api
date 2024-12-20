import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DistrictsModule } from './districts/districts.module';
import { ClientsModule } from './clients/clients.module';
import { Clients } from './clients/clients.entity';
import { ProductsModule } from './products/products.module';
import { Products } from './products/products.entity';
import { ProductsCategoryModule } from './products_category/products_category.module';
import { ProductsCategory } from './products_category/products_category.entity';
import { AuthModule } from './auth/auth.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [Clients, Products, ProductsCategory],
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: false,
        logging: true,
      }),
    }),
    ClientsModule,
    ProductsModule,
    DistrictsModule,
    ProductsCategoryModule,
    AuthModule,
    SalesModule,
  ],
})
export class AppModule {}
