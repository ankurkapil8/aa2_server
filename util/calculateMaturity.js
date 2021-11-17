const moment = require("moment");
const maturity = (account)=>{
    var amt = parseFloat(account.rd_amount);
    var rate = parseFloat(account.interest_rate);
    var months = parseInt(account.period);
    var lastDate = moment(account.created_at).add(account.period,"months");
    let totalDays = getDays(account.created_at, lastDate);
    let maturityAmount = 0;
    let totalIntrestEarned = 0;
    let count = 0;
    if(account.tenure=="monthly"){
      console.log("month loop");  
      count = account.period;
        for(let i =0;i<count;i++){
            totalIntrestEarned += amt*(count-i)*(rate/100)*(1/12);
            // console.log("day",count-i);
            // console.log("totalIntrestEarned",totalIntrestEarned);
            // console.log("------------------------------------------")
        }
        maturityAmount = amt*months+totalIntrestEarned;
    }
    if(account.tenure=="daily"){
        console.log("day loop");  
        var createdAt = account.createdAt;
        createdAt = moment(createdAt);
        var lastDepositDate = moment(createdAt).add(account.period,"months");
        count =lastDepositDate.diff(moment(createdAt),"days");
        for(let i =0;i<count;i++){
            totalIntrestEarned += amt*(count-i)*(rate/100)*(1/365);
            // console.log("day",count-i);
            // console.log("totalIntrestEarned",totalIntrestEarned);
            // console.log("------------------------------------------")
        }
        maturityAmount = amt*count+totalIntrestEarned;
    }

    // if(totalDays<=365){ // calculate intrest amount earned less than 1 year ( P(principal) × n(days) × r(interest rate)/100 × 1/365)
    //     for(let i =0;i<totalDays;i++){

    //         totalIntrestEarned += amt*(totalDays-i)*(rate/100)*(1/365);
    //         console.log("------------------------------------------")
    //         //if(i==2)
    //            // break;
    //     }
    // }
    // if(account.tenure=="monthly"){
    //     maturityAmount = amt*months+totalIntrestEarned;
    //   }
    //   if(account.tenure=="daily"){
    //     maturityAmount = amt*totalDays+totalIntrestEarned;
    //   }
    return maturityAmount;
}

const getDays = (fromDate, toDate)=>{
    fromDate = moment(fromDate);
    var lastDepositDate = moment(toDate);
    return lastDepositDate.diff(fromDate,"days");
}
module.exports = {
    maturity,
    getDays
};