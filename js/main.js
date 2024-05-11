import {
    DayTemplate,
    SlotTemplate,
    TableTemplate,
} from "../templates/templates.js";

import "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js";

var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const btn = document.getElementById("button1114");
const btn2 = document.getElementById("button1124");
const languageButton = document.getElementById("languageButton");

btn.addEventListener("click", async function(){
    var element = document.getElementById('body4');                  //tt for only the tables           
    btn.style.visibility="hidden";
    btn2.style.visibility="hidden";

    var opt = {
        margin:       1,
        filename:     'regularTable.pdf',
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
    btn2.style.visibility="visible";
});

btn2.addEventListener("click", function(){
    convertCSVtoExcel();
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

export function mergeTableCells(data) {
    for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 9; slot++) {
            for (let grade = 0; grade < 4; grade++) {
                if (data[day][slot][grade].span > 1) {
                    for (let i = 1; i < data[day][slot][grade].span; i++) {
                        try {
                            data[day][slot + i][grade].span = 0;
                        } catch (e) {
                            console.log(e);
                            console.log((data[day][slot + i][grade].span = 0));
                        }
                    }
                }
            }
        }
    }
}

export function renderTable(tableData, department) {
    if(langCode == "TR"){
        days = [
            DayTemplate.replace("r$Day", "Pazartesi"),
            DayTemplate.replace("r$Day", "Salı"),
            DayTemplate.replace("r$Day", "Çarşamba"),
            DayTemplate.replace("r$Day", "Perşembe"),
            DayTemplate.replace("r$Day", "Cuma"),
        ];
    }
    else{
        days = [
            DayTemplate.replace("r$Day", "Monday"),
            DayTemplate.replace("r$Day", "Tuesday"),
            DayTemplate.replace("r$Day", "Wednesday"),
            DayTemplate.replace("r$Day", "Thursday"),
            DayTemplate.replace("r$Day", "Friday"),
        ];
    }
    for (let d = 0; d < days.length; d++) {
        for (let s = 0; s < 9; s++) {
            let row = "";
            for (let g = 0; g < 4; g++) {
                if (tableData[d][s][g].span > 0) {
                    let slot = SlotTemplate.replace(
                        `r$CourseName`,
                        tableData[d][s][g].name
                    );
                    slot = slot.replace(`r$Classroom`, tableData[d][s][g].room);
                    slot = slot.replaceAll(`r$Span`, tableData[d][s][g].span);
                    row += slot;
                }
            }
            days[d] = days[d].replace(`r$slot-${s}`, row);
        }
    }
    const body = days.join("\n");
    let table = TableTemplate.replace("r$Body", body);
    table = table.replace("r$Department", department);
    table = table.replace("r$Years", years);
    document.getElementById("tt").innerHTML += table;
}

export function sortTable(dataa){

    var data = JSON.parse(dataa).slice(1);

    for (let i = 1; i < data.length; i++) {

        for(let k = 0; k < data.length-i; k++) {

            const myArrayA = data[k];
            const grade1 = parseInt(myArrayA["grade"]);       //5
            const day1 = parseInt(myArrayA["day"]);         //3
            const time1 = parseInt(myArrayA["time"]);        //4    
            const department1 = myArrayA["department"];            //6

            const myArrayB = data[k+1];
            const grade2 = parseInt(myArrayB["grade"]);
            const day2 = parseInt(myArrayB["day"]);
            const time2 = parseInt(myArrayB["time"]);
            const department2 = myArrayB["department"];

            // Sort by department, then year, then day, then start hour
            if (department1 !== department2){
                if(department1 > department2){
                    [data[k], data[k+1]] = [data[k+1], data[k]];
                }
            }
            else if (grade1 !== grade2){
                if(grade1 > grade2){
                    [data[k], data[k+1]] = [data[k+1], data[k]];
                }
            }
            else if (day1 !== day2){
                if(day1 > day2){
                    [data[k], data[k+1]] = [data[k+1], data[k]];
                }
            }
            else if(time1 !== time2){
                if(time1 > time2){
                    [data[k], data[k+1]] = [data[k+1], data[k]];
                }
            } 
        }
    }

    for(let i = 0; i < data.length; i++) {
        data[i]["day"] = days[data[i]["day"]];

        var totalMinutes = parseInt(data[i]["time"]) + 510;

        var hours = Math.floor(totalMinutes / 60);          
        var minutes = totalMinutes % 60;
        data[i]["time"] = ""+hours+":"+minutes+"";
    }
    
    return data;

}

var langCode = localStorage.getItem('langCode');
document.getElementById("regularTable").innerHTML = langCode == "EN" ? "REGULAR TABLE" : "NORMAL TABLO";
btn.innerHTML = langCode == "TR" ? "PDF Oluştur" : "Create PDF";
btn2.innerHTML = langCode == "TR" ? "Excel'e Dönüştür" : "Convert to Excel";
var years = langCode == "EN" ? '<th colspan="5">1st Year</th><th colspan="5">2nd Year</th><th colspan="5">3rd Year</th><th colspan="5">4th Year</th>' : '<th colspan="5">1. Sınıf</th><th colspan="5">2. Sınıf</th><th colspan="5">3. Sınıf</th><th colspan="5">4. Sınıf</th>';
document.getElementById('imgFlag').src = langCode == "EN" ? "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_Turkey.svg" : "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_the_United_Kingdom.svg";


const departments = new Map(JSON.parse(localStorage.getItem('tableData')));
departments.forEach((dep, name) => {
    mergeTableCells(dep.data);
    renderTable(dep.data, name);    
});

function convertCSVtoExcel() {
    var hold = localStorage.getItem('rawData');
    var hold2 = sortTable(hold);
    var csvFile = Papa.unparse(hold2);

    if(csvFile != null) {
      Papa.parse(csvFile, {
        complete: function(result) {
          const worksheet = XLSX.utils.json_to_sheet(result.data);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

          // SAVE THE WORKBOOK AS AN EXCEL FILE
          XLSX.writeFile(workbook, 'output.xlsx');
        },
        header: true
      });

    } else {
      alert(langCode == "TR" ? "Excel'e dönüştürme işlemi başarısız oldu." : "Failed to convert to Excel.");
    }
  }

