import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import {
  GroupingState,
  IDeleteAction,
  IDeleteSelectedAction,
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
import { ReportService } from 'src/app/modules/services/report.service';
import { CommonService } from 'src/app/modules/services/base.service';
import { Organization } from 'src/app/modules/models/base.model';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-report-quater',
  templateUrl: './report-quater.component.html',
  styleUrls: ['./report-quater.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class ReportQuaterComponent implements
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
  quaters: number[] = [1, 2, 3, 4];
  years: number[] = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: ReportService,
    public commonService: CommonService
  ) {
    const now = new Date();
    this.years.push(now.getFullYear() - 1, now.getFullYear());
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
      quater: 1,
      year: new Date().getFullYear()
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }

  filter() {
    const filter = {};
    const maDViQLy = this.filterGroup.get('maDViQLy').value;
    if (maDViQLy) {
      filter['maDViQLy'] = maDViQLy;
    }
    const quater = this.filterGroup.get('quater').value;
    if (quater) {
      filter['quater'] = quater;
    }
    const year = this.filterGroup.get('year').value;
    if (year) {
      filter['year'] = year;
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

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  // actions
  exportExcel() {
    this.isLoadingForm$.next(true);
    const filter = {};
    const maDViQLy = this.filterGroup.get('maDViQLy').value;
    if (maDViQLy) {
      filter['maDViQLy'] = maDViQLy;
    }
    const quater = this.filterGroup.get('quater').value;
    if (quater) {
      filter['quater'] = quater;
    }
    const year = this.filterGroup.get('year').value;
    if (year) {
      filter['year'] = year;
    }
    this.service.exportExcel(filter).subscribe((response) => {
      if(response === undefined || response === null){
        this.isLoadingForm$.next(false);
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
        link.download="ReportQuater.xlsx";
        link.click();

        this.isLoadingForm$.next(false);
      }
    });
  }
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
