import dayjs from 'dayjs/esm';

import { ITravelGuide, NewTravelGuide } from './travel-guide.model';

export const sampleWithRequiredData: ITravelGuide = {
  id: 11796,
  place: 'bandwidth',
  weather: dayjs('2023-03-07T16:43'),
};

export const sampleWithPartialData: ITravelGuide = {
  id: 9192,
  place: 'Card Assimilated payment',
  weather: dayjs('2023-03-07T09:17'),
};

export const sampleWithFullData: ITravelGuide = {
  id: 25812,
  place: 'tan index calculate',
  weather: dayjs('2023-03-08T03:02'),
};

export const sampleWithNewData: NewTravelGuide = {
  place: 'supply-chains',
  weather: dayjs('2023-03-07T23:08'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
