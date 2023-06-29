import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateThietBiComponent } from './create-thiet-bi/create-thiet-bi.component';
import { ThietBi } from 'src/app/modules/models/thietbi.model';
import { ThietBiService } from 'src/app/modules/services/thietbi.service';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { CommonService } from 'src/app/modules/services/common.service';


@Component({
  selector: 'app-thiet-bi',
  templateUrl: './thiet-bi.component.html',
  styleUrls: ['./thiet-bi.component.scss']
})
export class ThietBiComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() congvanid: number;
  status: number;
  thietBi: ThietBi;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  src: string;
  safeSrc: SafeResourceUrl;
  height: string;

  constructor(
    public route: ActivatedRoute,
    public CongVanYeuCauService: CongVanYeuCauService,
    private sanitizer: DomSanitizer,
    public CommonService: CommonService,
    public service: ThietBiService,
    private modalService: NgbModal,
    private fb: FormBuilder,) {

  }

  create() {
    const modalRef = this.modalService.open(CreateThietBiComponent, { size: 'xl' });
    modalRef.componentInstance._ThietBi = this.thietBi;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.height = window.outerHeight / 2 + 'px'
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    this.loadData();
    this.isLoadingForm$.next(false);
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congvanid).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.thietBi);
      })
    ).subscribe((result: ThietBi) => {
      if (result) {
        this.thietBi = result;
        this.getPDF(result.Data);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 1000);
        this.isLoadingForm$.next(false);
      }
    });
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      this.src = URL.createObjectURL(file);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    }), finalize(() => this.isLoadingForm$.next(false))
  }
  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
