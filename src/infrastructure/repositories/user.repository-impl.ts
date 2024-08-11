import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  async createUser(user: User): Promise<void> {
    this.users.push(user);
  }

  async updateUser(id: string, user: Partial<User>): Promise<void> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }
}
