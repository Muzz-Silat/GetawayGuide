import dayjs from 'dayjs/esm';

export interface ITravelGuide {
  id: number;
  place?: string | null;
  weather?: dayjs.Dayjs | null;
}

export type NewTravelGuide = Omit<ITravelGuide, 'id'> & { id: null };
