import { AppDataSource } from '../../functions/datasource';
import { User } from '../users/users.entity';
import { Skill } from './skills.entity';

const repository = AppDataSource.getRepository(Skill);
const userRepository = AppDataSource.getRepository(User);

export const createSkill = async (name: string, role: 'teacher' | 'learner', userId: string) => {
  const findUser = await userRepository.findOne({
    where: { id: userId }
  })

  const skill = new Skill();
  skill.user = findUser
  skill.name = name
  skill.role = role

  const newSkill = repository.create(skill);
  return await repository.save(newSkill);
};

export const getSkills = async () => {
  return await repository.find();
};

export const updateSkill = async (id: string, userId: string, name?: string, role?: 'teacher' | 'learner') => {

  const skillToUpdate = await repository.findOneBy({ id });
  if (!skillToUpdate) throw new Error('not_found');

  if (skillToUpdate.user.id !== userId) {
    throw new Error('unauthorized');
  }

  if (name) skillToUpdate.name = name;
  if (['teacher', 'learner'].includes(role)) skillToUpdate.role = role;

  return await repository.save(skillToUpdate);
};

export const deleteSkill = async (id: string, userId: string) => {
  const skillToUpdate = await repository.findOneBy({ id });

  if (skillToUpdate.user.id !== userId) {
    throw new Error('unauthorized');
  }

  const deleteResult = await repository.delete(id);
  if (deleteResult.affected === 0) throw new Error('not_found');
};
