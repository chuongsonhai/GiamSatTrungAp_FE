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
import { BaoCaoThongKeService } from '../../services/baocaothongke.service';
import { Organization } from '../../models/base.model';
import { CommonService } from '../../services/base.service'

import { ReportService } from '../../services/report.service';
import { BaoCaoTongHop } from '../../models/baocaotonghop.model';


@Component({
  selector: 'app-bao-cao-chi-tiet-thang',
  templateUrl: './bao-cao-chi-tiet-thang.component.html',
  styleUrls: ['./bao-cao-chi-tiet-thang.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class BaoCaoChiTietThangComponent implements
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
organizations: Organization[] = [];
baocao:BaoCaoTongHop;
isLoadingForm$ = new BehaviorSubject<boolean>(false);
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  private router: Router,
  public service: ReportService,
  public commonService: CommonService
) {

}
ngOnInit(): void {
  this.isLoadingForm$.next(true);
  this.filterForm();
  const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
  this.subscriptions.push(sb);
  this.getbaocao();
  

}

ngOnDestroy() {
  this.subscriptions.forEach((sb) => sb.unsubscribe());
}



// filtration
filterForm() {
  this.filterGroup = this.fb.group({
    thang: this.toDate.getMonth()+1,
    nam:this.toDate.getFullYear(),
    isHoanTat:true,
  });
  
}
getbaocao() {

  const filter = {};
  const isHoanTat = this.filterGroup.get('isHoanTat').value;

  filter['isHoanTat'] = isHoanTat;
  

  const thang = this.filterGroup.get('thang').value;
  if (thang) {
    filter['thang'] = thang;
  }
  const nam = this.filterGroup.get('nam').value;
  if (nam) {
    filter['nam'] = nam;
  }


  const subscribe = this.service.getBaoCaoChiTietThang(filter).pipe(
    catchError(err => {
      return of(undefined);
    })).subscribe(res => {
      debugger;
      if (res.success) {
        this.baocao = res.data;
        this.isLoadingForm$.next(false);
      }
    });
  this.subscriptions.push(subscribe);
}

exportExcel() {

  const filter = {};
  const isHoanTat = this.filterGroup.get('isHoanTat').value;

  filter['isHoanTat'] = isHoanTat;
  

  const fromdate = this.filterGroup.get('fromdate').value;
  if (fromdate) {
    filter['fromdate'] = fromdate;
  }
  const todate = this.filterGroup.get('todate').value;
  if (todate) {
    filter['todate'] = todate;
  }


  this.service.exportExcelTheoThang(filter).subscribe((response) => {
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
      link.download="Báo cáo chi tiết tháng.xlsx";
      link.click();

   
    }
  });
}

filter() {
  
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
