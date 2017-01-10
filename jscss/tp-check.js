/**
 * 待遇支付测算表
 */
var periodNumList = [2,3,6,9,12,24];
var tableData = [];
var parentDocument;

$(document).ready(function(){
    // 第一页进入第二页，选择要计算的员工
    $('input[name="periodNum"]').on('click', function() {
    });
    
    // 增加期数
    $('#addPeriod').on('click', function() {
        var num = $('#periodsNum').val();
        if(!isInteger(num)) {
            alert("请输入大于0的整数");
            $('#periodsNum').focus();
            return false;
        }
        
        num = parseInt(num);
        if(num <= 0) {
            alert("请输入大于0的整数");
            $('#periodsNum').focus();
            return false;
        }
        
        for(var i=0, n=periodNumList.length; i<n; i++) {
            if(num == periodNumList[i]) {
                alert("该期数已存在，请输入不同的期数！");
                $('#periodsNum').focus();
                return false;
            }
        }
        periodNumList.push(num);
        periodNumList.sort(function(a, b) {
            return a - b;
        });
        
        
        var content = '分期月数：';
        
        for(var i=0, n=periodNumList.length; i<n; i++) {
            num = periodNumList[i];
            content += '<input type="checkbox" style="margin-bottom:2px;" value="'+num+'" name="periodNum" id="periodNumId'+num+'" checked><label for="periodNumId'+num+'">'+num+'</label>&nbsp;&nbsp;';
        }
        
        $('#displayPeriodNum').html(content);
        
        // 生成表头
        createTableHead();
        getDataFromParentPage();
        
        $("input[name='periodNum']").bind("click",function () {
            if($(this).prop("checked") == true) {
                periodNumList.push($(this).val());
            } else {
                for(var i=0, n=periodNumList.length; i<n; i++) {
                    if($(this).val() == periodNumList[i]) {
                        break;
                    }
                }
                periodNumList.splice(i,1);
            }
            periodNumList.sort(function(a, b) {
                return a - b;
            });
            
            createTableHead();
            getDataFromParentPage();
        });
    });
    
    $("input[name='periodNum']").bind("click",function () {
        // periodNumList = [];
        
        if($(this).prop("checked") == true) {
            periodNumList.push($(this).val());
        } else {
            for(var i=0, n=periodNumList.length; i<n; i++) {
                if($(this).val() == periodNumList[i]) {
                    break;
                }
            }
            periodNumList.splice(i,1);
        }
        periodNumList.sort(function(a, b) {
            return a - b;
        });
        
        createTableHead();
        getDataFromParentPage();
    });
});

function createTableHead() {
    var headContent = '<tr><th nowrap>&nbsp;&nbsp;&nbsp;&nbsp;企&nbsp;业&nbsp;名&nbsp;称&nbsp;&nbsp;&nbsp;&nbsp;</th>'+
        '<th nowrap>&nbsp;&nbsp;姓名&nbsp;&nbsp;</th>'+
        '<th nowrap>证件类型</th>'+
        '<th nowrap>&nbsp;&nbsp;证&nbsp;件&nbsp;号&nbsp;码&nbsp;&nbsp;</th>'+
        '<th nowrap>上一年度<br>月平均工资</th>'+
        '<th nowrap>参加年金<br>首笔缴费时间</th>'+
        '<th nowrap>正式退休时间</th>'+
        '<th nowrap>年金实际缴费月数<br>（截止到退休之月）</th>'+
        '<th nowrap>年金中人补偿月数<br>（120-实际缴费月数）</th>'+
        '<th nowrap>年金中人补偿金额<br>（缴费基数*8.33%*补偿月）</th>'+
        '<th nowrap>年金个人账户金额</th>'+
        '<th nowrap>年金合计金额</th><th nowrap>2013年底税后缴费</th>'+
        '<th nowrap>2014年后税后缴费</th>'+
        '<th nowrap>总本金</th>'+
        '<th nowrap>完税比例</th>'+
        '<th nowrap>未完税比例</th>'+
        '<th nowrap>一次性应纳税所得额</th>'+
        '<th nowrap>一次性应缴纳<br>个人所得税</th>';
        
    // 按分期获取对应的表头内容
    for(var i=0, n=periodNumList.length; i<n; i++) {
        headContent += '<th nowrap>（分'+periodNumList[i]+'个月）<br>每月应纳税所得额</th>';
        headContent += '<th nowrap>（分'+periodNumList[i]+'个月）<br>每月应纳税额</th>';
        headContent += '<th nowrap>（分'+periodNumList[i]+'个月)<br>应缴纳个人所得税</th>';
    }
    
    $('#tableHead').html(headContent + '</tr>');
}

function getDataFromParentPage() {
    tableData = [];
    var parent = parentDocument;
    $('#tableBody').html('');
    
    if(parent) {
        var t = getBrowserType();
        
        var num = 0;
        if(t == 'ie') {
            var obj = parent.document.getElementById("employeeNum");
            num = obj.value;
        } else {
            var num = parent.getElementById("employeeNum");
        }
        alert(num);
        
        
        
        if(num != '' && parseInt(num) > 0) {
            num = parseInt(num);
            
            for(var i=0; i<num; i++) {
                var rowData = [];
                // 企业名称
                rowData.push(parent.document.getElementById("enterprise"+i).innerText);
                // 姓名
                rowData.push(parent.document.getElementById("emp_name"+i).innerText);
                
                // 证件类型
                rowData.push(parent.document.getElementById("cert_type"+i).innerText);
                
                // 证件号码
                rowData.push(parent.document.getElementById("cert_no"+i).innerText);
                
                // 上一年度月平均工资
                rowData.push(parent.document.getElementById("avg_salary_lastyear"+i).innerText);
                
                // 参加年金首笔缴费时间
                rowData.push(parent.document.getElementById("first_paytime"+i).innerText);
                
                // 正式退休时间
                rowData.push(parent.document.getElementById("retire_time"+i).innerText);
                
                // 年金实际缴费月数（截止到退休之月）
                rowData.push(parent.document.getElementById("pay_month"+i).innerText);
                
                // 年金中人补偿月数（120-实际缴费月数）
                rowData.push(parent.document.getElementById("compensate_month"+i).innerText);
                
                // 年金中人补偿金额（缴费基数*8.33%*补偿月）
                var compensate_fee = parent.document.getElementById("compensate_fee"+i).innerText;
                rowData.push(compensate_fee);
                
                // 年金个人账户金额
                var data_balnace = parent.document.getElementById("data_balnace"+i).innerText;
                rowData.push(data_balnace);
                
                // 年金合计金额 = 年金中人补偿金额 + 年金个人账户金额
                var annuity_sum = parent.document.getElementById("annuity_sum"+i).innerText;
                rowData.push(annuity_sum);
                
                rowData.push(parent.document.getElementById("data_taxed_pay_2013"+i).value);
                rowData.push(parent.document.getElementById("data_taxed_pay_2014"+i).value);
                
                // 总本金
                rowData.push(parent.document.getElementById("total_principal_fee"+i).innerText);
                
                // 完税比例
                rowData.push(parent.document.getElementById("period_tax_rate"+i).innerText);
                
                // 未完税比例
                var period_no_tax_rate = parent.document.getElementById("res_period_no_tax_rate"+i).innerText;
                rowData.push(period_no_tax_rate);
                
                // 一次性应纳税所得额 = 年金合计金额 - 2013年底税后缴费 - 2014年后税后缴费
                rowData.push(parent.document.getElementById("taxable_income"+i).innerText);
                
                // 一次性应缴纳个人所得税
                rowData.push(parent.document.getElementById("tax_fee"+i).innerText);
                
                for(var k=0, m=periodNumList.length; k<m; k++) {
                    var pay_tax_income = calPayTaxIncomePeroid(annuity_sum, period_no_tax_rate, periodNumList[k]); 
                    
                    var tax_fee = prettify(calTax(pay_tax_income));
                    var tax_fee_sum = prettify(parseFloat(tax_fee) * periodNumList[k]);
                    
                    rowData.push(pay_tax_income);
                    rowData.push(tax_fee);
                    rowData.push(tax_fee_sum);
                }
                
                tableData.push(rowData);
                
            }
            
            createTableContent();
        }
    }
}

// 生成表的内容数据
function createTableContent() {
    var rowData;
    for(var i=0, n=tableData.length; i<n; i++) {
        var row = tableData[i];
        
        rowData = '';
        var bgcolor = i%2 == 1 ? ";background:#E6E6FA;" : "";
        
        for(var k=0, m=row.length; k<m; k++) {
            rowData += '<td nowrap style="height:23px;'+bgcolor+'">'+row[k]+'</td>';
        }
        
        $('#tableBody').append('<tr>'+rowData+'</tr>');
    }
}

function toExportExcel() {
    ExcellentExport.excel(this, 'datatable', 'Sheet Name Here');
}