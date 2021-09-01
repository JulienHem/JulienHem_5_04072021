let params = new URL(document.location).searchParams;
let urlPhotographerId = params.get("id");
let profile = {};
let media = [];
let mediaElements = [];

let toggle = false;
let mediaElement;
let filters = document.querySelectorAll(".filter-button");
let modalContent = document.querySelector(".carousel-container-picture");
const pictureParent = document.querySelector(".pictures-cards");
const titles = ["Popularité", "Date", "Titre"];

class Image {
  constructor(src) {
    const element = document.createElement("img");
    element.src = src;
    this.getElement = () => element;
  }
}

class Video {
  constructor(src) {
    const element = document.createElement("video");
    element.src = src;
    this.getElement = () => element;
  }
}

class ElementFactory {
  constructor() {
    this.create = (type, src) => {
      let elementClass;
      if (type === "image") {
        elementClass = new Image(src);
      } else if (type === "video") {
        elementClass = new Video(src);
      }

      return elementClass.getElement();
    };
  }
}

fetch("../../src/data.json")
  .then((response) => response.json())
  .then((data) => {
    data.media.forEach((medias) => {
      if (medias.photographerId === +urlPhotographerId) {
        displayPictures(medias);
        displayModalPictures(medias);
        media.push(medias);
      }
    });
    carouselAnimation();

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
  const photographerPicture = document.querySelector(".photographer-picture");
  const photographerTags = document.querySelector(
    ".photographer-page-details-tags"
  );

  photographerPicture.src =
    "public/media/profiles_pictures/" + profile.portrait;
  photographerName.innerHTML = profile.name;
  photographerCity.innerHTML = profile.city;
  profile.tags.forEach((tag) => {
    const photographerTag = document.createElement("div");
    photographerTag.classList.add("photographers-cards-tags");
    photographerTag.innerHTML = "#" + tag;
    photographerTags.appendChild(photographerTag);
  });
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

function carouselAnimation() {
  const prevSlide = document.querySelector(".carousel-prev");
  const nextSlide = document.querySelector(".carousel-next");
  const carouselWrapper = document.querySelector(".carousel-container-picture");
  const mediasLength = carouselWrapper.children.length;
  let index = 0;

  mediaElements.push(mediaElement);
  const maxIndex = mediaElements.length;
  if (index === 0) {
    prevSlide.style.display = "none";
  }

  nextSlide.addEventListener("click", () => {
    let slideValue = carouselWrapper.clientWidth / mediasLength;
    index++;
    console.log(carouselWrapper.clientWidth);
    let right = Number(carouselWrapper.style.right.split("px")[0]);
    carouselWrapper.style.right = right + slideValue + "px";
    prevSlide.style.display = "block";
  });

  prevSlide.addEventListener("click", () => {
    let slideValue = carouselWrapper.clientWidth / mediasLength;
    index--;
    if (index === 0) {
      prevSlide.classList.add("d-none");
    }
    nextSlide.classList.remove("d-none");
    let right = Number(carouselWrapper.style.right.split("px")[0]);
    carouselWrapper.style.right = right - slideValue + "px";
  });
}

function displayModalPictures(media) {
  const element = new ElementFactory();

  if (media.image) {
    mediaElement = element.create(
      "image",
      "public/media/pictures/" + media.image
    );
  } else {
    mediaElement = element.create(
      "video",
      "public/media/videos/" + media.video
    );
  }
  mediaElement.classList.add("modal-media");

  modalContent.appendChild(mediaElement);
}

function displayPictures(media) {
  const pictureCard = document.createElement("div");
  const element = new ElementFactory();
  const pictureBottom = document.createElement("div");
  const pictureTitle = document.createElement("div");
  const pictureLikes = document.createElement("div");
  const pictureHeart = document.createElement("i");

  if (media.image) {
    mediaElement = element.create(
      "image",
      "public/media/pictures/" + media.image
    );
  } else {
    mediaElement = element.create(
      "video",
      "public/media/videos/" + media.video
    );
  }

  mediaElement.classList.add("pictures-cards-card-content");
  pictureCard.classList.add("pictures-cards-card");
  pictureBottom.classList.add("pictures-bottom");
  pictureTitle.classList.add("pictures-bottom-title");
  pictureLikes.classList.add("pictures-bottom-likes");
  pictureHeart.classList.add("fas", "fa-heart");

  pictureTitle.innerHTML = media.title;
  pictureLikes.innerHTML = media.likes;

  pictureParent.appendChild(pictureCard);

  pictureCard.appendChild(mediaElement);
  pictureCard.append(pictureBottom);
  pictureBottom.appendChild(pictureTitle);
  pictureBottom.appendChild(pictureLikes);
  pictureLikes.appendChild(pictureHeart);

  openModal();
}

function styleFirstElement() {
  const buttons = document.getElementsByClassName("filter-button");
  const ul = document.querySelector("#filter-buttons");
  const firstButton = buttons[0];
  const lastButton = buttons[2];
  firstButton.style.borderTopLeftRadius = "5px";
  firstButton.style.borderTopRightRadius = "5px";
  lastButton.style.borderBottomLeftRadius = "5px";
  lastButton.style.borderBottomRightRadius = "5px";
  lastButton.style.borderBottom = "none";
  lastButton.style["boxShadow"] = "0px 5px 8px 0px rgba(0,0,0,0.4)";

  const icon = document.createElement("i");
  icon.classList.add("fas", "fa-chevron-down");
  ul.appendChild(icon);
}

function toggleDropdown(display) {
  const arrow = document.querySelector(".fa-chevron-down");
  for (let i = 1; i < titles.length; i++) {
    const secondThirdButton = document.querySelector(`li:nth-child(${i + 1})`);
    secondThirdButton.style.display = display;
    if (display === "block") {
      arrow.classList.add("rotate-arrow");
      filterCards("Popularité", "likes");
      filterCards("Date", "date");
      filterCards("Titre", "title");
    } else {
      arrow.classList.remove("rotate-arrow");
    }
  }
}

function swapElements() {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", (e) => {
      if (!toggle) {
        toggleDropdown("block");
        toggle = true;
      } else {
        toggleDropdown("none");
        toggle = false;
      }

      let find = titles.find((title) => title === e.target.innerHTML);
      let titlePosition = titles.indexOf(e.target.innerHTML);
      const firstPosition = titles[0];
      titles[0] = find;
      titles[titlePosition] = firstPosition;
      updateFiltersDom();
    });
  });
}

function updateFiltersDom() {
  let filters = document.querySelectorAll(".filter-button");
  filters.forEach((filter, index) => {
    filter.innerHTML = titles[index];
  });
}

function filterCards(filterName, value) {
  let filters = document.querySelectorAll(".filter-button");
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      pictureParent.innerText = "";
      modalContent.innerText = "";
      if (filters[0].innerHTML === filterName) {
        media.sort((a, b) => {
          switch (value) {
            case "likes":
              return b[value] - a[value];

            case "date":
              return new Date(a[value]) - new Date(b[value]);

            case "title":
              if (a[value] < b[value]) {
                return -1;
              }
              if (a[value] > b[value]) {
                return 1;
              }
              return 0;
          }
        });
      }
      media.forEach((sortedMedia) => {
        displayPictures(sortedMedia);
      });
    });
  });
}

function openModal() {
  let cards = document.querySelectorAll(".pictures-cards-card");
  const modal = document.querySelector("#myModal");
  const span = document.getElementsByClassName("close")[0];

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      modal.style.display = "block";
    });
  });

  span.addEventListener("click", () => {
    modal.style.display = "none";
  });

  span.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
}

createFilters();
styleFirstElement();
swapElements();
