import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITravelGuide } from '../travel-guide.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../travel-guide.test-samples';

import { TravelGuideService, RestTravelGuide } from './travel-guide.service';

const requireRestSample: RestTravelGuide = {
  ...sampleWithRequiredData,
  weather: sampleWithRequiredData.weather?.toJSON(),
};

describe('TravelGuide Service', () => {
  let service: TravelGuideService;
  let httpMock: HttpTestingController;
  let expectedResult: ITravelGuide | ITravelGuide[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TravelGuideService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TravelGuide', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const travelGuide = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(travelGuide).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TravelGuide', () => {
      const travelGuide = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(travelGuide).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TravelGuide', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TravelGuide', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TravelGuide', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTravelGuideToCollectionIfMissing', () => {
      it('should add a TravelGuide to an empty array', () => {
        const travelGuide: ITravelGuide = sampleWithRequiredData;
        expectedResult = service.addTravelGuideToCollectionIfMissing([], travelGuide);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(travelGuide);
      });

      it('should not add a TravelGuide to an array that contains it', () => {
        const travelGuide: ITravelGuide = sampleWithRequiredData;
        const travelGuideCollection: ITravelGuide[] = [
          {
            ...travelGuide,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTravelGuideToCollectionIfMissing(travelGuideCollection, travelGuide);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TravelGuide to an array that doesn't contain it", () => {
        const travelGuide: ITravelGuide = sampleWithRequiredData;
        const travelGuideCollection: ITravelGuide[] = [sampleWithPartialData];
        expectedResult = service.addTravelGuideToCollectionIfMissing(travelGuideCollection, travelGuide);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(travelGuide);
      });

      it('should add only unique TravelGuide to an array', () => {
        const travelGuideArray: ITravelGuide[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const travelGuideCollection: ITravelGuide[] = [sampleWithRequiredData];
        expectedResult = service.addTravelGuideToCollectionIfMissing(travelGuideCollection, ...travelGuideArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const travelGuide: ITravelGuide = sampleWithRequiredData;
        const travelGuide2: ITravelGuide = sampleWithPartialData;
        expectedResult = service.addTravelGuideToCollectionIfMissing([], travelGuide, travelGuide2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(travelGuide);
        expect(expectedResult).toContain(travelGuide2);
      });

      it('should accept null and undefined values', () => {
        const travelGuide: ITravelGuide = sampleWithRequiredData;
        expectedResult = service.addTravelGuideToCollectionIfMissing([], null, travelGuide, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(travelGuide);
      });

      it('should return initial array if no TravelGuide is added', () => {
        const travelGuideCollection: ITravelGuide[] = [sampleWithRequiredData];
        expectedResult = service.addTravelGuideToCollectionIfMissing(travelGuideCollection, undefined, null);
        expect(expectedResult).toEqual(travelGuideCollection);
      });
    });

    describe('compareTravelGuide', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTravelGuide(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTravelGuide(entity1, entity2);
        const compareResult2 = service.compareTravelGuide(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTravelGuide(entity1, entity2);
        const compareResult2 = service.compareTravelGuide(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTravelGuide(entity1, entity2);
        const compareResult2 = service.compareTravelGuide(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
