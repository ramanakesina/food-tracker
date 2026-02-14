let foodLog = JSON.parse(localStorage.getItem("foodLog")) || [];
let waterLog = JSON.parse(localStorage.getItem("waterLog")) || [];
let healthLog = JSON.parse(localStorage.getItem("healthLog")) || [];

function saveData(){
localStorage.setItem("foodLog",JSON.stringify(foodLog));
localStorage.setItem("waterLog",JSON.stringify(waterLog));
localStorage.setItem("healthLog",JSON.stringify(healthLog));
}

function addFood(){
let val=document.getElementById("foodInput").value;
if(!val) return;
foodLog.push({text:val,time:new Date().toLocaleString()});
saveData();
displayLogs();
}

function addWater(){
let val=document.getElementById("waterInput").value;
if(!val) return;
waterLog.push({amount:val,time:new Date().toLocaleString()});
saveData();
displayLogs();
}

/* Edit/Delete Functions */

function deleteFood(i){
foodLog.splice(i,1);
saveData();
displayLogs();
}

function editFood(i){
let newVal=prompt("Modify food:",foodLog[i].text);
if(newVal){
foodLog[i].text=newVal;
saveData();
displayLogs();
}
}

function deleteWater(i){
waterLog.splice(i,1);
saveData();
displayLogs();
}

function editWater(i){
let newVal=prompt("Modify water amount:",waterLog[i].amount);
if(newVal){
waterLog[i].amount=newVal;
saveData();
displayLogs();
}
}

function displayLogs(){
document.getElementById("foodList").innerHTML=
foodLog.map((f,i)=>`
<li>
${f.text} - ${f.time}
<button onclick="editFood(${i})">Edit</button>
<button onclick="deleteFood(${i})">Delete</button>
</li>`).join("");

document.getElementById("waterList").innerHTML=
waterLog.map((w,i)=>`
<li>
${w.amount} ml - ${w.time}
<button onclick="editWater(${i})">Edit</button>
<button onclick="deleteWater(${i})">Delete</button>
</li>`).join("");
}

displayLogs();

/* Health Test */

function openTest(){
document.getElementById("testModal").style.display="block";
}

function closeTest(){
document.getElementById("testModal").style.display="none";
}

function saveHealth(){
let form=document.forms["healthForm"];
healthLog.push({
gas:form.gas.value,
headache:form.headache.value,
body:form.body.value,
energy:form.energy.value,
sleep:form.sleep.value,
stress:form.stress.value,
note:document.getElementById("note").value,
time:new Date().toLocaleString()
});
saveData();
closeTest();
alert("Health log saved");
}

/* Excel Download */

function downloadExcel(){
let csv="Type,Value,Time\n";

foodLog.forEach(f=>csv+=`Food,${f.text},${f.time}\n`);
waterLog.forEach(w=>csv+=`Water,${w.amount}ml,${w.time}\n`);

healthLog.forEach(h=>{
csv+=`Gas,${h.gas},${h.time}\n`;
csv+=`Headache,${h.headache},${h.time}\n`;
csv+=`BodyPain,${h.body},${h.time}\n`;
csv+=`Energy,${h.energy},${h.time}\n`;
csv+=`Sleep,${h.sleep},${h.time}\n`;
csv+=`Stress,${h.stress},${h.time}\n`;
csv+=`Note,${h.note},${h.time}\n`;
});

let blob=new Blob([csv],{type:"text/csv"});
let url=URL.createObjectURL(blob);

let a=document.createElement("a");
a.href=url;
a.download="health_data.csv";
a.click();
}
