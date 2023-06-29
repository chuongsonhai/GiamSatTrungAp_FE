import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, merge, of, Subscription } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BoPhanService } from "src/app/modules/services/bophan.service";
import { catchError, debounceTime, distinctUntilChanged, finalize } from "rxjs/operators";
import { GroupingState, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonService } from "../../services/base.service";
import { EditBoPhanComponent } from "./components/edit-bo-phan.component";
import { Organization } from "../../models/base.model";

@Component({
  selector: "app-bo-phan",
  styleUrls: ["./bo-phan.component.scss"],
  templateUrl: "./bo-phan.component.html",
})
export class BoPhanComponent implements
  OnInit,
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
  private subscriptions: Subscription[] = [];

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public service: BoPhanService,
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
      keyword: [''],
      maDViQLy: [this.orgCode],
      dongBoCmis: [false]
    });
    try {
      this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
      this.subscriptions.push(this.filterGroup.controls.dongBoCmis.valueChanges.subscribe(() => this.filter()));
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
    const modalRef = this.modalService.open(EditBoPhanComponent, { size: 'lg' });
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
}
