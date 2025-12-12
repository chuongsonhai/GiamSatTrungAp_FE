import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit, OnDestroy {
  @Input() response: string;

  isLoadingForm$ = new BehaviorSubject<boolean>(true);
  private subscriptions: Subscription[] = [];

  imageSrc: string | null = null;
  imageHeight: string = '400px';

  constructor(public modal: NgbActiveModal) {}

  ngOnInit(): void {
    if (this.response) {
      this.loadImageFromBase64(this.response);
    } else {
      this.isLoadingForm$.next(false);
    }
  }

  loadImageFromBase64(base64Str: string): void {
    try {
      // Assuming the base64 string is just the raw base64, add prefix
      this.imageSrc = `data:image/png;base64,${base64Str}`;
      this.imageHeight = (window.outerHeight / 2) + 'px';
    } catch (error) {
      console.error('Error decoding base64 image:', error);
      this.imageSrc = null;
    } finally {
      this.isLoadingForm$.next(false);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
