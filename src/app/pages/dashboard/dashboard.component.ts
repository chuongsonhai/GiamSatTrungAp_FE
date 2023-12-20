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
import { data } from 'jquery';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit,
  OnDestroy {
  isLoading: boolean;
  filterGroup: FormGroup;
  checkRender: any
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  _isLoadingForm$ = this.isLoadingForm$.asObservable();
  madvi: string;
  soLuongDaGui: number;
  // SoLuongKhaoSatThanhCong:DecimalPipe
  // SoLuongKhaoSatThatBai:DecimalPipe
  // soLuongKhaoSatDungNgang:DecimalPipe
  _user$: UserModel;
  optionscollumn: any
  options: any
  optionspie: any
  startDate = new Date();
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    public authService: AuthenticationService,
    public congVanYeuCauService: CongVanYeuCauService,
    public yeuCauNghiemThuService: YeuCauNghiemThuService,
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

        //chart1

        const a = this._user$.maDViQLy == 'PD' ? '-1' : this._user$.maDViQLy
        console.log(a)

        this.yeuCauNghiemThuService.getList1(a).subscribe((x: any) => {
       console.log(x)
          this.optionscollumn = {
            chart: {
              type: 'bar',
              height: 480,
              width: '100%'
            },
            series: [{
              name: 'sales',
              data: x.data.map((item: any) => item.soLuongDaGui)
            }],
            xaxis: {
              categories: x.data.map((item: any) => item.madvi)
            }
          };
          const chartcolumn = new ApexCharts(document.querySelector("#chartcolumn"), this.optionscollumn);
        
          chartcolumn.render();  
        });
        

    //chart2
    const a2 = this._user$.maDViQLy == 'PD' ? '-1' : this._user$.maDViQLy
    this.yeuCauNghiemThuService.getList2(a2).subscribe(response => {
      const data = response.data; // Assuming response contains a 'data' property
    
      // Ensure the data fields are numeric before using them in the chart
      const successfulCount = parseFloat(data.SoLuongKhaoSatThanhCong);
      const failedCount = parseFloat(data.SoLuongKhaoSatThatBai);
      const stoppedCount = parseFloat(data.soLuongKhaoSatDungNgang);
    
      // Check if the parsed values are valid numbers
      if (!isNaN(successfulCount) && !isNaN(failedCount) && !isNaN(stoppedCount)) {
        this.optionspie = {
          chart: {
            type: 'pie',
            height: 480,
          },
          series: [successfulCount, failedCount, stoppedCount],
          labels: ["Số lượng thành công", "Số lượng thất bại", "Số lượng dừng ngang"],
        };
    
        var chartpie = new ApexCharts(document.querySelector("#chartpie"), this.optionspie);
        chartpie.render();
      } else {
        // Handle case where data couldn't be parsed to numbers
        console.error('Invalid data format for the chart');
      }
    });
    
    
    

    //chart3
    const a3 = this._user$.maDViQLy == 'PD' ? '-1' : this._user$.maDViQLy
    this.yeuCauNghiemThuService.getList3(a3).subscribe((x: any) => {
      console.log(a3)
      this.options = {
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
        series: [{
          name: 'sales',
          data: x.data.map((item: any) =>item.socb)
          
        }],

        xaxis: {
          categories: 
          [
            'Giám sát thời gian tiếp nhận yêu cầu cấp điện lập thỏa thuận đấu nối của khách hàng',
            'Giám sát thời gian thực hiện lập thỏa thuận đấu nối',
            'Giám sát thời gian tiếp nhận yêu cầu kiểm tra điểm đóng điện và nghiệm thu',
            'Giám sát thời gian dự thảo và ký hợp đồng mua bán điện',
            'Giám sát thời gian thực hiện kiểm tra điều kiện kỹ thuật điểm đấu nối và nghiệm thu',
            'Giám sát thời gian thực hiện cấp điện mới trung áp',
            'Giám sát việc từ chối tiếp nhận yêu cầu cấp điện/thỏa thuận đấu nối',
            'Giám sát trờ ngại khảo sát lập thỏa thuận đấu nối',
            'Giám sát việc từ chối tiếp nhận yêu cầu lập thỏa thuận đấu nối',
            'Giám sát việc từ chối tiếp nhận yêu cầu kiểm tra điều kiện đóng điện điểm đấu nối và nghiệm thu',
            'Giám sát nguyên nhân khách hàng từ chối ký thỏa thuận đấu nối',
            'Giám sát trở ngại khi kiểm tra điều kiện đóng điện điểm đấu nối.',
            'Giám sát trở ngại khi thi công treo tháo',
            'Giám sát nguyên nhân khách hàng từ chối ký hợp đồng mua bán điện',
            'Giám sát thời gian nghiệm thu yêu cầu cấp điện mới trung áp',
            'Cảnh báo các bộ hồ sơ sắp hết hạn hiệu lực thỏa thuận đấu nối'
          ],
          
        }
      }
      var chart = new ApexCharts(document.querySelector("#chart"), this.options);
      chart.render(); 
    });

   }

  renderChart() {
    var dauthang = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 1);
    var cuoithang = new Date(this.startDate.getFullYear(), this.startDate.getMonth() + 1, 0)
    var dauthang1 = new Date(this.startDate.getFullYear(), this.startDate.getMonth() - 1, 1);
    var cuoithang1 = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), 0)

    this.isLoadingForm$.next(true);
    const sb = this.congVanYeuCauService.getListYeuCau(this._user$.maDViQLy, DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1), DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
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


    this.yeuCauNghiemThuService.getListYeuCau(this._user$.maDViQLy, DateTimeUtil.convertDateToStringVNDefaulDateNow(dauthang1), DateTimeUtil.convertDateToStringVNDefaulDateNow(cuoithang1)).pipe(
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
    const filter = { status: 0, maDViQLy: this._user$.maDViQLy };
    // console.log(this._user$.maDViQLy);
    const sb = this.service.getNotifies(filter).pipe(
      catchError((errorMessage) => {
        return of([]);
      }), finalize(() => {
        this._user$ = this.auth.currentUserValue;
        this.isLoadingForm$.next(false);
        this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy == 'PD');

      })
    ).subscribe(res => {
      if (res.success) {
        this._user$ = this.auth.currentUserValue;

        this._items$.next(res.data);
        // console.log(res.data)
        this.allowGetAll.next(this.auth.isSysAdmin() && this._user$.maDViQLy == 'PD');
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
function loadDataNewForm1() {
  throw new Error('Function not implemented.');
}

