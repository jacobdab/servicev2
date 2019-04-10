//Service

$('.progress').tooltip();
$(function () {
    $('[data-toggle="popover"]').popover({
        html : true ,
        container:'body',
        placement: 'right',
        content : function() {
            return $('#popover-content').html();
        }
    })
});

let showResults = function(arg) {
    let value = arg.trim();
    if (value == "" || value.length <= 0) {
        $('#searchResults').fadeOut();
        return;
    } else {
        $('#searchResults').fadeIn();
    }
    ;
    let jqxhr = $.get('/search?q=' + value, (data) => {
        console.log(data);
        $('#searchResults').html('');
    })
        .done((data) => {
            if (data.length === 0) {
                $('#searchResults').append("<p class='lead text-center mt-2'>No results</p>");
            } else {
                data.forEach(dataE => {
                    if(dataE.model){
                        $('#searchResults').append("<a href='#'><p class='m-2 lead'>" + dataE.client[0].clientName + " " + dataE.model+ "</p></a>")
                        $('#searchResults a').attr('href',"/customers/"+dataE.client[0]._id+"")
                    }else {
                        $('#searchResults').append("<a href='#'><p class='m-2 lead'>" + dataE.clientName + " " + dataE.devices[0].model + "</p></a>")
                        $('#searchResults a').attr('href', "/customers/" + dataE._id + "")
                    }});
            }
        })
        .fail((err) => {
            console.log(err);
        });
};


$(".btn-popover-container").each(function() {
    var btn = $(this).children(".popover-btn");
    var titleContainer = $(this).children(".btn-popover-title");
    var contentContainer = $(this).children(".btn-popover-content");

    var title = $(titleContainer).html();
    var content = $(contentContainer).html();

    $(btn).popover({
        html: true,
        title: title,
        content: content,
        placement: 'right'
    });
});

let showClient = function(arg) {
    let value = arg.trim();
    if (value == "" || value.length <= 0) {
        $('#searchClient').fadeOut();
        return;
    } else {
        $('#searchClient').fadeIn();
    }
    ;
    let jqxhr = $.get('/search?q=' + value, (data) => {
        $('#searchClient').html('');
    })
        .done((data) => {
            if (data.length === 0) {
                $('#searchClient').append("<p class='lead text-center mt-2 text-white'>No results</p>");
            } else {
                data.forEach(dataE => {
                    if(dataE.model){
                        $('#searchClient').append("<a href='#'><p class='m-2 lead text-white'>" + dataE.client[0].clientName+"</p></a>")
                        $('#searchClient a').attr('href',"/devices/"+dataE.client[0]._id+"/addDevice")
                    }else {
                        $('#searchClient').append("<a href='#'><p class='m-2 lead text-white'>" + dataE.clientName + "</p></a>")
                        $('#searchClient a').attr('href', "/devices/" + dataE._id + "/addDevice")
                    }});
            }
        })
        .fail((err) => {
            console.log(err);
        });
};



$(document).on('click','#napr',function (e) {
    e.preventDefault();
    let deviceId = $('#napr').attr('href');
    $.post("/devices/"+ deviceId +"/changeStatus?_method=PUT",
        {status: 'In repair',lastChange:Date.now()}, (data, status)=>{
            location.reload();
        });
});
$(document).on('click','#diag',function (e) {
    e.preventDefault();
    let deviceId = $('#diag').attr('href');
    $.post("/devices/"+ deviceId +"/changeStatus?_method=PUT",
        {status: 'In diagnose',lastChange:Date.now()}, (data, status)=>{
            location.reload();
        });
});
$(document).on('click','#test',function (e) {
    e.preventDefault();
    let deviceId = $('#test').attr('href');
    $.post("/devices/"+ deviceId +"/changeStatus?_method=PUT",
        {status: 'Being tested',lastChange:Date.now()}, (data, status)=>{
            location.reload();
        });
});$(document).on('click','#gwar',function (e) {
    e.preventDefault();
    let deviceId = $('#gwar').attr('href');
    $.post("/devices/"+ deviceId +"/changeStatus?_method=PUT",
        {status: 'In warranty repair',lastChange:Date.now()}, (data, status)=>{
            location.reload();
        });
});
$(document).on('click','#odb',function (e) {
    e.preventDefault();
    let deviceId = $('#gwar').attr('href');
    $.post("/devices/" + deviceId + "/changeStatus?_method=PUT",
        {status: 'To recieve',lastChange:Date.now()}, (data, status) => {
            location.reload();
        });
});
$(document).on('click','#odeb',function (e) {
    e.preventDefault();
    let deviceId = $('#gwar').attr('href');
    $.post("/devices/" + deviceId + "/changeStatus?_method=PUT",
        {status: 'Recieved',lastChange:Date.now()}, (data, status) => {
            location.reload();
        });
});
$('.modalSave').click((e)=>{
    let loc = location.href.substring(location.href.lastIndexOf('/')+1);
    $.ajax({
        url: '/devices/'+loc+'/addRepair',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            repair: $('#repair').val(),
        }),
        success: ()=> {location.reload();}
    }).done(()=>{
        console.log('done');

    })
    .fail((err)=>{
        console.log(err);
    })
});

$('#id').click((e)=>{
    $.ajax({
        url: '/devices/',
        method: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            sort: 1
        }),
        success: ()=> {location.reload();}
    }).done(()=>{
        console.log('done');
    })
        .fail((err)=>{
            console.log(err);
        })
});

$('#data').click((e)=>{
    $.ajax({
        url: '/devices/',
        method: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            sort: 2
        }),
        success: ()=> {location.reload();}
    }).done(()=>{
        console.log('done');
    })
        .fail((err)=>{
            console.log(err);
        })
});

$('#koniec').click((e)=>{
    $.ajax({
        url: '/devices/',
        method: 'put',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            sort: 3
        }),
        success: ()=> {location.reload();}
    }).done(()=>{
        console.log('done');
    })
        .fail((err)=>{
            console.log(err);
        })
});

$('.model-save').click((e)=>{
    $.ajax({
        url: '/addModel/',
        method: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            addModel: $('#model').val(),
        }),
        success: ()=> {location.reload();}
    })
});

function filter(data,value) {
    let chartPrice = [];
    let daysInMonth = [];
    let temp = 0;
    let oldCheck;
    for(let i = 1; i<=moment().daysInMonth();i++){
        daysInMonth.push(i);
        chartPrice.push(0);
    }
    data.forEach((dataE,i)=>{
        let check = moment(dataE.created).format('DD');
        if(check == oldCheck){
            temp += dataE[value];
        }else{
           temp = 0;
            temp += dataE[value];
        }
        chartPrice[check-1] = 0;
        chartPrice[check-1] += temp;
        oldCheck = check;
    });
    return [daysInMonth,chartPrice];

}
setTimeout(function() {
    $('#block').fadeOut('fast');
}, 1500); // <-- time in milliseconds


if(location.href === 'http://localhost:4000/' || location.href === 'https://localhost:4000/' ){
    fetch('http://localhost:4000/data').then((res)=>{
    if(!res.ok){
        let monthName = moment().format('MMMM');
        let labels = [];
        let data = [];
        for(let  i = 1; i<=moment().daysInMonth();i++){
            labels.push(i);
            data.push(0);
        }
        var myConfig = {
            "globals":{
                "font-family": "Roboto"
            },
            "graphset": [
                {
                    "type": "area",
                    "background-color": "rgba(0,0,0,0.5)",
                    "utc": true,
                    "plotarea": {
                        "margin-top":"10%",
                        "margin-right":"dynamic",
                        "margin-bottom":"dynamic",
                        "margin-left":"dynamic",
                        "adjust-layout":true
                    },
                    "labels": [
                        {
                            "text": "Profit: %plot-2-value",
                            "default-value": "",
                            "color": "#fff",
                            "x": "15%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                        {
                            "text": "Price: %plot-0-value",
                            "default-value": "",
                            "color": "#fc8d62",
                            "x": "45%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                        {
                            "text": "Cost of repair: %plot-1-value",
                            "default-value": "",
                            "color": "#66c2a5",
                            "x": "70%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                    ],
                    "scale-x": {
                        "line-color":"#fff",
                        "label": {
                            "text":"",
                            "font-size": "14px",
                            "font-weight": "normal",
                            "offset-x": "10%",
                            "font-angle": 360
                        },
                        "item": {
                            "text-align": "center",
                            "font-color": "#fff",
                            "font-size":"18px"
                        },
                        "zooming": 1,
                        "max-labels": moment().daysInMonth(),
                        "labels": labels,
                        "max-items": moment().daysInMonth(),
                        "items-overlap": true,
                        "guide": {
                            "line-width": "0px"
                        },
                        "tick": {
                            "line-width": "2px",
                            "line-color": "#fff",
                        },
                    },
                    "crosshair-x": {
                        "line-color":"#fff",
                        "line-width":1,
                        "plot-label": {
                            "visible": false
                        }
                    },
                    "scale-y": {
                        "line-color":"#fff",
                        "values": "0:1500:500",
                        "item": {
                            "font-color": "#fff",
                            "font-weight": "normal"
                        },
                        "label":{
                            "text":"Metrics",
                            "font-size":"14px",
                            "font-color": "#fff",
                        },
                        "guide": {
                            "line-width": "0px",
                            "alpha": 0.2,
                            "line-style": "dashed"
                        }
                    },
                    "plot": {
                        "line-width": 2,
                        "marker": {
                            "size": 1,
                            "visible": false
                        },
                        "tooltip": {
                            "font-family": "Roboto",
                            "font-size": "15px",
                            "text": "Was made %v %t on %data-days",
                            "text-align": "left",
                            "border-radius":5,
                            "padding":10
                        }
                    },
                    "series": [
                        {
                            "values": data,
                            "data-days": data,
                            "line-color": "#fc8d62",
                            "aspect": "spline",
                            "background-color": "#fc8d62",
                            "alpha-area": ".3",
                            "font-family": "Roboto",
                            "font-size": "14px",
                            "text": "zł"
                        },
                        {
                            "values": data,
                            "data-days": data,
                            "line-color": "#66c2a5",
                            "background-color": "#66c2a5",
                            "alpha-area": ".3",
                            "text": "Cost of repair",
                            "aspect": "spline",
                            "font-family": "Roboto",
                            "font-size": "14px"
                        },
                        {
                            "values": data,
                            "data-days": data,
                            "line-color": "#8da0cb",
                            "background-color": "#8da0cb",
                            "aspect": "spline",
                            "alpha-area": "0.2",
                            "text": "zł profit",
                            "font-family": "Roboto",
                            "font-size": "14px"
                        }
                    ]
                }
            ]
        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            height: '100%',
            width: '100%'
        });
        throw new Error(res.statusText);
    }else{
        return res.json();
    }
    }).then(data=>{
        let daysInMonth = [];
        let monthName = moment().format('MMMM');
        let price = filter(data,'price');
        let cost = filter(data,'costOfRepair');
        let profit = filter(data,'profit');
        var myConfig = {
            "globals":{
                "font-family": "Roboto"
            },
            "graphset": [
                {
                    "type": "area",
                    "background-color": "rgba(0,0,0,0.5)",
                    "utc": true,
                    "plotarea": {
                        "margin-top":"10%",
                        "margin-right":"dynamic",
                        "margin-bottom":"dynamic",
                        "margin-left":"dynamic",
                        "adjust-layout":true
                    },
                    "labels": [
                        {
                            "text": "Profit: %plot-2-value",
                            "default-value": "",
                            "color": "#fff",
                            "x": "15%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                        {
                            "text": "Price: %plot-0-value",
                            "default-value": "",
                            "color": "#fc8d62",
                            "x": "45%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                        {
                            "text": "Cost of repair: %plot-1-value",
                            "default-value": "",
                            "color": "#66c2a5",
                            "x": "70%",
                            "y": 50,
                            "width": 120,
                            "text-align": "left",
                            "bold": 0,
                            "font-size": "20px",
                            "font-weight": "bold"
                        },
                    ],
                    "scale-x": {
                        "line-color":"#fff",
                        "label": {
                            "text":"",
                            "font-size": "14px",
                            "font-weight": "normal",
                            "offset-x": "10%",
                            "font-angle": 360
                        },
                        "item": {
                            "text-align": "center",
                            "font-color": "#fff",
                            "font-size":"18px"
                        },
                        "zooming": 1,
                        "max-labels": moment().daysInMonth(),
                        "labels": price[0],
                        "max-items": moment().daysInMonth(),
                        "items-overlap": true,
                        "guide": {
                            "line-width": "0px"
                        },
                        "tick": {
                            "line-width": "2px",
                            "line-color": "#fff",
                        },
                    },
                    "crosshair-x": {
                        "line-color":"#fff",
                        "line-width":1,
                        "plot-label": {
                            "visible": false
                        }
                    },
                    "scale-y": {
                        "line-color":"#fff",
                        "values": "0:1500:500",
                        "item": {
                            "font-color": "#fff",
                            "font-weight": "normal"
                        },
                        "label":{
                            "text":"Metrics",
                            "font-size":"14px",
                            "font-color": "#fff",
                        },
                        "guide": {
                            "line-width": "0px",
                            "alpha": 0.2,
                            "line-style": "dashed"
                        }
                    },
                    "plot": {
                        "line-width": 2,
                        "marker": {
                            "size": 1,
                            "visible": false
                        },
                        "tooltip": {
                            "font-family": "Roboto",
                            "font-size": "15px",
                            "text": "Was made %v %t on %data-days",
                            "text-align": "left",
                            "border-radius":5,
                            "padding":10
                        }
                    },
                    "series": [
                        {
                            "values": price[1],
                            "data-days": cost[0],
                            "line-color": "#fc8d62",
                            "aspect": "spline",
                            "background-color": "#fc8d62",
                            "alpha-area": ".3",
                            "font-family": "Roboto",
                            "font-size": "14px",
                            "text": "zł"
                        },
                        {
                            "values": cost[1],
                            "data-days": profit[0],
                            "line-color": "#66c2a5",
                            "background-color": "#66c2a5",
                            "alpha-area": ".3",
                            "text": "Cost of repair",
                            "aspect": "spline",
                            "font-family": "Roboto",
                            "font-size": "14px"
                        },
                        {
                            "values": profit[1],
                            "data-days": daysInMonth,
                            "line-color": "#8da0cb",
                            "background-color": "#8da0cb",
                            "aspect": "spline",
                            "alpha-area": "0.2",
                            "text": "zł profit",
                            "font-family": "Roboto",
                            "font-size": "14px"
                        }
                    ]
                }
            ]
        };

        zingchart.render({
            id: 'myChart',
            data: myConfig,
            height: '100%',
            width: '100%'
        });
    });


}