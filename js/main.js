import {
    DayTemplate,
    SlotTemplate,
    TableTemplate,
} from "../templates/templates.js";

import "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js";

const btn = document.getElementById("button1114");

btn.addEventListener("click", function(){
    console.log("clicked");
    var element = document.getElementById('body3');                  //tt for only the tables           

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

    html2pdf().set(opt).from(element).save();

});

const btn2 = document.getElementById("button1124");

btn2.addEventListener("click", function(){
    console.log("clicked");
    /*
    var wb = XLSX.utils.book_new();

    const departmentss = new Map(JSON.parse(localStorage.getItem('tableData')));
    departmentss.forEach((dep, name) => {
        sortTable(dep.data,wb);  
    });

    
    // Convert the workbook to an Excel file (blob)
    var wbBlob = XLSX.write(wb, { type: 'blob', bookType: 'xlsx' });

     // Save the Excel file using FileSaver
    saveAs(wbBlob, 'output.xlsx');

    FileSaver.saveAs(wbBlob, 'output.xlsx'); */
    
    convertCSVtoExcel();

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
    const days = [
        DayTemplate.replace("r$Day", "Monday"),
        DayTemplate.replace("r$Day", "Tuesday"),
        DayTemplate.replace("r$Day", "Wednesday"),
        DayTemplate.replace("r$Day", "Thursday"),
        DayTemplate.replace("r$Day", "Friday"),
    ];
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
    document.getElementById("tt").innerHTML += table;
}

export function swap(data, i, j) {
    let temp = data[i];
    data[i] = data[j];
    data[j] = temp;
}

export function sortTable(dataa){

    var data = JSON.parse(dataa);

    console.log(data);

    for (let i = 5; i < data.length; i++) {

        for(let k = 5; k < data.length-i; k++) {

            const myArrayA = data[k];
            console.log(myArrayA);
            console.log('asdasd:' + myArrayA.split(',')[1]);
            const grade1 = parseInt(myArrayA["department"]);       //5
            const day1 = parseInt(myArrayA["grade"]);         //3
            const time1 = parseInt(myArrayA["day"]);        //4    
            const department1 = myArrayA["time"];            //6

            console.log(grade1, day1, time1, department1);

            const myArrayB = data[k+1].split(',').split(':')[1];
            console.log(myArrayB);
            const grade2 = parseInt(myArrayB[5]);
            const day2 = parseInt(myArrayB[3]);
            const time2 = parseInt(myArrayB[4]);
            const department2 = myArrayB[6];

            console.log(grade2, day2, time2, department2);

            // Sort by department, then year, then day, then start hour
            if (department1 !== department2){
                if(department1.localeCompare(department2)){
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
            }; 
        }
    }
    
    return data;

}

const departments = new Map(JSON.parse(localStorage.getItem('tableData')));
departments.forEach((dep, name) => {
    mergeTableCells(dep.data);
    renderTable(dep.data, name);    
});

function convertCSVtoExcel() {
    var hold = localStorage.getItem('rawData');
    var hold2 = sortTable(hold);
    var csvFile = hold2;

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
      alert('Please select a CSV File.');
    }
  }

