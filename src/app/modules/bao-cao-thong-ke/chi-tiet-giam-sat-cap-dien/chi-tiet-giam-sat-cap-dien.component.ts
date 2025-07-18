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
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';

@Component({
  selector: 'app-chi-tiet-giam-sat-cap-dien',
  templateUrl: './chi-tiet-giam-sat-cap-dien.component.html',
  styleUrls: ['./chi-tiet-giam-sat-cap-dien.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})

export class ChiTietGiamSatCapDienComponent implements
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
    this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy =='HN');
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
          this.filterForm();
        }
      });
    this.subscriptions.push(subscribe);
    // this.filter();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  orgCode: string;
  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      keyword: [''],
      status: -1,
      maDViQLy: this.orgCode == 'HN' ? '-1' : this.orgCode,
      MaLoaiCanhBao: ['-1'],
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
    const MaLoaiCanhBao = this.filterGroup.controls['MaLoaiCanhBao'].value;
    if (MaLoaiCanhBao) {
      filter['MaLoaiCanhBao'] = MaLoaiCanhBao;
    }
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
  
    this.service.getCTGiamSatCapDien({Filterbcgstd:filter}).pipe(
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
    const MaLoaiCanhBao = this.filterGroup.controls['MaLoaiCanhBao'].value;
    if (MaLoaiCanhBao) {
      filter['MaLoaiCanhBao'] = MaLoaiCanhBao;
    }
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
    this.service.exportExcelCTGiamSatCapDien({Filterbcgstd:filter}).subscribe((response) => {
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
        link.download="ChiTietGiamSatCapDien.xlsx";
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