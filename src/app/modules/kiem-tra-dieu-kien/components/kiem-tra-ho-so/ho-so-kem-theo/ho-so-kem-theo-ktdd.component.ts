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
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';
@Component({
  selector: 'app-ho-so-kem-theo-ktdd',
  templateUrl: './ho-so-kem-theo-ktdd.component.html',
  styleUrls: ['./ho-so-kem-theo-ktdd.component.scss']
})
export class HoSoKemTheoKTDDComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;

  formGroup: FormGroup;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  safeSrc: SafeResourceUrl;
  srcCV: string;

  private subscriptions: Subscription[] = [];
  constructor(
    public service: YeuCauNghiemThuService,
    public hsoservice: HoSoYeuCauService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      const sb = this.service.getListHSo(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau).pipe(
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
    this.hsoservice.getDetail(id).subscribe((response) => {
      if (loaiFile === 'PDF') {
        const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
        modalRef.componentInstance.response = response;
        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(false);
          }
        );
      }
      if (loaiFile === 'PNG' || loaiFile === 'JPG') {
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

  download(id: number, loaiFile: string) {
    this.hsoservice.download(id).subscribe((response) => {
      if(response === undefined || response === null){
        this.isLoadingForm$.next(false);
      }
      else{
        var binary_string = window.atob(response);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        let blob = new Blob([bytes.buffer], { type: 'octet/stream' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download="FileData." + loaiFile;
        link.click();
        this.isLoadingForm$.next(false);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  submited = new BehaviorSubject<boolean>(false);
}