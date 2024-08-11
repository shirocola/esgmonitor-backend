import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../interfaces/controllers/user.controller';
import { UserRepositoryImpl } from '../infrastructure/repositories/user.repository-impl';
import { CreateUserUseCase } from '../application/usecases/create-user.usecase';
import { UpdateUserUseCase } from '../application/usecases/update-user.usecase';
import { DeleteUserUseCase } from '../application/usecases/delete-user.usecase';
import { User } from '../domain/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: ['UserRepository'],
})
export class UserModule {}
