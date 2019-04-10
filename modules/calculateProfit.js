function calculateProfit (devices) {
    let profit = 0;
    if(Array.isArray(devices)){
        devices.forEach(devicesE=>{
            if(typeof devicesE.price != "undefined"  && typeof devicesE.costOfRepair != "undefined"){
                profit +=(devicesE.price-devicesE.costOfRepair);
            }else{
            }
        });
    }else{
        profit += devices.price - devices.costOfRepair;
    }
    return profit;
}


module.exports = calculateProfit;