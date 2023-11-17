import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ThongBao } from 'src/app/modules/models/thongbao.model';
import { ThongBaoService } from 'src/app/modules/services/thongbao.service';
import { UserModel } from 'src/app/_models/usermodel';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { CongVanYeuCauService } from 'src/app/modules/services/congvanyeucau.service';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import * as ApexCharts from 'apexcharts'
import { Organization } from 'src/app/modules/models/organization.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit,
  OnDestroy {
  isLoading: boolean;
  filterGroup: FormGroup;
  checkRender:any
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  _isLoadingForm$=  this.isLoadingForm$.asObservable();  

  _user$: UserModel;
  startDate = new Date();
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public congVanYeuCauService:CongVanYeuCauService,
    public yeuCauNghiemThuService:YeuCauNghiemThuService,
    public service: ThongBaoService,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthenticationService,
  ) {

   }


  get user$() {
    return of(this._user$);
  }
  ngOnInit(): void {
    this._user$ = this.authService.currentUserValue;
    this.route.queryParamMap
      .subscribe(params => {
        this.router.navigate(['/']);
      });
    this.notifies();
    // setTimeout(() => {
    //   this.renderChart();
    // }, 1000);

    var optionscollumn = {
      chart: {
        type: 'bar',
        height: 480,
        width: '100%'
      },
      series: [{
        name: 'sales',
        data: [
          30,
          40,35,50,49,60,70,91,125,10,45,
          30,40,35,50,49,60,70,91,125,10,
          30,40,35,50,49,60,70,91,125,10,
        ]
      }],
      xaxis: {
        categories: [
          "PD",
          "PD0100","PD0200","PD0300","PD0400","PD0500","PD0600","PD0700","PD0800","PD0900","PD1000",
          "PD1100","PD1200","PD1300","PD1400","PD1500","PD1600","PD1700","PD1800","PD1900","PD2000",
          "PD2100","PD2200","PD2300","PD2400","PD2500","PD2600","PD2700","PD2800","PD2900","PD3000"
      ]
      }
    }

    var optionspie = {
      chart: {
        type: 'pie',
        height: 480,
      },
      series: [44,55,41],
        labels: ["Số lượng thành công", "Số lượng thất bại", "Số lượng dừng ngang"],
      
    }
    
    var chartcolumn = new ApexCharts(document.querySelector("#chartcolumn"), optionscollumn);
    var chartpie = new ApexCharts(document.querySelector("#chartpie"), optionspie);
    
    chartpie.render();
    chartcolumn.render();






    var options = {
          series: [{
          data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380,555,905,325,618,993]
        }],
          chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [
              'Thời gian tiếp nhận yêu cầu cấp điện lập thỏa thuận đấu nối của khách hàng',
              'Thời gian thực hiện lập thỏa thuận đấu nối', 
              'Thời gian tiếp nhận yêu cầu kiểm tra đóng điện và nghiệm thu',
              'Thời gian dự thảo và ký hợp đồng mua bán điện',
              'Thời gian thực hiện kiểm tra điều kiện kỹ thuật điểm đấu nối và nghiệm thu', 
              'Giám sát thời gian nghiệm thu yêu cầu cấp điện mới trung áp', 
              'Cảnh báo các bộ hồ sơ sắp hết hạn hiệu lực thỏa thuận đấu nối',
              'Thời gian thực hiện cấp điện mới trung áp', 
              'Giám sát việc từ chối tiếp nhận yêu cầu cấp điện/thỏa thuận đấu nối', 
              'Giám sát trờ ngại khảo sát lập thỏa thuận đấu nối',
              'Giám sát việc hủy yêu cầu lập thỏa thuận đấu nối',
              'Giám sát việc từ chối tiếp nhận yêu cầu kiểm tra điều kiện đóng điện điểm đấu nối và nghiệm thu',
              'Giám sát nguyên nhân khách hàng từ chối ký thỏa thuận đấu nối',
              'Giám sát trở ngại khi kiểm tra điều kiện đóng điện điểm đấu nối.',
              'Giám sát trở ngại khi thi công treo tháo',
              'Giám sát nguyên nhân khách hàng từ chối ký hợp đồng mua bán điện'
          ],
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    

 
  }

  renderChart(){
    var dauthang=new Date(this.startDate.getFullYear(),this.startDate.getMonth(),1);
    var cuoithang=new Date(this.startDate.getFullYear(),this.startDate.getMonth()+1, 0)
    var dauthang1=new Date(this.startDate.getFullYear(),this.startDate.getMonth()-1,1);
    var cuoithang1=new Date(this.startDate.getFullYear(),this.startDate.getMonth(), 0) 

    this.isLoadingForm$.next(true);
      const sb = this.congVanYeuCauService.getListYeuCau(this._user$.maDViQLy,DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1),DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
        catchError((errorMessage) => {
          return of([]);
        }), finalize(() => {
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
              
          this.isLoadingForm$.next(false);
        }
      });

         
      this.yeuCauNghiemThuService.getListYeuCau(this._user$.maDViQLy,DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1),DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
        catchError((errorMessage) => {
          return of([]);
        }), finalize(() => {
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
 
          this.isLoadingForm$.next(false);
        }
      });

  }
  orgCode: string;
  organizations: Organization[] = [];
  protected _items$ = new BehaviorSubject<ThongBao[]>([]);
  get items$() {
    return this._items$.asObservable();
  }
  allowGetAll = new BehaviorSubject<boolean>(false);
  notifies() {
    const filter = { status: 0 ,maDViQLy :this._user$.maDViQLy };
    console.log(this._user$.maDViQLy);
    const sb = this.service.getNotifies(filter).pipe(
      catchError((errorMessage) => {
        return of([]);
      }), finalize(() => {
        this._user$ = this.auth.currentUserValue;
        this.isLoadingForm$.next(false);
        this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy =='PD');

      })
    ).subscribe(res => {
      if (res.success) {
        this._user$ = this.auth.currentUserValue;
   
        this._items$.next(res.data);
       // console.log(res.data)
        this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy =='PD');
        this.organizations = res.data;
      }
    });
  }

  tBaoIDs: number[] = [];
  selectRow(code: number) {
    const index = this.tBaoIDs.indexOf(code);
    if (index !== -1) this.tBaoIDs.splice(index, 1);
    else
      this.orgCode = this.organizations[0].orgCode;
      this.tBaoIDs.push(code);
  }

  updateStatus() {
    const sbUpdate = this.service.updateStatus(this.tBaoIDs).pipe(
      catchError((errorMessage) => {
        return of(undefined);
      }),
    ).subscribe(res => {
      if (res.success) {
        this.toastr.success("Chuyển trạng thái thành công", "Thông báo");
        this.notifies();
      }
      else {
        this.toastr.error(res.message, "Thông báo");
      }
    });
    this.subscriptions.push(sbUpdate);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
