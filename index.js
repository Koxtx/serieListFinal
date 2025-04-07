const ul = document.querySelector("ul");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const form = document.querySelector("form");
const input = document.querySelector("input");
const btnVu = document.querySelector("#btnVu");
const btnAvoir = document.querySelector("#btnAvoir");
const btnTout = document.querySelector("#btnTout");

let filteredSeries = [];

const series = [
  {
    name: "Breaking Bad",
    seen: false,
    edit: false,
  },
  {
    name: "The Wire",
    seen: true,
    edit: false,
  },
];

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (value === "") {
    displayError("Aucune saisie");
    return;
  }

  const lowerValue = value.toLowerCase();
  const DejaSaisieSerie = series.find(
    (serie) => serie.name.toLowerCase() === lowerValue
  );
  if (DejaSaisieSerie) {
    displayError("Déjà saisie");
    return;
  }

  input.value = "";
  addSerie(value);
});

btnVu.addEventListener("click", () => {
  filteredSeries = series.filter((serie) => serie.seen);
  displaySeries();
});

btnAvoir.addEventListener("click", () => {
  filteredSeries = series.filter((serie) => !serie.seen);
  displaySeries();
});

btnTout.addEventListener("click", () => {
  filteredSeries = series;
  displaySeries();
});

const displaySeries = () => {
  const seriesNode = filteredSeries.map((serie, index) => {
    return createSerieElement(serie, index);
  });
  ul.innerHTML = "";
  ul.append(...seriesNode);
};

const createSerieElement = (serie, index) => {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.classList.add("todo");
  span.addEventListener("click", () => {
    toggleSerie(index);
  });
  if (serie.seen) {
    span.classList.add("done");
  }

  const p = document.createElement("p");
  p.innerText = serie.name;
  p.addEventListener("mouseover", () => {
    p.style.cursor = "pointer";
    overImg(serie);
  });
  p.addEventListener("mouseout", () => {
    img.src = "./img/streaming.jpg";
  });

  const btnEdit = document.createElement("button");
  btnEdit.innerText = "Edit";
  btnEdit.addEventListener("click", () => {
    editSerie(index);
    displaySeries();
  });

  const btnDelete = document.createElement("button");
  btnDelete.innerText = "Delete";
  btnDelete.classList.add("delete");
  btnDelete.addEventListener("click", () => {
    deleteSerie(index);
  });

  li.append(span, p, btnEdit, btnDelete);

  if (serie.edit) {
    const input = document.createElement("input");
    input.value = serie.name;

    const btnSave = document.createElement("button");
    btnSave.innerText = "Save";
    btnSave.addEventListener("click", () => {
      saveSerie(input.value, index);
    });

    const btnCancel = document.createElement("button");
    btnCancel.innerText = "Cancel";
    btnCancel.addEventListener("click", () => {
      cancelSerie(index);
      displaySeries();
    });

    li.innerHTML = "";
    li.append(input, btnSave, btnCancel);
  }

  return li;
};

const addSerie = (value) => {
  series.push({ name: value, seen: false, edit: false });
  displaySeries();
};

const deleteSerie = (index) => {
  series.splice(index, 1);
  displaySeries();
};

const toggleSerie = (index) => {
  series[index].seen = !series[index].seen;
  displaySeries();
};

const editSerie = (index) => {
  series.forEach((serie, i) => {
    if (i === index) {
      serie.edit = true;
    } else {
      serie.edit = false;
    }
  });
};

const cancelSerie = (index) => {
  series[index].edit = false;
};

const saveSerie = (name, index) => {
  const lowerName = name.toLowerCase();
  const existingSeries = series.find(
    (serie, i) => i !== index && serie.name.toLowerCase() === lowerName
  );
  if (name.trim() === "") {
    displayError("Aucune saisie");
    return;
  } else if (existingSeries) {
    displayError("Déjà saisie");
    return;
  }

  series[index].name = name;
  series[index].edit = false;
  displaySeries();
};

const displayError = (message) => {
  const parag = document.createElement("p");
  parag.innerText = message;
  parag.style.color = "#e50914";
  ul.prepend(parag);
};

displaySeries();

const div = document.createElement("div");

const img = document.createElement("img");
const imgSrc = document.createAttribute("src");
const imgAlt = document.createAttribute("alt");
const imgWidth = document.createAttribute("width");

img.setAttributeNode(imgSrc);
img.setAttributeNode(imgAlt);
img.setAttributeNode(imgWidth);
imgSrc.value = "./img/streaming.jpg";
imgAlt.value = "Netflix";
imgWidth.value = "300px";
img.style.margin = "20px";

const overImg = async (serie) => {
  const lowerName = serie.name.toLowerCase();
  const imgPath = `./img/${lowerName}.jpg`;
  const blackImgPath = "./img/black.jpg";

  try {
    const exists = await serieExists(imgPath);
    img.src = exists ? imgPath : blackImgPath;
  } catch (error) {
    img.src = blackImgPath;
  }

  imgAlt.value = serie.name;
};

const serieExists = (imgPath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imgPath;
  });
};

div.append(img);
body.append(div);
