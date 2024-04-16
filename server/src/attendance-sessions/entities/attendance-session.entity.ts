import { Class } from 'src/classes/entities/class.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AttendanceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Class)
  @JoinTable()
  class: Class;
  @Column('text', { nullable: false })
  session_date: string;
  @Column({ nullable: true })
  description: string;
}
