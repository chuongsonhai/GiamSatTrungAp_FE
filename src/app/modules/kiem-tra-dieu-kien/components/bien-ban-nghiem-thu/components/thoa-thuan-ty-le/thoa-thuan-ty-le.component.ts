import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first } from 'rxjs/operators';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { ThoaThuanTyLe } from 'src/app/modules/models/thoathuantyle.model';
import { ThoaThuanTyLeService } from 'src/app/modules/services/thoathuantyle.service';
import { CreateThoaThuanTyLeComponent } from './create-thoa-thuan-ty-le/create-thoa-thuan-ty-le.component';

@Component({
  selector: 'app-thoa-thuan-ty-le',
  templateUrl: './thoa-thuan-ty-le.component.html',
  styleUrls: ['./thoa-thuan-ty-le.component.scss']
})
export class ThoaThuanTyLeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() congvanid: number;
  status: number;
  thoaThuanTyLe: ThoaThuanTyLe;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  blobUrl: string;
  height: string;

  constructor(
    public route: ActivatedRoute,
    public CongVanYeuCauService: CongVanYeuCauService,
    public CommonService: CommonService,
    public service: ThoaThuanTyLeService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.height = window.outerHeight / 2 + 'px';
    this.loadData();
  }

  create() {
    const modalRef = this.modalService.open(CreateThoaThuanTyLeComponent, { size: 'xl' });
    modalRef.componentInstance._ThoaThuanTyLe = this.thoaThuanTyLe;

    modalRef.result.then(() => {
      this.isLoadingForm$.next(true);
      this.loadData();
    });
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congvanid).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.thoaThuanTyLe);
      })
    ).subscribe((result) => {
      if (result) {
        this.thoaThuanTyLe = result;
        this.getPDF(result.Data);
      } else {
        this.isLoadingForm$.next(false);
      }
    });

    this.subscriptions.push(sb);
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).pipe(
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((response) => {
      const binary_string = window.atob(response);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      const file = new Blob([bytes.buffer], { type: 'application/pdf' });
      this.blobUrl = URL.createObjectURL(file); // Không cần dùng bypassSecurity
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl); // Giải phóng URL tránh leak memory
    }
  }
}
