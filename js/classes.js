let classes = {};
let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
                        day: days[day],
                        time: (slot + 8) + ":30"
                    })
                } else {
                    classes[element.room] = []
                    classes[element.room].push({
                        name: element.name,
                        department: department,
                        lecturer: element.lecturer,
                        day: days[day],
                        time: (slot + 8) + ":30"
                    })
                }
            }
        }
    }
    console.log(classes)
}

const departments = new Map(JSON.parse(localStorage.getItem('tableData')));

Promise.all([...departments.entries()].map(([name, deb]) => mergeTableCells(deb.data, name))).then(() => {
    let keys = Object.keys(classes);
    keys.sort();

    for (let z = 0; z < keys.length; z++) {
        if (keys[z] != "") {

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
            for (let data in classes[keys[z]][0]) {
                let cellBData = document.createElement("th");
                let upper = data.toUpperCase();
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

            table.appendChild(head);
            table.appendChild(body);
            document.body.appendChild(table);
        }
    }
}
);

