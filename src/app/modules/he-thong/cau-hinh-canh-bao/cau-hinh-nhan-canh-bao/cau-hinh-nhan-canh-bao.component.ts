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
import { CommonService, CongVanYeuCauService } from '../../../services/base.service';
import { DatePipe } from '@angular/common';
import { catchError, finalize } from 'rxjs/operators';
import { Organization } from '../../../models/organization.model';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/_models/usermodel';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { HopDongService } from 'src/app/modules/services/hopdong.service';
import { KhaoSatKhachHangGsService } from 'src/app/modules/services/khaosatkhachanggiamsat.service';
import { CauHinhNguoiNhanCanhBaoService } from 'src/app/modules/services/cauhinhnguoinhancanhbao.service';
import { UserNhanCanhbaoComponent } from '../../user-nhan-canhbao/user-nhan-canhbao.component';
import { ResponseModel } from 'src/app/modules/models/response.model';
import { CanhBaoGiamSatService } from 'src/app/modules/services/canhbaogiamsat.service';

@Component({
  selector: 'app-cau-hinh-nhan-canh-bao',
  templateUrl: './cau-hinh-nhan-canh-bao.component.html',
  styleUrls: ['./cau-hinh-nhan-canh-bao.component.scss']
})
export class CauHinhNhanCanhBaoComponent implements 
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
[x: string]: any;
  viewbuton: boolean = true;
  EMPTY: any;
  private subscriptions: Subscription[] = [];
  id: number;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  filterGroup: FormGroup;
  userNhanCanhBaooo: UserModel[] = [];
  idCanhBao: number
  maLoaiCanhBao: number
  noiDungCanhBao: string
  thoiGianGui: string
  NOIDUNG_PHANHOI_X3: string
  NGUOI_PHANHOI_X3: string
  donViQuanLy: string
  trangThai: number
  trangThaiHienNut: number
  idYeuCau: number
  maYeuCau: string
  tenKhachHang: string
  soDienThoai: string
  trangThaiYeuCau: string
  NGUYENHHAN_CANHBAO: number
  KETQUA_GIAMSAT: string
paginator: PaginatorState;
sorting: SortState;
grouping: GroupingState;
isLoading: boolean;
toDate = new Date();
fromDate = new Date(this.toDate.getFullYear(), this.toDate.getMonth(), 1);
constructor(
  private fb: FormBuilder,
  private modalService: NgbModal,
  public service: CauHinhNguoiNhanCanhBaoService,
  public servicecb: CanhBaoGiamSatService,
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
  searchGroup: FormGroup;
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
        this.userNhanCanhBaooo = res.data;
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
    maDViQLy: -1,
  });
  try {
    this.subscriptions.push(this.filterGroup.controls.maDViQLy.valueChanges.subscribe(() => this.filter()));
  } catch (error) {
  }
}

filter() {
  const filter = {};
  const maDViQLy = this.filterGroup.get('maDViQLy').value;
  if (maDViQLy) {
    this.orgCode = maDViQLy;
  }
  filter['maDViQLy'] = maDViQLy;
  
  
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

// // form actions
// public reloadForm(reload: boolean) {
//   if (reload) {
//     this.loadData();
//   }
// }
createPH(idCanhBao: number) {
  const modalRef = this.modalService.open(UserNhanCanhbaoComponent, { size: 'md' });
  modalRef.componentInstance.id  = idCanhBao;
  modalRef.componentInstance.idPhanHoi= null;
  modalRef.result.then(
    () => {
      this.isLoadingForm$.next(true);
      // this.reloadForm(true);
      this.filter();
      this.isLoadingForm$.next(false);
    }
  );
}

update(id: string) {
  const modalRef = this.modalService.open(UserNhanCanhbaoComponent, { size: 'md' });
  modalRef.componentInstance.id = id;
  modalRef.result.then(
    () => {
      this.isLoadingForm$.next(true);
      this.filter();
      this.isLoadingForm$.next(false);
    }
  );
}

deletePH(idPhanHoi: number) {
  this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xóa phản hồi?')
    .then((confirmed) => {
      if (confirmed) {
        const sbSign = this.servicecb.deleteUserNhan(idPhanHoi).pipe(
          catchError((errorMessage) => {
            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            return of(undefined);
          }),
          finalize(() => {
          }))
          .subscribe((res: ResponseModel) => {
            if (res.success) {
              this.isLoadingForm$.next(true);
              this.filter();
              this.isLoadingForm$.next(false);
              this.toastr.success("Thực hiện thành công", "Thành công");
            }
            else
              this.toastr.error(res.message, "Thông báo");
          })
      }
    });
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


