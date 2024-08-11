import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/usecases/create-user.usecase';
import { UpdateUserUseCase } from '../../application/usecases/update-user.usecase';
import { DeleteUserUseCase } from '../../application/usecases/delete-user.usecase';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Response } from 'express';
import { User } from '../../domain/entities/user.entity';
import { v4 as uuidv4 } from 'uuid'; // Assuming you're using UUIDs for generating IDs

@Controller('api/users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = new User(
      uuidv4(), // Generate a unique ID
      createUserDto.username,
      createUserDto.email,
      createUserDto.role,
    );
    await this.createUserUseCase.execute(user);
    return res.status(200).json({ message: 'User created successfully' });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = new User(
      id,
      updateUserDto.username,
      updateUserDto.email,
      updateUserDto.role,
    );
    await this.updateUserUseCase.execute(id, user); // Pass both the ID and user object
    return res.status(200).json({ message: 'User updated successfully' });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    await this.deleteUserUseCase.execute(id);
    return res.status(200).json({ message: 'User deleted successfully' });
  }
}
