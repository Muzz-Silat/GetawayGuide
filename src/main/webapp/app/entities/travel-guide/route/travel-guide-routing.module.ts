import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TravelGuideComponent } from '../list/travel-guide.component';
import { TravelGuideDetailComponent } from '../detail/travel-guide-detail.component';
import { TravelGuideUpdateComponent } from '../update/travel-guide-update.component';
import { TravelGuideRoutingResolveService } from './travel-guide-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const travelGuideRoute: Routes = [
  {
    path: '',
    component: TravelGuideComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TravelGuideDetailComponent,
    resolve: {
      travelGuide: TravelGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TravelGuideUpdateComponent,
    resolve: {
      travelGuide: TravelGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TravelGuideUpdateComponent,
    resolve: {
      travelGuide: TravelGuideRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(travelGuideRoute)],
  exports: [RouterModule],
})
export class TravelGuideRoutingModule {}
