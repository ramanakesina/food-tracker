// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig={
  apiKey:"AIzaSyAhkItut1AaP4PbwMCS1boOlOKb5SeImxk",
  authDomain:"ram-checker-ad686.firebaseapp.com",
  projectId:"ram-checker-ad686",
  storageBucket:"ram-checker-ad686.firebasestorage.app",
  messagingSenderId:"301946828251",
  appId:"1:301946828251:web:8ab9cefed0fc59686d23fe",
  measurementId:"G-TWDX15F3HK"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

let currentUser;
let foodLog=[],waterLog=[],healthLog=[];

const loginPage=document.getElementById("loginPage");
const appPage=document.getElementById("appPage");
const testModal=document.getElementById("testModal");

const foodInput=document.getElementById("foodInput");
const waterInput=document.getElementById("waterInput");
const foodList=document.getElementById("foodList");
const waterList=document.getElementById("waterList");

async function googleLogin(){
  const provider=new GoogleAuthProvider();
  await signInWithPopup(auth,provider);
}

onAuthStateChanged(auth,user=>{
  if(user){
    currentUser=user;
    loginPage.style.display="none";
    appPage.style.display="block";
    loadLogs();
  }else{
    loginPage.style.display="block";
    appPage.style.display="none";
  }
});

async function loadLogs(){
  if(!currentUser) return;

  foodLog=[];
  waterLog=[];

  const foods=await getDocs(collection(db,"users",currentUser.uid,"foods"));
  foods.forEach(d=>foodLog.push({id:d.id,...d.data()}));

  const water=await getDocs(collection(db,"users",currentUser.uid,"water"));
  water.forEach(d=>waterLog.push({id:d.id,...d.data()}));

  displayLogs();
}

async function addFood(){
  let val=foodInput.value;
  if(!val) return;

  await addDoc(collection(db,"users",currentUser.uid,"foods"),{
    text:val,
    time:new Date().toLocaleString()
  });

  foodInput.value="";
  loadLogs();
}

async function addWater(){
  let val=waterInput.value;
  if(!val) return;

  await addDoc(collection(db,"users",currentUser.uid,"water"),{
    amount:val,
    time:new Date().toLocaleString()
  });

  waterInput.value="";
  loadLogs();
}

/* EDIT DELETE FIXED FOR FIRESTORE */

async function deleteFood(id){
  await deleteDoc(doc(db,"users",currentUser.uid,"foods",id));
  loadLogs();
}

async function editFood(id,oldText){
  let newVal=prompt("Modify food:",oldText);
  if(newVal){
    await updateDoc(doc(db,"users",currentUser.uid,"foods",id),{text:newVal});
    loadLogs();
  }
}

async function deleteWater(id){
  await deleteDoc(doc(db,"users",currentUser.uid,"water",id));
  loadLogs();
}

async function editWater(id,oldVal){
  let newVal=prompt("Modify water amount:",oldVal);
  if(newVal){
    await updateDoc(doc(db,"users",currentUser.uid,"water",id),{amount:newVal});
    loadLogs();
  }
}

function displayLogs(){
  foodList.innerHTML=foodLog.map(f=>`
  <li>
    ${f.text} - ${f.time}
    <button onclick="editFood('${f.id}','${f.text}')">Edit</button>
    <button onclick="deleteFood('${f.id}')">Delete</button>
  </li>`).join("");

  waterList.innerHTML=waterLog.map(w=>`
  <li>
    ${w.amount} ml - ${w.time}
    <button onclick="editWater('${w.id}','${w.amount}')">Edit</button>
    <button onclick="deleteWater('${w.id}')">Delete</button>
  </li>`).join("");
}

/* CSV EXPORT UNCHANGED */

function downloadExcel(){
  let csv="Type,Value,Time\n";

  foodLog.forEach(f=>csv+=`Food,${f.text},${f.time}\n`);
  waterLog.forEach(w=>csv+=`Water,${w.amount}ml,${w.time}\n`);

  let blob=new Blob([csv],{type:"text/csv"});
  let url=URL.createObjectURL(blob);

  let a=document.createElement("a");
  a.href=url;
  a.download="health_data.csv";
  a.click();
}

window.googleLogin=googleLogin;
window.editFood=editFood;
window.deleteFood=deleteFood;
window.editWater=editWater;
window.deleteWater=deleteWater;
