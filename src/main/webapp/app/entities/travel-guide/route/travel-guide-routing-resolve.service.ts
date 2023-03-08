import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITravelGuide } from '../travel-guide.model';
import { TravelGuideService } from '../service/travel-guide.service';

@Injectable({ providedIn: 'root' })
export class TravelGuideRoutingResolveService implements Resolve<ITravelGuide | null> {
  constructor(protected service: TravelGuideService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITravelGuide | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((travelGuide: HttpResponse<ITravelGuide>) => {
          if (travelGuide.body) {
            return of(travelGuide.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
