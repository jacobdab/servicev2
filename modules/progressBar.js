const moment = require('moment');

function progressBar(progressEl) {
    progress = [];
    let now = moment();
    //console.log(progressEl);
    if(Array.isArray(progressEl)){
        progressEl.forEach((progressE) => {
            if (!progressE.devices) {
                let startDate = moment(progressE.created);
                //console.log(startDate + " startDate");
                let endDate = moment(progressE.created).add(14, 'days');
                //console.log(endDate + ' endDate');
                let percentage_complete = (now - startDate) / (endDate - startDate) * 100;
                //console.log(percentage_complete + ' percentage_complete');
                let percentage_rounded = (Math.round(percentage_complete * 100) / 100);
                progress.push(percentage_rounded)
            } else {
                if (progressE.devices.length == 0) {
                } else {
                    let startDate = moment(progressE.devices[0].created);
                    let endDate = moment(progressE.devices[0].created).add(14, 'days');
                    let percentage_complete = (now - startDate) / (endDate - startDate) * 100;
                    let percentage_rounded = (Math.round(percentage_complete * 100) / 100);
                    progress.push(percentage_rounded)
                }
            }
        })
    }else{
        if (!progressEl.devices) {
            let startDate = moment(progressEl.created);
            //console.log(startDate + " startDate");
            let endDate = moment(progressEl.created).add(14, 'days');
            //console.log(endDate + ' endDate');
            let percentage_complete = (now - startDate) / (endDate - startDate) * 100;
            //console.log(percentage_complete + ' percentage_complete');
            let percentage_rounded = (Math.round(percentage_complete * 100) / 100);
            progress.push(percentage_rounded)
        } else {
            if (progressEl.devices.length == 0) {
            } else {
                let startDate = moment(progressEl.devices[0].created);
                let endDate = moment(progressEl.devices[0].created).add(14, 'days');
                let percentage_complete = (now - startDate) / (endDate - startDate) * 100;
                let percentage_rounded = (Math.round(percentage_complete * 100) / 100);
                progress.push(percentage_rounded)
            }
        }
    }
};

module.exports = progressBar;