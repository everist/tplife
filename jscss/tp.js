var excelData = [];
var selectedEmpData = [];
var selectedEmpId = [];
var reCalculate = false;
var allowNull  = true;
var havingNull = false;
var X = null;
$(document).ready(function(){
    // 第一页进入第二页，选择要计算的员工
    $('#inputNext').on('click', function() {
        // window.location.href="tp_demo_select.html";
        $('#topTable1').hide();
        $('#topTable2').show();
        
        $('#dataDiv1').hide();
        $('#dataDiv2').show();
        
        initSelect();
        
        hangTableTr();
    });
    
    // 开始计算，第2页进入第3页
    $('#startCalculate').on('click', function() {
        /*if(!confirm('确实要开始计算吗？')) {
            return false;
        }
        */
        if(saveCalculateFeeData()) {
            $('#topTable2').hide();
            $('#topTable3').show();
            
            $('#dataDiv2').hide();
            $('#dataDiv3').show();
        }
    });
    
    $('#returnSelect').on('click', function() {
        $('#topTable3').hide();
        $('#topTable2').show();
        
        $('#dataDiv3').hide();
        $('#dataDiv2').show();
    });
    
    $('#reImportExcel').on('click', function() {
        $('#topTable3').hide();
        $('#topTable1').show();
        
        $('#dataDiv3').hide();
        $('#dataDiv1').show();
    });
    
    $('#reImportExcel1').on('click', function() {
        $('#topTable2').hide();
        $('#topTable1').show();
        
        $('#dataDiv2').hide();
        $('#dataDiv1').show();
    });
    
    
    $('#createCheckTable').on('click', function() {
        window.open('校验表.html');
    });
    
    $('#selectAdd').on('click', function() {
        var options = $('select.multiselect1 option:selected').sort().clone();
        selectedEmp(options.val());
        $('select.multiselect2').append(options);
        $('select.multiselect1 option:selected').remove();
    });
    
    $('select.multiselect1').on('dblclick', function() {
        var options = $('select.multiselect1 option:selected').sort().clone();
        selectedEmp(options.val());
        
        $('select.multiselect2').append(options);
        $('select.multiselect1 option:selected').remove();
    });
    $('#selectAddAll').on('click', function() {
        var options = $('select.multiselect1 option').sort().clone();
        
        for(var i=0, n=options.length; i<n; i++) {
            
            selectedEmp(options[i].value);
        }
        $('select.multiselect2').append(options);
        
        $('select.multiselect1').empty();
    });
    
    $('#selectRemove').on('click', function() {
        var options = $('select.multiselect2 option:selected').sort().clone();
        removeInputRow(options.val());
        
        $('select.multiselect1').append(options);

        $('select.multiselect2 option:selected').remove();
    });
    $('select.multiselect2').on('dblclick', function() {
        var options = $('select.multiselect2 option:selected').sort().clone();
        removeInputRow(options.val());
        $('select.multiselect1').append(options);

        $('select.multiselect2 option:selected').remove();
    });
    
    $('#selectRemoveAll').on('click', function() {
        var options = $('select.multiselect2 option').sort().clone();
        for(var i=0, n=excelData.length; i<n; i++) {
            removeInputRow(i);
        }
        
        $('select.multiselect1').append(options);

        $('select.multiselect2').empty();
    });
    
    $('#periodsNum').on(!window.eventListener ? 'keyup' : 'input', function() {
        if(isInteger($(this).val())) {
            var num = parseInt($(this).val());
            for(var i=0, n=selectedEmpId.length; i<n; i++) {
                var index = selectedEmpId[i];
                
                changePeriodValue(i, num, selectedEmpData[i], excelData[index]);
            }
        }
    });
    $('#periodsNum').on('focus', function() {
        $(this).select();
    });
    $("#periodsNum").on("keypress",function (e) {
        if (e.which == 13) {
            return false;
        }
    });
    
    // 批理保存 年金中人补偿金额
    $('#batchSaveComFee').on('click', function() {
        var batchVal = $('#comFeeAll').val();
        if(batchVal == '') {
            if(!confirm("年金中人补偿金额为空，是否统一设置成空？")) {
                return false;
            }
        }
        if(batchVal != '' && !validateFloat(batchVal) || parseFloat(batchVal) < 0) {
            alert("年金中人补偿金额\n 请输入大于或等于0的整数或小数");
            return false;
        }
        
        // 保存输入的数据
        $(".inputRowClassFlag").each(function(){
            var index = $(this).attr("id").substr(7);
            
            // selectedEmpId.push(index);
            $('#compensateFee'+index).val(batchVal);
        });
    });
});


function importXLS() {
    var filename = $("#excelFileInput").val();
    if(!filename || filename == "") {
        alert("请选择要导入的Excel文件（后缀是xls）");
        return false;
    }
    var extend = filename.substring(filename.lastIndexOf(".")+1);
    if(extend != "xls") {
        alert("请选择要导入的Excel文件（后缀是xls）");
        return false;
    }
    excelData = [];
    
    $('#tableHead').empty();
    $('#tableBody').empty();
    
    // 判断使用的浏览器，是IE还是其他的内核
    var t = getBrowserType();
    if(t == 'ie') {
        importXLSByIE(filename);
    } else {
        importXLSByNoIE(filename);
    }
    CollectGarbage();
}

// 通过IE导入excel
function importXLSByIE(filename) {
    objCon = new ActiveXObject("ADODB.Connection");
    objCon.Provider = "Microsoft.Jet.OLEDB.4.0";
    objCon.ConnectionString = "Data Source=" + filename + ";Extended Properties=Excel 8.0;";
    objCon.CursorLocation = 1;
    objCon.Open;
    var strQuery;
    
    var rowData = '', headRowData = '';
    var strSheetName = "Sheet1$";
    var rsTemp =   new ActiveXObject("ADODB.Recordset");
    rsTemp = objCon.OpenSchema(20);
    if(!rsTemp.EOF)
    strSheetName = rsTemp.Fields("Table_Name").Value;
    
    rsTemp = null;
    var rsExcel =   new ActiveXObject("ADODB.Recordset");
    strQuery = "SELECT * FROM [" + strSheetName + "]";
    rsExcel.ActiveConnection = objCon;
    rsExcel.Open(strQuery);
    
    var rownum = 0;
    var cellValue = '';
    var empid = '';
    while(!rsExcel.EOF) {
        var rowArray = {};
        
        if(rownum == 0) {
            for(i = 0;i<rsExcel.Fields.Count;++i) {
                var cell = rsExcel.Fields(i);
                if(i == 1) {
                    headRowData += '<th nowrap>'+cell.name+'</th>';
                } else {
                    headRowData += '<th nowrap>'+cell.name+'</th>';
                }
                cellValue = cell.value;
                
                rowData += '<td>'+(cellValue == null ? '' : cellValue)+'</td>';
                rowArray[i] = cellValue;
                
                if(i == 4) {
                    empid = cellValue;
                }
            }
            $('#tableHead').append('<tr>'+headRowData+'</tr>');
            $('#tableBody').append('<tr>'+rowData+'</tr>');
            
            // excelData.push(rowArray);
            excelData.push(rowArray);
            
        } else {
            var bgcolor = rownum%2 == 1 ? ";background:#E6E6FA;" : "";
            
            for(i=0;i<rsExcel.Fields.Count;++i) {
                var cell = rsExcel.Fields(i);
                cellValue = cell.value;
                
                rowData += '<td nowrap style="height:30px;'+bgcolor+'">'+(cellValue == null ? '' : cellValue)+'</td>';
                
                rowArray[i] = cellValue;
                if(i == 4) {
                    empid = cellValue;
                }
            }
            $('#tableBody').append('<tr>'+rowData+'</tr>');
            excelData.push(rowArray);
        }
        
        rowData = '';
        rsExcel.MoveNext;
        rownum++;
    }
    
    $('#importExcelPreview').html('导入数据预览，共 '+rownum+' 条记录');
    
    objCon.Close;
    objCon =null;
    rsExcel = null;
}

// 非IE导入Excel
function importXLSByNoIE(filename) {
    X = XLS;
    var name = filename;
    var f = $("#excelFileInput")[0].files[0];
    var reader;
    if(f) {
        reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            xw_xfer(data, process_wb);
        };
        
        reader.readAsBinaryString(f);
    }
}

function ab2str(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
    return o;
}

function s2ab2(s) {
    var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
    for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
    return [v, b];
}

function xw_xfer(data, cb) {
    var v = XLS.read(data, {type: 'binary'});
    
    var res = {t:"xls", d:JSON.stringify(v)};
    var r = s2ab2(res.d)[1];
    
    var xx=ab2str(r).replace(/\n/g,"\\n").replace(/\r/g,"\\r");
    cb(JSON.parse(xx));
}

function process_wb(wb) {
    XLS.SSF.load_table(wb.SSF);
    var output = "";
    var result = [];
    // wb.SheetNames.forEach(function(sheetName) {
    var rows = X.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]]);
    var rowData = '', headRowData = '';
    var rownum = 0;
    var cellValue = '';
    
    if(rows.length > 0) {
        var rowArray = {};
        var num = 0;
        for(var k in rows[0]) {
            headRowData += '<th nowrap>'+k+'</th>';
            cellValue = (rows[0][k] == null ? '' : rows[0][k]);
            
            rowData += '<td nowrap style="height:30px;">'+(cellValue == null ? '' : cellValue)+'</td>';
            // rowData += '<td>'+cellValue+'</td>';
            rowArray[num++] = cellValue;
            
        }
        excelData.push(rowArray);
        
        $('#tableHead').append('<tr>'+headRowData+'</tr>');
        $('#tableBody').append('<tr>'+rowData+'</tr>');
        
        var rownum = 0;
        for(var i=1, n=rows.length; i<n; i++) {
            var bgcolor = rownum%2 == 0 ? "background:#E6E6FA;" : "";
            rowData = '';
            num = 0;
            rowArray = {};
            
            for(var k in rows[i]) {
                // headRowData += '<th nowrap>'+k+'</th>';
                cellValue = (rows[i][k] == null ? '' : rows[i][k]);
                rowData += '<td nowrap style="height:30px;'+bgcolor+'">'+(cellValue == null ? '' : cellValue)+'</td>';
                
                rowArray[num++] = cellValue;
            }
            
            // excelData.push(rowArray);
            rownum++;
            $('#tableBody').append('<tr>'+rowData+'</tr>');
            excelData.push(rowArray);
        }
        
        $('#importExcelPreview').html('导入数据预览，共 '+(rownum+1)+' 条记录');
    }
}

function initSelect() {
    $('select.multiselect1').empty();
    $('select.multiselect2').empty();
    
    selectedEmpData = [];
    selectedEmpId = [];
    
    for(var i=0, n=excelData.length; i<n; i++) {
        removeInputRow(i);
    }

    var rowData, optionText;
    for(var i=0, n=excelData.length; i<n; i++) {
        rowData = excelData[i];
        optionText = rowData[2]+'（' +rowData[4] +'）';
        $('select.multiselect1')
                    .append($('<option title="'+rowData[2]+'"></option>')
                    .attr('value',i)
                    .text(optionText));
    }
}

function selectedEmp(index) {
    // inputTable
    var n = excelData.length;
    if(index >= 0 && index < n) {
        var rowData = excelData[index];
        var rowText = '<td class="nametd_l"><input type="checkbox" class="chkSelectEmp" id="cancel'+index+'" value="'+index+'" checked> &nbsp; 姓名：<b>'+rowData[2]+'</b></td> <td colspan="5" class="nametd_r">身份证： '+rowData[4]+'</td>';
        
        $('#inputTableBody').append('<tr id="nameTr'+index+'">'+rowText+'</tr>');
        
        $(".chkSelectEmp").bind("click",function () {
            var empId = $(this).prop("value");
            if(!($(this).prop("checked"))) {
                $(this).parent().parent().remove();
                $('#inputTr'+empId).remove();
                
                removeFromSelectByChk(empId);
            }
        });
        
        $('#inputTableBody').append(getInputContent(index));
        $(".input_text").bind("keypress",function (e) {
            if (e.which == 13) {
                var index = $('.input_text').index(this) + 1;
                $('.input_text').eq(index).focus();
                return false;
            }
        });
        
        $(".input_text").bind("blur",function () {
            if(reCalculate) {
                var val = $(this).val();
                var tag = parseInt($(this).attr('tag'));
                var empno = $(this).attr('empno');
                // if(!validateInputValueEmpty(val, tag)) {
                if(!validateInputValue(val, tag, allowNull)) {
                    reCalculate = false;
                    return;
                }
                
                // 计算内容
                if(tag == 1) {
                    // 上一年度月平均工资
                    var firstDate = $("#firstDate"+empno).val();
                    var retireDate = $("#retireDate"+empno).val();
                    
                    if(firstDate != "" && retireDate != "") {
                        var monthNum = intervalMonth(firstDate, retireDate);
                        
                        if(monthNum == "") {
                            alert("参加年金首笔缴费时间与正式退休时间输入格式不正确！");
                        }
                        else if(monthNum <= 0) {
                            alert("正式退休时间小于等于参加年金首笔缴费时间");
                        } else {
                            $("#payMonth"+empno).val(monthNum);
                            
                            // 修改补偿月份与金额
                            var comMonth = 120-(monthNum);
                            $("#compensateMonth"+empno).val(comMonth);
                            $("#compensateFee"+empno).val(calCompensateFee($("#avgSalary"+empno).val(), comMonth));
                        }
                    }
                }
                else if(tag == 2 || tag == 3) {
                    // 参加年金首笔缴费时间 与 正式退休时间
                    var firstDate = $("#firstDate"+empno).val();
                    var retireDate = $("#retireDate"+empno).val();
                    
                    if(firstDate != "" && firstDate.indexOf("-") == -1) {
                        firstDate = transDateToSplit(firstDate);
                        $("#firstDate"+empno).val(firstDate);
                    }
                    if(retireDate != "" && retireDate.indexOf("-") == -1) {
                        retireDate = transDateToSplit(retireDate);
                        $("#retireDate"+empno).val(retireDate);
                    }
                        
                    if(firstDate != "" && retireDate != "") {
                        var monthNum = intervalMonth(firstDate, retireDate);
                        
                        if(monthNum == "") {
                            alert("参加年金首笔缴费时间与正式退休时间输入格式不正确！");
                        }
                        else if(monthNum <= 0) {
                            alert("正式退休时间小于等于参加年金首笔缴费时间");
                        } else {
                            $("#payMonth"+empno).val(monthNum);
                            
                            // 修改补偿月份与金额
                            var comMonth = 120-(monthNum);
                            $("#compensateMonth"+empno).val(comMonth);
                            $("#compensateFee"+empno).val(calCompensateFee($("#avgSalary"+empno).val(), comMonth));
                        }
                    }
                } else if(tag == 4) {
                    // 修改实际月份
                    var firstDate  = $("#firstDate"+empno).val();
                    var retireDate = $("#retireDate"+empno).val();
                    
                    if(firstDate != "" && retireDate != "") {
                        var monthNum = intervalMonth(firstDate, retireDate);
                        // monthNum--;
                        if(val == '') {
                            $(this).attr("class","input_text");
                            val = monthNum;
                            $(this).val(val);
                        } else {
                            if(val == monthNum) {
                                $(this).attr("class","input_text");
                            } else {
                                $(this).attr("class","input_text_red");
                            }
                        }
                    }
                    
                    // 计算 年金中人补偿月数(120-年金实际缴费月数)
                    if(val != '') {
                        var comMonth = 120-val;
                        comMonth = comMonth < 0 ? 0 : comMonth;
                        $("#compensateMonth"+empno).val(comMonth);
                        $("#compensateFee"+empno).val(calCompensateFee($("#avgSalary"+empno).val(), comMonth));
                    }
                } else if(tag == 5) {
                    // 年金中人补偿月数
                    var monthNum = $("#payMonth"+empno).val();
                    var comMonth = 120-monthNum;
                    if(val == '' && monthNum != '') {
                        $(this).attr("class","input_text");
                        $(this).val(comMonth);
                    } else {
                        if(val == comMonth) {
                            $(this).attr("class","input_text");
                        } else {
                            $(this).attr("class","input_text_red");
                        }
                    }
                    
                    $("#compensateFee"+empno).val(calCompensateFee($("#avgSalary"+empno).val(), val));
                } else if(tag == 6) {
                    // 年金中人补偿金额
                    var comMonth = $("#compensateMonth"+empno).val();
                    if(comMonth != '') {
                        var comFee = calCompensateFee($("#avgSalary"+empno).val(), comMonth);
                        if(val == '') {
                            // 为空取默认计算值
                            $(this).attr("class","input_text");
                            $("#compensateFee"+empno).val(comFee);
                        }
                        else {
                            if(val == comFee) {
                                $(this).attr("class","input_text");
                            } else {
                                $(this).attr("class","input_text_red");
                            }
                        }
                    }
                }// end if tag = 6
            }
        });
        
        $(".input_text").bind("change",function () {
            reCalculate = true;
        });
        $(".input_text_red").bind("change",function () {
            reCalculate = true;
        });
    }
}

function removeFromSelectByChk(index) {
    var options = $('select.multiselect2 option[value="' + index + '"]').sort().clone();
    $('select.multiselect1').append(options);

    $('select.multiselect2 option[value="' + index + '"]').remove();
}

function removeInputRow(index) {
    $('#inputTr'+index).remove();
    $('#nameTr'+index).remove();
}

function saveCalculateFeeData() {
    selectedEmpId = [];
    selectedEmpData = [];
    
    // 保存输入的数据
    $(".inputRowClassFlag").each(function(){
        var index = $(this).attr("id").substr(7);
        
        selectedEmpId.push(index);
    });
    
    if(selectedEmpId.length == 0) {
        alert("请选择要计算的员工");
        return false;
    } else {
        var titleContent = '共选择'+selectedEmpId.length+'人：';
        var resultTableContent = '';
        
        // '共选择4人：<a href="#people1">李四</a>、<a href="#people2">张三</a>、<a href="#people3">王五</a>、<a href="#people4">小白</a>');
        for(var i=0, n=selectedEmpId.length; i<n; i++) {
            var index = selectedEmpId[i];
            
            // 检查输入内容是否符合要求
            if(!checkCalculateInput(selectedEmpId[i])) {
                return false;
            }
            
            if(i > 0) {
                titleContent += '、&nbsp;';
            }
            titleContent += '<a href="#people'+index+'">'+excelData[index][2]+'</a>';
            
            resultTableContent += getResultTableContent(selectedEmpData[i], excelData[index], (n-1 == i), i);
        }
        
        if(havingNull && !confirm("输入项存在为空的内容，是否继续计算？")) {
            return false;
        }
        
        resultTableContent += '<input type="hidden" id="employeeNum" value="'+selectedEmpId.length+'">';
        // 修改 result tile
        $('#peopleTd').html(titleContent);
        $('#calResultTableTd').html(resultTableContent);
        
        $(".num_periods_td").bind("click",function () {
            var periodNum = $(this).html();
            var period_id = $(this).attr('id');
            var ind = $(this).attr('ind');
            
            if(periodNum.indexOf('input') == -1) {
                var input_id = period_id + "_input";
                $(this).html('<input class="period_num_input" id="'+input_id+'" value="'+periodNum+'" maxlength="3">');
                $("#"+input_id).focus();
                $("#"+input_id).select();
                
                $(".period_num_input").bind("keypress",function (e) {
                    if (e.which == 13) {
                        // $("#"+period_id).html($(this).val());
                        
                        // 重新计算
                        changePeriodValue(ind, $(this).val(), selectedEmpData[ind], excelData[selectedEmpId[ind]]);
                        return false;
                    }
                });
            }
        });
    }
    
    return true;
}

// 验证输入值数据，不能为空等
function checkCalculateInput(index) {
    havingNull = false;
    var empData = [];
    empData[0] = index;
    empData[1] = $('#avgSalary'+index).val();
    empData[2] = $('#firstDate'+index).val();
    empData[3] = $('#retireDate'+index).val();
    empData[4] = $('#payMonth'+index).val();
    empData[5] = $('#compensateMonth'+index).val();
    empData[6] = $('#compensateFee'+index).val();
    var names = ['', 'avgSalary', 'firstDate', 'retireDate', 'payMonth', 'compensateMonth', 'compensateFee'];
    
    for(var i=1; i<=6; i++) {
        if(empData[i] == '') {
            if(!allowNull) {
                alert('请输入计算数据');
                $('#'+names[i]+index).focus();
                return false;
            }
            havingNull = true;
        }
        
        if(!validateInputValue(empData[i], i, allowNull)) {
            $('#'+names[i]+index).focus();
            return false;
        }
    }
    
    selectedEmpData.push(empData);
    return true;
}


function CreateExcel()
{
   /*try{
       var oXL = new ActiveXObject("Excel.Application"); //创建应该对象
       // this.oXL.Visible = ExcelVisible;
       var oWB = oXL .Workbooks.Add();//新建一个Excel工作簿
       var oSheet = oWB.ActiveSheet;//指定要写入内容的工作表为活动工作表
       //不显示网格线
       oXL.ActiveWindow.DisplayGridlines=false;
   }catch(e){
        alert("请确认安装了非绿色版本的excel！"+e.description);
        CloseExcel();
   }*/
}


function hangTableTr() {
    var scroll_bar = $("#inputTable"); //表格的id
    var bar_head = $("#inputTableHead");//表头
    var bar_height = bar_head.height();//表头高
    var sroll_header = scroll_bar.clone().attr('id', 'bb');//更改复制的表格id
    
    $(window).scroll(function(){
        var bodytop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        
        var scroll_top = bodytop - scroll_bar.offset().top;//判断是否到达窗口顶部
        
        if (scroll_top > 0) {
            $('body').append('<div id="shelter"></div>');//复制的表格所在的容器
            $("#shelter").css({'height':bar_height,'position':'fixed','top':'0','overflow':'hidden','width':'1050px','margin': '0 auto','left':'0','right':'0','border-bottom':'1px solid #c8c8c8'});
            sroll_header.appendTo('#shelter');
            $('#shelter table').removeClass(); //删除table原来有的默认class，防止margin,padding等值影响样式
            $('#shelter table').css({'width':'1050px','background-color':'#f0f0f0','margin':'0 auto'});
            $('#shelter table tr th').css({'height':bar_height,'line-height':'30px;','color':'#036','padding-left':'0px','font':'bold 14px "Microsoft YaHei", 黑体'});//此处可以自行发挥
            $('#shelter table tr td').css({'padding':'0px'});

            $('#shelter').show();
        }else {
            $('#shelter').hide();
        }
    });
}


