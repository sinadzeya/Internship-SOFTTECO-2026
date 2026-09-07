import { api } from '@/lib/axios.ts';
import type { UserData } from '@/services/user.service.ts';

export interface PostData {
  id: string;
  user: UserData;
  title: string;
  content: string;
  category: PostCategory;
}

export interface CreatePostDto {
  title: string;
  content: string;
  category: PostCategory;
}

export const PostCategory = {
  DISCUSSION: 'discussion',

  BOOK: 'book',
  MOVIE: 'movie',
  MUSIC: 'music',
  GAME: 'game',
  ART: 'art',
  THEATER: 'theater',
  ANIME: 'anime',
  PODCAST: 'podcast',

  SPORT: 'sport',
  TRAVEL: 'travel',
  FOOD: 'food',
  FASHION: 'fashion',
  PETS: 'pets',
  GARDENING: 'gardening',
  BOARD_GAMES: 'board_games',
  DIY: 'diy',

  FEMINISM: 'feminism',
  POLITICS: 'politics',
  SOCIETY: 'society',
  ECOLOGY: 'ecology',

  SCIENCE: 'science',
  TECH: 'tech',
  LANGUAGES: 'languages',
  HISTORY: 'history',
  PHILOSOPHY: 'philosophy',
  BUSINESS: 'business',

  FITNESS: 'fitness',
  CAREER: 'career',
  EDUCATION: 'education',
  MENTAL_HEALTH: 'mental_health',

  OTHER: 'other',
} as const;

export type PostCategory = typeof PostCategory[keyof typeof PostCategory];

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  [PostCategory.DISCUSSION]: 'General Discussion',
  [PostCategory.BOOK]: 'Books',
  [PostCategory.MOVIE]: 'Movies & TV',
  [PostCategory.MUSIC]: 'Music',
  [PostCategory.GAME]: 'Video Games',
  [PostCategory.ART]: 'Art & Design',
  [PostCategory.THEATER]: 'Theater',
  [PostCategory.ANIME]: 'Anime & Manga',
  [PostCategory.PODCAST]: 'Podcasts',
  [PostCategory.SPORT]: 'Sports',
  [PostCategory.TRAVEL]: 'Travel',
  [PostCategory.FOOD]: 'Food & Cooking',
  [PostCategory.FASHION]: 'Fashion & Style',
  [PostCategory.PETS]: 'Pets & Animals',
  [PostCategory.GARDENING]: 'Gardening',
  [PostCategory.BOARD_GAMES]: 'Board Games',
  [PostCategory.DIY]: 'DIY & Crafts',
  [PostCategory.FEMINISM]: 'Feminism',
  [PostCategory.POLITICS]: 'Politics',
  [PostCategory.SOCIETY]: 'Society & Activism',
  [PostCategory.ECOLOGY]: 'Ecology & Environment',
  [PostCategory.SCIENCE]: 'Science',
  [PostCategory.TECH]: 'Technology',
  [PostCategory.LANGUAGES]: 'Languages',
  [PostCategory.HISTORY]: 'History',
  [PostCategory.PHILOSOPHY]: 'Philosophy',
  [PostCategory.BUSINESS]: 'Business & Finance',
  [PostCategory.FITNESS]: 'Fitness & Health',
  [PostCategory.CAREER]: 'Career & Work',
  [PostCategory.EDUCATION]: 'Education',
  [PostCategory.MENTAL_HEALTH]: 'Mental Health',
  [PostCategory.OTHER]: 'Other',
};

export const postService = {
 async fetchAllPosts(): Promise<PostData[]> {
   const { data } = await api.get<PostData[]>("/api/posts/");
   return data;
 },

 async create(createPostDto: CreatePostDto): Promise<PostData> {
   const { data } = await api.post<PostData>('/api/posts/', createPostDto);
   return data;
 }
};