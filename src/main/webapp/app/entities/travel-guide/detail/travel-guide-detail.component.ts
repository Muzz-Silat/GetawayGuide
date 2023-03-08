import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITravelGuide } from '../travel-guide.model';

@Component({
  selector: 'jhi-travel-guide-detail',
  templateUrl: './travel-guide-detail.component.html',
})
export class TravelGuideDetailComponent implements OnInit {
  travelGuide: ITravelGuide | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ travelGuide }) => {
      this.travelGuide = travelGuide;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
