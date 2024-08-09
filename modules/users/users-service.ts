import { AppDataSource } from '../../functions/datasource';
import { User } from './users.entity';

const repository = AppDataSource.getRepository(User);

export const createUser = async (name: string, email: string) => {
  const newUser = repository.create({ name, email });
  return await repository.save(newUser);
};

export const getUsers = async () => {
  return await repository.find();
};

export const updateUser = async (id: string, userId: string, name?: string, email?: string) => {
  const repository = AppDataSource.getRepository(User);

  const userToUpdate = await repository.findOneBy({ id });
  if (!userToUpdate) throw new Error('not_found');

  if (userToUpdate.id !== userId) {
    throw new Error('unauthorized');
  }

  if (name) userToUpdate.name = name;
  if (email) userToUpdate.email = email;

  return await repository.save(userToUpdate);
};

export const deleteUser = async (id: string) => {
  const deleteResult = await repository.delete(id);
  if (deleteResult.affected === 0) throw new Error('User not found');
};
