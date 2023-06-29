import { Component, OnInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HoSoYeuCauService } from 'src/app/modules/services/hosoyeucau.service';
import { catchError, finalize } from 'rxjs/operators';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';
import { ViewImageComponent } from 'src/app/modules/share-component/view-image/view-image.component';
@Component({
  selector: 'app-ho-so-giay-to',
  templateUrl: './ho-so-giay-to.component.html',
  styleUrls: ['./ho-so-giay-to.component.scss']
})
export class HoSoGiayToComponent implements OnInit, OnDestroy {
  @Input() maYeuCau: string;
  @Input() maDViQLy: string;

  formGroup: FormGroup;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  safeSrc: SafeResourceUrl;
  srcCV: string;

  private subscriptions: Subscription[] = [];
  constructor(
    public service: HoSoYeuCauService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.maYeuCau !== undefined && this.maDViQLy !== undefined ) {
      const sb = this.service.getListHSoGTo(this.maDViQLy, this.maYeuCau).pipe(
        catchError((errorMessage) => {
          return of([]);
        }), finalize(() => {
          this.isLoadingForm$.next(false);
        })
      ).subscribe();
    }
  }

  view(id: number, loaiFile: string) {
    this.isLoadingForm$.next(true);
    this.service.getDetail(id).subscribe((response) => {
      if (loaiFile === 'PDF') {
        const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
        modalRef.componentInstance.response = response;
        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(false);
          }
        );
      }
      else {
        const modalRef = this.modalService.open(ViewImageComponent, { size: 'xl' });
        modalRef.componentInstance.response = response;
        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(false);
          }
        );
      }
    }), finalize(() => {
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  submited = new BehaviorSubject<boolean>(false);
}