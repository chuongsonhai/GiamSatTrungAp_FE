import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss']
})
export class ViewImageComponent implements OnInit {
  @Input() response: string;
  isLoading: boolean;
  isLocked: boolean;
  private subscriptions: Subscription[] = [];
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  constructor(private sanitizer: DomSanitizer,  public modal: NgbActiveModal,) { }
  safeSrc: SafeResourceUrl;
  height:string;
  src: string;
  ngOnInit(): void {
    this.getPdf();
  }
  getPdf() {
    var binary_string = window.atob(this.response);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    let file = new Blob([bytes.buffer], { type: 'image/png' });
    this.src = URL.createObjectURL(file);
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    this.height=window.outerHeight/2+'px';
  }
  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}
