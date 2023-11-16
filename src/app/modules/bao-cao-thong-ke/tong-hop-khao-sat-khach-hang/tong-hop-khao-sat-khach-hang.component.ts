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
import { BaoCaoTHKSKH } from '../../models/baocaoycnt.model';
import { UserModel } from 'src/app/_models/usermodel';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-tong-hop-khao-sat-khach-hang',
  templateUrl: './tong-hop-khao-sat-khach-hang.component.html',
  styleUrls: ['./tong-hop-khao-sat-khach-hang.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
  export class TongHopKhaoSatKhachHangComponent implements
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
  private _fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
  organizations: Organization[] = [];
  _viewItem = new BehaviorSubject<any[]>([]);
  viewItem = this._viewItem.asObservable();
  allowGetAll = new BehaviorSubject<boolean>(false);
  _user$: UserModel;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: ReportService,
    public commonService: CommonService,
    private auth: AuthenticationService,
  ) {
  
  }

  ngOnInit(): void {
    this.filterForm();
    this._user$ = this.auth.currentUserValue;
    this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy =='PD');
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
          this.orgCode = this.organizations[0].orgCode;
          debugger;
          this.filterForm();
        }
      });
    this.subscriptions.push(subscribe);
    // this.filter();
  }
  orgCode: string;
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  
  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      keyword: [''],
      HangMucKhaoSat: -1,
      status: -1,
      DanhGiaThoiGianCapDien: -1,
      DanhGiaYCTN: -1,
      DanhGiaTTDN: -1,
      DanhGiaNT: -1,
      ChiPhiKhachHang: -1,
      DanhGiaHaiLong: -1,
      maDViQLy: this.orgCode == 'PD' ? '-1' : this.orgCode,
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
    const _maDViQLy = this.filterGroup.controls['maDViQLy'].value;
    if (_maDViQLy) {
      filter['maDViQLy'] = _maDViQLy;
    }
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
      filter['DanhGiaThoiGianCapDien'] = _todate;
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
  

    this.service.getTHKhaoSatKhachHang({FilterDGiaDoHaiLong:filter}).pipe(
      catchError(err => {
        return of(undefined);
      })).subscribe((response) => {
      if(response === undefined || response === null){
       
      }
      else{
        this._viewItem.next(response.data.listSoLuongKhaoSatTrangThaiChuyenKhaiThac);
        console.log(response);
  
     
      }
    });

  }
  
  exportExcel() {
   
    const filter2 = {};
    const keyword = this.filterGroup.controls['keyword'].value;
    if (keyword) {
      filter2['keyword'] = keyword;
    }
    const _maDViQLy = this.filterGroup.controls['maDViQLy'].value;
    if (_maDViQLy) {
      filter2['maDViQLy'] = _maDViQLy;
    }
    const fromdate = this.filterGroup.controls['fromdate'].value;
    if (fromdate) {
      filter2['fromdate'] = fromdate;
    }
    const _todate = this.filterGroup.controls['todate'].value;
    if (_todate) {
      filter2['todate'] = _todate;
    }
    const DanhGiaThoiGianCapDien = this.filterGroup.controls['DanhGiaThoiGianCapDien'].value;
    if (DanhGiaThoiGianCapDien) {
      filter2['DanhGiaThoiGianCapDien'] = _todate;
    }
    const DanhGiaYCTN = this.filterGroup.controls['DanhGiaYCTN'].value;
    if (DanhGiaYCTN) {
      filter2['DanhGiaYCTN'] = DanhGiaYCTN;
    }

    const DanhGiaTTDN = this.filterGroup.controls['DanhGiaTTDN'].value;
    if (DanhGiaTTDN) {
      filter2['DanhGiaTTDN'] = DanhGiaTTDN;
    }

    const DanhGiaNT = this.filterGroup.controls['DanhGiaNT'].value;
    if (DanhGiaNT) {
      filter2['DanhGiaNT'] = DanhGiaNT;
    }
    const ChiPhiKhachHang = this.filterGroup.controls['ChiPhiKhachHang'].value;
    if (ChiPhiKhachHang) {
      filter2['ChiPhiKhachHang'] = ChiPhiKhachHang;
    }
    const DanhGiaHaiLong = this.filterGroup.controls['DanhGiaHaiLong'].value;
    if (DanhGiaHaiLong) {
      filter2['DanhGiaHaiLong'] = DanhGiaHaiLong;
    }
    debugger;
    this.service.exportExcelTHKhaoSatKhachHang({FilterDGiaDoHaiLong:filter2}).subscribe((response) => {
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
        link.download="TongHopKhaoSatKhachHang.xlsx";
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