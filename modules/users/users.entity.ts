import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Skill } from '../skills/skills.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => Skill, skill => skill.id, { cascade: true })
  @JoinTable()
  skills: Skill[];

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date
}
