import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITravelGuide, NewTravelGuide } from '../travel-guide.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITravelGuide for edit and NewTravelGuideFormGroupInput for create.
 */
type TravelGuideFormGroupInput = ITravelGuide | PartialWithRequiredKeyOf<NewTravelGuide>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITravelGuide | NewTravelGuide> = Omit<T, 'weather'> & {
  weather?: string | null;
};

type TravelGuideFormRawValue = FormValueOf<ITravelGuide>;

type NewTravelGuideFormRawValue = FormValueOf<NewTravelGuide>;

type TravelGuideFormDefaults = Pick<NewTravelGuide, 'id' | 'weather'>;

type TravelGuideFormGroupContent = {
  id: FormControl<TravelGuideFormRawValue['id'] | NewTravelGuide['id']>;
  place: FormControl<TravelGuideFormRawValue['place']>;
  weather: FormControl<TravelGuideFormRawValue['weather']>;
};

export type TravelGuideFormGroup = FormGroup<TravelGuideFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TravelGuideFormService {
  createTravelGuideFormGroup(travelGuide: TravelGuideFormGroupInput = { id: null }): TravelGuideFormGroup {
    const travelGuideRawValue = this.convertTravelGuideToTravelGuideRawValue({
      ...this.getFormDefaults(),
      ...travelGuide,
    });
    return new FormGroup<TravelGuideFormGroupContent>({
      id: new FormControl(
        { value: travelGuideRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      place: new FormControl(travelGuideRawValue.place, {
        validators: [Validators.required],
      }),
      weather: new FormControl(travelGuideRawValue.weather, {
        validators: [Validators.required],
      }),
    });
  }

  getTravelGuide(form: TravelGuideFormGroup): ITravelGuide | NewTravelGuide {
    return this.convertTravelGuideRawValueToTravelGuide(form.getRawValue() as TravelGuideFormRawValue | NewTravelGuideFormRawValue);
  }

  resetForm(form: TravelGuideFormGroup, travelGuide: TravelGuideFormGroupInput): void {
    const travelGuideRawValue = this.convertTravelGuideToTravelGuideRawValue({ ...this.getFormDefaults(), ...travelGuide });
    form.reset(
      {
        ...travelGuideRawValue,
        id: { value: travelGuideRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TravelGuideFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      weather: currentTime,
    };
  }

  private convertTravelGuideRawValueToTravelGuide(
    rawTravelGuide: TravelGuideFormRawValue | NewTravelGuideFormRawValue
  ): ITravelGuide | NewTravelGuide {
    return {
      ...rawTravelGuide,
      weather: dayjs(rawTravelGuide.weather, DATE_TIME_FORMAT),
    };
  }

  private convertTravelGuideToTravelGuideRawValue(
    travelGuide: ITravelGuide | (Partial<NewTravelGuide> & TravelGuideFormDefaults)
  ): TravelGuideFormRawValue | PartialWithRequiredKeyOf<NewTravelGuideFormRawValue> {
    return {
      ...travelGuide,
      weather: travelGuide.weather ? travelGuide.weather.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
