import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first } from 'rxjs/operators';
import { CreateThoaThuanDamBaoComponent } from './create-thoa-thuan-dam-bao/create-thoa-thuan-dam-bao.component';
import { ThoaThuanDamBao } from 'src/app/modules/models/thoathuandambao.model';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { ThoaThuanDamBaoService } from 'src/app/modules/services/thoathuandambao.service';

@Component({
  selector: 'app-thoa-thuan-dam-bao',
  templateUrl: './thoa-thuan-dam-bao.component.html',
  styleUrls: ['./thoa-thuan-dam-bao.component.scss']
})
export class ThoaThuanDamBaoComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  @Input() congvanid: number;
  status: number;
  thoaThuanDamBao: ThoaThuanDamBao;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  pdfUrl: string | null = null;
  height: string;

  constructor(
    public route: ActivatedRoute,
    public CongVanYeuCauService: CongVanYeuCauService,
    private sanitizer: DomSanitizer,
    public CommonService: CommonService,
    public service: ThoaThuanDamBaoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.height = `${window.outerHeight / 2}px`;
    this.loadData();
  }

  create() {
    const modalRef = this.modalService.open(CreateThoaThuanDamBaoComponent, { size: 'xl' });
    modalRef.componentInstance._ThoaThuanDamBao = this.thoaThuanDamBao;

    modalRef.result.then(() => {
      this.isLoadingForm$.next(true);
      this.loadData();
    });
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congvanid).pipe(
      first(),
      catchError(() => {
        this.isLoadingForm$.next(false);
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((result: ThoaThuanDamBao | null) => {
      if (result) {
        this.thoaThuanDamBao = result;
        this.getPDF(result.Data);
      }
    });
    this.subscriptions.push(sb);
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    const sb = this.CommonService.getPDF(path).pipe(
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe(response => {
      const binary_string = window.atob(response);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'application/pdf' });
      this.pdfUrl = URL.createObjectURL(blob);
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }
}
