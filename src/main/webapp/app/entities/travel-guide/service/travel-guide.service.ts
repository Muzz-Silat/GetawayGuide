import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITravelGuide, NewTravelGuide } from '../travel-guide.model';

export type PartialUpdateTravelGuide = Partial<ITravelGuide> & Pick<ITravelGuide, 'id'>;

type RestOf<T extends ITravelGuide | NewTravelGuide> = Omit<T, 'weather'> & {
  weather?: string | null;
};

export type RestTravelGuide = RestOf<ITravelGuide>;

export type NewRestTravelGuide = RestOf<NewTravelGuide>;

export type PartialUpdateRestTravelGuide = RestOf<PartialUpdateTravelGuide>;

export type EntityResponseType = HttpResponse<ITravelGuide>;
export type EntityArrayResponseType = HttpResponse<ITravelGuide[]>;

@Injectable({ providedIn: 'root' })
export class TravelGuideService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/travel-guides');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(travelGuide: NewTravelGuide): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(travelGuide);
    return this.http
      .post<RestTravelGuide>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(travelGuide: ITravelGuide): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(travelGuide);
    return this.http
      .put<RestTravelGuide>(`${this.resourceUrl}/${this.getTravelGuideIdentifier(travelGuide)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(travelGuide: PartialUpdateTravelGuide): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(travelGuide);
    return this.http
      .patch<RestTravelGuide>(`${this.resourceUrl}/${this.getTravelGuideIdentifier(travelGuide)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTravelGuide>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTravelGuide[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTravelGuideIdentifier(travelGuide: Pick<ITravelGuide, 'id'>): number {
    return travelGuide.id;
  }

  compareTravelGuide(o1: Pick<ITravelGuide, 'id'> | null, o2: Pick<ITravelGuide, 'id'> | null): boolean {
    return o1 && o2 ? this.getTravelGuideIdentifier(o1) === this.getTravelGuideIdentifier(o2) : o1 === o2;
  }

  addTravelGuideToCollectionIfMissing<Type extends Pick<ITravelGuide, 'id'>>(
    travelGuideCollection: Type[],
    ...travelGuidesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const travelGuides: Type[] = travelGuidesToCheck.filter(isPresent);
    if (travelGuides.length > 0) {
      const travelGuideCollectionIdentifiers = travelGuideCollection.map(
        travelGuideItem => this.getTravelGuideIdentifier(travelGuideItem)!
      );
      const travelGuidesToAdd = travelGuides.filter(travelGuideItem => {
        const travelGuideIdentifier = this.getTravelGuideIdentifier(travelGuideItem);
        if (travelGuideCollectionIdentifiers.includes(travelGuideIdentifier)) {
          return false;
        }
        travelGuideCollectionIdentifiers.push(travelGuideIdentifier);
        return true;
      });
      return [...travelGuidesToAdd, ...travelGuideCollection];
    }
    return travelGuideCollection;
  }

  protected convertDateFromClient<T extends ITravelGuide | NewTravelGuide | PartialUpdateTravelGuide>(travelGuide: T): RestOf<T> {
    return {
      ...travelGuide,
      weather: travelGuide.weather?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTravelGuide: RestTravelGuide): ITravelGuide {
    return {
      ...restTravelGuide,
      weather: restTravelGuide.weather ? dayjs(restTravelGuide.weather) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTravelGuide>): HttpResponse<ITravelGuide> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTravelGuide[]>): HttpResponse<ITravelGuide[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
