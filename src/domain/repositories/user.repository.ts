import { User } from '../entities/user.entity';

export interface UserRepository {
  createUser(user: User): Promise<void>;
  updateUser(id: string, user: Partial<User>): Promise<void>;
  deleteUser(id: string): Promise<void>;
  findUserById(id: string): Promise<User | undefined>;
}
