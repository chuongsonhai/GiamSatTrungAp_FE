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
import { UpdateMauHoSoComponent } from './components/update-mau-ho-so.component';
import { MauHoSoService } from '../../services/mauhoso.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../share-component/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-mau-ho-so',
  templateUrl: './mau-ho-so.component.html',
  styleUrls: ['./mau-ho-so.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})

export class MauHoSoComponent implements OnInit, OnDestroy,
  IFetchSelectedAction,
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
    public service: MauHoSoService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
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

  create() {
    this.update(undefined);
  }

  update(id: string) {
    const modalRef = this.modalService.open(UpdateMauHoSoComponent, { size: 'sm' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() =>
      this.filter(),
      () => { }
    );
  }
  // form actions

  delete(id: string) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xóa cấu hình này?')
      .then((confirmed) => {
        if (confirmed) {
          const sbSign = this.service.delete(id).pipe(
            tap(() => {
            }),
            catchError((errorMessage) => {
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(undefined);
            }),
          ).subscribe((res) => {
            if (res.success) {
              this.toastr.success("Xóa thành công", "Thành công");
              this.filter();
            }
            else
              this.toastr.error(res.message, "Thông báo");
          });
        }
      });
  }

  updateStatus(id: string) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn chuyển trạng thái cấu hình này?')
      .then((confirmed) => {
        if (confirmed) {
          const sbSign = this.service.updateStatus(id).pipe(
            tap(() => {
            }),
            catchError((errorMessage) => {
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(undefined);
            }),
          ).subscribe((res) => {
            if (res.success) {
              this.toastr.success("Cập nhật trạng thái thành công", "Thành công");
              this.filter();
            }
            else
              this.toastr.error(res.message, "Thông báo");
          });
        }
      });
  }

  deleteSelected() {
  }

  updateStatusForSelected() {
  }

  fetchSelected() {

  }

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
}
