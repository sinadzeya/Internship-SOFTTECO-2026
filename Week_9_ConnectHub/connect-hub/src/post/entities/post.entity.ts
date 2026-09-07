import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum PostCategory {
  BOOK = 'book',
  MOVIE = 'movie',
  MUSIC = 'music',
  GAME = 'game',
  ART = 'art',
  THEATER = 'theater',
  ANIME = 'anime',
  PODCAST = 'podcast',

  SPORT = 'sport',
  TRAVEL = 'travel',
  FOOD = 'food',
  FASHION = 'fashion',
  PETS = 'pets',
  GARDENING = 'gardening',
  BOARD_GAMES = 'board_games',
  DIY = 'diy',

  FEMINISM = 'feminism',
  POLITICS = 'politics',
  SOCIETY = 'society',
  ECOLOGY = 'ecology',

  SCIENCE = 'science',
  TECH = 'tech',
  LANGUAGES = 'languages',
  HISTORY = 'history',
  PHILOSOPHY = 'philosophy',
  BUSINESS = 'business',

  FITNESS = 'fitness',
  CAREER = 'career',
  EDUCATION = 'education',
  MENTAL_HEALTH = 'mental_health',

  DISCUSSION = 'discussion',
  OTHER = 'other',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column({ type: 'uuid', nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  title!: string;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({
    type: 'enum',
    enum: PostCategory,
    default: PostCategory.OTHER,
  })
  category!: PostCategory;

  @CreateDateColumn()
  createdAt!: Date;
}
