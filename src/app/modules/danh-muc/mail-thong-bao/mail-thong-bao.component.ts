import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";

import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from "@angular/material/tree";
import { FlatTreeControl } from "@angular/cdk/tree";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { finalize } from "rxjs/operators";
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SendMailService } from "../../services/sendmail.service";
import { UpdateMailThongBaoComponent } from "./update-mail-thong-bao/update-mail-thong-bao.component";

@Component({
  selector: "app-mail-thong-bao",
  styleUrls: ["./mail-thong-bao.component.scss"],
  templateUrl: "./mail-thong-bao.component.html",
})
export class MailThongBaoComponent implements OnInit,
  OnDestroy,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public service: SendMailService
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
    this.filterGroup = this.fb.group({
      keyword: [''],
      maYCau: [''],
      status: -1
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.keyword.valueChanges.subscribe(() => this.filter()));
      this.subscriptions.push(this.filterGroup.controls.status.valueChanges.subscribe(() => this.filter()));
    } catch (error) {
    }
  }
  update(id: number) {
    const modalRef = this.modalService.open(UpdateMailThongBaoComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.filter();
        this.isLoadingForm$.next(false);
      }
    );
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
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
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
