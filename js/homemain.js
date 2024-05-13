var langCode = localStorage.getItem('langCode') == null ? 'EN' : localStorage.getItem('langCode');
localStorage.setItem('langCode', langCode);

const languageButton = document.getElementById("languageButton");

document.getElementById("aybu").innerHTML = langCode == "EN" ? "AYBU LECTURE SCHEDULE" : "AYBU DERS PROGRAMI";
document.getElementById("file-in").innerHTML = langCode == "EN" ? "Choose file" : "Dosya seç";
document.getElementById("regularTable").innerHTML = langCode == "EN" ? "Regular Table" : "Normal Tablo";
document.getElementById("withProf").innerHTML = langCode == "EN" ? "With Professor Names" : "Profesör isimleriyle beraber";
document.getElementById("onlyProf").innerHTML = langCode == "EN" ? "Professor's Timetables" : "Profesörlerin Programları";
document.getElementById("classes").innerHTML = langCode == "EN" ? "Classes' Timetable" : "Sınıfların Programları";
document.getElementById("docInp").innerHTML = langCode == "EN" ? "Click to browse" : "Tıklayarak dosya seçin";

document.getElementById('imgFlag').src = langCode == "EN" ? "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_Turkey.svg" : "https://flagemoji.com/wp-content/uploads/2020/02/Flag_of_the_United_Kingdom.svg";


languageButton.addEventListener("click", function(){
    if(langCode == "TR"){
        localStorage.setItem('langCode', 'EN');
    }
    else{
        localStorage.setItem('langCode', 'TR');
    }
    location.reload();
});

export function createEmptyTableData() {
    const courses = [];
    for (let day = 0; day < 5; day++) {
        let d = [];
        for (let slot = 0; slot < 9; slot++) {
            let s = [];
            for (let grade = 0; grade < 4; grade++) {
                s.push({ span: 1, grade: grade + 1, name: "", room: "" });
            }
            d.push(s);
        }
        courses.push(d);
    }
    return courses;
}

function event(e) {
    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onloadend = () => {
        const allCourses = readCourses(reader.result);
        const departments = new Map();
        for (let i = 0; i < allCourses.length; i++) {
            const c = allCourses[i];
            if (c.code == "course_code") continue;
            if (!departments.has(c.department)) {
                departments.set(c.department, { data: createEmptyTableData() });
            }
            const dep = departments.get(c.department);
            console.log(c);
            dep.data[c.day][c.time / 60][c.grade - 1] = {
                span: c.duration / 60,
                name: c.code,
                room: c.classroom,
                lecturer: c.lecturer,
            };
        }
        //console.log(departments.entries());
        localStorage.setItem("tableData", JSON.stringify(Array.from(departments.entries())));
        localStorage.setItem("rawData", JSON.stringify(allCourses));
    };
}

document.getElementById("file-in").addEventListener("input", event);


export class Course {
    /**
     *
     * @param {string} code Course code
     * @param {int} day Day index, starts from 0
     * @param {int} time Timeslot index, starts from 0
     * @param {int} duration Course duration
     * @param {string} classroom Classroom code
     * @param {int} grade Course grade
     * @param {string} department Course department
     * @param {string} name Course name
     * @param {string} lecturer Teachers name
     */
    constructor(code, day, time, duration, classroom, grade, department, name, lecturer) {
        this.code = code;
        this.duration = duration;
        this.classroom = classroom;
        this.day = day;
        this.time = time;
        this.grade = grade;
        this.department = department;
        this.name = name;
        this.lecturer = lecturer;
    }
}

/**
 *
 * @param {string} data
 * @returns {Array<Course>}
 */
function readCourses(data) {
    data = data.replace(/[\r]/g, "");
    data = data.trim();
    const courses = [];
    data.split("\n").forEach((row) => {
        const val = row.split(",");
        courses.push(
            new Course(
                val[0],
                parseInt(val[1]),
                parseInt(val[2]),
                val[3],
                val[4],
                parseInt(val[5]),
                val[6],
                val[7],
                val[8],
            )
        );
    });

    return courses;
}
