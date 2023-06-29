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
import { BaoCaoTHTCDNViewModel } from '../../models/baocaothtcdn.model';

@Component({
  selector: 'app-tong-hop-qua-han',
  templateUrl: './tong-hop-qua-han.component.html',
  styleUrls: ['./tong-hop-qua-han.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class TongHopQuaHanComponent implements
OnInit,
OnDestroy {
isLoading: boolean;
filterGroup: FormGroup;
searchGroup: FormGroup;
private subscriptions: Subscription[] = [];
_toDate = new Date();
private _fromDate = new Date(this._toDate.getFullYear(), this._toDate.getMonth(), 1);
organizations: Organization[] = [];
baocao:BaoCaoTHTCDNViewModel;
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

    todate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this._toDate),
    fromdate:DateTimeUtil.convertDateToStringVNDefaulDateNow(this._fromDate),
    keyword:''
  });
  
}
getbaocao() {
  const filter = {};
  const _keyword = this.filterGroup.controls['keyword'].value;
  debugger;
  if (_keyword) {
    filter['keyword'] = _keyword;
  }
  const _fromdate = this.filterGroup.controls['fromdate'].value;
  if (_fromdate) {
    filter['fromdate'] = _fromdate;
  }
  const _todate = this.filterGroup.controls['todate'].value;
  if (_todate) {
    filter['todate'] = _todate;
  }



  const subscribe = this.service.getBaoCaoTHTCDNQuaHan(filter).pipe(
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
  const _keyword = this.filterGroup.controls['keyword'].value;
  debugger;
  if (_keyword) {
    filter['keyword'] = _keyword;
  }
  const _fromdate = this.filterGroup.controls['fromdate'].value;
  if (_fromdate) {
    filter['fromdate'] = _fromdate;
  }
  const _todate = this.filterGroup.controls['todate'].value;
  if (_todate) {
    filter['todate'] = _todate;
  }
  this.service.exportExcelTHQuaHan(filter).subscribe((response) => {
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
      link.download="Báo cáo tổng hợp quá hạn.xlsx";
      link.click();

   
    }
  });
}


}
