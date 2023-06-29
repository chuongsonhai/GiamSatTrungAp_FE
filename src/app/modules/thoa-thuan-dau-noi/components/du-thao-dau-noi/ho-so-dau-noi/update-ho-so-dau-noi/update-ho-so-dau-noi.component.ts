import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import * as _moment from 'moment';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HoSoKemTheoService } from 'src/app/modules/services/hosokemtheo.service';
import { HoSoKemTheo } from 'src/app/modules/models/hosokemtheo.model';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';

@Component({
  selector: 'app-update-ho-so-dau-noi',
  templateUrl: './update-ho-so-dau-noi.component.html',
  styleUrls: ['./update-ho-so-dau-noi.component.scss']
})
export class UpdateHoSoDauNoiComponent implements OnInit {
  @Input() id: number;
  @Input() congVanYeuCau: CongVanYeuCau;
  EMPTY: any;
  HoSoKemTheo: HoSoKemTheo;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    public service: HoSoKemTheoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
  ) {
    this.EMPTY = {
      ID: 0,
      MaHoSo: undefined,
      MaDViQLy: undefined,
      MaYeuCau: undefined,
      LoaiHoSo: undefined,
      TenHoSo: undefined,
      Data: undefined,
      TrangThai: 0,
    }
  }

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.HoSoKemTheo = Object.assign(new HoSoKemTheo(), this.EMPTY);
    this.loadForm();
    if (this.id > 0) {
      this.HoSoKemTheo = Object.assign(new HoSoKemTheo(), this.EMPTY);
      const sb = this.service.getItem(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.HoSoKemTheo);
        })
      ).subscribe((HoSoKemTheo: HoSoKemTheo) => {
        if (HoSoKemTheo) {
          this.HoSoKemTheo = Object.assign(this.HoSoKemTheo, HoSoKemTheo);
          this.loadForm();
        }
      });

      this.subscriptions.push(sb);
  
      this.isLoadingForm$.next(false);
    }
  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({

        TenHoSo: [this.HoSoKemTheo.TenHoSo],
        Data: [this.HoSoKemTheo.Data],
        TrangThai: [this.HoSoKemTheo.TrangThai],
        File: undefined,
      });
    }
    catch (error) {

    }
  }
  
  save() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.HoSoKemTheo = Object.assign(this.HoSoKemTheo, formValues);
    this.HoSoKemTheo.MaDViQLy = this.congVanYeuCau.MaDViQLy;
    this.HoSoKemTheo.MaYeuCau = this.congVanYeuCau.MaYeuCau;
    this.HoSoKemTheo.Type=0;
    if (this.id > 0) {
      this.edit();
    }
    else {
      this.create();
    }

  }

  edit() {
    const sbUpdate = this.service.updateHSKT(this.fileToUpload, this.HoSoKemTheo).pipe(
      tap(() => {
        this.HoSoKemTheo = Object.assign(new HoSoKemTheo(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.HoSoKemTheo);
      }),
    ).subscribe(res => this.HoSoKemTheo = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.service.createHSKT(this.fileToUpload, this.HoSoKemTheo).pipe(
      tap(() => {
        this.HoSoKemTheo = Object.assign(new HoSoKemTheo(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.HoSoKemTheo);
      }),
    ).subscribe((res: HoSoKemTheo) => this.HoSoKemTheo = res);
    this.subscriptions.push(sbCreate);
  }

  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFileInput(event.target.files);
    }
  }

  fileToUpload: any;

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    let reader = new FileReader();
    reader.onload = ((event: any) => {
      this.HoSoKemTheo.Data = event.target.result;
    });
    reader.readAsDataURL(this.fileToUpload);
    //reader.onloadend = function (e) {};
  }

}
