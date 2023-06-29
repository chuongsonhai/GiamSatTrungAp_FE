
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, first, timeout } from 'rxjs/operators';
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
import { DatePipe } from '@angular/common';;
import { ViewPdfComponent } from '../../share-component/view-pdf/view-pdf.component';
import { BienBanNTService } from '../../services/bienbannt.service';
import { BienBanNT } from '../../models/bienbannt.model';
import { CommonService } from '../../services/base.service';
import { Organization } from '../../models/base.model';

@Component({
  selector: 'app-list-bien-ban-nghiem-thu',
  templateUrl: './list-bien-ban-nghiem-thu.component.html',
  styleUrls: ['./list-bien-ban-nghiem-thu.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class ListBienBanNghiemThuComponent implements

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

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: BienBanNTService,
    public commonService: CommonService
  ) {

  }

  orgCode: string;
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
          this.orgCode = this.organizations[0].orgCode;
          this.filterForm();
          this.filter();
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
      maDViQLy:[this.orgCode],
      keyword: [''],
      maYCau: [''],
      fromdate: [''],
      todate: [''],
      status: -1
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
      this.subscriptions.push(this.filterGroup.controls.status.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }

  filter() {
    const filter = {};
    const keyword = this.filterGroup.get('keyword').value;
    if (keyword) {
      filter['keyword'] = keyword;
    }

    const maYCau = this.filterGroup.get('maYCau').value;
    if (maYCau) {
      filter['maYCau'] = maYCau;
    }
    
    const madvi = this.filterGroup.get('maDViQLy').value;
    if (madvi) {
      this.orgCode = madvi;
    }
    filter['maDViQLy'] = this.orgCode;

    const fromdate = this.filterGroup.get('fromdate').value;
    if (fromdate) {
      filter['fromdate'] = fromdate;
    }

    const todate = this.filterGroup.get('todate').value;
    if (todate) {
      filter['todate'] = todate;
    }

    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }
    this.service.patchState({ filter });

  }
  // search
  searchForm() {
    // this.searchGroup = this.fb.group({
    //   searchTerm: [''],
    // });
    // const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
    //   .pipe(debounceTime(150), distinctUntilChanged())
    //   .subscribe((val) => this.search(val));
    // this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {

  }

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  view(id: number) {
    this.isLoadingForm$.next(true);
    const sb = this.service.detail(id).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(undefined);
      })
    ).subscribe((result) => {
      if (result) {
        const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
        modalRef.componentInstance.response = result;

        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(true);
            this.isLoadingForm$.next(false);
          }
        );
      }
    });
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
