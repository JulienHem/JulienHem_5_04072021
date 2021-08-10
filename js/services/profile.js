let params = new URL(document.location).searchParams;
let urlPhotographerId = params.get("id");
let profile = {};
const titles = ["Popularité", "Date", "Titre"];
let filtering = false;

fetch("../../src/data.json")
  .then((response) => response.json())
  .then((data) => {
    data.photographers.forEach((photographer) => {
      if (photographer.id === +urlPhotographerId) {
        profile = photographer;
      }
    });
    displayDetails();
  });

function displayDetails() {
  const photographerName = document.querySelector(
    ".photographer-page-details-head-name"
  );
  const photographerCity = document.querySelector(
    ".photographer-page-details-city"
  );
  photographerName.innerHTML = profile.name;
  photographerCity.innerHTML = profile.city;
}

function createFilters() {
  const ul = document.querySelector("#filter-buttons");
  ul.innerHTML = "";

  titles.forEach((title) => {
    const li = document.createElement("li");
    const filterButtons = document.createElement("button");
    filterButtons.classList.add("filter-button");
    filterButtons.innerHTML = title;
    ul.appendChild(li);
    li.appendChild(filterButtons);
  });
}

function showFilters() {
  const filterButtons = document.querySelector(".filter-button");

  filterButtons.addEventListener("click", () => {
    for (let i = 1; i < titles.length; i++) {
      const button = document.querySelector(`li:nth-child(${i + 1})`);
      button.style.display = "block";
    }
  });
}

function swapElements() {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", (e) => {
      if (!filtering) {
        filtering = true;
        return;
      }

      let find = titles.find((title) => title === e.target.innerHTML);
      let titlePosition = titles.indexOf(e.target.innerHTML);
      console.log(find, titlePosition);
      const firstPosition = titles[0];
      titles[0] = find;
      titles[titlePosition] = firstPosition;
      console.log(titles);
      filtering = false;
      createFilters();
      showFilters();
      swapElements();
    });
  });
}

createFilters();
showFilters();
swapElements();
