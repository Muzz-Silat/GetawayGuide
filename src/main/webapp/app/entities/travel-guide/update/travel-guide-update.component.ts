import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TravelGuideFormService, TravelGuideFormGroup } from './travel-guide-form.service';
import { ITravelGuide } from '../travel-guide.model';
import { TravelGuideService } from '../service/travel-guide.service';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

@Component({
  selector: 'jhi-travel-guide-update',
  templateUrl: './travel-guide-update.component.html',
})
export class TravelGuideUpdateComponent implements OnInit {
  isSaving = false;
  travelGuide: ITravelGuide | null = null;

  tagsSharedCollection: ITag[] = [];

  editForm: TravelGuideFormGroup = this.travelGuideFormService.createTravelGuideFormGroup();

  constructor(
    protected travelGuideService: TravelGuideService,
    protected travelGuideFormService: TravelGuideFormService,
    protected tagService: TagService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTag = (o1: ITag | null, o2: ITag | null): boolean => this.tagService.compareTag(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ travelGuide }) => {
      this.travelGuide = travelGuide;
      if (travelGuide) {
        this.updateForm(travelGuide);
      }

      this.loadRelationshipsOptions();
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

    this.tagsSharedCollection = this.tagService.addTagToCollectionIfMissing<ITag>(this.tagsSharedCollection, ...(travelGuide.tags ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.tagService
      .query()
      .pipe(map((res: HttpResponse<ITag[]>) => res.body ?? []))
      .pipe(map((tags: ITag[]) => this.tagService.addTagToCollectionIfMissing<ITag>(tags, ...(this.travelGuide?.tags ?? []))))
      .subscribe((tags: ITag[]) => (this.tagsSharedCollection = tags));
  }
}
