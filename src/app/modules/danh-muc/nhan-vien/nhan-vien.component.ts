import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { CommonService } from 'src/app/modules/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { Options } from 'select2';
import { NhanVienService } from '../../services/nhanvien.service';
import { GroupingState, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { EditNhanVienComponent } from './components/edit-nhan-vien.component';
import { Organization } from '../../models/base.model';

@Component({
  selector: 'app-nhan-vien',
  templateUrl: './nhan-vien.component.html',
  styleUrls: ['./nhan-vien.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class NhanVienComponent implements OnInit,
  OnDestroy,
  IFetchSelectedAction,
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
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public commonService: CommonService,
    public service: NhanVienService,
    private modalService: NgbModal
  ) {
   
  }

  orgCode: string;
  organizations: Organization[] = [];
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
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
          this.loadBPhans(this.orgCode);
        }
      });
    this.subscriptions.push(subscribe);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.isLoadingForm$.next(true);
    this.filterGroup = this.fb.group({
      keyword: [''],
      maDViQLy: [this.orgCode],
      maBPhan: [''],
      dongBoCmis:false
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
      this.subscriptions.push(this.filterGroup.controls.maBPhan.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }

  filter() {
    const filter = {};
    const keyword = this.filterGroup.get('keyword').value;
    if (keyword) {
      filter['keyword'] = keyword;
    }
    const dongBoCmis = this.filterGroup.get('dongBoCmis').value;
    if (dongBoCmis) {
      filter['dongBoCmis'] = dongBoCmis;
    }
    const madvi = this.filterGroup.get('maDViQLy').value;
    if (madvi) {
      this.orgCode = madvi;
    }
    filter['maDViQLy'] = this.orgCode;
    const mabp = this.filterGroup.get('maBPhan').value;
    if (mabp) {
      filter['maBPhan'] = mabp;
    }
    this.service.patchState({ filter });
  }
  // search
  searchForm() {
  }

  search(searchTerm: string) {
    this.service.patchState({ searchTerm });
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
    this.service.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.service.patchState({ paginator });
  }
  // actions  
  edit(id: number) {
    const modalRef = this.modalService.open(EditNhanVienComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.service.fetch(),
      () => { }
    );
  }

  delete(id: number) {
  }

  deleteSelected() {
  }

  updateStatusForSelected() {
  }

  fetchSelected() {

  }
  loadBPhans(maDonVi: string) {
    if (maDonVi && maDonVi !== undefined) {
      this.isLoadingForm$.next(true);
      const example = merge(
        this.commonService.getBoPhans(maDonVi)
      );
      this.isLoadingForm$.next(true);
      const subscribe = example.pipe(
        catchError(err => {
          return of(undefined);
        }),
        finalize(() => {
          this.isLoadingForm$.next(false);
        })).subscribe();
      this.subscriptions.push(subscribe);
    }
  }

}
