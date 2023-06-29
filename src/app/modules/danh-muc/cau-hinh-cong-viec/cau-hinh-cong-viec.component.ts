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
import { CauHinhDKService } from "../../services/cauhinhdk.service";
import { UpdateCauHinhCVComponent } from "./components/update-cau-hinh-cong-viec.component";

@Component({
  selector: "app-cau-hinh-cong-viec",
  styleUrls: ["./cau-hinh-cong-viec.component.scss"],
  templateUrl: "./cau-hinh-cong-viec.component.html",
})
export class CauHinhCongViecComponent implements OnInit,
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
    public service: CauHinhDKService
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
  }

  filter() {
    const filter = {};
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
  update(id: number) {
    const modalRef = this.modalService.open(UpdateCauHinhCVComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.filter();
        this.isLoadingForm$.next(false);
      }
    );
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
