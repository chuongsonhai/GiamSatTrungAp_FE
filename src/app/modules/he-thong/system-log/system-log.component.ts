import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
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
import { DataLoggingService } from '../../services/dataloggingservice.service';

@Component({
  selector: 'app-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class SystemLogComponent implements
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
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  private router: Router,
  public service: DataLoggingService,
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
    maDonVi: [''],
    maYCau: [''],
    userName: [''],
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
  const _maDonVi = this.filterGroup.controls['maDonVi'].value;
  if (_maDonVi) {
    filter['maDonVi'] = _maDonVi;
  }
  const _maYCau = this.filterGroup.controls['maYCau'].value;
  if (_maYCau) {
    filter['maYCau'] = _maYCau;
  }
  const _userName = this.filterGroup.controls['userName'].value;
  if (_userName) {
    filter['userName'] = _userName;
  }
  const fromdate = this.filterGroup.controls['fromdate'].value;
  if (fromdate) {
    filter['fromdate'] = fromdate;
  }
  const _todate = this.filterGroup.controls['todate'].value;
  if (_todate) {
    filter['todate'] = _todate;
  }

  this.service.patchState({ filter });
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
