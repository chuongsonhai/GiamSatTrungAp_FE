import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';
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
} from '../../../_metronic/shared/crud-table';
import * as _moment from 'moment';
import { CommonService, UserService } from '../../services/base.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { Organization } from '../../models/base.model';

@Component({
  selector: 'app-nguoi-dung',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent
  implements
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

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public UserService: UserService,
    public commonService: CommonService
  ) {

  }

  orgCode: string;
  organizations: Organization[] = [];
  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();

    const sb = this.UserService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.UserService.grouping;
    this.paginator = this.UserService.paginator;
    this.sorting = this.UserService.sorting;
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
    this.filterGroup = this.fb.group({
      keyword: [''],
      maDViQLy: [this.orgCode],
      maBPhan: ['']
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
    const madvi = this.filterGroup.get('maDViQLy').value;
    if (madvi) {
      this.orgCode = madvi;
    }
    filter['maDViQLy'] = this.orgCode;

    const mabphan = this.filterGroup.get('maBPhan').value;
    if (mabphan) {
      filter['maBPhan'] = mabphan;
    }
    this.UserService.patchState({ filter });
  }
  // search
  searchForm() {

  }

  search(searchTerm: string) {
    this.UserService.patchState({ searchTerm });
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
    this.UserService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.UserService.patchState({ paginator });
  }
  // actions  

  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(EditUserComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.orgCode = this.orgCode;
    modalRef.result.then(() =>
      this.filter(),
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
}
