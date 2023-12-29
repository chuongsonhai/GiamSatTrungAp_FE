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
import { CanhBaoChiTiet, LichSuTuongTac, PhanHoi } from '../../models/canhbaochitiet.model';
import { ActivatedRoute } from '@angular/router';
import { PhanHoiCanhBaoComponent } from '../phan-hoi-canh-bao/phan-hoi-canh-bao.component';
import { ResponseModel } from '../../models/response.model';
import { ViewPdfComponent } from '../../share-component/view-pdf/view-pdf.component';
import { ViewImageComponent } from '../../share-component/view-image/view-image.component';
import { LogCanhbaoService } from '../../services/logcanhbao.service';
import { flatten } from '@angular/compiler';

@Component({
  selector: 'app-chi-tiet-canh-bao',
  templateUrl: './chi-tiet-canh-bao.component.html',
  styleUrls: ['./chi-tiet-canh-bao.component.scss']
})
export class ChiTietCanhBaoComponent implements OnInit, OnDestroy {
  viewbuton: boolean = true;
  EMPTY: any;
  private subscriptions: Subscription[] = [];
  id: number;
  CanhBaoChiTiet: CanhBaoChiTiet;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  filterGroup: FormGroup;
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
  phanHoi: LichSuTuongTac[]
  LichSuTuongTac: any
  organizations: Organization[] = [];
  allowGSCD = new BehaviorSubject<boolean>(false);
  allowPHGS = new BehaviorSubject<boolean>(false);

  //0: Mới tạo, 1: Duyệt hồ sơ, 2: Yêu cầu khảo sát, 3: Lập dự thảo đấu nối, 4: Ký duyệt dự thảo đấu nối, 5: Chuyển tiếp
  constructor(
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public service: CanhBaoGiamSatService,
    public Logservice: LogCanhbaoService,
    private modalService: NgbModal,
    public commonService: CommonService,
    public confirmationDialogService: ConfirmationDialogService,
    public toastr: ToastrService,
    private auth: AuthenticationService,

  ) {
    this.EMPTY = {
      ID: 0
    }



  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.CanhBaoChiTiet = Object.assign(new CanhBaoChiTiet(), this.EMPTY);
    this.filterGroup = this.fb.group({
      idCanhBao: [this.id],
      maLoaiCanhBao: '',
      thoiGianGui: '',
      NOIDUNG_PHANHOI_X3: '',
      NGUOI_PHANHOI_X3: '',
      maYeuCau: '',
      donViQuanLy: '',
      trangThai: '',
      idYeuCau: '',
      tenKhachHang: '',
      soDienThoai: '',
      trangThaiYeuCau: '',
      noiDungCanhBao: '',
      NGUYENHHAN_CANHBAO: 1,
      KETQUA_GIAMSAT: '',
    });
    const subscribe = this.commonService.getDonVis().pipe(
      catchError(err => {
        return of(undefined);
      })).subscribe(res => {
        if (res.success) {
          this.organizations = res.data;


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
      });


  }

  logfilter() {
    const filter = { canhBaoId: this.id };
    this.Logservice.patchState({ filter });
  }

  orgCode: string;
  loadData() {

    if (this.auth.checkPermission('GSCD-X3') == true) {
      this.allowGSCD.next(this.auth.checkPermission('GSCD-X3'));
      this.auth.checkPermission('GSCD-DV') == false;
    }
    else {
      this.allowPHGS.next(this.auth.checkPermission('GSCD-DV'));
    }
    const sb = this.service.getItemById(this.id).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.CanhBaoChiTiet);
      })
    ).subscribe((res) => {
      this.idYeuCau = res.data.ThongTinYeuCau.ID;
      if (res) {
        // console.log(res);
        var loaiCB = "";
        if (res.data.ThongTinCanhBao.maLoaiCanhBao == 1) {
          loaiCB = "Tiếp nhận yêu cầu cấp điện lập thỏa thuận đấu nối của khách hàng";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 2) {
          loaiCB = "Thời gian thực hiện lập thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 3) {
          loaiCB = "Thời gian tiếp nhận yêu cầu kiểm tra đóng điện và nghiệm thu";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 4) {
          loaiCB = "Thời gian dự thảo và ký hợp đồng mua bán điện";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 5) {
          loaiCB = "Thời gian thực hiện kiểm tra điều kiện kỹ thuật điểm đấu nối và nghiệm thu";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 6) {
          loaiCB = "Giám sát thời gian nghiệm thu yêu cầu cấp điện mới trung áp";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 7) {
          loaiCB = "Cảnh báo các bộ hồ sơ sắp hết hạn hiệu lực thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 8) {
          loaiCB = "Thời gian thực hiện cấp điện mới trung áp";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 9) {
          loaiCB = "Giám sát việc từ chối tiếp nhận yêu cầu cấp điện/thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 10) {
          loaiCB = " Giám sát trờ ngại khảo sát lập thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 11) {
          loaiCB = "Giám sát việc hủy yêu cầu lập thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 12) {
          loaiCB = "Giám sát việc từ chối tiếp nhận yêu cầu kiểm tra điều kiện đóng điện điểm đấu nối và nghiệm thu";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 13) {
          loaiCB = "Giám sát nguyên nhân khách hàng từ chối ký thỏa thuận đấu nối";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 14) {
          loaiCB = "Giám sát trở ngại khi kiểm tra điều kiện đóng điện điểm đấu nối.";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 15) {
          loaiCB = "Giám sát trở ngại khi thi công treo tháo";
        } else if (res.data.ThongTinCanhBao.maLoaiCanhBao == 16) {
          loaiCB = "Giám sát nguyên nhân khách hàng từ chối ký hợp đồng mua bán điện";
        }
        var trangTahiCB = "";
        if (res.data.ThongTinCanhBao.trangThai == 1) {
          trangTahiCB = " Mới tạo";
        } else if (res.data.ThongTinCanhBao.trangThai == 2) {
          trangTahiCB = "Đã gửi thông báo";
        } else if (res.data.ThongTinCanhBao.trangThai == 3) {
          trangTahiCB = "Đã tiếp nhận theo dõi";
        } else if (res.data.ThongTinCanhBao.trangThai == 4) {
          trangTahiCB = "Chuyển đơn vị xử lý";
        } else if (res.data.ThongTinCanhBao.trangThai == 5) {
          trangTahiCB = "Gửi lại cảnh báo";
        } else if (res.data.ThongTinCanhBao.trangThai == 6) {
          trangTahiCB = "Đã kết thúc cảnh báo";
        }

        this.filterGroup = this.fb.group({
          idCanhBao: res.data.ThongTinCanhBao.idCanhBao,
          maLoaiCanhBao: loaiCB,
          noiDungCanhBao: res.data.ThongTinCanhBao.noidungCanhBao,
          thoiGianGui: res.data.ThongTinCanhBao.thoiGianGui,
          NOIDUNG_PHANHOI_X3: res.data.DanhSachPhanHoi.NOIDUNG_PHANHOI_X3,
          NGUOI_PHANHOI_X3: res.data.DanhSachPhanHoi.NGUOI_PHANHOI_X3,
          donViQuanLy: res.data.ThongTinCanhBao.donViQuanLy,
          trangThai: trangTahiCB,
          idYeuCau: res.data.ThongTinYeuCau.ID,
          maYeuCau: res.data.ThongTinYeuCau.MaYeuCau,
          tenKhachHang: res.data.ThongTinYeuCau.TenKhachHang,
          soDienThoai: res.data.ThongTinYeuCau.DienThoai,
          trangThaiYeuCau: res.data.ThongTinYeuCau.TrangThai,
          phanHoi: res.data.DanhSachPhanHoi,
          NGUYENHHAN_CANHBAO: res.data.viewnguyennhan_canhbao.NGUYENHHAN_CANHBAO == 0 ? 1 : res.data.viewnguyennhan_canhbao.NGUYENHHAN_CANHBAO,
          KETQUA_GIAMSAT: res.data.viewnguyennhan_canhbao.KETQUA_GIAMSAT
        });


        this.donViQuanLy = res.data.ThongTinCanhBao.donViQuanLy;
        this.trangThaiHienNut = res.data.viewnguyennhan_canhbao.TRANGTHAI_CANHBAO;

        this.phanHoi = res.data.DanhSachPhanHoi;
        this.LichSuTuongTac = res.data.DanhSachTuongTac;
        console.log(res.data.DanhSachPhanHoi)
        if (res.data.DanhSachPhanHoi.length > 0) {
          this.viewbuton = false;
        } else {
          this.viewbuton = true;
        }
        this.isLoadingForm$.next(false);


        //  console.log( res.data.ThongTinYeuCau.donViQuanLy)
        //  console.log( this.auth.checkPermission('GSCD-X3'))
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
    window.location.href = '/ttdn/list/update/' + id;
  }
  tabs = {
    PhanHoiTraoDoi: 1,
    LichSuTuongTac: 2,
  };

  activeTabId = 1;

  changeTab(tabId: number) {
    this.activeTabId = tabId;
    if (tabId == this.tabs.LichSuTuongTac) {
      this.logfilter();
    }

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

  createPH(idCanhBao: number) {
    const modalRef = this.modalService.open(PhanHoiCanhBaoComponent, { size: 'md' });
    modalRef.componentInstance.id = idCanhBao;
    modalRef.componentInstance.idPhanHoi = null;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.reloadForm(true);
        this.isLoadingForm$.next(false);
      }
    );
  }

  edit(idPhanHoi: number) {
    const modalRef = this.modalService.open(PhanHoiCanhBaoComponent, { size: 'md' });
    modalRef.componentInstance.idPhanHoi = idPhanHoi;
    modalRef.componentInstance.id = null;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.reloadForm(true);
        this.isLoadingForm$.next(false);
      }
    );
  }

  deletePH(idPhanHoi: number) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xóa phản hồi?')
      .then((confirmed) => {
        if (confirmed) {
          const sbSign = this.service.deletePH(idPhanHoi).pipe(
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

  updateStatusCanhBao(idCanhBao: number, status: number) {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn cập nhật trạng thái?')
      .then((confirmed) => {
        if (confirmed) {
          var aaaa = this.filterGroup.controls.NGUYENHHAN_CANHBAO.value
          var kqgs = this.filterGroup.controls.KETQUA_GIAMSAT.value

          // const sbSign = this.service.updateStatus(idCanhBao,status,aaaa).pipe(
          const sbSign = this.service.updateStatus(idCanhBao, status, aaaa, kqgs).pipe(
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

  view(path: string) {
    this.isLoadingForm$.next(true);
    this.commonService.getPDF1(path).subscribe((response) => {
      // console.log(response)
      // var filetype=path.split(".")[1];
      // if (filetype === 'pdf') {
      //   const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
      //   modalRef.componentInstance.response = response;
      //   modalRef.result.then(
      //     () => {
      //       this.isLoadingForm$.next(false);
      //     }
      //   );
      // }
      // else {
      //   const modalRef = this.modalService.open(ViewImageComponent, { size: 'xl' });
      //   modalRef.componentInstance.response = response;
      //   modalRef.result.then(
      //     () => {
      //       this.isLoadingForm$.next(false);
      //     }
      //   );
      // }
      console.log(response)
      if (response === undefined || response === null) {

      }
      else {
        if (response.Type == "doc") {
          var binary_string = window.atob(response.BaseType);
          var len = binary_string.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
          }
          let blob = new Blob([bytes.buffer], { type: 'application/msword;charset=utf-8' }); // Loại tệp Word là 'application/msword'
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "file.doc"; // Đặt tên tệp tin Word ở đây
          link.click();
        }
        if (response.Type == "xlsx") {
          var binary_string = window.atob(response.BaseType);
          var len = binary_string.length;
          var bytes = new Uint8Array(len);
          for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
          }
          let blob = new Blob([bytes.buffer], { type: 'application/vnd.openxmlformats-ficedocument.spreadsheetml.sheet;charset=utf-8' });
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = "file.xlsx";
          link.click();
        }

        if (response.Type == "pdf") {
            const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
            modalRef.componentInstance.response = response.BaseType;
            modalRef.result.then(
              () => {
                this.isLoadingForm$.next(false);
              }
            );
          }

          // if (response.Type == "xls") {
          //   var binary_string = window.atob(response);
          //   var len = binary_string.length;
          //   var bytes = new Uint8Array(len);
          //   for (var i = 0; i < len; i++) {
          //     bytes[i] = binary_string.charCodeAt(i);
          //   }
          //   let blob = new Blob([bytes.buffer], { type: 'application/vnd.ms-excel' });
          //   var link = document.createElement('a');
          //   link.href = window.URL.createObjectURL(blob);
          //   link.download = "TenFile.xls"; // Đổi tên file thành tên mong muốn với định dạng .xls
          //   link.click();
            
          // }

      }
    }), finalize(() => {
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    })
  }




  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
