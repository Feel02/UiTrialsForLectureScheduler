let teachers = {};
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let daysTR = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

import "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
const btn = document.getElementById("button1112");
const languageButton = document.getElementById("languageButton");

btn.addEventListener("click", async function(){
    console.log("clicked");
    var element = document.getElementById('body2');                  //tt for only the tables
    btn.style.visibility="hidden";        

    var opt = {
        margin:       1,
        filename:     'teacherNames.pdf',
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
                if (data[day][slot][grade].lecturer in teachers) {
                    teachers[data[day][slot][grade].lecturer].push({
                        department: department,
                        room: data[day][slot][grade].room,
                        name: data[day][slot][grade].name,
                        day: langCode == "TR" ? daysTR[day] : days[day],
                        time: (slot + 8) + ":30" + " - " + (slot + 8 + data[day][slot][grade].span) + ":30"
                    });
                } 
                else {
                    teachers[data[day][slot][grade].lecturer] = [];
                    teachers[data[day][slot][grade].lecturer].push({
                        department: department,
                        room: data[day][slot][grade].room,
                        name: data[day][slot][grade].name,
                        day: langCode == "TR" ? daysTR[day] : days[day],
                        time: (slot + 8) + ":30" + " - " + (slot + 8 + data[day][slot][grade].span) + ":30"
                    });
                }
            }
        }
    }
}

var langCode = localStorage.getItem('langCode');
document.getElementById("onlyProf").innerHTML = langCode == "EN" ? "Professor's Timetables" : "Profesörlerin Programları";
btn.innerHTML = langCode == "TR" ? "PDF Oluştur" : "Create PDF";
document.getElementById('imgFlag').src = langCode == "EN" ? "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_Turkey.svg" : "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_the_United_Kingdom.svg";


const departments = new Map(JSON.parse(localStorage.getItem('tableData')));

Promise.all([...departments.entries()].map(([name, deb]) => mergeTableCells(deb.data, name))).then(() => {
    let keys = Object.keys(teachers);
    keys.sort();

    for (let z = 0; z < keys.length; z++) {
        if (keys[z] != "undefined") {

            let table = document.createElement("table");
            let head = document.createElement("thead");
            let body = document.createElement("tbody");

            let rowHead = document.createElement("tr");
            let cellHead = document.createElement("th");
            cellHead.appendChild(document.createTextNode(keys[z]));
            rowHead.appendChild(cellHead);
            cellHead.colSpan = "5";
            rowHead.appendChild(cellHead);
            head.appendChild(rowHead);

            // create  the header of each column
            let cellB = document.createElement("tr");
            for (let data in teachers[keys[z]][0]) {
                let cellBData = document.createElement("th");
                let upper = data.toUpperCase();
                if(langCode == "TR"){
                    upper = upper.replace("DAY", "GÜN");
                    upper = upper.replace("TIME", "SAAT");
                    upper = upper.replace("ROOM", "SINIF");
                    upper = upper.replace("DEPARTMENT", "BÖLÜM");
                    upper = upper.replace("NAME", "DERS");
                }
                cellBData.appendChild(document.createTextNode(upper));
                cellB.appendChild(cellBData);
            }
            body.appendChild(cellB);

            for (let index in teachers[keys[z]]) {
                let cell = document.createElement("tr");
                for (let data in teachers[keys[z]][index]) {
                    let cellData = document.createElement("td");
                    cellData.appendChild(document.createTextNode(`${teachers[keys[z]][index][data]}`));
                    cell.appendChild(cellData);
                }
                body.appendChild(cell);
            }

            var size = body.rows.length;
            for(var i = 1; i < size; i++){
                for(var j = 1; j < size-i; j++){
                    var day = body.rows[j].cells[3].innerHTML;       //day
                    var dayIndex = langCode == "TR" ? daysTR.indexOf(day) : days.indexOf(day);
                    var time = body.rows[j].cells[4].innerHTML;       //time
                    var timeStart = convertH2M(time.split(" - ")[0]);

                    var day2 = body.rows[j+1].cells[3].innerHTML;       //day
                    var dayIndex2 = langCode == "TR" ? daysTR.indexOf(day2) : days.indexOf(day2);
                    var time2 = body.rows[j+1].cells[4].innerHTML;       //time
                    var timeStart2 = convertH2M(time2.split(" - ")[0]);
                    if(dayIndex > dayIndex2 || (dayIndex == dayIndex2 && timeStart > timeStart2)){
                        var temp = body.rows[j].innerHTML;
                        body.rows[j].innerHTML = body.rows[j+1].innerHTML;
                        body.rows[j+1].innerHTML = temp;
                    }
                }

            }

            table.appendChild(head);
            table.appendChild(body);
            document.body.appendChild(table);
        }
    }
}
);

function convertH2M(timeInHour){
    var timeParts = timeInHour.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}
