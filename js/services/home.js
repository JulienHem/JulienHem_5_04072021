const photographersTags = [];
const photographerDetails = [];
let activeFilters = [];
let allPhotographers = [];
let isSelected = false;

const photographersCards = document.querySelector(".photographers-cards");
const profileTags = document.querySelector(".header-filters");
const profilePicture = document.querySelector(".photographer-picture");
const profileCity = document.querySelector(".photographer-city");
const profileDesc = document.querySelector(".photographer-desc");


// FETCH THE DATA FROM THE JSON
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


// PUTING THE TAGS IN AN ARRAY
function getTags(tags) {
  tags.forEach((tag) => {
    if (!photographersTags.includes(tag)) {
      photographersTags.push(tag);
    }
  });
}

// HIDE TOP BUTTON ON SCROLL
function hideButton() {
  const contentButton = document.querySelector('.header-contenu-content');

  window.addEventListener('scroll', () => {
    contentButton.style.visibility = 'visible';
  })
}


// CREATE THE TAGS
function createTags(photographers) {
  photographersTags.forEach((tag) => {
    const headerFilter = document.createElement("a");
    headerFilter.href = "#";
    headerFilter.classList.add("header-filters-tag");
    headerFilter.innerHTML = "#" + tag;
    profileTags.appendChild(headerFilter);

    headerFilter.addEventListener("click", () => {
      // SET AN ATTRIBUTE TO KNOW IF THE TAG AS ALREADY BEEN SELECTED
      let filterAttribute = headerFilter.getAttribute('isSelected');
      // STYLING IF IT DOESNT HAVE THE ATTRIBUTE
      if(!filterAttribute) {
        activeFilters.push(tag);
        headerFilter.setAttribute('isSelected', true);
        headerFilter.style.backgroundColor = '#911C1C';
        headerFilter.style.color = '#ffffff';
      } else {
        // IF IT HAS ALREADY BEEN SELECTED
        headerFilter.removeAttribute('isSelected');
        headerFilter.style.backgroundColor = '#ffffff';
        headerFilter.style.color = '#911C1C';
        const tagIndex = activeFilters.indexOf(tag);
        activeFilters.splice(tagIndex, 1);
      }
      // SELECT ALL PHOTOGRAPHERS IF NONE OF THEM HAVE BEEN SELECTED
      if(activeFilters.length === 0 ) {
        photographers = allPhotographers;
      } else {
        photographers = allPhotographers.filter((photographer) => {
          return photographer.tags.filter((tag) => activeFilters.includes(tag)).length;
        });
      }
     
      photographersCards.innerHTML = "";
      photographers.forEach((photographer) => {
        createPhotographersDetails(photographer);
      });
    });
  });
}


// DISPLAYING PHOTOGRAPHERS DETAILS
function createPhotographersDetails(photographer) {
  const photographerCard = document.createElement("a");
  const img = document.createElement("img");
  const photographerName = document.createElement("h2");
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
 
  img.src = "public/media/profiles_pictures/" + photographer.portrait;
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

hideButton();