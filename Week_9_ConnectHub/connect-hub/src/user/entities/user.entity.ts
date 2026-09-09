import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { SocialAccount } from '../../social-account/entities/social-accounts.entity';
import { SocialAccountAccess } from '../../social-account/entities/social-accounts-access.entity';

@Entity('users')
export class User {
  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  username!: string;

  @Column({ type: 'varchar', length: 254, unique: true, nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false, select: false })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  currentRefreshToken?: string | null;

  @OneToMany(() => SocialAccount, (account) => account.owner)
  socialAccounts!: SocialAccount[];

  @OneToMany(() => SocialAccountAccess, (access) => access.owner)
  ownedAccesses!: SocialAccountAccess[];

  @OneToMany(() => SocialAccountAccess, (access) => access.client)
  clientAccesses!: SocialAccountAccess[];

  @CreateDateColumn()
  createdAt!: Date;
}
