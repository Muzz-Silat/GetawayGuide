import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TravelGuideFormService, TravelGuideFormGroup } from './travel-guide-form.service';
import { ITravelGuide } from '../travel-guide.model';
import { TravelGuideService } from '../service/travel-guide.service';

@Component({
  selector: 'jhi-travel-guide-update',
  templateUrl: './travel-guide-update.component.html',
})
export class TravelGuideUpdateComponent implements OnInit {
  isSaving = false;
  travelGuide: ITravelGuide | null = null;

  editForm: TravelGuideFormGroup = this.travelGuideFormService.createTravelGuideFormGroup();

  constructor(
    protected travelGuideService: TravelGuideService,
    protected travelGuideFormService: TravelGuideFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ travelGuide }) => {
      this.travelGuide = travelGuide;
      if (travelGuide) {
        this.updateForm(travelGuide);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const travelGuide = this.travelGuideFormService.getTravelGuide(this.editForm);
    if (travelGuide.id !== null) {
      this.subscribeToSaveResponse(this.travelGuideService.update(travelGuide));
    } else {
      this.subscribeToSaveResponse(this.travelGuideService.create(travelGuide));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITravelGuide>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(travelGuide: ITravelGuide): void {
    this.travelGuide = travelGuide;
    this.travelGuideFormService.resetForm(this.editForm, travelGuide);
  }
}
