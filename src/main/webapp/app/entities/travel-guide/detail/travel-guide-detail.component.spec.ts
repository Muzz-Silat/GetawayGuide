import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TravelGuideDetailComponent } from './travel-guide-detail.component';

describe('TravelGuide Management Detail Component', () => {
  let comp: TravelGuideDetailComponent;
  let fixture: ComponentFixture<TravelGuideDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TravelGuideDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ travelGuide: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TravelGuideDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TravelGuideDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load travelGuide on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.travelGuide).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
