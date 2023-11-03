import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, timeout } from 'rxjs/operators';
import {
  GroupingState,
  ICreateAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IEditAction,
  IFetchSelectedAction,
  IFilterView,
  IGroupingView,
  ISearchView,
  ISortView,
  IUpdateStatusForSelectedAction,
  PaginatorState,
  SortState,
} from 'src/app/_metronic/shared/crud-table';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { YeuCauNghiemThuService } from '../../services/yeucaunghiemthu.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { Organization } from '../../models/base.model';
import { CommonService } from '../../services/base.service';
import { BaoCaoChiTietTCDNQuaHanService } from '../../services/baocaochitiettcdnquahan.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-chi-tiet-khao-sat-khach-hang',
  templateUrl: './chi-tiet-khao-sat-khach-hang.component.html',
  styleUrls: ['./chi-tiet-khao-sat-khach-hang.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class ChiTietKhaoSatKhachHangComponent implements
  OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  toDate = new Date();
  _viewItem = new BehaviorSubject<any[]>([]);
  viewItem = this._viewItem.asObservable();
  private _fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
  organizations: Organization[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: ReportService,
    public commonService: CommonService
  ) {
  
  }
  ngOnInit(): void {
    this.filterForm();
    const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.service.grouping;
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    const subscribe = this.commonService.getDonVis().pipe(
      catchError(err => {
        return of(undefined);
      })).subscribe(res => {
        if (res.success) {
          this.organizations = res.data;
          this.filterForm();
        }
      });
    this.subscriptions.push(subscribe);
    // this.filter();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  
  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      keyword: [''],
      status: -1,
      DanhGiaThoiGianCapDien: -1,
      DanhGiaYCTN: -1,
      DanhGiaTTDN: -1,
      DanhGiaNT: -1,
      ChiPhiKhachHang: -1,
      HangMucKhaoSat: -1,
      DanhGiaHaiLong: -1,
      maDViQly: ['-1'],
      fromdate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this._fromDate),
      todate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this.toDate),
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.keyword.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }
  
  filter() {
    const filter = {};
    const _keyword = this.filterGroup.controls['keyword'].value;
    if (_keyword) {
      filter['keyword'] = _keyword;
    }
    const HangMucKhaoSat = this.filterGroup.controls['HangMucKhaoSat'].value;
    // if (HangMucKhaoSat) {
    //   filter['HangMucKhaoSat'] = HangMucKhaoSat;
    // }
    
    const fromdate = this.filterGroup.controls['fromdate'].value;
    if (fromdate) {
      filter['fromdate'] = fromdate;
    }
    const _todate = this.filterGroup.controls['todate'].value;
    if (_todate) {
      filter['todate'] = _todate;
    }

    const DanhGiaThoiGianCapDien = this.filterGroup.controls['DanhGiaThoiGianCapDien'].value;
    if (DanhGiaThoiGianCapDien) {
      filter['DanhGiaThoiGianCapDien'] = DanhGiaThoiGianCapDien;
    }
    const DanhGiaYCTN = this.filterGroup.controls['DanhGiaYCTN'].value;
    if (DanhGiaYCTN) {
      filter['DanhGiaYCTN'] = DanhGiaYCTN;
    }

    const DanhGiaTTDN = this.filterGroup.controls['DanhGiaTTDN'].value;
    if (DanhGiaTTDN) {
      filter['DanhGiaTTDN'] = DanhGiaTTDN;
    }

    const DanhGiaNT = this.filterGroup.controls['DanhGiaNT'].value;
    if (DanhGiaNT) {
      filter['DanhGiaNT'] = DanhGiaNT;
    }
    const ChiPhiKhachHang = this.filterGroup.controls['ChiPhiKhachHang'].value;
    if (ChiPhiKhachHang) {
      filter['ChiPhiKhachHang'] = ChiPhiKhachHang;
    }
    const DanhGiaHaiLong = this.filterGroup.controls['DanhGiaHaiLong'].value;
    if (DanhGiaHaiLong) {
      filter['DanhGiaHaiLong'] = DanhGiaHaiLong;
    }

    const maDViQly = this.filterGroup.controls['maDViQly'].value;
    if (maDViQly) {
      filter['maDViQly'] = maDViQly;
    }
  

    this.service.getCTKhaoSatKhachHang({Filterbcmdhl:filter}).pipe(
      catchError(err => {
        return of(undefined);
      })).subscribe((response) => {
      if(response === undefined || response === null){
       
      }
      else{
        this._viewItem.next(response.data);
        console.log(response);
  
     
      }
    });

  }
  
  exportExcel() {
   
    const filter = {};
    const _keyword = this.filterGroup.controls['keyword'].value;
    if (_keyword) {
      filter['keyword'] = _keyword;
    }
    const HangMucKhaoSat = this.filterGroup.controls['HangMucKhaoSat'].value;
    // if (HangMucKhaoSat) {
    //   filter['HangMucKhaoSat'] = HangMucKhaoSat;
    // }
    
    const fromdate = this.filterGroup.controls['fromdate'].value;
    if (fromdate) {
      filter['fromdate'] = fromdate;
    }
    const _todate = this.filterGroup.controls['todate'].value;
    if (_todate) {
      filter['todate'] = _todate;
    }

    const DanhGiaThoiGianCapDien = this.filterGroup.controls['DanhGiaThoiGianCapDien'].value;
    if (DanhGiaThoiGianCapDien) {
      filter['DanhGiaThoiGianCapDien'] = DanhGiaThoiGianCapDien;
    }
    const DanhGiaYCTN = this.filterGroup.controls['DanhGiaYCTN'].value;
    if (DanhGiaYCTN) {
      filter['DanhGiaYCTN'] = DanhGiaYCTN;
    }

    const DanhGiaTTDN = this.filterGroup.controls['DanhGiaTTDN'].value;
    if (DanhGiaTTDN) {
      filter['DanhGiaTTDN'] = DanhGiaTTDN;
    }

    const DanhGiaNT = this.filterGroup.controls['DanhGiaNT'].value;
    if (DanhGiaNT) {
      filter['DanhGiaNT'] = DanhGiaNT;
    }
    const ChiPhiKhachHang = this.filterGroup.controls['ChiPhiKhachHang'].value;
    if (ChiPhiKhachHang) {
      filter['ChiPhiKhachHang'] = ChiPhiKhachHang;
    }
    const DanhGiaHaiLong = this.filterGroup.controls['DanhGiaHaiLong'].value;
    if (DanhGiaHaiLong) {
      filter['DanhGiaHaiLong'] = DanhGiaHaiLong;
    }

    const maDViQly = this.filterGroup.controls['maDViQly'].value;
    if (maDViQly) {
      filter['maDViQly'] = maDViQly;
    }
    this.service.exportExcelCTKhaoSatKhachHang({Filterbcmdhl:filter}).subscribe((response) => {
      if(response === undefined || response === null){
       
      }
      else{
        var binary_string = window.atob(response);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        let blob = new Blob([bytes.buffer], { type: 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet;charset=utf-8' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download="ChiTietKhaoSatKhachHang.xlsx";
        link.click();
      }
    });
  }
  
  // search
  searchForm() {
  
  }
  
  search(searchTerm: string) {
  
  }
  
  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
  
  }
  
  // pagination
  paginate(paginator: PaginatorState) {
    this.service.patchState({ paginator });
  }
  // actions
  
  // form actions
  
  delete(id: number) {
  }
  
  deleteSelected() {
  }
  
  updateStatusForSelected() {
  }
  
  fetchSelected() {
  
  }
  }