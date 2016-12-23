var displayNullChar = '-';

function getInputContent(id) {
    return '<tr id="inputTr'+id+'" class="inputRowClassFlag">'+
    '<td class="inputtd_l"><input type="text" class="input_text" empno="'+id+'" tag="1" id="avgSalary'+id+'"></td>'+
    '<td class="inputtd"><input type="text" class="input_text" empno="'+id+'" id="firstDate'+id+'" tag="2" ></td>' +
    '<td class="inputtd"><input type="text" class="input_text" empno="'+id+'" id="retireDate'+id+'" tag="3" ></td>' +
    '<td class="inputtd"><input type="text" class="input_text" empno="'+id+'" id="payMonth'+id+'" tag="4" ></td>' +
    '<td class="inputtd"><input type="text" class="input_text" empno="'+id+'" id="compensateMonth'+id+'" tag="5" ></td>' +
    '<td class="inputtd_r"><input type="text" class="input_text" empno="'+id+'" id="compensateFee'+id+'" tag="6" ></td>' + 
    '</tr>';
}

function validateInputValueEmpty(val, tag) {
    if(tag == 1) {
        if(!validateFloat(val) || parseFloat(val) < 0) {
            alert("上一年度月平均工资\n 请输入大于或等于0的整数或小数");
            return false;
        }
    } else if(tag == 2) {
        if(!validateDateExt(val)) {
            alert("参加年金首笔缴费时间\n 请输入正确的日期格式，如：2016-10-01, 2016-08-09或者20160809, 20161016");
            return false;
        }
    } else if(tag == 3) {
        if(!validateDateExt(val)) {
            alert("正式退休时间\n 请输入正确的日期格式，如：2016-10-01, 2016-08-09");
            return false;
        }
    } else if(tag == 4) {
        if(val == '') {
            return true;
        }
        
        if(!isInteger(val) || parseInt(val) < 0) {
            alert("年金实际缴费月数\n 请输入大于或等于0的整数");
            return false;
        }
    } else if(tag == 5) {
        if(val == '') {
            return true;
        }
        
        if(!isInteger(val) || parseInt(val) < 0) {
            alert("年金中人补偿月数\n 请输入大于或等于0的整数");
            return false;
        }
    } else if(tag == 6) {
        if(val == '') {
            return true;
        }
        
        if(!validateFloat(val) || parseFloat(val) < 0) {
            alert("年金中人补偿金额\n 请输入大于或等于0的整数或小数");
            return false;
        }
    }
    
    return true;
}

// 验证输入的内容
// val 内容
// tag 输入内容名称 1-上一年度月平均工资 2-参加年金首笔缴费时间 3-正式退休时间
// 4-年金实际缴费月数 5-年金中人补偿月数 6-年金中人补偿金额
function validateInputValue(val, tag, allowNull) {
    if(allowNull && val == '') {
        return true;
    }
    
    if(tag == 1) {
        if(!validateFloat(val) || parseFloat(val) < 0) {
            alert("上一年度月平均工资\n 请输入大于或等于0的整数或小数");
            return false;
        }
    } else if(tag == 2) {
        if(!validateDateExt(val)) {
            alert("参加年金首笔缴费时间\n 请输入正确的日期格式，如：2016-10-01, 2016-08-09");
            return false;
        }
    } else if(tag == 3) {
        if(!validateDateExt(val)) {
            alert("正式退休时间\n 请输入正确的日期格式，如：2016-10-01, 2016-08-09");
            return false;
        }
    } else if(tag == 4) {
        if(!isInteger(val) || parseInt(val) < 0) {
            alert("年金实际缴费月数\n 请输入大于或等于0的整数");
            return false;
        }
    } else if(tag == 5) {
        if(!isInteger(val) || parseInt(val) < 0) {
            alert("年金中人补偿月数\n 请输入大于或等于0的整数");
            return false;
        }
    } else if(tag == 6) {
        if(!validateFloat(val) || parseFloat(val) < 0) {
            alert("年金中人补偿金额\n 请输入大于或等于0的整数或小数");
            return false;
        }
    }
    
    return true;
}

// 计算年金实际缴费月数
// istip 是否需要提示
function calculatePayMonth(firstData, retireDate) {
    var d1 = null;
    if(firstData.indexOf("-") == 0) {
        d1 = new Date(Date.parse(firstData.replace(/-/g, "/")));
    } else {
        if(firstData.length == 8) {
            d1 = new Date(Date.parse());
        }
    }
    
    if(d1 == null || d2 == null) {
        return 0;
    }
    
    var d2 = new Date(Date.parse(retireDate.replace(/-/g, "/")));
   
    // 计算实际缴费月数
    return (d2.getFullYear() - d1.getFullYear())*12 + (d2.getMonth() - d1.getMonth());
    
}

// 生成结果表格
// 本金法测算
function getResultTableContent(input_data, excel_data, islast, index) {
    
    var num_periods = parseInt($("#periodsNum").val());
    
    // 个人账户余额(归属前资产余额)
    var excel_data_balnace = excel_data[38];
    var excel_data_taxed_pay_2013 = excel_data[31];  // 2013年底税后缴费
    var excel_data_taxed_pay_2014 = excel_data[35];  // 2014年底税后缴费
    // alert(excel_data_taxed_pay_2013);
    
    // 分期支付完税比例-W
    var excel_period_tax_rate = excel_data[40];
    // 分期支付未完税比例
    var res_period_no_tax_rate = calPeriodPayNoTaxRate(excel_period_tax_rate) + '%';
    
    
    var input_data_compensate_fee = input_data[6];
    
    // 年金合计金额
    var res_annuity_sum = calAnnuitySum(excel_data_balnace, input_data_compensate_fee);
    // 应纳税所得额
    var res_taxable_income = calTaxableIncome(res_annuity_sum, excel_data_taxed_pay_2013, excel_data_taxed_pay_2014);
    
    // 应纳税额
    var res_tax_fee = prettify(calTax(res_taxable_income));
    
    var res_get_fee_after_tax = prettify1(parseFloat(res_annuity_sum) - parseFloat(res_tax_fee));
    
    
    // 每月税前领取金额
    var res_get_fee_peroid = calGetFeePeroid(res_annuity_sum, num_periods);
    // 每月应纳税所得额
    var res_pay_tax_income_peroid = calPayTaxIncomePeroid(res_annuity_sum, res_period_no_tax_rate, num_periods);
    
    // 每月应纳税额
    var res_tax_fee_period = prettify(calTax(res_pay_tax_income_peroid));
    
    // 应纳税总额 每月应纳税额*期数
    var res_tax_fee_sum_period = prettify(parseFloat(res_tax_fee_period) * num_periods);
    
    // 每月税后领取金额 每月税前领取金额-每月应纳税额
    var res_get_fee_after_tax_period = prettify(parseFloat(res_get_fee_peroid) - parseFloat(res_tax_fee_period));
    
    // 分期支付适用税率=年金合计金额/期数*未完税比例
    var res_tax_rate = getTaxRate(res_get_fee_peroid*calPeriodPayNoTaxRate(excel_period_tax_rate)/100) + '%';
    
    var table_id = 'people'+input_data[0];
    return '<table class="grid" style="width:780px;font-size:14px;" align="center" id="'+table_id+'">'+
      '<thead>'+
          '<tr>'+
            '<th nowrap colspan="4" style="height:50px;">企业年金待遇支付测算</th>'+
            '</tr>'+
      '</thead>'+
      '<tbody> '+
          '<tr>'+
            '<td align="center" nowrap width="29%" >企业名称：</td>'+
            '<td width="31%" id="enterprise'+index+'">'+excel_data[1]+'</td>'+
            '<td align="center" nowrap width="20%">姓名：</td>'+
            '<td colspan="3" width="20%" id="emp_name'+index+'">'+excel_data[2]+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td align="center">证件类型：</td>'+
            '<td id="cert_type'+index+'">'+excel_data[3]+'</td>'+
            '<td align="center">证件号码：</td>'+
            '<td id="cert_no'+index+'">'+excel_data[4]+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td align="center">个人账户余额：</td>'+
            '<td colspan="3" class="focusContent" id="data_balnace'+index+'">'+excel_data_balnace+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td align="center">已完税金额：</td>'+
            '<td colspan="3">'+excel_data[39]+'</td>'+
          '</tr>'+
          '<tr>'+
            '<td align="center">总本金：</td>'+
            '<td colspan="3" class="focusContent" id="total_principal_fee'+index+'">'+excel_data[37]+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">上一年度月平均工资：</td>'+
            '<td colspan="3" id="avg_salary_lastyear'+index+'">'+(input_data[1] == '' ? displayNullChar : input_data[1]) +'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">参加年金首笔缴费时间：</td>'+
            '<td colspan="3" id="first_paytime'+index+'">'+(input_data[2] == '' ? displayNullChar : input_data[2])+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">正式退休时间：</td>'+
            '<td colspan="3" id="retire_time'+index+'">'+(input_data[3] == '' ? displayNullChar : input_data[3])+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center" nowrap>年金实际缴费月数（截止到退休之月）：</td>'+
            '<td colspan="3" id="pay_month'+index+'">'+(input_data[4] == '' ? displayNullChar : input_data[4])+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">年金中人补偿月数：</td>'+
            '<td colspan="3" id="compensate_month'+index+'">'+(input_data[5] == '' ? displayNullChar : input_data[5])+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center" >年金中人补偿金额：</td>'+
            '<td colspan="3" class="focusContent" id="compensate_fee'+index+'">'+(input_data[6] == '' ? '0' : input_data[6])+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center">年金合计金额：</td>'+
            '<td colspan="3" class="focusContent" id="annuity_sum'+index+'">'+res_annuity_sum+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td  colspan="4">领取方式选择：</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center" rowspan="4">一次性领取：</td>'+
            '<td align="center" rowspan="4">一次性支付：</td>'+
            '<td>税前领取金额：</td>'+
            '<td>'+res_annuity_sum+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>应纳税所得额：</td>'+
            '<td id="taxable_income'+index+'">'+res_taxable_income+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>应纳税额：</td>'+
            '<td class="focusContent" id="tax_fee'+index+'">'+res_tax_fee+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>税后领取金额：</td>'+
            '<td class="focusContent">'+res_get_fee_after_tax+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td align="center" rowspan="9">分期领取：</td>'+
            '<td align="center" rowspan="9">按月支付<br>（定额定期指定额度）：</td>'+
            '<td>期数：</td>'+
            '<td id="res_num_periods'+index+'" ind="'+index+'" class="num_periods_td" title="点击可修改期数">'+num_periods+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>适用税率：</td>'+
            '<td id="res_tax_rate'+index+'">'+res_tax_rate+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>分期支付完税比例：</td>'+
            '<td id="period_tax_rate'+index+'">'+excel_period_tax_rate+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>分期支付未完税比例：</td>'+
            '<td id="res_period_no_tax_rate'+index+'">'+res_period_no_tax_rate+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>每月税前领取金额：</td>'+
            '<td id="res_get_fee_peroid'+index+'">'+res_get_fee_peroid+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>每月应纳税所得额：</td>'+
            '<td id="res_pay_tax_income_peroid'+index+'">'+res_pay_tax_income_peroid+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>每月应纳税额：</td>'+
            '<td id="res_tax_fee_period'+index+'" class="focusContent">'+res_tax_fee_period+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>应纳税总额：</td>'+
            '<td id="res_tax_fee_sum_period'+index+'">'+res_tax_fee_sum_period+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>每月税后领取金额：</td>'+
            '<td id="res_get_fee_after_tax_period'+index+'" class="focusContent">'+res_get_fee_after_tax_period+'</td>'+
        '</tr>'+
      '</tbody>'+
      '<tr><td colspan="4" style="border:none">备注：以上基础数据来源于工行账管提供，实际领取金额应以当时定价日计算为准，个人资产投资损益将在最后一期结算。</td></tr>'+
    '</table>'+
    '<input id="data_taxed_pay_2013'+index+'" type="hidden" value="'+excel_data_taxed_pay_2013+'">' + 
    '<input id="data_taxed_pay_2014'+index+'" type="hidden" value="'+excel_data_taxed_pay_2014+'">' + 
    (islast ? '' : '<br><br><p class="w3cbbs"></p>');
}


function changePeriodValue(index, num_periods, input_data, excel_data) {
    // 期数
    $('#res_num_periods'+index).html(num_periods);
    
    // 个人账户余额 归属前资产余额
    var excel_data_balnace = excel_data[38];
    var input_data_compensate_fee = input_data[6];
    
    // 年金合计金额
    var res_annuity_sum = calAnnuitySum(excel_data_balnace, input_data_compensate_fee);
    
    // 分期支付完税比例-W 分期支付完税比例
    var excel_period_tax_rate = excel_data[40];
    
    // 分期支付未完税比例
    var res_period_no_tax_rate = calPeriodPayNoTaxRate(excel_period_tax_rate) + '%';
    
    // 每月税前领取金额
    var res_get_fee_peroid = calGetFeePeroid(res_annuity_sum, num_periods);
    
    // 每月应纳税所得额
    var res_pay_tax_income_peroid = calPayTaxIncomePeroid(res_annuity_sum, res_period_no_tax_rate, num_periods);
    
    // 每月应纳税额
    var res_tax_fee_period = prettify(calTax(res_pay_tax_income_peroid));
    
    // 应纳税总额 每月应纳税额*期数
    var res_tax_fee_sum_period = prettify(parseFloat(res_tax_fee_period) * num_periods);
    
    // 每月税后领取金额 每月税前领取金额-每月应纳税额
    var res_get_fee_after_tax_period = prettify(parseFloat(res_get_fee_peroid) - parseFloat(res_tax_fee_period));
    
    // 分期支付适用税率=年金合计金额/期数*未完税比例
    var res_tax_rate = getTaxRate(res_get_fee_peroid*calPeriodPayNoTaxRate(excel_period_tax_rate)/100) + '%';
    
    // 每月税前领取金额
    $('#res_get_fee_peroid'+index).html(res_get_fee_peroid);
    // 每月应纳税所得额
    $('#res_pay_tax_income_peroid'+index).html(res_pay_tax_income_peroid);
    // 适用税率
    $('#res_tax_rate'+index).html(res_tax_rate);
    // 每月应纳税额
    $('#res_tax_fee_period'+index).html(res_tax_fee_period);
    
    // 应纳税总额
    $('#res_tax_fee_sum_period'+index).html(res_tax_fee_sum_period);
    
    // 每月税后领取金额
    $('#res_get_fee_after_tax_period'+index).html(res_get_fee_after_tax_period);
}