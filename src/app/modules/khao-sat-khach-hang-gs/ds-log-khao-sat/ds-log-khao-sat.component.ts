import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString, LayoutService } from '../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupingState, IFetchSelectedAction, IFilterView, IGroupingView, ISortView, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { CauHinhCanhBaoService } from '../../services/cauhinhcanhbao.service';
import { LogCanhbaoService } from '../../services/logcanhbao.service';
import { LogKhaoSatService } from '../../services/logkhaosat.service';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';

@Component({
  selector: 'app-ds-log-khao-sat',
  templateUrl: './ds-log-khao-sat.component.html',
  styleUrls: ['./ds-log-khao-sat.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class DsLogKhaoSatComponent implements OnInit, OnDestroy,IFetchSelectedAction,ISortView,IFilterView,IGroupingView,IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  IdKhaoSat: number;
  current = new Date();
  todate = new Date(this.current.getTime() + 86400000);
  // todate = new Date();
  fromdate = new Date(this.todate.getFullYear(), this.todate.getMonth(), 1);
  private subscriptions: Subscription[] = [];
    constructor(
      private fb: FormBuilder,
      private modalService: NgbModal,
      private router: Router,
      public service: LogKhaoSatService,
      public route: ActivatedRoute,
    ) { 
  
    }
  
   // angular lifecircle hooks
   ngOnInit(): void {
    this.filterForm();
    const sb = this.service.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.service.grouping;
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    this.filter();
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  
  // filtration
  filterForm() {

    this.route.params.subscribe(params => {
      if (params.ID) {
        var isValueProperty = parseInt(params.ID, 10) >= 0;
        if (isValueProperty) {
          this.IdKhaoSat = Number(params.ID);
        }
      }
    });

    this.filterGroup = this.fb.group({
      fromdate: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.fromdate),
      todate: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.todate),
      IdKhaoSat: this.IdKhaoSat
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }

  filter() {
    const filter = {};

    const fromdate = this.filterGroup.get('fromdate').value;
    if (fromdate) {
      filter['fromdate'] = fromdate;
    }
    const todate = this.filterGroup.get('todate').value;
    if (todate) {
      filter['todate'] = todate;
    }
    filter['IdKhaoSat'] = this.IdKhaoSat;
    
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
  
  create() {
    this.update(undefined);
  }
  
  // actions
  update(id: string) {
    
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
  
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  
  }
  
  
  