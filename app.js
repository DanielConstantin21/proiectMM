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

    const colors = generateColors(setTari.size);
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
    const isElementVisible = (element) => {
      return element.offsetParent !== null;
    };
    const tableContainer = document.getElementById("tableContainer");
    btnAfiseaza.addEventListener("click", function () {
      if (isElementVisible(tableContainer))
        tableContainer.style.display = "none";

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

    selectAni.addEventListener("change", function () {
      an = selectAni.value;
    });

    var bbDate = [];
    btnBubble.addEventListener("click", function () {
      tableContainer.style.display = "block";
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
    console.log(datele);
    let btnPlay = document.getElementById("btnPlay");

    btnPlay.addEventListener("click", function () {
      tableContainer.style.display = "block";
      titlul.innerHTML = "Animatie evolutie SV, POP,PIB pentru toate tarile";
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
      .reduce((a, b) => Math.min(a, b));
    const maxPOP = datele
      .filter((d) => d.indicator == "POP" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.max(a, b), 0);
    const minPIB = datele
      .filter((d) => d.indicator == "PIB" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.min(a, b));
    const maxPIB = datele
      .filter((d) => d.indicator == "PIB" && d.valoare !== null)
      .map((a) => a.valoare)
      .reduce((a, b) => Math.max(a, b), 0);

    function getBubble(anul) {
      bubbleChart = new BubbleChart(document.getElementById("barChart"));
      const anSel = anul;
      let array = [];

      generateTable(datele, anSel);

      for (let i of setTari) {
        let u = datele.filter((a) => a.tara === i && a.an === anSel);
        u.sort((a, b) => {
          const indicatorsOrder = ["SV", "PIB", "POP"];
          return (
            indicatorsOrder.indexOf(a.indicator) -
            indicatorsOrder.indexOf(b.indicator)
          );
        });
        const arr = [u[0], u[1], u[2]];
        array.push(arr);
      }

      // // Verificați dacă există date pentru cel puțin una dintre dimensiuni
      // if (!array.some((data) => data[0] && data[1] && data[2])) {
      //   // Dacă nu există date, afișați un mesaj și ieșiți din metodă
      //   console.log("Nu există date pentru toate dimensiunile");
      //   return;
      // }

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

    ///functii pentru tabel
    function generateTable(data, selectedYear) {
      const tableContainer = document.getElementById("tableContainer");
      tableContainer.innerHTML = ""; // Clear the container

      const countries = Array.from(new Set(data.map((item) => item.tara)));
      const indicators = ["SV", "PIB", "POP"];

      // Calculăm valorile medii pentru fiecare indicator
      const averageValues = {};
      for (const indicator of indicators) {
        const values = data
          .filter((item) => item.indicator === indicator)
          .map((item) => item.valoare);
        const sum = values.reduce((acc, value) => acc + value, 0);
        averageValues[indicator] = sum / values.length;
      }

      // Construim tabelul
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");

      // Adăugăm antetele pentru coloane
      const headerCell = document.createElement("th");
      headerRow.appendChild(headerCell); // Celula goală pentru colțul din stânga-sus

      for (const indicator of indicators) {
        const headerCell = document.createElement("th");
        headerCell.textContent = indicator;
        headerRow.appendChild(headerCell);
      }

      table.appendChild(headerRow);

      // Adăugăm rândurile pentru țări
      for (const country of countries) {
        const countryRow = document.createElement("tr");
        const countryCell = document.createElement("td");
        countryCell.textContent = country;
        countryRow.appendChild(countryCell);

        // Adăugăm celule pentru fiecare indicator
        for (const indicator of indicators) {
          const value =
            data.find(
              (item) =>
                item.tara === country &&
                item.indicator === indicator &&
                item.an === selectedYear
            )?.valoare || 0;
          const cell = document.createElement("td");

          // Calculăm diferența față de medie pentru fiecare celulă
          const difference = value - averageValues[indicator];
          console.log(
            "indicator:" +
              indicator +
              ", minSV:" +
              minSV +
              ", maxSV:" +
              maxSV +
              ", avg:" +
              averageValues[indicator]
          );
          switch (indicator) {
            case "SV":
              cell.style.backgroundColor = scaleColor(
                value,
                averageValues[indicator],
                minSV,
                maxSV
              );
              break;
            case "POP":
              cell.style.backgroundColor = scaleColor(
                value,
                averageValues[indicator],
                minPOP,
                maxPOP
              );
              break;
            case "PIB":
              cell.style.backgroundColor = scaleColor(
                value,
                averageValues[indicator],
                minPIB,
                maxPIB
              );
              break;
              defalut: break;
          }

          cell.textContent = value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          countryRow.appendChild(cell);
        }

        table.appendChild(countryRow);
      }

      tableContainer.appendChild(table);
    }
    function scaleColor(value, average, minValue, maxValue) {
      // Culoare pentru valorile mici (de la roșu închis la deschis)
      const darkRedColor = [255, 0, 0].map((channel) =>
        Math.min(
          255,
          Math.round(
            channel -
              ((channel / 2) * (1 - (value - minValue))) / (average - minValue)
          )
        )
      );

      // Culoare pentru valorile mari (de la verde închis la deschis)
      const darkGreenColor = [0, 255, 0].map((channel) =>
        Math.min(
          255,
          Math.round(
            channel +
              (channel / 2) * (1 - (value - average) / (maxValue - average))
          )
        )
      );

      // Interpolare între culorile roșu închis și verde închis
      const interpolatedColor = darkRedColor.map((channel, index) => {
        const interpolatedValue =
          channel +
          ((darkGreenColor[index] - channel) * (value - minValue)) /
            (maxValue - minValue);
        return Math.min(255, Math.max(0, Math.round(interpolatedValue))); // Asigură-te că nu depășim limitele RGB
      });

      return `rgb(${interpolatedColor.join(",")})`;
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
