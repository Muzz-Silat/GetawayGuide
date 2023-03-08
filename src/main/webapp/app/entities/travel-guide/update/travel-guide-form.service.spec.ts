import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../travel-guide.test-samples';

import { TravelGuideFormService } from './travel-guide-form.service';

describe('TravelGuide Form Service', () => {
  let service: TravelGuideFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelGuideFormService);
  });

  describe('Service methods', () => {
    describe('createTravelGuideFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTravelGuideFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            place: expect.any(Object),
            weather: expect.any(Object),
          })
        );
      });

      it('passing ITravelGuide should create a new form with FormGroup', () => {
        const formGroup = service.createTravelGuideFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            place: expect.any(Object),
            weather: expect.any(Object),
          })
        );
      });
    });

    describe('getTravelGuide', () => {
      it('should return NewTravelGuide for default TravelGuide initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTravelGuideFormGroup(sampleWithNewData);

        const travelGuide = service.getTravelGuide(formGroup) as any;

        expect(travelGuide).toMatchObject(sampleWithNewData);
      });

      it('should return NewTravelGuide for empty TravelGuide initial value', () => {
        const formGroup = service.createTravelGuideFormGroup();

        const travelGuide = service.getTravelGuide(formGroup) as any;

        expect(travelGuide).toMatchObject({});
      });

      it('should return ITravelGuide', () => {
        const formGroup = service.createTravelGuideFormGroup(sampleWithRequiredData);

        const travelGuide = service.getTravelGuide(formGroup) as any;

        expect(travelGuide).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITravelGuide should not enable id FormControl', () => {
        const formGroup = service.createTravelGuideFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTravelGuide should disable id FormControl', () => {
        const formGroup = service.createTravelGuideFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
