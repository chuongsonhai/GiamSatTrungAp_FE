var SignService = {
    sign: false,
    lstHoso: [],
    cert: null,
    index: 0,
    signLeave: false,
    tukhoa: '',
    hoSoSingle: null,
    GetCaSingle: function (tukhoa, hoso) {
        ServiceExt.GetCa(function (d) {
            console.log(d);
            SignService.hoSoSingle = hoso;
            SignService.cert = d;
            $("#txtFileBase64Sign").val(SignService.cert);
            $("#txtUSBCertificate").val((SignService.cert));
            SignService.tukhoa = tukhoa;
            SignService.createHashHopDongSingle();
            //document.getElementById("request").value=d;
        });
    },
    GetCaSinglePhuLuc : function (tukhoa, hoso) {
        SignService.hoSoSingle = hoso;
        SignService.cert =  $("#txtUSBCertificate").val();
        SignService.tukhoa = tukhoa;
        SignService.createHashHopDongSinglePhuLuc();
    },
    GetUSBCertificate: function (tukhoa, hoso) {
        ServiceExt.GetCa(function (d) {
            SignService.cert = d;
            $("#txtUSBCertificate").val(SignService.cert);
            var event = new Event('getCertificateDone', {});
            window.dispatchEvent(event);
        });
    },
    createHashHopDongSingle: function () {
        //debugger;
        var data = {
            "TuKhoa": SignService.tukhoa,
            "cert": SignService.cert,
            "Base64File": SignService.hoSoSingle,
        };
        console.log(data);
        jQuery.ajax({
            async: true,
            type: "POST",
            //url: 'https://apicskh.evnhanoi.com.vn/kyso/CreateHashHopDong_USB',
            url: 'https://apicskh.evnhanoi.com.vn/kyso/CreateHashHopDong_USB',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),

        }).then(function (response) {
            //debugger;
            console.log(response);
            var obj = response;
            if (obj.suc) {
                // alert("suc" + obj.id_file+obj.hashed);
                SignService.updateHopDongSingle(obj.id_file, obj.hashed);

                console.log(obj);
            }
            else {

                alert('Lỗi trong quá trinh ký: ' + obj.msg);
            }
        }, function (err) {
            console.log(err);
        });

    },
    updateHopDongSingle: function (GlobalId_file, GlobalHashed) {

        var reqdata = {
            "id_file": GlobalId_file,
            "hashed": GlobalHashed,
        }
        var stringReqdata = JSON.stringify(reqdata);
        console.log(stringReqdata);

        //var url = "https://apicskh.evnhanoi.com.vn/kyso/HopDongInsertHashedFile_USB";
        var url = "https://apicskh.evnhanoi.com.vn/kyso/HopDongInsertHashedFile_USB";
        jQuery.ajax({
            async: true,
            type: "POST",
            url: url,
            data: stringReqdata,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                console.log(data);
                //console.log(data.filebase64);
                if (data.suc == true) {
                    alert('Ký thành công !');

                    var event = new Event('build', {});
                    console.log(data.filebase64);
                    $("#txtFileBase64Sign").val(data.filebase64);
                    // Dispatch the event.
                    // debugger;
                    window.dispatchEvent(event);

                }
                else {
                    alert('Lỗi trong quá trinh ký: ' + data.msg);

                }

            }
        })

    },
    createHashHopDongSinglePhuLuc: function () {
        //debugger;
        var data = {
            "TuKhoa": SignService.tukhoa,
            "cert": SignService.cert,
            "Base64File": SignService.hoSoSingle,
        };
        console.log(data);
        jQuery.ajax({
            async: true,
            type: "POST",
            //url: 'https://apicskh.evnhanoi.com.vn/kyso/CreateHashHopDong_USB',
            url: 'https://apicskh.evnhanoi.com.vn/kyso/CreateHashHopDong_USB',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),

        }).then(function (response) {
            //debugger;
            console.log(response);
            var obj = response;
            if (obj.suc) {
                // alert("suc" + obj.id_file+obj.hashed);
                SignService.updateHopDongSinglePhuLuc(obj.id_file, obj.hashed);

                console.log(obj);
            }
            else {

                alert('Lỗi trong quá trinh ký: ' + obj.msg);
            }
        }, function (err) {
            console.log(err);
        });

    },
    updateHopDongSinglePhuLuc: function (GlobalId_file, GlobalHashed) {

        var reqdata = {
            "id_file": GlobalId_file,
            "hashed": GlobalHashed,
        }
        var stringReqdata = JSON.stringify(reqdata);
        console.log(stringReqdata);

        //var url = "https://apicskh.evnhanoi.com.vn/kyso/HopDongInsertHashedFile_USB";
        var url = "https://apicskh.evnhanoi.com.vn/kyso/HopDongInsertHashedFile_USB";
        jQuery.ajax({
            async: true,
            type: "POST",
            url: url,
            data: stringReqdata,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                console.log(data);
                //console.log(data.filebase64);
                if (data.suc == true) {
                   

                    var event = new Event('build', {});
                    console.log(data.filebase64);
                    $("#txtFileBase64Sign").val(data.filebase64);
                    // Dispatch the event.
                    // debugger;
                    window.dispatchEvent(event);

                }
                else {
                    alert('Lỗi trong quá trinh ký: ' + data.msg);

                }

            }
        })

    },
    GetCa: function (hoso) {
        ServiceExt.GetCa(function (d) {
            console.log(d);
            SignService.lstHoso = hoso;
            SignService.cert = d;
            SignService.index = 0;
            SignService.signLeave = false;
            SignService.Sign();
            //document.getElementById("request").value=d;
        });
    },
    Sign: function () {
        //var data='zNLZMgn6dahMLVNwcVv/hJDFmqg=';
        //ServiceExt.Sign(data,function(d){
        //	console.log(d);
        //		document.getElementById("request").value=d;
        //});
        SignService.index = 0;
        SignService.SignCallBack(SignService.index);

        //SignService.createHashHopDong(hoso[0].MA_YCAU, hoso[0].MA_DVIQLY, hoso[0].MA_HSGT, cert);
    },

    SignCallBack: function (i) {
        SignService.callSign(SignService.lstHoso[i], SignService.cert, true);
    },

    SignLeave: function (i) {
        SignService.callSign(SignService.lstHoso[i], SignService.cert, true);
    },

    callSign: function (hosoSign, cert, bSign) {
        for (var i = 0; i < hosoSign.length; i++) {
            SignService.createHashHopDong(hosoSign[i].MA_YCAU, hosoSign[i].MA_DVIQLY, hosoSign[i].MA_HSGT, cert);
        }
        //SignService.createHashHopDong(hosoSign.MA_YCAU, hosoSign.MA_DVIQLY, hosoSign.MA_HSGT, cert);

    },
    createHashHopDong: function (maYeuCau, maDonViQuanLy, maGiayTo, cert) {
        debugger;
        var reqdata = {
            MA_DVIQLY: maDonViQuanLy,
            MA_LOAI_HSO: maGiayTo,
            MA_YCAU_KNAI: maYeuCau,
            CERT: cert
        };
        var stringReqdata = JSON.stringify(reqdata);
        var url = "https://apicskh.evnhanoi.com.vn/cmis/ServiceInterface-Interface-context-root/resources/serviceInterface/createHashHDong";
        //Output: {"TYPE":"OK", "MESSAGE":"Base64Hash"}
        jQuery.ajax({
            async: true,
            type: "POST",
            //url: '@Url.Action("HoSo2019/createHashHopDong")',
            //url: '/GiaoDichDienTu/createHashHopDong',
            url: url,
            data: stringReqdata,
            dataType: "json",
            context: document.body,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //Thuc hien Ky so file hop dong
                console.log(data);
                if (data.TYPE === "SUCCESS") {
                    SignService.signHopDong(maYeuCau, maDonViQuanLy, maGiayTo, data);
                }

            }
        });
    },

    createHashHopDong1: function (maYeuCau, maDonViQuanLy, maGiayTo, cert) {
        var reqdata = {
            MA_DVIQLY: maDonViQuanLy,
            MA_LOAI_HSO: maGiayTo,
            MA_YCAU_KNAI: maYeuCau,
            CERT: cert
        };
        var stringReqdata = JSON.stringify(reqdata);
        //var url = "http://10.9.0.72:7002/ServiceInterface-Interface-context-root/resources/serviceInterface/createHashHDong";
        var url = "https://apicskh.evnhanoi.com.vn/cmis/ServiceInterface-Interface-context-root/resources/serviceInterface/createHashHDong";
        //Output: {"TYPE":"OK", "MESSAGE":"Base64Hash"}
        $.ajax({
            async: true,
            type: "POST",
            url: url,
            data: stringReqdata,
            dataType: "json",
            context: document.body,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                //Thuc hien Ky so file hop dong
                SignService.signHopDong(maYeuCau, maDonViQuanLy, maGiayTo, data);
            }
        });
    },

    signHopDong: function (maYeuCau, maDonViQuanLy, maGiayTo, data) {
        //alert(data.MESSAGE);
        //signdata
        ServiceExt.Sign(data.MESSAGE, function (d) {
            console.log(d);
            //Call API update file ky
            console.log('Sign ' + maGiayTo);
            SignService.updateHopDong(maYeuCau, maDonViQuanLy, maGiayTo, d);
        });
    },

    updateHopDong: function (maYeuCau, maDonViQuanLy, maGiayTo, dataSigned) {
        var reqdata = {
            AccessKey: "123",
            SecretKey: "123",
            MA_DVIQLY: maDonViQuanLy,
            MA_YCAU_KNAI: maYeuCau,
            MA_LOAI_HSO: maGiayTo,
            //strNgayKy: "03/04/2020",
            HASH: dataSigned
        };

        var stringReqdata = JSON.stringify(reqdata);
        console.log('update' + stringReqdata);
        var url = "https://apicskh.evnhanoi.com.vn/cmis/ServiceInterface-Interface-context-root/resources/serviceInterface/updateHashHDong";
        jQuery.ajax({
            async: true,
            type: "POST",
            //url: '@Url.Action("HoSo2019/updateHashHopDong")',
            //url: '/GiaoDichDienTu/updateHashHopDong',
            url: url,
            data: stringReqdata,
            dataType: "json",
            context: document.body,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                if (data.MESSAGE === "OK") {

                    if (SignService.index + 1 === SignService.lstHoso.length) {
                        alert('Ký số thành công!');
                    }
                    if (maYeuCau.include('GC')) {
                        var event = new Event('build', {});
                        window.dispatchEvent(event);
                    }
                    //alert('Ký số thành công!');
                } else {
                    alert(data.MESSAGE);
                }
                //todo: tạm bỏ
                //if (SignService.index + 1 < SignService.lstHoso.length) {
                //    SignService.index = SignService.index + 1;
                //    SignService.SignLeave(SignService.index);
                //}
            }
        });
    },

    updateHopDong1: function (maYeuCau, maDonViQuanLy, maGiayTo, dataSigned) {
        var reqdata = {
            AccessKey: "123",
            SecretKey: "123",
            MA_DVIQLY: maDonViQuanLy,
            MA_YCAU_KNAI: maYeuCau,
            MA_LOAI_HSO: maGiayTo,
            strNgayKy: "03/04/2020",
            HASH: dataSigned
        }
        var stringReqdata = JSON.stringify(reqdata);
        var url = "https://apicskh.evnhanoi.com.vn/cmis/ServiceInterface-Interface-context-root/resources/serviceInterface/updateHashHDong";
        jQuery.ajax({
            async: true,
            type: "POST",
            url: url,
            data: stringReqdata,
            dataType: "json",
            context: document.body,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                alert(data.MESSAGE);
                if (SignService.index + 1 < SignService.lstHoso.length) {
                    SignService.index = SignService.index + 1;
                    SignService.SignLeave(SignService.index);
                }

            }
        });
    }
};


