function isNumber(value) {
    return !isNaN(value);
}

// A simple check to verify that the value is an integer. Uses `isNumber`
// and a simple modulo check.
function isInteger(value) {
    return isNumber(value) && value % 1 === 0;
}

function prettify(str) {
    if (isNumber(str)) {
        // If there are more than 2 decimals round it to two
        //if ((str * 100) % 1 === 0) {
        //  return "" + str;
        //} else {
          return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        //}
    } else {
        return "";
    }
}

function prettify1(str) {
    if (isNumber(str)) {
        // If there are more than 2 decimals round it to two
        
        return parseFloat(Math.round(str * 100) / 100).toFixed(2);
        
    } else {
        return "";
    }
}

function prettify_8(str) {
    if (isNumber(str)) {
        // If there are more than 2 decimals round it to two
        if ((str * 100000000) % 1 === 0) {
          return "" + str;
        } else {
          return parseFloat(Math.round(str * 100000000) / 100000000).toFixed(8);
        }
    } else {
        return "";
    }
}

// 验证实数
function validateRealNum(val){
    var patten = /^-?\d+\.?\d*$/;
    return patten.test(val);
}

//验证小数
function validateFloat(val){
    var patten = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
    return patten.test(val);
}

//验证小数，保留2位小数点
function validateMoneyNum(val){
    var patten = /^-?\d+\.?\d{0,2}$/;
    return patten.test(val);
}

function validateDate(val){
    var res = val.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(res==null)return false; 
    else return true;
}

function validateDateExt(val){
    var res = val.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if(res==null) {
        res = val.match(/^(\d{4})(\d{2})(\d{2})$/);
        if(res==null)return false; 
        else return true;
    } 
    else {
        return true;
    }
}

function preview(oper) { 
    var t = getBrowserType();
    if(t == 'ie') {
        //alert("请选择左上方“文件->打印预览”或者使用Chrome浏览器");
        //return false;
        $('#topTable3').hide();
        WebBrowser.ExecWB(7,1);
        $('#topTable3').show();
        return false;
    }
    
    if (oper < 10) {  
        bdhtml=window.document.body.innerHTML;//获取当前页的html代码  
        sprnstr="<!--startprint"+oper+"-->";//设置打印开始区域  
        eprnstr="<!--endprint"+oper+"-->";//设置打印结束区域  
        prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html  
        prnhtmlprnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html  
        window.document.body.innerHTML=prnhtml;
        window.print();  
        window.document.body.innerHTML=bdhtml;  
    } else {  
        window.print();  
    }  
}

function resultPrint(oper) { 
    // var t = getBrowserType();
    
    if (oper < 10) {  
        bdhtml=window.document.body.innerHTML;//获取当前页的html代码  
        sprnstr="<!--startprint"+oper+"-->";//设置打印开始区域  
        eprnstr="<!--endprint"+oper+"-->";//设置打印结束区域  
        prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html  
        prnhtmlprnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html  
        window.document.body.innerHTML=prnhtml;
        window.print();  
        window.document.body.innerHTML=bdhtml;  
    } else {  
        window.print();  
    }  
}

function intervalMonth(startDate, endDate) {
    var d1 = null;
    var d2 = null;
    if(startDate.indexOf("-") == -1) {
        if(startDate.length == 8) {
            d1 = new Date(Date.parse(startDate.substring(0,4) + "/" + startDate.substring(4,6) + "/" + startDate.substring(6,8)));
        }
    } else {
        d1 = new Date(Date.parse(startDate.replace(/-/g, "/")));
    }
    if(endDate.indexOf("-") == -1) {
        if(endDate.length == 8) {
            d2 = new Date(Date.parse(endDate.substring(0,4) + "/" + endDate.substring(4,6) + "/" + endDate.substring(6,8)));
        }
    } else {
        d2 = new Date(Date.parse(endDate.replace(/-/g, "/")));
    }
    
    if(d1 == null || d2 == null) {
        return "";
    }
   
    // 计算实际缴费月数
    return (d2.getFullYear() - d1.getFullYear())*12 + (d2.getMonth() - d1.getMonth());
}

// 把紧凑的日志格式转成中间带短横线的日期
// 如 20100101，转成 2010-01-01
function transDateToSplit(date) {
    if(date.length == 8) {
        return date.substring(0,4) + "-" + date.substring(4,6) + "-" + date.substring(6,8);
    }
    
    return "";
}

function addFloat(f1, f2) {
    if(validateFloat(f1)) {
        if(validateFloat(f2)) {
            return parseFloat(f1) + parseFloat(f2);
        } else {
            return parseFloat(f1);
        }
    } else if(validateFloat(f2)) {
        return parseFloat(f2);
    } else {
        return 0;
    }
}


function getBrowserType() {
     var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        
        if (Sys.ie) return "ie";
        if (Sys.firefox) return "firefox";
        if (Sys.chrome) return "chrome";
        if (Sys.opera) return "opera";
        if (Sys.safari) return "safari";
    return "";
}

function exportExcel(obj, tableId, fileName) {
    var t = getBrowserType();
    if(t == 'ie') {
        var x= document.getElementById(tableId).rows;
        var xls = new ActiveXObject("Excel.Application");
        xls.visible = true;
        var workbook = xls.Workbooks.Add();
        var sheet    = workbook.ActiveSheet;
    
        // xls.Workbooks.Add
        
        for (i = 0; i < x.length; i++) {
            var y = x[i].cells;
            for (j = 0; j < y.length; j++) {
                if(j == 3) {
                    sheet.Cells( i+1, j+1).NumberFormat = "@";
                }
                sheet.Cells( i+1, j+1).Value = y[j].innerText;
            }
        }
        sheet.Visible = true;
        sheet.UserControl = true;
        CollectGarbage();
        // return xls;
    } else {
        ExcellentExport.excel(obj, tableId, fileName);
    }
}

// 导出测算表的数据
// 测算表是多个表格数据，需要对每一个表格进行遍历
function exportCalTable(obj, tableId, fileName) {
    var val = document.getElementById("employeeNum").value;
    var num = parseInt(val);
    
    var xls = new ActiveXObject("Excel.Application");
    xls.visible = true;
    // xls.Workbooks.Add;
    var workbook = xls.Workbooks.Add();
    var sheet    = workbook.ActiveSheet;
    
    sheet.Columns("A").ColumnWidth = 25;
    sheet.Columns("B").ColumnWidth = 22;
    sheet.Columns("C").ColumnWidth = 19;
    sheet.Columns("D").ColumnWidth = 19;
    // ExcelSheet.ActiveSheet.Cells(row,col).HorizontalAlignment = 3; //水平对齐方式枚举* (1-常规，2-靠左，3-居中，4-靠右，5-填充 6-两端对齐，7-跨列居中，8-分散对齐)
    var step = 1, baseRow = 1;
    
    for(var k = 0; k<num; k++) {
        //alert(k);
        
        var perTableId = 'people0';
        var x = document.getElementById('people' + selectedEmpData[k][0]).rows;
    
        baseRow = 1 + k * 30;
        for (i = 0; i < x.length; i++) {
            var y = x[i].cells;
            if(i == 0) {
                // 标题
                sheet.Cells(baseRow, 1).HorizontalAlignment = 3;
                sheet.Cells(baseRow, 1).Font.Size = 18; //设置为10号字*
                sheet.Cells(baseRow, 1).Font.Name = "黑体"; //设置为黑体*
                sheet.Rows(baseRow).RowHeight = 35;
                sheet.Cells(baseRow, 1).Value = y[0].innerText;
                
                sheet.Range(sheet.Cells(baseRow,1), sheet.Cells(baseRow, 4)).Merge();
                continue;
            }
            
            for (j = 0; j < y.length; j++) {
                step = 1;
                if(i == 2 && j == 3) {
                    // 身份证号码
                    sheet.Cells( i+baseRow, j+1).NumberFormat = "@";
                }
                else if( i >= 3 && i <= 12 ) {
                    if(j == 1) {
                        // 基础数据
                        sheet.Range(sheet.Cells(i+baseRow,2), sheet.Cells(i+baseRow, 4)).Merge();
                        
                        if( i == 3 || i == 5 || i == 11 || i == 12) {
                            // 红色
                            sheet.Cells( i+baseRow, j+1).Font.ColorIndex  = 3;
                        }
                    }
                }
                else if( i == 13 ) {
                    // 领取方式选择
                    sheet.Range(sheet.Cells(i + baseRow,1), sheet.Cells(i + baseRow, 4)).Merge();
                }
                else if( i == 14 ) {
                    if(j <= 1) {
                        sheet.Range(sheet.Cells(i + baseRow, j+1), sheet.Cells(i + baseRow + 3, j+1)).Merge();
                    }
                }
                else if( i >= 15 && i <= 17 ) {
                    step = 3;
                    if( i == 16 || i == 17 ) {
                        // 红色
                        sheet.Cells( i + baseRow, j+step).Font.ColorIndex  = 3;
                    }
                }
                else if( i == 18 ) {
                    if(j <= 1) {
                        sheet.Range(sheet.Cells(i + baseRow, j+1), sheet.Cells(i + baseRow + 8, j+1)).Merge();
                    }
                }
                else if( i >= 19 && i <= 26 ) {
                    step = 3;
                    if( i == 24 || i == 26 ) {
                        // 红色
                        sheet.Cells( i + baseRow, j+step).Font.ColorIndex  = 3;
                    }
                }
                sheet.Cells( i + baseRow, j+step).Value = y[j].innerText;
                sheet.Cells( i + baseRow, j+step).HorizontalAlignment = 2;
            }
        }
    }
    
    xls.Visible = true;
    xls.UserControl = true;
    CollectGarbage();
}