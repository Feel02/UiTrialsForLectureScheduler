export var DayTemplate = `<tr>
<th
    rowspan="9"
    colspan="1"
    style="writing-mode: vertical-lr; text-orientation: upright"
>
    r$Day
</th>
<td colspan="2" style="font-size: 14px">8:30 - 9:20</td>
r$slot-0
</tr>
<tr>
<td colspan="2" style="font-size: 14px">9:30 - 10:20</td>
r$slot-1
</tr>
<tr>
<td colspan="2" style="font-size: 14px">10:30 - 11:20</td>
r$slot-2
</tr>
<tr>
<td colspan="2" style="font-size: 14px">11:30 - 12:20</td>
r$slot-3
</tr>
<tr>
<td colspan="2" style="font-size: 14px">12:30 - 13:20</td>
r$slot-4
</tr>
<tr>
<td colspan="2" style="font-size: 14px">13:30 - 14:20</td>
r$slot-5
</tr>
<tr>
<td colspan="2" style="font-size: 14px">14:30 - 15:20</td>
r$slot-6
</tr>
<tr>
<td colspan="2" style="font-size: 14px">15:30 - 16:20</td>
r$slot-7
</tr>
<tr>
<td colspan="2" style="font-size: 14px">16:30 - 17:20</td>
r$slot-8
</tr>
`;

export var SlotTemplate = `<td colspan="3" rowspan="r$Span">r$CourseName</td>
<td colspan="2" rowspan="r$Span">r$Classroom</td>
`;

export var TableTemplate = `<table border="1px solid black">
<caption border="1px solid black">
    r$Department
</caption>
<thead>
    <tr>
        <th colspan="3"></th>
        r$Years
    </tr>
</thead>
<tbody>
    r$Body
</tbody>
</table>
`;
