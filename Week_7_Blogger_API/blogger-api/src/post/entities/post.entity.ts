import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt!: Date;
}
