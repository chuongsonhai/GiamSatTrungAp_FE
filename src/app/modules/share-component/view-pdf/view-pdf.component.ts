import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent implements OnInit {
  @Input() response: string;
  isLoading: boolean;
  isLocked: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private sanitizer: DomSanitizer, public modal: NgbActiveModal,) { }
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  safeSrc: SafeResourceUrl;
  height: string;
  src: string;
  ngOnInit(): void {
    this.getPdf();
  }
  getPdf() {
    if (this.response !== undefined) {
      var binary_string = window.atob(this.response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      this.src = URL.createObjectURL(file);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      this.height = window.outerHeight / 2 + 'px';
    }
    else {
      this.modal.dismiss();
    }
  }
  getUrl(key: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
