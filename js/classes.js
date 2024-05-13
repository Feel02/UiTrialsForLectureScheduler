//const fs = require('fs');
//const readline = require('readline');
let classes = {};
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let daysTR = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

import "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
const btn = document.getElementById("button1113");
const languageButton = document.getElementById("languageButton");

/* const roomsFilePath = 'Classroom_Capacities.csv';
const roomsLines = await readFileLines(roomsFilePath);
var rooms = [];

var tempRooms = roomsLines.map(line => ({ roomId: line.split(',')[0], roomSize: line.split(',')[1]}));
for(const room of tempRooms){                                                                                   //get the rooms from the file and split them accordingly
    rooms.push(room);                                                                                           //this for ensures that we're saving rooms to the global variable
} 
rooms.sort((a, b) => a.roomId > b.roomId); */

btn.addEventListener("click", async function(){
    console.log("clicked");
    btn.style.visibility="hidden";
    var element = document.getElementById('body3');                  //tt for only the tables
    

    var opt = {
        margin:       1,
        filename:     'classesTable.pdf',
        image:        { type: 'jpeg', quality: 0.99 },
        html2canvas:  { scale:1, dpi:192},
        pagebreak: {mode: 'avoid-all'},
        jsPDF: {unit: 'mm', format: 'a2', orientation: 'l'},
      };

    //html2pdf().from(element).save('filename.pdf');

    /*html2pdf().from(element).toPdf().get('pdf').then(function (pdf) {
        var totalPages = pdf.internal.getNumberOfPages();
        for (var i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
        }
    }).save('filename1.pdf');*/

    await html2pdf().set(opt).from(element).save();
    btn.style.visibility="visible";
});

languageButton.addEventListener("click", function(){
    if(langCode == "TR"){
        localStorage.setItem('langCode', 'EN');
    }
    else{
        localStorage.setItem('langCode', 'TR');
    }
    location.reload();
});

export function mergeTableCells(data, department) {
    for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 9; slot++) {
            for (let grade = 0; grade < 4; grade++) {
                const element = data[day][slot][grade];   
                if(element.room in classes) {
                    classes[element.room].push({
                        name: element.name,
                        department: department,
                        lecturer: element.lecturer,
                        day: langCode == "TR" ? daysTR[day] : days[day],
                        time: (slot + 8) + ":30" + " - " + (slot + 8 + data[day][slot][grade].span) + ":30"
                    })
                } else {
                    classes[element.room] = []
                    classes[element.room].push({
                        name: element.name,
                        department: department,
                        lecturer: element.lecturer,
                        day: langCode == "TR" ? daysTR[day] : days[day],
                        time: (slot + 8) + ":30" + " - " + (slot + 8 + data[day][slot][grade].span) + ":30"
                    })
                }
            }
        }
    }
    //console.log(classes)
}

var langCode = localStorage.getItem('langCode');
document.getElementById("onlyClasses").innerHTML = langCode == "EN" ? "Classes' Timetables" : "Sınıfların Programları";
btn.innerHTML = langCode == "TR" ? "PDF Oluştur" : "Create PDF";
document.getElementById('imgFlag').src = langCode == "EN" ? "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_Turkey.svg" : "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_the_United_Kingdom.svg";

const departments = new Map(JSON.parse(localStorage.getItem('tableData')));

Promise.all([...departments.entries()].map(([name, deb]) => mergeTableCells(deb.data, name))).then(() => {

    let keys = Object.keys(classes);
    keys.sort();

    for (let z = 0; z < keys.length; z++) {
        if (keys[z] != "") {

            //console.log(keys[z]);              //sınıf adı

            let table = document.createElement("table");
            let head = document.createElement("thead");
            let body = document.createElement("tbody");

            let rowHead = document.createElement("tr");
            let cellHead = document.createElement("th");
            cellHead.appendChild(document.createTextNode(keys[z]));
            //cellHead.appendChild(document.createTextNode(keys[z] + " - " + rooms.find(room => room.roomId === keys[z]).roomSize));
            rowHead.appendChild(cellHead);
            cellHead.colSpan = "5";
            rowHead.appendChild(cellHead);
            head.appendChild(rowHead);

            // create  the header of each column
            let cellB = document.createElement("tr");
            for (let data in classes[keys[z]][0]) {
                let cellBData = document.createElement("th");
                let upper = data.toUpperCase();
                if(langCode == "TR"){
                    upper = upper.replace("DAY", "GÜN");
                    upper = upper.replace("TIME", "SAAT");
                    upper = upper.replace("ROOM", "SINIF");
                    upper = upper.replace("DEPARTMENT", "BÖLÜM");
                    upper = upper.replace("NAME", "DERS");
                    upper = upper.replace("LECTURER", "PROFESÖR");
                }
                cellBData.appendChild(document.createTextNode(upper));
                cellB.appendChild(cellBData);
            }
            body.appendChild(cellB);

            for (let index in classes[keys[z]]) {
                let cell = document.createElement("tr");
                for (let data in classes[keys[z]][index]) {
                    let cellData = document.createElement("td");
                    cellData.appendChild(document.createTextNode(`${classes[keys[z]][index][data]}`));
                    cell.appendChild(cellData);
                }
                body.appendChild(cell);
            }

            //get the size of the room
            //console.log(rooms.find(room => room.roomId === keys[z]).roomSize);

            console.log(body)
            console.log(body.children[0].children[0].innerHTML);
            console.log(body.children[0].children[0].children[0].innerHTML);


            body.children[0].children[0].innerHTML += " - " + rooms.find(room => room.roomId === keys[z]).roomSize;



            table.appendChild(head);
            table.appendChild(body);
            document.body.appendChild(table);
        }
    }
});


