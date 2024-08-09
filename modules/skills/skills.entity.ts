import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  role: 'teacher' | 'learner';

  @ManyToOne(() => User, user => user.id)
  user: User;

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
