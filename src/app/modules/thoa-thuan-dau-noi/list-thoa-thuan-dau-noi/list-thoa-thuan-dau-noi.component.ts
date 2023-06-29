
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
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
import { CommonService, CongVanYeuCauService } from '../../services/base.service';
import { DoingBusinessComponent } from '../doing-business/doing-business.component';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { Organization } from '../../models/organization.model';
import { HoSoGiayToComponent } from './components/ho-so-giay-to.component';
import { HopDongService } from '../../services/hopdong.service';
import { ViewPdfComponent } from '../../share-component/view-pdf/view-pdf.component';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { ConfirmationDialogService } from '../../share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseModel } from '../../models/response.model';
import { ApproveModel } from '../../models/bienbanks.model';
import { UserModel } from 'src/app/_models/usermodel';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-thoa-thuan-dau-noi',
  templateUrl: './list-thoa-thuan-dau-noi.component.html',
  styleUrls: ['./list-thoa-thuan-dau-noi.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class ListThoaThuanDauNoiComponent implements
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
  EMPTY: any;
  private subscriptions: Subscription[] = [];
  toDate = new Date();
  fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public service: CongVanYeuCauService,
    public commonService: CommonService,
    private auth: AuthenticationService,
    private confirmationDialogService: ConfirmationDialogService,
    public contractService: HopDongService,
    private toastr: ToastrService
  ) {
    this.EMPTY = {
      ID: 0,
      TrangThai: 0,
      HoSos: [],
    }
  }
  _user$: UserModel;
  allowGetAll = new BehaviorSubject<boolean>(false);
  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this._user$ = this.auth.currentUserValue;
    this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy=='PD');

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

  orgCode: string;
  organizations: Organization[] = [];
  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      maDViQLy: [this.orgCode],
      keyword: [''],
      khachhang: [''],
      fromdate: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.fromDate),
      todate: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.toDate),
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
    const khachhang = this.filterGroup.get('khachhang').value;
    if (khachhang) {
      filter['khachhang'] = khachhang;
    }
    const madvi = this.filterGroup.get('maDViQLy').value;
    if (madvi) {
      this.orgCode = madvi;
    }
    filter['maDViQLy'] = madvi;
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

  histories(maYeuCau: string) {
    const modalRef = this.modalService.open(DoingBusinessComponent, { size: 'lg' });
    modalRef.componentInstance.maYeuCau = maYeuCau;
    modalRef.result.then(() =>
      () => { }
    );
  }

  duplicate(maYeuCau: string) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn tạo yêu cầu mới từ yêu cầu đã chọn?')
      .then((confirmed) => {
        if (confirmed) {
          const sbSign = this.service.duplicate(maYeuCau).pipe(
            catchError((errorMessage) => {
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(undefined);
            }),
            finalize(() => {
            }))
            .subscribe((res: ResponseModel) => {
              if (res.success) {
                this.toastr.success("Thực hiện thành công", "Thành công");
              }
              else
                this.toastr.error(res.message, "Thông báo");
            })
        }
      });
  }

  contract(maDViQLy: string, maYeuCau: string) {
    this.contractService.detail(maDViQLy, maYeuCau).subscribe((response) => {
      const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
      modalRef.componentInstance.response = response;
      modalRef.result.then(
      );
    })
  }
  approveModel: ApproveModel;
  

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
