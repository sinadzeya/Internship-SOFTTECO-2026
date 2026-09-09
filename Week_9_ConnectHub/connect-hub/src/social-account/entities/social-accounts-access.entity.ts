import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocialAccount } from './social-accounts.entity';
import { User } from '../../user/entities/user.entity';

@Entity('social_accounts_access')
export class SocialAccountAccess {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.ownedAccesses, { onDelete: 'CASCADE' })
  owner!: User;

  @ManyToOne(() => User, (user) => user.clientAccesses, { onDelete: 'CASCADE' })
  client!: User;

  @ManyToOne(() => SocialAccount, (account) => account.accesses, {
    onDelete: 'CASCADE',
  })
  socialAccount!: SocialAccount;

  @Column({ type: 'boolean', nullable: false })
  clientHasAccess!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
