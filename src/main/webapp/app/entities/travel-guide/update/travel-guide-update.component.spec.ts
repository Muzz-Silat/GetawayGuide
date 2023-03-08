import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TravelGuideFormService } from './travel-guide-form.service';
import { TravelGuideService } from '../service/travel-guide.service';
import { ITravelGuide } from '../travel-guide.model';
import { ITag } from 'app/entities/tag/tag.model';
import { TagService } from 'app/entities/tag/service/tag.service';

import { TravelGuideUpdateComponent } from './travel-guide-update.component';

describe('TravelGuide Management Update Component', () => {
  let comp: TravelGuideUpdateComponent;
  let fixture: ComponentFixture<TravelGuideUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let travelGuideFormService: TravelGuideFormService;
  let travelGuideService: TravelGuideService;
  let tagService: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TravelGuideUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TravelGuideUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TravelGuideUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    travelGuideFormService = TestBed.inject(TravelGuideFormService);
    travelGuideService = TestBed.inject(TravelGuideService);
    tagService = TestBed.inject(TagService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Tag query and add missing value', () => {
      const travelGuide: ITravelGuide = { id: 456 };
      const tags: ITag[] = [{ id: 27583 }];
      travelGuide.tags = tags;

      const tagCollection: ITag[] = [{ id: 95140 }];
      jest.spyOn(tagService, 'query').mockReturnValue(of(new HttpResponse({ body: tagCollection })));
      const additionalTags = [...tags];
      const expectedCollection: ITag[] = [...additionalTags, ...tagCollection];
      jest.spyOn(tagService, 'addTagToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ travelGuide });
      comp.ngOnInit();

      expect(tagService.query).toHaveBeenCalled();
      expect(tagService.addTagToCollectionIfMissing).toHaveBeenCalledWith(tagCollection, ...additionalTags.map(expect.objectContaining));
      expect(comp.tagsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const travelGuide: ITravelGuide = { id: 456 };
      const tag: ITag = { id: 49529 };
      travelGuide.tags = [tag];

      activatedRoute.data = of({ travelGuide });
      comp.ngOnInit();

      expect(comp.tagsSharedCollection).toContain(tag);
      expect(comp.travelGuide).toEqual(travelGuide);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITravelGuide>>();
      const travelGuide = { id: 123 };
      jest.spyOn(travelGuideFormService, 'getTravelGuide').mockReturnValue(travelGuide);
      jest.spyOn(travelGuideService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ travelGuide });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: travelGuide }));
      saveSubject.complete();

      // THEN
      expect(travelGuideFormService.getTravelGuide).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(travelGuideService.update).toHaveBeenCalledWith(expect.objectContaining(travelGuide));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITravelGuide>>();
      const travelGuide = { id: 123 };
      jest.spyOn(travelGuideFormService, 'getTravelGuide').mockReturnValue({ id: null });
      jest.spyOn(travelGuideService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ travelGuide: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: travelGuide }));
      saveSubject.complete();

      // THEN
      expect(travelGuideFormService.getTravelGuide).toHaveBeenCalled();
      expect(travelGuideService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITravelGuide>>();
      const travelGuide = { id: 123 };
      jest.spyOn(travelGuideService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ travelGuide });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(travelGuideService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTag', () => {
      it('Should forward to tagService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tagService, 'compareTag');
        comp.compareTag(entity, entity2);
        expect(tagService.compareTag).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
