import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { GroupingState, IDeleteAction, IDeleteSelectedAction, IFetchSelectedAction, IFilterView, IGroupingView, ISearchView, ISortView, IUpdateStatusForSelectedAction, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { CanhBaoGiamSatService } from '../../services/canhbaogiamsat.service';
import { CommonService } from '../../services/common.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ConfirmationDialogService } from '../../share-component/confirmation-dialog/confirmation-dialog.service';
import { HopDongService } from '../../services/hopdong.service';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/_models/usermodel';
import { catchError, finalize, first } from 'rxjs/operators';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { Organization } from '../../models/organization.model';
import { CanhBaoChiTiet, DanhSachKhaoSat, KhaoSat, PhanHoi } from '../../models/canhbaochitiet.model';
import { ActivatedRoute } from '@angular/router';
import { ResponseModel } from '../../models/response.model';
import { PhanHoiCanhBaoComponent } from '../../giam-sat-cap-dien/phan-hoi-canh-bao/phan-hoi-canh-bao.component';
import { KhaoSatGiamSatService } from '../../services/khaosatgiamsat.service';
import { KhaoSatCanhBaoComponent } from '../khao-sat-canh-bao/khao-sat-canh-bao.component';

@Component({
  selector: 'app-ds-khao-sat',
  templateUrl: './ds-khao-sat.component.html',
  styleUrls: ['./ds-khao-sat.component.scss']
})
export class DsKhaoSatComponent implements OnInit, OnDestroy {
    EMPTY: any;
    private subscriptions: Subscription[] = [];
    id: number;
    CanhBaoChiTiet: DanhSachKhaoSat;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    filterGroup: FormGroup;
    idCanhBao: number
    maLoaiCanhBao: number
    noiDungCanhBao: string
    thoiGianGui: string
    donViQuanLy: string
    trangThai: number
    idYeuCau:number
    maYeuCau: string
    tenKhachHang: string
    soDienThoai: string
    trangThaiYeuCau: string
    khaoSat: KhaoSat[]
    organizations: Organization[] = [];
  
    //0: Mới tạo, 1: Duyệt hồ sơ, 2: Yêu cầu khảo sát, 3: Lập dự thảo đấu nối, 4: Ký duyệt dự thảo đấu nối, 5: Chuyển tiếp
    constructor(
      private fb: FormBuilder,
      public route: ActivatedRoute,
      public service: KhaoSatGiamSatService,
      private modalService: NgbModal,
      public commonService: CommonService,
      public confirmationDialogService: ConfirmationDialogService,
      public toastr: ToastrService
    ) {
      this.EMPTY = {
        ID: 0
      }
    }
  
    ngOnInit() {
      this.isLoadingForm$.next(true);
      this.CanhBaoChiTiet = Object.assign(new DanhSachKhaoSat(), this.EMPTY);
      
      this.filterGroup = this.fb.group({
        maYeuCau:'',  
        trangThai:'',
        idCanhBao: [this.id],
        tenKhachHang:'',
        soDienThoai:'',
      });
      
      this.route.params.subscribe(params => {
        if (params.ID) {
          var isValueProperty = parseInt(params.ID, 10) >= 0;
          if (isValueProperty) {
            this.id = Number(params.ID);
            this.loadData();
        
          }
        }
      });
    }
  
    tabs = {
      TiepNhanHoSo: 1,
      KhaoSatHienTruong: 2,
      DuThaoThoaThuan: 3,
      ChuyenTiep: 4,
    };
  
    activeTabId = 0;
  
    loadData() {
      const sb = this.service.getItemByCanhBaoId(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.CanhBaoChiTiet);
        })
      ).subscribe((res) => {
        // this.idYeuCau = res.data.ThongTinYeuCau.ID;
        if (res) {
          
          this.filterGroup = this.fb.group({
            maYeuCau:res.data.MaYeuCau,
            trangThai:res.data.TrangThaiCongVan, 
            tenKhachHang:res.data.TenKhachHang,
            soDienThoai:res.data.DienThoai,
            idCanhBao : res.data.canhbao.ID,
          });
          this.donViQuanLy = res.data.canhbao.DONVI_DIENLUC;
          this.idCanhBao = res.data.canhbao.ID;
          this.khaoSat= res.data.DanhSachKhaoSat;
          this.isLoadingForm$.next(false);
        }
      });
  
      this.subscriptions.push(sb);
    }
  
    public reloadForm(reload: boolean) {
      if (reload) {
        this.loadData();
      }
    }
    redirectpage(id) {
      debugger;
      window.location.href = '/ttdn/list/update/'+ id;
    }
  
    changeTab(tabId: number) {
      this.activeTabId = tabId;
      // if (this.activeTabId >= tabId)
      //   this.activeTabId = tabId;
      // else {
      //   if (this.status === 0 || this.status === 1) {
      //     this.activeTabId = this.tabs.TiepNhanHoSo;
      //   }
      //   if (this.status === 2 || this.status === 3 || this.status === 4) {
      //     this.activeTabId = this.tabs.KhaoSatHienTruong;
      //   }
  
      //   if (this.status >= 5 && this.status <= 7) {
      //     this.activeTabId = this.tabs.DuThaoThoaThuan;
      //   }
  
      //   if (this.status > 7 && this.status < 13) {
      //     this.activeTabId = this.tabs.ChuyenTiep;
      //   }
      // }
    }
    
    createPHDV(idCanhBao: number, idKhaoSat: number) {
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'md' });
      modalRef.componentInstance.id = idCanhBao;
      modalRef.componentInstance.idKhaoSat = idKhaoSat;
      modalRef.componentInstance.isPhanHoiDv = true;
      modalRef.result.then(
        () => {
          this.isLoadingForm$.next(true);
          this.reloadForm(true);
          this.isLoadingForm$.next(false);
        }
      );
    }
  
    createKS(idCanhBao: number) {
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'md' });
      modalRef.componentInstance.id = idCanhBao;
      modalRef.componentInstance.idKhaoSat = null;
      modalRef.componentInstance.isPhanHoiDv = null;
      modalRef.result.then(
        () => {
          this.isLoadingForm$.next(true);
          this.reloadForm(true);
          this.isLoadingForm$.next(false);
        }
      );
    }
  
    edit(idKhaoSat: number) {
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'md' });
      modalRef.componentInstance.idKhaoSat = idKhaoSat;
      modalRef.componentInstance.id = null;
      modalRef.componentInstance.isPhanHoiDv = null;
      modalRef.result.then(
        () => {
          this.isLoadingForm$.next(true);
          this.reloadForm(true);
          this.isLoadingForm$.next(false);
        }
      );
    }
  
    // deletePH(idPhanHoi: number) {
    //   this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xóa phản hồi?')
    //     .then((confirmed) => {
    //       if (confirmed) {
    //         const sbSign = this.service.deletePH(idPhanHoi).pipe(
    //           catchError((errorMessage) => {
    //             this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    //             return of(undefined);
    //           }),
    //           finalize(() => {
    //           }))
    //           .subscribe((res: ResponseModel) => {
    //             if (res.success) {
    //               this.isLoadingForm$.next(true);
    //               this.reloadForm(true);
    //               this.isLoadingForm$.next(false);
    //               this.toastr.success("Thực hiện thành công", "Thành công");
    //             }
    //             else
    //               this.toastr.error(res.message, "Thông báo");
    //           })
    //       }
    //     });
    // }
  
    updateStatus(idKhaoSat: number, status:number) {
      this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn cập nhật trạng thái?')
        .then((confirmed) => {
          if (confirmed) {
            const sbSign = this.service.updateStatus(idKhaoSat,status).pipe(
              catchError((errorMessage) => {
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                return of(undefined);
              }),
              finalize(() => {
              }))
              .subscribe((res: ResponseModel) => {
                if (res.success) {
                  this.isLoadingForm$.next(true);
                  this.reloadForm(true);
                  this.isLoadingForm$.next(false);
                  this.toastr.success("Thực hiện thành công", "Thành công");
                }
                else
                  this.toastr.error(res.message, "Thông báo");
              })
          }
        });
    }
  
    
    
  
    ngOnDestroy() {
      this.subscriptions.forEach(sb => sb.unsubscribe());
    }
  }
  