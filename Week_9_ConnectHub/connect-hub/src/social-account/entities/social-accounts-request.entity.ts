import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('social_accounts_requests')
export class SocialAccountRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.ownedAccesses, { onDelete: 'CASCADE' })
  owner!: User;

  @ManyToOne(() => User, (user) => user.clientAccesses, { onDelete: 'CASCADE' })
  client!: User;

  @Column({ type: 'boolean', nullable: false })
  fulfilled!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
