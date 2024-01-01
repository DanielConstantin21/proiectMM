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
    // Adaugam barele
    const barWidth = this.#svg.clientWidth / data[0].length;

    const f = this.#svg.clientHeight / Math.max(...data[1]);

    for (let i = 0; i < data[0].length; i++) {
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

    this.#svg.setAttribute("width", "100%");
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
    ctx.fillText("SV", 0, 30);
    ctx.fillText("PIB", width - 30, this.#canvas.clientHeight - 20);
    let fsize = 30;
    ctx.font = fsize + "px Comic Sans MS";
    ctx.fillStyle = "rgb(247, 25, 25, 0.5)";
    ctx.textAlign = "center";
    ctx.fillText(year, width - 60, height - 60);

    //trasam axele
    const axisOffsetY = 50;
    const axisOffsetX = 50;

    // Axa Y
    ctx.beginPath();
    ctx.moveTo(axisOffsetY, 0);
    ctx.lineTo(axisOffsetY, this.#canvas.clientHeight - axisOffsetX);
    ctx.stroke();

    // Axa X
    ctx.beginPath();
    ctx.moveTo(axisOffsetY, this.#canvas.clientHeight - axisOffsetX);
    ctx.lineTo(width, this.#canvas.clientHeight - axisOffsetX);
    ctx.stroke();

    // verificam daca avem date pentru toate cele 3 dimensiuni:
    if (!dataBbl.some((data) => data[0] && data[1] && data[2])) {
      ctx.font = "20px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(
        "Nu exista date pentru toate dimensiunile!",
        width / 2,
        height / 2
      );
      return;
    }

    //Desenam diviziunile pentru Y (SV)
    const numDivisionsY = 5;
    const stepY = (height - axisOffsetX) / numDivisionsY;

    for (let i = 0; i < numDivisionsY; i++) {
      const yPosition = this.#canvas.clientHeight - axisOffsetX - i * stepY;

      ctx.beginPath();
      ctx.moveTo(axisOffsetY - 10, yPosition);
      ctx.lineTo(axisOffsetY, yPosition);
      ctx.stroke();

      ctx.font = "10px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "right";
      ctx.fillText(
        ((i / (numDivisionsY - 1)) * difSV + minSV).toFixed(2),
        axisOffsetY - 15,
        yPosition
      );
    }

    // Desenam diviziunile pentru axa X (PIB)
    const numDivisionsX = 5;
    const stepX = (width - axisOffsetY) / numDivisionsX;

    for (let i = 1; i <= numDivisionsX; i++) {
      const xPosition = axisOffsetY + i * stepX;

      ctx.beginPath();
      ctx.moveTo(xPosition, this.#canvas.clientHeight - axisOffsetX);
      ctx.lineTo(xPosition, this.#canvas.clientHeight - axisOffsetX + 10);
      ctx.stroke();

      ctx.font = "10px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(
        ((i / numDivisionsX) * difPIB + minPIB).toFixed(2),
        xPosition,
        this.#canvas.clientHeight - axisOffsetX + 20
      );
    }

    for (let i = 0; i < dataBbl.length; i++) {
      let valPOP = dataBbl[i][1] ? dataBbl[i][2].valoare : 0;
      let valPIB = dataBbl[i][2] ? dataBbl[i][1].valoare : 0;
      let valSV = dataBbl[i][0] ? dataBbl[i][0].valoare : 0;

      const label = dataBbl[i][0].tara;

      const bubbleDim = bblMin + ((valPOP - minPOP) / difPOP) * bblMax;

      // Scalam valorile x și y pentru a se încadra în interiorul graficului cu o margine pentru raza maximă a bulei\\

      const scaledX =
        axisOffsetX +
        this.mapValueToRange(
          valPIB,
          minPIB,
          maxPIB,
          0,
          width - axisOffsetX - bubbleDim
        );
      let scaledY =
        axisOffsetY +
        this.mapValueToRange(
          valSV,
          minSV,
          maxSV,
          0,
          height - axisOffsetY - bubbleDim
        );

      // Inversam coordonatele Y pentru a se potrivi cu sistemul de coordonate al graficului
      scaledY = height - scaledY;

      const maxY = height - axisOffsetX - bubbleDim;
      const minY = axisOffsetX;
      if (scaledY > maxY) {
        scaledY = maxY;
      } else if (scaledY < minY) {
        scaledY = minY;
      }

      ctx.fillStyle = colors[i]; // "rgb(255, 99, 71, 0.5)";
      ctx.beginPath();
      ctx.arc(scaledX, scaledY, bubbleDim, 0, 2 * Math.PI);
      ctx.fill();

      let fsize = (bubbleDim / 2) * 1.5;
      ctx.font = fsize + "px Comic Sans MS";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(label, scaledX, scaledY);
    }
  }
  mapValueToRange(value, inMin, inMax, outMin, outMax) {
    // Map a value from one range to another
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
  #createCanvas() {
    this.#canvas = document.createElement("canvas");
    this.#canvas.width = 800;
    this.#canvas.height = 600;
  }
}
