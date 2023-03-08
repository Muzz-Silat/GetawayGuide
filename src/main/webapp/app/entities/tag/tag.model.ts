import { IPost } from 'app/entities/post/post.model';
import { ITravelGuide } from 'app/entities/travel-guide/travel-guide.model';

export interface ITag {
  id: number;
  name?: string | null;
  posts?: Pick<IPost, 'id'>[] | null;
  posts?: Pick<ITravelGuide, 'id'>[] | null;
}

export type NewTag = Omit<ITag, 'id'> & { id: null };
