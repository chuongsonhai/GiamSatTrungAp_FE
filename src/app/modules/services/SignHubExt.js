var signHubProxy;
var GlobalId_file = "";
var GlobalHashed = "";

var SignHubExt = function () {

    this.initialize = function (TuKhoa,Base64File) {
        console.log('init12');
        try {
            $.getScript("http://localhost:19821/signalr/hubs").done(function () {
                $.connection.hub.url = "http://localhost:19821/signalr";
                $.connection.hub.logging = true;
                // Declare a proxy to reference the hub.
                signHubProxy = $.connection.signHub;


                //hàm này được tool ký gọi để trả về cert
                //state: thành công là Success, thất bại là Error;
                //data: thành công là Base64 của cert, thất bại là thông báo lỗi
                signHubProxy.client.getCertResult = function (state, data) {
                    if (state == "Error") {
                        console.error(data);
                        return;
                    }
                    else {
                        console.log(data);
                        writeToLog(data);
                        createHashHopDong(data, TuKhoa, Base64File);
                    }
                };


                //hàm này được tool ký gọi để trả về hash sau ký
                //state: thành công là Success, thất bại là Error;
                //data: thành công là Base64 của file ký , thất bại là thông báo lỗi
                signHubProxy.client.signResult = function (state, data) {
                    if (state == "Error") {
                        console.error(data);
                        return;
                    }
                    else {
                        console.log("signResult " + data);
                        updateHopDong(data);
                    }

                };

                //Connect to hub
                $.connection.hub.start().done(function () {
                    writeToLog("Connected.");
                    // gọi đến tool ký để lấy cert
                    signHubProxy.server.getCert();
                }).fail(function () {
                    writeToLog('Could not connect');
                });
            }).fail(function () {
                alert("lỗi kết nối đến tool ký, vui lòng restart lại tool ký")
            })


        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    };

    //Write given text to log area
    function writeToLog(result) {
        $("#txtLog").append(result + "&#10;&#13;")
    }

    //Disconnect
    function disconnect() {
        if (signHubProxy != null) {
            $.connection.hub.stop().done(function () {
                signHubProxy = null;
                writeToLog("Disconnected.");
            });
        }
    }

    function createHashHopDong(cert, TuKhoa, Base64File) {
        var data = {
            "TuKhoa": TuKhoa,
            "cert": cert,
			"Base64File":Base64File,
        };
        var jsondata=JSON.stringify(data);
        console.log(data);
        jQuery.ajax({
            async: true,
            type: "POST",
            url: 'https://apitrungap.evnhanoi.vn/api/hosogiayto/CreateHash',
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data:  jsondata,
        }).then(function (response) {
            console.log(response);
            var obj = response;
            if (obj.suc) {
                signHubProxy.server.signFile(obj.hashed);
                
                GlobalId_file = obj.id_file;
                GlobalHashed = obj.hashed;

                //console.log(obj);
            }
            else {
                alert("getHash" + obj.msg);
            }
        }, function (err) {
            console.log(err);
        });

    }

    function updateHopDong(dataSigned) {
        var reqdata = {
            "id_file": GlobalId_file,
            "hashed": GlobalHashed,
        }
		console.log(reqdata);
        var jsondata=JSON.stringify(reqdata);
        var url = "https://apitrungap.evnhanoi.vn/api/hosogiayto/WrapFile";
        jQuery.ajax({
            async: true,
            type: "POST",
            url: url,
            data: jsondata,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
			console.log(data);
                //console.log(data.filebase64);
				if(data.suc==true){
                    alert('Ký thành công !');
                    $("#txtFileBase64Sign").val(data.filebase64);
                    $("#txtFileBase64Sign").trigger('input'); // Use for Chrome/Firefox/Edge
                    $("#txtFileBase64Sign").trigger('change'); // Use for Chrome/Firefox/Edge + IE11
                    $("#txtFileBase64Sign").blur();
                }
				else
				alert('Lỗi trong quá trinh ký: '+data.msg);
  
            }
        })
    }
}