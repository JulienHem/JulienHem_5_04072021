const photographersTags = [];
const photographerDetails = [];
let activeFilters = [];
let allPhotographers = [];
const photographersCards = document.querySelector(".photographers-cards");
const profileTags = document.querySelector(".header-filters");
const profilePicture = document.querySelector(".photographer-picture");
const profileCity = document.querySelector(".photographer-city");
const profileDesc = document.querySelector(".photographer-desc");

fetch("../../src/data.json")
  .then((response) => response.json())
  .then((json) => {
    json.photographers.forEach((photographer) => {
      getTags(photographer.tags);
    });
    allPhotographers = json.photographers
    createTags(json.photographers);
    json.photographers.forEach((photographer) => {
      createPhotographersDetails(photographer);
    });
  });

function getTags(tags) {
  tags.forEach((tag) => {
    if (!photographersTags.includes(tag)) {
      photographersTags.push(tag);
    }
  });
}

function createTags(photographers) {
  photographersTags.forEach((tag) => {
    const headerFilter = document.createElement("a");
    headerFilter.href = "#";
    headerFilter.classList.add("header-filters-tag");
    headerFilter.innerHTML = "#" + tag;
    profileTags.appendChild(headerFilter);

    headerFilter.addEventListener("click", () => {
      activeFilters.push(tag);
      photographers = allPhotographers.filter((photographer) => {
        return photographer.tags.filter((tag) => activeFilters.includes(tag)).length;
      });
      photographersCards.innerHTML = "";
      photographers.forEach((photographer) => {
        createPhotographersDetails(photographer);
      });
    });
  });
}

function createPhotographersDetails(photographer) {
  const photographerCard = document.createElement("a");
  const img = document.createElement("img");
  const photographerName = document.createElement("div");
  const photographerCity = document.createElement("div");
  const photographerQuote = document.createElement("div");
  const photographerPrice = document.createElement("div");
  const photographerDetails = document.createElement("div");
  const tag = document.createElement("div");

  photographerDetails.classList.add("photographers-details");
  tag.classList.add("photographers-details-tags");
  photographerCard.classList.add("photographers-cards-link");
  img.classList.add("photographers-cards-picture");
  photographerName.classList.add("photographers-cards-name");
  photographerCity.classList.add("photographers-cards-city");
  photographerQuote.classList.add("photographers-cards-quote");
  photographerPrice.classList.add("photographers-cards-price");

  photographerName.innerHTML = photographer.name;
  photographerCity.innerHTML = photographer.city + ", " + photographer.country;
  photographerQuote.innerHTML = photographer.tagline;
  photographerPrice.innerHTML = photographer.price + "€/jour";

  photographerCard.href = `../photographer-page.html?id=` + photographer.id;
 
  img.src = "public/img/profiles_pictures/" + photographer.portrait;
  img.alt = "Profile picture of the photographer";

  photographersCards.appendChild(photographerCard);
  photographerCard.appendChild(img);
  photographerCard.appendChild(photographerDetails);
  photographerDetails.appendChild(photographerName);
  photographerDetails.appendChild(photographerCity);
  photographerDetails.appendChild(photographerQuote);
  photographerDetails.appendChild(photographerPrice);
  photographerDetails.appendChild(tag);

  photographer.tags.forEach((photoTags) => {
    const photographerTags = document.createElement("div");
    photographerTags.classList.add("photographers-cards-tags");
    photographerTags.innerHTML = "#" + photoTags;
    tag.appendChild(photographerTags);
  });
}
