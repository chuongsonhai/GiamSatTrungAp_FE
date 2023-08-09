export const DynamicAsideMenuConfig = {
  items: [    
    {
      title: 'Quản trị hệ thống',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Code/Settings4.svg',
      root: true,
      permission: 'HT-Group,HT-NguoiDung,HT-CauHinh,HT-DonVi,HT-PhongBan',
      page: '/qtht',
      submenu: [  
        {
          permission: 'HT-Group',
          title: 'Vai trò',
          page: '/qtht/roles'
        },      
        {
          permission: 'HT-NguoiDung',
          title: 'Danh sách người dùng',
          page: '/qtht/users'
        },
        {
          permission: 'HT-CauHinh',
          title: 'Cấu hình hệ thống',
          page: '/qtht/systemconfig'
        },    
        {
          permission: 'HT-CauHinh',
          title: 'Cấu hình cảnh báo',
          page: '/qtht/cauhinhcanhbao'
        },     
        {
          permission: 'HT-CauHinh',
          title: 'Log cảnh báo',
          page: '/qtht/logcanhbao'
        },   
        {
          permission: 'HT-DonVi',
          title: 'Đơn vị',
          page: '/qtht/donvi'
        }, 
        {
          permission: 'HT-PhongBan',
          title: 'Bộ phận',
          page: '/qtht/bophan'
        },   
        {
          permission: 'HT-CauHinh',
          title: 'Mẫu hồ sơ',
          page: '/qtht/mauhoso'
        },     
        {
          permission: 'HT-CauHinh',
          title: 'Cấu hình mẫu biên bản',
          page: '/qtht/templates'
        },        
        {
          permission: 'HT-CauHinh',
          title: 'Cấu hình đồng bộ',
          page: '/qtht/cauhinhdongbo'
        },
        {
          permission: 'HT-CauHinh',
          title: 'Trở ngại',
          page: '/qtht/trongai'
        },
        {
          permission: 'HT-CauHinh',
          title: 'SystemLog',
          page: '/qtht/systemlog'
        }
      ]
    },
    {
      title: 'Danh mục',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Credit-card.svg',
      root: true,
      permission: 'DM-CViec,DM-TTrinh,DM-Mail,DM-NhanVien,DM-ThongBao',
      page: '',
      submenu: [  
        {
          permission: 'DM-CViec',
          title: 'Cấu hình công việc',
          page: '/dmht/cauhinhcv'
        },
        {
          permission: 'DM-TTrinh',
          title: 'Theo dõi tiến trình',
          page: '/dmht/tientrinh'
        },
        {
          permission: 'DM-Mail',
          title: 'Mail thông báo',
          page: '/dmht/mail'
        },
        {
          permission: 'DM-Mail',
          title: 'Mail cảnh báo TCT',
          page: '/dmht/mailcanhbaotct'
        },
        {
          permission: 'DM-NhanVien',
          title: 'Nhân viên',
          page: '/dmht/nhanvien'
        },
        {
          permission: 'DM-ThongBao',
          title: 'Thông báo',
          page: '/dmht/thongbao'
        }
      ]
    },
    {
      title: 'Thỏa thuận đấu nối',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Chart-pie.svg',
      root: true,
      permission: 'YCDN-List,YCDN-BBKS,YCDN-TTDN',
      page: '',   
      submenu:[
        {
          permission: 'YCDN-List',
          title: 'Danh sách yêu cầu',
          page: '/ttdn/list'
        },
        {
          permission: 'YCDN-BBKS',
          title: 'Biên bản khảo sát',
          page: '/bbks/list'
        },
        {
          permission: 'YCDN-TTDN',
          title: 'Thỏa thuận đấu nối',
          page: '/bbdn/list'
        }
      ]  
    },
    {
      title: 'Kiểm tra điều kiện đóng điện & nghiệm thu',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Chart-pie.svg',
      root: true,
      permission: 'YCNT-List',
      page: '',
      submenu:[
        {
          permission: 'YCNT-List',
          title: 'Danh sách yêu cầu',
          page: '/ktdk/list'
        },
        {
          permission: 'YCNT-List',
          title: 'Biên bản kiểm tra điều kiện đóng điện',
          page: '/bbkt/list'
        },
        {
          permission: 'YCNT-List',
          title: 'Biên bản treo tháo',
          page: '/bbtt/list'
        },
        {
          permission: 'YCNT-List',
          title: 'Biên bản nghiệm thu',
          page: '/bbnt/list'
        },
        {
          permission: 'YCNT-List',
          title: 'Hợp đồng mua bán điện',
          page: '/ktdk/hopdong'
        }
      ]      
    },
    {
      title: 'Giám sát cấp điện',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Code/Settings4.svg',
      root: true,
      permission: 'HT-Group,HT-NguoiDung,HT-CauHinh,HT-DonVi,HT-PhongBan',
      page: '',
      submenu: [  
        {
          permission: 'HT-Group',
          title: 'Danh sách cảnh báo',
          page: '/gscd/filter'
        },      
        
      ]
    },
    {
      title: 'Báo cáo, thống kê',
      bullet: 'dot',
      icon: 'flaticon2-list-2',
      svg: './assets/media/svg/icons/Shopping/Chart-pie.svg',
      root: true,
      permission: 'YCNT-List,YCDN-List',
      page: '',
      submenu:[
        {
          permission: 'YCDN-List',
          title: 'Chi tiết thoả thuận đấu nối',
          page: '/bctk/bcttdn'
        },
        {
          permission: 'YCNT-List',
          title: 'Chi tiết kiểm tra điều kiện đóng điện điểm đấu nối và nghiệm thu',
          page: '/bctk/bcnt'
        },
        {
          permission: 'YCNT-List',
          title: 'Chi tiết tiếp cận điện năng ',
          page: '/bctk/cttcdn'
        },
        {
          permission: 'YCNT-List',
          title: 'Tổng hợp tiếp cận điện năng',
          page: '/bctk/thtcdn'
        },
        {
          permission: 'YCNT-List',
          title: 'Tổng hợp kết quả',
          page: '/bctk/thkq'
        },
        {
          permission: 'YCNT-List,YCDN-List',
          title: 'Thống kê theo quý',
          page: '/bctk/quater'
        },
        {
          permission: 'YCDN-List',
          title: 'Tổng hợp hồ sơ đăng ký ',
          page: '/bctk/tk'
        },
        {
          permission: 'YCDN-List',
          title: 'Báo cáo tổng hợp ',
          page: '/bctk/bcth'
        },
        {
          permission: 'YCDN-List',
          title: 'Báo cáo chi tiết tháng',
          page: '/bctk/bcctt'
        },
        {
          permission: 'YCDN-List',
          title: 'Báo cáo chi tiết luỹ kế',
          page: '/bctk/bcctlk'
        },
        {
          permission: 'YCDN-List',
          title: 'Thống kê tiến độ',
          page: '/bctk/bctd'
        },
        {
          permission: 'YCDN-List',
          title: 'Chi tiết các công trình quá hạn',
          page: '/bctk/ctqh'
        },
        {
          permission: 'YCDN-List',
          title: 'Tổng hợp các công trình quá hạn',
          page: '/bctk/thqh'
        }
      ]      
    }
  ]
};
