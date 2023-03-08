import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITravelGuide } from '../travel-guide.model';
import { TravelGuideService } from '../service/travel-guide.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './travel-guide-delete-dialog.component.html',
})
export class TravelGuideDeleteDialogComponent {
  travelGuide?: ITravelGuide;

  constructor(protected travelGuideService: TravelGuideService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.travelGuideService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
