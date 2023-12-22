"use strict";
import datele from "./media/eurostat.json" assert { type: "json" };

const tari = datele.map((a) => a.tara);
const indicator = datele.map((ind) => ind.indicator);
const setTari = new Set(tari);
const setIndicatori = new Set(indicator);
console.log(setTari);

let selectTara = document.getElementById("selectTari");
let selectIndicatori = document.getElementById("selectIndicator");
let btnAfiseaza = document.getElementById("btnAfiseaza");
var divChart = document.getElementById("barChart");
var barChart = document.getElementById("barChart").getAttribute("#svg");
var bubbleChart = document.getElementsByTagName("canvas");
createSetTari();
createSetIndicatori();

function createSetTari() {
  setTari.forEach((i) => {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    selectTara.appendChild(option);
  });
}

function createSetIndicatori() {
  setIndicatori.forEach((i) => {
    var option = document.createElement("option");
    option.value = i;
    option.text = i;
    selectIndicatori.appendChild(option);
  });
}

let tara = "";
selectTara.addEventListener("change", function () {
  tara = selectTara.value;
});

let ind = "";
selectIndicatori.addEventListener("change", function () {
  ind = selectIndicatori.value;
});

var dateGrafic = [];
btnAfiseaza.addEventListener("click", function () {
  if (tara == "") [tara] = setTari;
  if (ind == "") [ind] = setIndicatori;

  const dateGraficLabels = datele
    .filter((d) => d.indicator == ind && d.tara == tara)
    .map((a, b) => a.an);
  const dateGraficValues = datele
    .filter((d) => d.indicator == ind && d.tara == tara)
    .map((a, b) => a.valoare);

  dateGrafic[0] = dateGraficLabels;
  dateGrafic[1] = dateGraficValues;

  while (divChart.firstChild) {
    divChart.removeChild(divChart.firstChild);
  }
  barChart = new BarChart(document.getElementById("barChart"));
  barChart.draw(dateGrafic);
});

let btnBubble = document.getElementById("btnBubble");

var bbDate = [];
btnBubble.addEventListener("click", function () {

  bubbleChart = new BubbleChart(document.getElementById("barChart"));
    const anSel = '2000';
    const minSV = datele.filter((d) => d.indicator =='SV' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.min(a, b));
    const maxSV = datele.filter((d) => d.indicator =='SV' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.max(a, b));
    const minPOP = datele.filter((d) => d.indicator =='POP' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.min(a, b));
    const maxPOP = datele.filter((d) => d.indicator =='POP' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.max(a, b));
    const minPIB = datele.filter((d) => d.indicator =='PIB' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.min(a, b));
    const maxPIB = datele.filter((d) => d.indicator =='PIB' && d.an == anSel && d.valoare !==null).map(a=>a.valoare).reduce((a, b)=> Math.max(a, b));
  let array = []
  for(let i of setTari){
    let u = datele.filter((a)=>a.tara==i && a.an==anSel)
    const arr = [u[0], u[1], u[2]];
    array.push(arr);
    //console.log(arr);
  }
console.log(array);

  //console.log(bbDate);
  bubbleChart.draw(array, minSV, maxSV, minPOP, maxPOP, minPIB, maxPIB );
});
