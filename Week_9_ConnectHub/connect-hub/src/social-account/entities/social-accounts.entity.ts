import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SocialAccountAccess } from './social-accounts-accesses.entity';
import { User } from '../../user/entities/user.entity';

@Entity('social_accounts')
export class SocialAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  platform!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  accountName!: string;

  @ManyToOne(() => User, (user) => user.socialAccounts, { onDelete: 'CASCADE' })
  owner!: User;

  @OneToMany(() => SocialAccountAccess, (access) => access.socialAccount)
  accesses!: SocialAccountAccess[];

  @CreateDateColumn()
  createdAt!: Date;
}
