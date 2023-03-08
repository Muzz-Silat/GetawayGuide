import dayjs from 'dayjs/esm';
import { ITag } from 'app/entities/tag/tag.model';

export interface ITravelGuide {
  id: number;
  place?: string | null;
  weather?: dayjs.Dayjs | null;
  tags?: Pick<ITag, 'id' | 'name'>[] | null;
}

export type NewTravelGuide = Omit<ITravelGuide, 'id'> & { id: null };
