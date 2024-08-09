import { AppDataSource } from "../../functions/datasource";
import { Skill } from "../skills/skills.entity";
import { User } from "../users/users.entity";
import { Match } from "./match.entity";

const userRepository = AppDataSource.getRepository(User);
const repository = AppDataSource.getRepository(Skill);

export const findMatches = async (userId: string): Promise<Match[]> => {
  const learner = await userRepository.findOne({
    where: { id: userId }
  })
  const learnerSkills = learner.skills.filter(skills => skills.role === 'learner');

  const matches = [];
  for (const learnerSkill of learnerSkills) {
    const teacherUserSkills = await repository.find({
      where: {
        name: learnerSkill.name,
        role: 'teacher'
      },
      relations: ['user', 'skill']
    });

    for (const teacherUserSkill of teacherUserSkills) {
      matches.push({
        teacher: teacherUserSkill.user,
        learner: learner,
        skill: learnerSkill.name,
      });
    }
  }

  return matches;
}