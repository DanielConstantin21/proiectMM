"use strict";
initializareDate();

let datele = [];

function initializareDate() {
  const limit = 16;
  const arrTari = [
    "BE",
    "BG",
    "CZ",
    "DK",
    "DE",
    "EE",
    "IE",
    "EL",
    "ES",
    "FR",
    "HR",
    "IT",
    "CY",
    "LV",
    "LT",
    "LU",
    "HU",
    "MT",
    "NL",
    "AT",
    "PL",
    "PT",
    "RO",
    "SI",
    "SK",
    "FI",
    "SE",
  ];

  let geoCond = "&";
  for (let i = 0; i < arrTari.length; i++) {
    geoCond += "geo=" + arrTari[i] + "&";
  }
  const urlSV =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec?sex=T&age=Y1&lastTimePeriod=" +
    limit +
    geoCond;
  const urlPOP =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?sex=T&age=TOTAL&lastTimePeriod=" +
    limit +
    geoCond;
  const urlPIB =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB&lastTimePeriod=" +
    limit +
    geoCond;
  const finalURLsv = urlSV + geoCond;

  Promise.all([
    loadData("SV", urlSV, limit - 1),
    loadData("POP", urlPOP, limit - 1),
    loadData("PIB", urlPIB, limit - 1),
  ]).then(() => {
    const tari = datele.map((a) => a.tara);
    const indicator = datele.map((ind) => ind.indicator);
    const setTari = new Set(tari);
    const setIndicatori = new Set(indicator);
    const ani = datele.map((a) => a.an);
    const setAni = new Set(ani);

    let selectTara = document.getElementById("selectTari");
    let selectIndicatori = document.getElementById("selectIndicator");
    let selectAni = document.getElementById("selectAni");
    let btnAfiseaza = document.getElementById("btnAfiseaza");
    var divChart = document.getElementById("barChart");
    var barChart = document.getElementById("barChart").getAttribute("#svg");
    var bubbleChart = document.getElementsByTagName("canvas");
    const titlul = document.getElementById("titlu");
    createSetTari();
    createSetIndicatori();
    createSetAni();

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
      titlul.innerHTML =
        "Grafic al evolutiei indicatorului " + ind + ", pentru tara " + tara;
      dateGrafic[0] = dateGraficLabels;
      dateGrafic[1] = dateGraficValues;

      while (divChart.firstChild) {
        divChart.removeChild(divChart.firstChild);
      }
      barChart = new BarChart(document.getElementById("barChart"));
      barChart.draw(dateGrafic);
    });

    let btnBubble = document.getElementById("btnBubble");
    let an = "";
    const colors = generateColors(tari.length);
    selectAni.addEventListener("change", function () {
      an = selectAni.value;
    });

    var bbDate = [];
    btnBubble.addEventListener("click", function () {
      //bubbleChart = new BubbleChart(document.getElementById("barChart"));
      if (an == "") [an] = setAni;
      titlul.innerHTML = "Bubble Chart pentru anul " + an;
      getBubble(an);
    });

    // handle bbl animation
    let isAnimating = false;
    let currentAnimationFrame = null;

    function animate() {
      const anii = Array.from(setAni);
      let currentIndex = 0;

      function animateStep() {
        if (!isAnimating) {
          return;
        }

        if (currentIndex < anii.length) {
          getBubble(anii[currentIndex]);
          currentIndex++;

          // Adjust the delay between frames (currently 1000 milliseconds)
          setTimeout(function () {
            currentAnimationFrame = requestAnimationFrame(animateStep);
          }, 700); // Adjust the delay as needed
        } else {
          isAnimating = false;
          btnPlay.innerHTML = "Play Animation";
        }
      }

      animateStep();
    }

    let btnPlay = document.getElementById("btnPlay");

    btnPlay.addEventListener("click", function () {
      if (!isAnimating) {
        isAnimating = true;
        animate();
        btnPlay.innerHTML = "Stop Animation";
      } else {
        isAnimating = false;
        cancelAnimationFrame(currentAnimationFrame);
        btnPlay.innerHTML = "Play Animation";
      }
    });

    ///

    const minSV = datele
      .filter((d) => d.indicator == "SV" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.min(a, b));

    const maxSV = datele
      .filter((d) => d.indicator == "SV" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.max(a, b), 0);
    const minPOP = datele
      .filter((d) => d.indicator == "POP" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.min(a, b), 0);
    const maxPOP = datele
      .filter((d) => d.indicator == "POP" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.max(a, b), 0);
    const minPIB = datele
      .filter((d) => d.indicator == "PIB" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.min(a, b), 0);
    const maxPIB = datele
      .filter((d) => d.indicator == "PIB" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.max(a, b), 0);

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

    function createSetAni() {
      setAni.forEach((i) => {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectAni.appendChild(option);
      });
    }

    function generateColors(noOfElements) {
      let colors = [];
      const randomColor = () => {
        return (
          "#" +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, "0")
            .concat(
              Math.floor(0.35 * 255)
                .toString(16)
                .padStart(2, 0)
            )
            .toUpperCase()
        );
      };
      for (let i = 0; i < noOfElements; i++) {
        colors[i] = randomColor();
      }
      return colors;
    }

    function getBubble(anul) {
      bubbleChart = new BubbleChart(document.getElementById("barChart"));
      const anSel = anul;
      let array = [];
      for (let i of setTari) {
        let u = datele.filter((a) => a.tara === i && a.an === anSel);
        const arr = [u[0], u[1], u[2]];
        array.push(arr);
      }

      bubbleChart.draw(
        array,
        minSV,
        maxSV,
        minPOP,
        maxPOP,
        minPIB,
        maxPIB,
        colors
      );
    }
  });
}

async function loadData(indicator, finalURL, limit) {
  let limita = limit;
  try {
    const response = await fetch(finalURL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const {
      value,
      dimension: {
        geo: {
          category: { index, label },
        },
        time: {
          category: { index: ind, label: lbl },
        },
      },
    } = data;
    const tarile = {};
    const ani = {};

    if (value.length < limita) limita = value.length;

    for (const [key, value] of Object.entries(index)) {
      tarile[value] = key;
    }
    for (const [key, value] of Object.entries(ind)) {
      ani[value] = key;
    }
    const result = Object.keys(value).map((key) => [key, value[key]]);
    // console.log("lungime value" + result.length / 27);
    limita = result.length / 27;

    for (let i = 0; i < result.length; i++) {
      let sv = {
        tara: tarile[Math.floor(i / limita)],
        an: ((parseInt(i) % limita) + parseInt(ani[0])).toString(),
        indicator: indicator,
        valoare: result[i][1],
      };
      datele.push(sv);
    }
  } catch (error) {
    console.error(error);
  }
}
