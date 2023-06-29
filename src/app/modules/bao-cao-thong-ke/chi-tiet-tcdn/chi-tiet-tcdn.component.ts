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

import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { BaoCaoChiTietTCDNService } from '../../services/baocaochitiettcdn.service';
import { Organization } from '../../models/organization.model';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-chi-tiet-tcdn',
  templateUrl: './chi-tiet-tcdn.component.html',
  styleUrls: ['./chi-tiet-tcdn.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class ChiTietTcdnComponent implements
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
fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  private router: Router,
  public service: BaoCaoChiTietTCDNService,
  public commonService: CommonService
) {

}
organizations: Organization[] = [];
// angular lifecircle hooks
ngOnInit(): void {
  this.filterForm();
  const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
  this.subscriptions.push(sb);
  this.grouping = this.service.grouping;
  this.paginator = this.service.paginator;
  this.sorting = this.service.sorting;
  //this.filter();
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
}

ngOnDestroy() {
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}

// filtration
filterForm() {
  this.filterGroup = this.fb.group({
    maDViQLy: [''],
    keyword: [''],
    // status: -1,
    fromdate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this.fromDate),
    todate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this.toDate),
  });
  try {
    this.subscriptions.push(this.filterGroup.controls.keyword.valueChanges.subscribe(() => this.filter()));
  } catch (error) {
  }
}

filter() {
  const filter = {};
  const maDViQLy = this.filterGroup.get('maDViQLy').value;
  if (maDViQLy) {
    filter['maDViQLy'] = maDViQLy;
  }

  const keyword = this.filterGroup.get('keyword').value;
  if (keyword) {
    filter['keyword'] = keyword;
  }
  // const status = this.filterGroup.get('status').value;
  // if (status) {
  //   filter['status'] = status;
  // }
  const fromdate = this.filterGroup.get('fromdate').value;
  if (fromdate) {
    filter['fromdate'] = fromdate;
  }
  const todate = this.filterGroup.get('todate').value;
  if (todate) {
    filter['todate'] = todate;
  }
  this.service.patchState({ filter });
}

exportExcel() {
  const filter = {};
  const maDViQLy = this.filterGroup.get('maDViQLy').value;
  if (maDViQLy) {
    filter['maDViQLy'] = maDViQLy;
  }

  const keyword = this.filterGroup.get('keyword').value;
  if (keyword) {
    filter['keyword'] = keyword;
  }
  // const status = this.filterGroup.get('status').value;
  // if (status) {
  //   filter['status'] = status;
  // }
  const fromdate = this.filterGroup.get('fromdate').value;
  if (fromdate) {
    filter['fromdate'] = fromdate;
  }
  const todate = this.filterGroup.get('todate').value;
  if (todate) {
    filter['todate'] = todate;
  }
  this.service.exportExcel(filter).subscribe((response) => {
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
      link.download="Báo cáo chi tiết tiếp cận điện năng.xlsx";
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
