import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, of, Subscription } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { ThongBaoService } from "../../services/thongbao.service";
import { Organization } from "../../models/base.model";
import { CommonService } from "../../services/base.service";
import { catchError, tap } from "rxjs/operators";
import { ConfirmationDialogService } from "../../share-component/confirmation-dialog/confirmation-dialog.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-thong-bao",
  styleUrls: ["./thong-bao.component.scss"],
  templateUrl: "./thong-bao.component.html",
})
export class ThongBaoComponent implements OnInit,
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
    public service: ThongBaoService,
    public commonService: CommonService,
    public confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService
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
      maDViQLy: [this.orgCode],
      maYCau: [''],
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
    let status = -1;
    if (this.filterGroup.get('status').value)
      status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    const madvi = this.filterGroup.get('maDViQLy').value;
    if (madvi) {
      this.orgCode = madvi;
    }
    filter['maDViQLy'] = this.orgCode;

    const maYCau = this.filterGroup.get('maYCau').value;
    if (maYCau) {
      filter['maYCau'] = maYCau;
    }
    this.service.patchState({ filter });
  }

  tBaoIDs: number[] = [];
  selectRow(code: number) {
    const index = this.tBaoIDs.indexOf(code);
    if (index !== -1) this.tBaoIDs.splice(index, 1);
    else
      this.tBaoIDs.push(code);
  }

  updateStatus() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn đã xử lý các yêu cầu này?')
      .then((confirmed) => {
        if (confirmed) {
          const sbUpdate = this.service.updateStatus(this.tBaoIDs).pipe(
            tap(() => {
              this.filter();
            }),
            catchError((errorMessage) => {
              return of(undefined);
            }),
          ).subscribe(res => {
            if (res.success) {
              this.toastr.success("Chuyển trạng thái thành công", "Thông báo");
            }
            else {
              this.toastr.error(res.message, "Thông báo");
            }
          });
          this.subscriptions.push(sbUpdate);
        }
      });
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

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
}
