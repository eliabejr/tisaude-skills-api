import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';
import { Skill } from '../skills/skills.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.id)
  teacher: User;

  @ManyToOne(() => User, user => user.id)
  learner: User;

  @ManyToOne(() => Skill, skill => skill.id)
  skill: Skill;
}
