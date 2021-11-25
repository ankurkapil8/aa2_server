const moment = require("moment");
const maturity = (account)=>{
    var amt = parseFloat(account.deposited_amount);
    var rate = 2;
    //var months = parseInt(account.period);
    var lastDate = moment();
    let totalDays = getDays(account.deposited_date, lastDate);
    let maturityAmount = 0;
    let totalIntrestEarned = 0;
    let count = 0;
    totalIntrestEarned = amt*(totalDays)*(rate/100)*(1/365);
    // if(account.tenure=="monthly"){
    //   console.log("month loop");  
    //   count = account.period;
    //     for(let i =0;i<count;i++){
    //         totalIntrestEarned += amt*(count-i)*(rate/100)*(1/12);
    //     }
    //     maturityAmount = amt*months+totalIntrestEarned;
    // }
   // if(account.tenure=="daily"){
        // console.log("day loop");  
        // var createdAt = account.createdAt;
        // createdAt = moment(createdAt);
        // var lastDepositDate = moment(createdAt).add(account.period,"months");
        // count =lastDepositDate.diff(moment(createdAt),"days");
        // for(let i =0;i<count;i++){
        //     totalIntrestEarned += amt*(count-i)*(rate/100)*(1/365);
        // }
        // maturityAmount = amt*count+totalIntrestEarned;
   // }

    return totalIntrestEarned+amt;
}

const getDays = (fromDate, toDate)=>{
    fromDate = moment(fromDate);
    var lastDepositDate = moment(toDate);
    return lastDepositDate.diff(fromDate,"days");
}
const calculatCloseAmount = (account)=>{
    var amt = parseFloat(account.rd_amount);
    var rate = parseFloat(account.interest_rate);
    var months = parseInt(account.period);
    //var lastDate = moment(account.created_at).add(account.period,"months");
    let totalDays = getDays(account.deposited_date, new Date());
    let maturityAmount = 0;
    let totalIntrestEarned = 0;
    let count = 0;
    totalIntrestEarned = amt*(totalDays)*(rate/100)*(1/365);
    return account.rd_amount+totalIntrestEarned;

}
const generatePassbook = ()=>{

}
module.exports = {
    maturity,
    getDays,
    calculatCloseAmount
};