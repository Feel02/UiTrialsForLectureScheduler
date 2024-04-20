import {
    DayTemplate,
    SlotTemplate,
    TableTemplate,
} from "../templates/templates.js";

import * as asdf from "../html2pdf.js/dist/html2pdf.bundle.min.js";

const btn = document.getElementById("button1111");

btn.addEventListener("click", function(){
    console.log("clicked");
    var element = document.getElementById('body');
    asdf.from(element).save('filename.pdf');
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
                        tableData[d][s][g].name + "<br>" 
                        + (tableData[d][s][g].lecturer != null ? tableData[d][s][g].lecturer : "")
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

const departments = new Map(JSON.parse(localStorage.getItem('tableData')));
departments.forEach((dep, name) => {
    mergeTableCells(dep.data);
    renderTable(dep.data, name);
});
