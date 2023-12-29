class BarChart {
  #svgns = "http://www.w3.org/2000/svg";
  #svg;

  /**
   * Creates a new bar chart
   * @param {HTMLElement} domElement
   */
  constructor(domElement) {
    domElement.replaceChildren();
    this.#createSVG();
    domElement.appendChild(this.#svg);
  }

  /**
   * Displays the bar chart
   * @param {Array<Array>} data
   */
  draw(data) {
    // Clear the chart

    // Add the bars
    const barWidth = this.#svg.clientWidth / data[0].length;

    const f = this.#svg.clientHeight / Math.max(...data[1]);

    for (let i = 0; i < data[0].length; i++) {
      //  const element = data[i]
      const label = data[0][i];
      const value = data[1][i];

      const barHeight = value * f * 0.9;
      const barY = this.#svg.clientHeight - barHeight;
      const barX = i * barWidth + barWidth / 4;

      const bar = document.createElementNS(this.#svgns, "rect");
      bar.classList.add("bar");
      bar.setAttribute("x", barX);
      bar.setAttribute("y", barY);
      bar.setAttribute("height", barHeight);
      bar.setAttribute("width", barWidth / 2);

      //note: if the styles are set using CSS .bar:hover {...} will only work if marked as !important
      //the styling should be moved to the .bar {...} instead
      bar.style.fill = "#db4437";
      bar.style.strokeWidth = 2;
      bar.style.stroke = "black";

      const title = document.createElementNS(this.#svgns, "title");
      title.innerHTML = "Year: " + label + ", Value: " + value;
      bar.appendChild(title);

      const text = document.createElementNS(this.#svgns, "text");
      text.appendChild(document.createTextNode(label));
      text.setAttribute("x", barX);
      text.setAttribute("y", barY - 10);
      this.#svg.appendChild(text);

      this.#svg.appendChild(bar);
    }
  }
  #createSVG() {
    this.#svg = document.createElementNS(this.#svgns, "svg");

    this.#svg.style.borderColor = "black";
    this.#svg.style.borderWidth = "1px";
    this.#svg.style.borderStyle = "solid";
    this.#svg.style.backgroundColor = "WhiteSmoke";
    //or
    //this.#svg.setAttribute('style', 'border: 1px solid black');

    this.#svg.setAttribute("width", "100%"); //note: this.#svg.width is readonly
    this.#svg.setAttribute("height", "100%");
  }
}
class BubbleChart {
  #canvas;

  /**
   * Creates a new bubble chart
   * @param {HTMLElement} domElement
   */
  constructor(domElement) {
    domElement.replaceChildren();
    this.#createCanvas();
    domElement.appendChild(this.#canvas);
  }

  /**
   * Displays the bubble chart
   * @param {Array<Array} dataBbl
   *
   */
  draw(dataBbl, minSV, maxSV, minPOP, maxPOP, minPIB, maxPIB, colors) {
    // Clear the chart

    this.#canvas.replaceChildren();
    const ctx = this.#canvas.getContext("2d");
    //ctx.clearRect(0, 0, 600, 400);

    const width = this.#canvas.clientWidth;
    const height = this.#canvas.clientHeight;
    const difSV = maxSV - minSV;
    const difPOP = maxPOP - minPOP;
    const difPIB = maxPIB - minPIB;
    const bblMax = 30;
    const bblMin = 10;
    const year = dataBbl[0][0].an;

    ctx.font = "12px Comic Sans MS";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("SV", 0, 50);
    ctx.fillText("PIB", width - 30, this.#canvas.clientHeight - 20);
    let fsize = 30;
    ctx.font = fsize + "px Comic Sans MS";
    ctx.fillStyle = "rgb(247, 25, 25, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(year, width - 60, height - 40);

    //trasam axele
    ctx.beginPath();
    ctx.moveTo(1, this.#canvas.clientHeight);
    ctx.lineTo(1, this.#canvas.clientHeight - height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1, this.#canvas.clientHeight);
    ctx.lineTo(width, this.#canvas.clientHeight);
    ctx.stroke();

    // ctx.font = "12px Comic Sans MS";
    // ctx.fillStyle = "black";
    // ctx.textAlign = "left";
    //ctx.fillText("PIB", width, this.#canvas.clientHeight - 15);

    for (let i = 0; i < dataBbl.length; i++) {
      let valPOP = dataBbl[i][1] ? dataBbl[i][1].valoare : 0;
      let valPIB = dataBbl[i][2] ? dataBbl[i][2].valoare : 0;
      let valSV = dataBbl[i][0] ? dataBbl[i][0].valoare : 0;

      const label = dataBbl[i][0].tara;

      const bubbleDim = bblMin + ((valPOP - minPOP) / difPOP) * bblMax;
      // const barY =
      //   this.#canvas.clientHeight -
      //   (bblMax + ((valSV - minSV) / difSV) * (height - bblMax));
      // const barX = bblMax + ((valPIB - minPIB) / difPIB) * (width - bblMax);
      const barX = this.mapValueToRange(valPIB, minPIB, maxPIB, 0, width);
      const barY = this.mapValueToRange(valSV, minSV, maxSV, height, 0);

      ctx.fillStyle = colors[i]; // "rgb(255, 99, 71, 0.5)";
      ctx.beginPath();
      ctx.arc(barX, barY, bubbleDim, 0, 2 * Math.PI);
      ctx.fill();

      let fsize = (bubbleDim / 2) * 1.5;
      ctx.font = fsize + "px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(label, barX, barY);
    }
  }
  mapValueToRange(value, inMin, inMax, outMin, outMax) {
    // Map a value from one range to another
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  #createCanvas() {
    this.#canvas = document.createElement("canvas");

    //this.#canvas.setAttribute("width", "100%");
    // this.#canvas.setAttribute("height", "100%");
    this.#canvas.width = 800;
    this.#canvas.height = 600;
  }
}
