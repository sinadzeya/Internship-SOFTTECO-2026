import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';

@Entity('users')
export class User {
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 254, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  bio?: string;

  @Column({ type: 'varchar', nullable: true })
  currentHashedRefreshToken?: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
