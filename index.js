var fs = require('fs');

var myObj = {}



function doA() {
    return new Promise(function(resolve, reject) {
        fs.readFile('file.txt', function(err, data) {
            if(!err) {
                console.log('IF' + data);
                resolve(data.toString());
            }else {
                console.log('Error' +err);
            }
        })
    })
}

function doB() {
    return new Promise(function(resolve, reject) {
        fs.readFile('file2.txt', function(err, data) {
            if(!err) {
                console.log(data);
                resolve(data.toString());
            } else {
                console.log('Error' + err);
            }
        })
    })
}

async function main() {
    myObj['data1'] = await doA();
    myObj['data2'] = await doB();
    console.log(myObj);
}

main()



// doA().then(function(data) {
//     myObj['data1'] = data;
//     doB().then(function(data) {
//         myObj['data2'] = data;
//         console.log(myObj);
//     })
// })