import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ChamDutHopDong } from 'src/app/modules/models/chamduthopdong.model';
import { HoSoYeuCau } from 'src/app/modules/models/hosoyeucau.model';
import { ThoaThuanDamBao } from 'src/app/modules/models/thoathuandambao.model';
import { ThoaThuanTyLe } from 'src/app/modules/models/thoathuantyle.model';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { ChamDutHopDongService } from 'src/app/modules/services/chamduthopdong.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { HoSoKemTheoService } from 'src/app/modules/services/hosokemtheo.service';
import { HoSoYeuCauService } from 'src/app/modules/services/hosoyeucau.service';
import { ThoaThuanDamBaoService } from 'src/app/modules/services/thoathuandambao.service';
import { ThoaThuanTyLeService } from 'src/app/modules/services/thoathuantyle.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ViewPdfComponent } from 'src/app/modules/share-component/view-pdf/view-pdf.component';
import { CreateThoaThuanDamBaoComponent } from '../thoa-thuan-dam-bao/create-thoa-thuan-dam-bao/create-thoa-thuan-dam-bao.component';
import { ChamDutHopDongComponent } from './cham-dut-hop-dong/cham-dut-hop-dong.component';
import { ThoaThuanTyLeComponent } from './thoa-thuan-ty-le/thoa-thuan-ty-le.component';
import { UpdatePhuLucHopDongComponent } from './update-phu-luc-hop-dong/update-phu-luc-hop-dong.component';


@Component({
  selector: 'app-phu-luc-hop-dong',
  templateUrl: './phu-luc-hop-dong.component.html',
  styleUrls: ['./phu-luc-hop-dong.component.scss']
})
export class PhuLucHopDongComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() congVanYeuCau: YeuCauNghiemThu;
  bangkethietbi: HoSoYeuCau;
  bieudophutai: HoSoYeuCau;
  thoathuandambao: HoSoYeuCau;
  TTDB: ThoaThuanDamBao;
  thoathuantyle: HoSoYeuCau;
  TTTL: ThoaThuanTyLe;
  thoathuanchamdut: HoSoYeuCau;
  CDHD: ChamDutHopDong;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  EMPTY: any;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    public HoSoYeuCauService: HoSoYeuCauService,
    public CommonService: CommonService,
    public ThoaThuanDamBaoService: ThoaThuanDamBaoService,
    public ThoaThuanTyLeService: ThoaThuanTyLeService,
    public ChamDutHopDongService: ChamDutHopDongService,
    private toastr: ToastrService,
  ) {
    this.EMPTY = {
      ID: 0,
      MaHoSo: undefined,
      MaDViQLy: undefined,
      MaYeuCau: undefined,
      LoaiHoSo: undefined,
      LoaiFile: undefined,
      TenHoSo: undefined,
      Data: undefined,
      TrangThai: -1,
    }

  }

  docids: number[] = [];
  // angular lifecircle hooks
  ngOnInit(): void {
    this.loadData();

  }

  selectRow(id: number) {
    const index = this.docids.indexOf(id);
    if (index !== -1) this.docids.splice(index, 1);
    else
      this.docids.push(id);
  }

  isRowSelected(id: number): boolean {
    return this.docids.indexOf(id) >= 0;
  }

  signDocs() {
    if (this.docids !== undefined && this.docids.length > 0) {
      const sbUpdate = this.HoSoYeuCauService.signDocs(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, this.docids).pipe(
        catchError((errorMessage) => {
          this.toastr.error(errorMessage);
          return of(undefined);
        }),
      ).subscribe(res => {
        if (res.success) {
          this.toastr.success("Ký số thành công", "Thông báo");
        }
        else {
          this.toastr.error(res.message, "Thông báo");
        }
      });
      this.subscriptions.push(sbUpdate);
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.bangkethietbi = Object.assign(new HoSoYeuCau(), this.EMPTY);
    this.bieudophutai = Object.assign(new HoSoYeuCau(), this.EMPTY);
    this.thoathuandambao = Object.assign(new HoSoYeuCau(), this.EMPTY);
    this.thoathuantyle = Object.assign(new HoSoYeuCau(), this.EMPTY);
    this.thoathuanchamdut = Object.assign(new HoSoYeuCau(), this.EMPTY);
    const sb = this.HoSoYeuCauService.getByLoai(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, "PL_TB").pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.bangkethietbi);
      })
    ).subscribe((bangkethietbi: HoSoYeuCau) => {
      if (bangkethietbi) {
        this.isLoadingForm$.next(true);
        this.bangkethietbi = bangkethietbi;
        this.isLoadingForm$.next(false);
      }
    });
    this.subscriptions.push(sb);
    const sb2 = this.HoSoYeuCauService.getByLoai(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, "PL_BDPT").pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.bieudophutai);
      })
    ).subscribe((bieudophutai: HoSoYeuCau) => {
      if (bieudophutai) {
        this.isLoadingForm$.next(true);
        this.bieudophutai = bieudophutai;
        this.isLoadingForm$.next(false);
      }
    });
    this.subscriptions.push(sb2);
    const sb3 = this.HoSoYeuCauService.getByLoai(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, "PL_TTDBao").pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.thoathuandambao);
      })
    ).subscribe((thoathuandambao: HoSoYeuCau) => {
      if (thoathuandambao) {
        this.isLoadingForm$.next(true);
        this.thoathuandambao = thoathuandambao;
        this.isLoadingForm$.next(false);
      }
    });

    this.subscriptions.push(sb3);
    const sb4 = this.HoSoYeuCauService.getByLoai(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, "PL_TTMBan").pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.thoathuantyle);
      })
    ).subscribe((thoathuantyle: HoSoYeuCau) => {
      if (thoathuantyle) {
        this.isLoadingForm$.next(true);
        this.thoathuantyle = thoathuantyle;
        this.isLoadingForm$.next(false);
      }
    });
    this.subscriptions.push(sb4);

    const sb5 = this.HoSoYeuCauService.getByLoai(this.congVanYeuCau.MaDViQLy, this.congVanYeuCau.MaYeuCau, "PL_TTCDut").pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.thoathuanchamdut);
      })
    ).subscribe((thoathuanchamdut: HoSoYeuCau) => {
      if (thoathuanchamdut) {
        this.isLoadingForm$.next(true);
        this.thoathuanchamdut = thoathuanchamdut;
        this.isLoadingForm$.next(false);
      }
    });
    this.subscriptions.push(sb5);
    this.isLoadingForm$.next(false);
  }

  view(path: string) {
    this.CommonService.getPDF(path).subscribe((response) => {
      const modalRef = this.modalService.open(ViewPdfComponent, { size: 'xl' });
      modalRef.componentInstance.response = response;

      modalRef.result.then(
        () => {
          this.isLoadingForm$.next(true);
          this.isLoadingForm$.next(false);
        }
      );
    }), finalize(() => {
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    })
  }

  updatettdb() {
    const sb = this.ThoaThuanDamBaoService.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.TTDB);
      })
    ).subscribe((result: ThoaThuanDamBao) => {
      if (result) {
        this.TTDB = result;
        const modalRef = this.modalService.open(CreateThoaThuanDamBaoComponent, { size: 'xl' });
        modalRef.componentInstance._ThoaThuanDamBao = this.TTDB;

        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(true);
            this.loadData();
            setTimeout(() => {
              this.isLoadingForm$.next(false);
            }, 2000);
          }
        );
      }
    });

  }

  updatetttl() {
    const sb = this.ThoaThuanTyLeService.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.TTDB);
      })
    ).subscribe((result: ThoaThuanTyLe) => {
      if (result) {
        this.TTTL = result;
        const modalRef = this.modalService.open(ThoaThuanTyLeComponent, { size: 'xl' });
        modalRef.componentInstance._ThoaThuanTyLe = this.TTTL;

        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(true);
            this.loadData();
            setTimeout(() => {
              this.isLoadingForm$.next(false);
            }, 2000);
          }
        );
      }
    });
  }
  updatettcd() {
    const sb = this.ChamDutHopDongService.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.TTDB);
      })
    ).subscribe((result: ChamDutHopDong) => {
      if (result) {
        this.CDHD = result;
        const modalRef = this.modalService.open(ChamDutHopDongComponent, { size: 'xl' });
        modalRef.componentInstance._ChamDutHopDong = this.CDHD;

        modalRef.result.then(
          () => {
            this.isLoadingForm$.next(true);
            this.loadData();
            setTimeout(() => {
              this.isLoadingForm$.next(false);
            }, 2000);
          }
        );
      }
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

}