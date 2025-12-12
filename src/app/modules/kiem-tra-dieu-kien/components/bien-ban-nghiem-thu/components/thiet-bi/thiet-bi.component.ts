import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
export class ThietBiComponent implements OnInit, OnDestroy {

  @Input() congvanid: number;
  thietBi: ThietBi;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  pdfUrl: SafeResourceUrl;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private CongVanYeuCauService: CongVanYeuCauService,
    private sanitizer: DomSanitizer,
    private CommonService: CommonService,
    private service: ThietBiService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  create() {
    const modalRef = this.modalService.open(CreateThietBiComponent, { size: 'xl' });
    modalRef.componentInstance._ThietBi = this.thietBi;
    modalRef.result.then(() => {
      this.isLoadingForm$.next(true);
      this.loadData();
    });
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sub = this.service.getItem(this.congvanid).pipe(
      first(),
      catchError(() => {
        this.isLoadingForm$.next(false);
        return of(null);
      })
    ).subscribe((result: ThietBi) => {
      if (result) {
        this.thietBi = result;
        this.loadPDF(result.Data);
      } else {
        this.isLoadingForm$.next(false);
      }
    });

    this.subscriptions.push(sub);
  }

  loadPDF(path: string) {
    const sub = this.CommonService.getPDF(path).pipe(first()).subscribe(response => {
      const binary = atob(response);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      this.pdfUrl = url; // Use directly without sanitization
      this.isLoadingForm$.next(false);
    }, () => this.isLoadingForm$.next(false));

    this.subscriptions.push(sub);
  }

  get safeUrl(): SafeResourceUrl {
    // Sanitize here if really needed, but source is trusted Blob URL
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl as string);
  }
}
