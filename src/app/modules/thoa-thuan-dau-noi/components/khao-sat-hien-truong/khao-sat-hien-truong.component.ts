import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { BienBanKSService } from 'src/app/modules/services/bienbanks.service';
import { finalize } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';

@Component({
  selector: 'app-khao-sat-hien-truong',
  templateUrl: './khao-sat-hien-truong.component.html',
  styleUrls: ['./khao-sat-hien-truong.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class KhaoSatHienTruongComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  formGroup: FormGroup;
  congvanid: number;

  constructor(
    public service: BienBanKSService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    public CommonService: CommonService,        
  ) {
    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      id: 0,
      deptId: undefined,
      staffCode: undefined,
      ngayHen: undefined,
      noiDung: undefined
    }
  }
  submitted = false;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  height: string;
  tabs = {
    CongVan: 1,    
    PhanCongKS: 2,
    TaiLieuKS: 3,
    BienBanKS: 4
  };

  activeTabId = this.tabs.CongVan; // 0 => Basic info;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.getPDF(this.congVanYeuCau.Data);
      if (this.congVanYeuCau.TrangThai === 2)
        this.activeTabId = this.tabs.PhanCongKS;
      if (this.congVanYeuCau.TrangThai === 3 || this.congVanYeuCau.TrangThai === 4)
        this.activeTabId = this.tabs.BienBanKS;
      if (this.activeTabId != this.tabs.CongVan)
        this.changeTab(this.activeTabId);
    }
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      if (response === undefined || response === null) {
  
      }
      else {
        if (response.Type == "") {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      this.srcCV = URL.createObjectURL(file);
      this.safeSrcCV = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    
      // if (response.Type == "") {
      //   const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
      //   modalRef.componentInstance.response = response.BaseType;
      //   modalRef.result.then(
      //     () => {
      //       this.isLoadingForm$.next(false);
      //     }
      //   );
      //  }
      }
        }
    }), finalize(() => {
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    })
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
  }

  private subscriptions: Subscription[] = [];  

  public reloadData(reload: boolean) {
    this.reloadForm.emit(reload);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
