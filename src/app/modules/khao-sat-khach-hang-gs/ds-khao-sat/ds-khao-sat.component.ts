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
    allowGSCD = new BehaviorSubject<boolean>(false);
    allowPHGS = new BehaviorSubject<boolean>(false);
  
    //0: Mới tạo, 1: Duyệt hồ sơ, 2: Yêu cầu khảo sát, 3: Lập dự thảo đấu nối, 4: Ký duyệt dự thảo đấu nối, 5: Chuyển tiếp
    constructor(
      private fb: FormBuilder,
      public route: ActivatedRoute,
      public service: KhaoSatGiamSatService,
      private modalService: NgbModal,
      public commonService: CommonService,
      public confirmationDialogService: ConfirmationDialogService,
      public toastr: ToastrService,
      private auth: AuthenticationService,
    ) {
      this.EMPTY = {
        ID: 0
      }
      this.allowGSCD.next( auth.checkPermission('GSCD-X3'));
      this.allowPHGS.next( auth.checkPermission('GSCD-DV'));
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
        mucdo_hailong:"-1",
        TrangThaiKhaoSat:"-1"
      });
      
      this.route.params.subscribe(params => {
        if (params.ID) {
            this.maYeuCau = (params.ID);
            this.loadData();
        
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
      const sb = this.service.getItemByYeuCauId(this.maYeuCau,'-1','-1').pipe(
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
            mucdo_hailong:"-1",
            TrangThaiKhaoSat:"-1"
          });
          this.donViQuanLy = res.data.DONVI_DIENLUC;
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

    filter() {
      const filter = {};
      
      
      const TrangThaiKhaoSat = this.filterGroup.get('TrangThaiKhaoSat').value;
      if (TrangThaiKhaoSat) {
        filter['TrangThaiKhaoSat'] = TrangThaiKhaoSat;
      }
      const mucdo_hailong = this.filterGroup.get('mucdo_hailong').value;
      if (mucdo_hailong) {
        filter['mucdo_hailong'] = mucdo_hailong;
      }
      // this.service.patchState({ filter });
      const sb = this.service.getItemByYeuCauId(this.maYeuCau,TrangThaiKhaoSat,mucdo_hailong).pipe(
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
            mucdo_hailong:mucdo_hailong,
            TrangThaiKhaoSat:TrangThaiKhaoSat
          });
          this.donViQuanLy = res.data.DONVI_DIENLUC;
          this.khaoSat= res.data.DanhSachKhaoSat;
          this.isLoadingForm$.next(false);
        }
      });
  
      this.subscriptions.push(sb);
  
    }
  
    changeTab(tabId: number) {
      this.activeTabId = tabId;
      
    }
    
    createPHDV(maYeuCau: string, idKhaoSat: number) {
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'md' });
      modalRef.componentInstance.maYeuCau = maYeuCau;
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
  
    createKS(maYeuCau: string) {
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'lg' });
      modalRef.componentInstance.maYeuCau = maYeuCau;
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
      const modalRef = this.modalService.open(KhaoSatCanhBaoComponent, { size: 'lg' });
      modalRef.componentInstance.idKhaoSat = idKhaoSat;
      modalRef.componentInstance.maYeuCau = null;
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
  