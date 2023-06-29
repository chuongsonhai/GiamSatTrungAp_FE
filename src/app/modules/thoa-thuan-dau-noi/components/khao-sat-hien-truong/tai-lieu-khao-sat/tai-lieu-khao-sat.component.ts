
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import {
  GroupingState,  
  IDeleteAction,  
  PaginatorState,
  SortState,
} from 'src/app/_metronic/shared/crud-table';
import * as _moment from 'moment';
import { Router } from '@angular/router';

import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { catchError, finalize } from 'rxjs/operators';
import { UpdateTaiLieuKhaoSatComponent } from './update-tai-lieu-khao-sat/update-tai-lieu-khao-sat.component';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';
import { CommonService } from 'src/app/modules/services/common.service';
import { HoSoKemTheoService } from 'src/app/modules/services/hosokemtheo.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ViewImageComponent } from 'src/app/modules/share-component/view-image/view-image.component';

@Component({
  selector: 'app-tai-lieu-khao-sat',
  templateUrl: './tai-lieu-khao-sat.component.html',
  styleUrls: ['./tai-lieu-khao-sat.component.scss']
})
export class TaiLieuKhaoSatComponent implements OnInit,
  OnDestroy,
  IDeleteAction {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  @Input() congVanYeuCau: CongVanYeuCau;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public HoSoKemTheoService: HoSoKemTheoService,
    public CommonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {

  }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadData();
  }
  
  loadData() {
    this.isLoadingForm$.next(true);
    const example = merge(
      this.HoSoKemTheoService.getListHSKT(this.congVanYeuCau.MaDViQLy,this.congVanYeuCau.MaYeuCau,4)
    );

    this.isLoadingForm$.next(true);
    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })).subscribe();
    this.subscriptions.push(subscribe);
  }


  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  delete(id : number){
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xoá hồ sơ?')
    .then((confirmed) => {
      if (confirmed) {
        this.isLoadingForm$.next(true);
        const example = merge(
          this.HoSoKemTheoService.deleteItem(id)
        );
    
        this.isLoadingForm$.next(true);
        const subscribe = example.pipe(
          catchError(err => {
            return of(undefined);
          }),
          finalize(() => {
            this.loadData();
            this.isLoadingForm$.next(false);
          })).subscribe();
        this.subscriptions.push(subscribe);
  
      }
    })

  }

  upload(id: number) {
    const modalRef = this.modalService.open(UpdateTaiLieuKhaoSatComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;

    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
  }
  view(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      var filetype=path.split(".")[1];
      if (filetype === 'pdf') {
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

}
