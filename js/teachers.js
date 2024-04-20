let teachers = {};
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function mergeTableCells(data, department) {
    for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 9; slot++) {
            for (let grade = 0; grade < 4; grade++) {
                if (data[day][slot][grade].lecturer in teachers) {
                    teachers[data[day][slot][grade].lecturer].push({
                        department: department,
                        room: data[day][slot][grade].room,
                        name: data[day][slot][grade].name,
                        day: days[day],
                        time: (slot + 8) + ":30"
                    });
                } else {
                    teachers[data[day][slot][grade].lecturer] = [];
                    teachers[data[day][slot][grade].lecturer].push({
                        department: department,
                        room: data[day][slot][grade].room,
                        name: data[day][slot][grade].name,
                        day: days[day],
                        time: (slot + 8) + ":30"
                    });
                }
            }
        }
    }
}

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

            table.appendChild(head);
            table.appendChild(body);
            document.body.appendChild(table);
        }
    }
}
);

