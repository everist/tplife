/**
 * 计算公式js
 */
// 缴费基数（上一年度月平均工资）*8.33%*年金中人补偿月数
// avgSalary - 上一年度月平均工资 month - 年金中人补偿月数
function calCompensateFee(avg_salary, month) {
    return prettify((avg_salary * 8.33 * month)/100);
}

// 年金合计金额 (个人账户余额+年金中人补偿金额)
function calAnnuitySum(balance, compensate_fee) {
    return prettify(addFloat(balance, compensate_fee));
}

// 应纳税所得额 (年金合计金额-2013年底税后缴费（计税表N）-2014年后税后缴费（计税表R）)
function calTaxableIncome(sum, pay_2013, pay_2014) {
    return prettify(sum - pay_2013 - pay_2014);
}

// 应纳税额 ROUND(MAX((一次性领取应纳税所得额)*0.05*{0.6,2,4,5,6,7,9}-5*{0,21,111,201,551,1101,2701},0),2)，参照“工资薪金所得税”税率表不扣除3500起征点（附本金法举例测算表）
function calPayTax(sum, pay_2013, pay_2014) {
    // return prettify(sum - pay_2013 - pay_2014);
}

// 计算分期支付未完税比例
function calPeriodPayNoTaxRate(rate) {
    var pos = rate.indexOf('%');
    if(pos == -1) {
        if(validateFloat(rate)) {
            return prettify_8(100 - parseFloat(rate));
        } else {
            return 0;
        }
    } else {
        rate = rate.substring(0, pos);
        if(validateFloat(rate)) {
            return prettify_8(100 - parseFloat(rate));
        } else {
            return 0;
        }
    }
}

// 每月税前领取金额 年金合计金额/期数
function calGetFeePeroid(sum, period) {
    if(validateFloat(sum)) {
        return prettify(sum/period);
    } else {
        return 0;
    }
}

// 每月应纳税所得额 年金合计金额*分期支付未完税比例/期数
function calPayTaxIncomePeroid(sum, noTaxRate, period) {
    if(validateFloat(sum)) {
        return prettify(parseFloat(sum) * parseFloat(noTaxRate) / period / 100);
    } else {
        return 0;
    }
}

// 工资薪金
// 应纳税额
function calTax(XSum) {
    var Rate;
    var Balan;
    var TSum_7;
    
    if (XSum<=1500) {
        Rate=3;
        Balan=0;
    }
    else if ((1500<XSum) && (XSum<=4500)) 
    {
        Rate=10;
        Balan=105;
    }
    else if ((4500<XSum) && (XSum<=9000))
    {   
        Rate=20;
        Balan=555;
    }
    else if ((9000<XSum) && (XSum<=35000))
    {
        Rate=25;
        Balan=1005;
    }
    else if ((35000<XSum) && (XSum<=55000))
    {
        Rate=30;
        Balan=2755;
    }
    else if ((55000<XSum) && (XSum<=80000))
    {
        Rate=35;
        Balan=5505;
    }
    else if (XSum>80000) 
    {
        Rate=45;
        Balan=13505;
    }
    
    TSum_7=(XSum*Rate)/100-Balan;
    if (TSum_7<0){
       TSum_7=0;
    }
    return TSum_7
}

function Rate2(XSum)
{
    var Rate;
    var Balan;
    var TSum;
    if (XSum<=5000)
    {
        Rate=5;
        Balan=0;
    }
    else if ((5000<XSum) && (XSum<=10000))
    {
        Rate=10;
        Balan=250;
    }
    else if ((10000<XSum) && (XSum<=30000))
    {
        Rate=20;
        Balan=1250;
    }
    else if ((30000<XSum) && (XSum<=50000))
    {
        Rate=30;
        Balan=4250;
    }
    else if (50000<XSum)
    {
        Rate=35;
        Balan=6750;
    }
    
    TSum=(XSum*Rate)/100-Balan;
    
    if (TSum<0)
    {
        TSum=0;
    }
    return TSum;
}

function getTaxRate(income) {
    // var subtractIncome = parseFloat(income) - 1500;
    var subtractIncome = parseFloat(income);
    
    if(subtractIncome > 80000) {
        return 45;
    } else if(subtractIncome > 55000 && subtractIncome <= 80000) {
        return 35;
    } else if(subtractIncome > 35000 && subtractIncome <= 55000) {
        return 30;
    } else if(subtractIncome > 9000 && subtractIncome <= 35000) {
        return 25;
    } else if(subtractIncome > 4500 && subtractIncome <= 9000) {
        return 20;
    } else if(subtractIncome > 1500 && subtractIncome <= 4500) {
        return 10;
    } else {
        return 3;
    }
}
