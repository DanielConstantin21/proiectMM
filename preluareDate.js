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
const datele = [];
let geoCond = "&";
for (let i = 0; i < arrTari.length; i++) {
  geoCond += "geo=" + arrTari[i] + "&";
}
const urlSV =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec?sex=T&age=Y1&lastTimePeriod=16" +
  geoCond;
const urlPOP =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?sex=T&age=TOTAL&lastTimePeriod=16" +
  geoCond;
const urlPIB =
  "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB&lastTimePeriod=16" +
  geoCond;
const finalURLsv = urlSV + geoCond;
//let dataSV = [];
function initializareDate() {
  loadData(datele, "SV", urlSV);
  loadData(datele, "POP", urlPOP);
  loadData(datele, "PIB", urlPIB);
}

async function loadData(arrIndicator, indicator, finalURL) {
  //let dataSV = [];
  const SVdata = await fetch(finalURL, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
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
      // console.log(ind);
      for (const [key, value] of Object.entries(index)) {
        tarile[value] = key;
      }
      for (const [key, value] of Object.entries(ind)) {
        ani[value] = key;
      }
      const result = Object.keys(value).map((key) => [key, value[key]]);
      for (let i = 0; i < result.length; i++) {
        let sv = {
          tara: tarile[Math.floor(i / 15)],
          an: ((parseInt(i) % 15) + parseInt(ani[0])).toString(),
          indicator: indicator,
          valoare: result[i][1],
        };
        arrIndicator.push(sv);
      }
    })
    .catch((error) => console.error(error)); // Handle errors);
}

export default datele;
