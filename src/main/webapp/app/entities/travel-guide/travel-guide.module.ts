import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TravelGuideComponent } from './list/travel-guide.component';
import { TravelGuideDetailComponent } from './detail/travel-guide-detail.component';
import { TravelGuideUpdateComponent } from './update/travel-guide-update.component';
import { TravelGuideDeleteDialogComponent } from './delete/travel-guide-delete-dialog.component';
import { TravelGuideRoutingModule } from './route/travel-guide-routing.module';

@NgModule({
  imports: [SharedModule, TravelGuideRoutingModule],
  declarations: [TravelGuideComponent, TravelGuideDetailComponent, TravelGuideUpdateComponent, TravelGuideDeleteDialogComponent],
})
export class TravelGuideModule {}
