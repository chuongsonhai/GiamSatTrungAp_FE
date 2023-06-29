import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer ,SafeResourceUrl} from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first } from 'rxjs/operators';
import { CreateThoaThuanDamBaoComponent } from './create-thoa-thuan-dam-bao/create-thoa-thuan-dam-bao.component';
import { ThoaThuanDamBao } from 'src/app/modules/models/thoathuandambao.model';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { ThoaThuanDamBaoService } from 'src/app/modules/services/thoathuandambao.service';


@Component({
  selector: 'app-thoa-thuan-dam-bao',
  templateUrl: './thoa-thuan-dam-bao.component.html',
  styleUrls: ['./thoa-thuan-dam-bao.component.scss']
})
export class ThoaThuanDamBaoComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() congvanid: number;
  status: number;
  thoaThuanDamBao: ThoaThuanDamBao;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  src: string;
  safeSrc: SafeResourceUrl;
  height: string;

  constructor(
    public route: ActivatedRoute,
    public CongVanYeuCauService: CongVanYeuCauService,
    private sanitizer: DomSanitizer,
    public CommonService: CommonService,
    public service: ThoaThuanDamBaoService,
    private modalService: NgbModal,
    private fb: FormBuilder,) {
    
  }

  create() {
    const modalRef = this.modalService.open(CreateThoaThuanDamBaoComponent, { size: 'xl' });
    modalRef.componentInstance._ThoaThuanDamBao=this.thoaThuanDamBao;

    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true); 
        this.loadData();
        this.isLoadingForm$.next(false);
       }
    );

  }
  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.height = window.outerHeight / 2 + 'px'
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
      this.loadData();
      this.isLoadingForm$.next(false);
    
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congvanid).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.thoaThuanDamBao);
      })
    ).subscribe((result: ThoaThuanDamBao) => {
      if (result) {
        this.thoaThuanDamBao = result;
        this.getPDF(result.Data);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 1000);
        this.isLoadingForm$.next(false);
      }
    });
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      this.src = URL.createObjectURL(file);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
    }), finalize(() => this.isLoadingForm$.next(false))
  }
  getUrl() {
     return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}

