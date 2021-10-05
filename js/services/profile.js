let params = new URL(document.location).searchParams;
let urlPhotographerId = params.get("id");
let profile = {};
let media = [];
let mediaElements = [];
let carouselMediaCount = 0;
let modalIndex = 0;
let toggle = false;
let mediaElement;
const carouselWrapper = document.querySelector(".carousel-container-picture");
let filters = document.querySelectorAll(".filter-button");
let modalContent = document.querySelector(".carousel-container-picture");
const pictureParent = document.querySelector(".pictures-cards");
const prevSlide = document.querySelector(".go-back");
const nextSlide = document.querySelector(".go-next");
const titles = ["Popularité", "Date", "Titre"];
let totalLikes = 0;

// CREATE A CLASS FOR EVERY IMAGES ELEMENT

class Image {
  constructor(src) {
    const element = document.createElement("img");
    element.src = src;
    this.getElement = () => element;
  }
}

// CLASS FOR ALL VIDEOS ELEMENT

class Video {
  constructor(src) {
    const element = document.createElement("video");
    element.src = src;
    this.getElement = () => element;
  }
}

// INSTANTIATE IMAGE OR VIDEO WITH ITS TYPE

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

// FETCHING THE DATA

fetch("../../src/data.json")
  .then((response) => response.json())
  .then((data) => {
    data.media.forEach((medias) => {
      if (medias.photographerId === +urlPhotographerId) {
        displayPictures(medias);
        displayModalPictures(medias);
        carouselMediaCount++;
        media.push(medias);
      }
    });

    data.photographers.forEach((photographer) => {
      if (photographer.id === +urlPhotographerId) {
        profile = photographer;
        displayBottomDetails(photographer)

      }
    });
    carouselAnimation();
    displayDetails();
    
  });


  // DISPLAYING PHOTOGRAPHER DETAILS


function displayDetails() {
  const modalArtistName = document.querySelector('.modal-header-artistname');
  const photographerName = document.querySelector(".photographer-page-details-head-name");
  const photographerCity = document.querySelector(".photographer-page-details-city");
  const photographerPicture = document.querySelector(".photographer-picture");
  const photographerTags = document.querySelector(".photographer-page-details-tags");

  photographerPicture.src = "public/media/profiles_pictures/" + profile.portrait;
  photographerName.innerHTML = profile.name;
  photographerCity.innerHTML = profile.city;
  modalArtistName.innerHTML = profile.name;

  // DISPLAYING TAGS 
  profile.tags.forEach((tag) => {
    const photographerTag = document.createElement("div");
    photographerTag.classList.add("photographers-cards-tags");
    photographerTag.innerHTML = "#" + tag;
    photographerTags.appendChild(photographerTag);
  });
}

// CREATING THE FILTER BUTTON
function createFilters() {
  const ul = document.querySelector("#filter-buttons");
  ul.innerHTML = "";

  // DISPLAYING THE TITLES FOR THE DROPDOWN
  titles.forEach((title) => {
    const li = document.createElement("li");
    const filterButtons = document.createElement("button");
    filterButtons.classList.add("filter-button");
    filterButtons.innerHTML = title;
    ul.appendChild(li);
    li.appendChild(filterButtons);
  });
}

// DISPLAYING THE DETAILS FOR THE LITTLE DETAILS CARD ON THE BOTTOM RIGHT

function displayBottomDetails(details) {
  const cardPrice = document.querySelector('.bottom-card-price');
  cardPrice.innerHTML = details.price + '€ / jour'
}


// DISPLAYING THE PICTURES INSIDE THE MODAL
function displayModalPictures(media) {
  // NEW INSTANCE OF THE FACTORY TO DISPLAY IMAGES OR VIDEOS
  const element = new ElementFactory();
  const pictureContainer = document.createElement('div');
  const pictureBottom = document.createElement("div");
  const pictureTitle = document.createElement("div");



  if (media.image) {
    // DISPLAYING AN IMAGE
    mediaElement = element.create(
      "image",
      "public/media/pictures/" + media.image
    );
  } else {
    // DISPLAYING A VIDEO
    mediaElement = element.create(
      "video",
      "public/media/videos/" + media.video
    );
  }
  mediaElement.classList.add("modal-media");
  pictureBottom.classList.add("modal-pictures-bottom");
  pictureContainer.classList.add('picture-container')

  pictureTitle.innerHTML = media.title;


  modalContent.appendChild(pictureContainer);
  pictureContainer.appendChild(mediaElement);
  pictureContainer.appendChild(pictureBottom);
  pictureBottom.appendChild(pictureTitle);
  
}


// MOVING THE CAROUSSEL
function carouselAnimation() {
  const maxIndex = carouselMediaCount
  if (modalIndex === 0) {
    prevSlide.style.display = "none";
  }

  nextSlide.addEventListener("click", (e) => {
    // CALCULATING THE EXACT VALUE TO SWIPE THE CAROUSEL TO THE RIGHT
    e.preventDefault();
    carouselWrapper.style.right = (585*(modalIndex - 1)) + 585 + "px";
    modalIndex++;
    prevSlide.style.display = "block";

    // HIDING THE RIGHT ARROW IF WE REACH THE LAST IMAGE
    if(modalIndex === maxIndex) {
      nextSlide.style.display = 'none';
    }
  });

  prevSlide.addEventListener("click", (e) => {
    
    // HIDING THE LEFT ARROW IF WE ARE AT THE FIRST IMAGE
    e.preventDefault();

    modalIndex--;
    if (modalIndex === 1) {
      prevSlide.style.display = 'none';
    }
    nextSlide.style.display = 'block';
    carouselWrapper.style.right = (585*modalIndex - 1) - 585 + "px";
  });
}


// DISPLAYING PROFILE PICTURES
function displayPictures(media) {
  const pictureCard = document.createElement("div");
  const pictureLink = document.createElement("a");
  const element = new ElementFactory();
  const pictureBottom = document.createElement("div");
  const pictureTitle = document.createElement("div");
  const pictureLikes = document.createElement("a");
  const pictureHeart = document.createElement("i");
  const cardLikes = document.querySelector('.bottom-card-likes');


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
  pictureCard.setAttribute('tabindex', 7)
  pictureBottom.classList.add("pictures-bottom");
  pictureTitle.classList.add("pictures-bottom-title");
  pictureLikes.classList.add("pictures-bottom-likes");
  pictureHeart.classList.add("fas", "fa-heart");
  pictureLink.classList.add("picture-link")
  pictureLink.setAttribute('href', "");
  pictureLikes.setAttribute('href', "")

  pictureTitle.innerHTML = media.title;
  pictureLikes.innerHTML = media.likes;

  totalLikes += media.likes;
  cardLikes.innerHTML = totalLikes;
  pictureParent.appendChild(pictureCard);
  
  // INCREMENT THE LIKES
  pictureLikes.addEventListener('click', (e) => {
    e.preventDefault();
    media.likes++;
    pictureLikes.innerHTML = media.likes;
    pictureLikes.appendChild(pictureHeart);
    totalLikes++;
    cardLikes.innerHTML = totalLikes;
  })

  pictureCard.appendChild(pictureLink);
  pictureLink.appendChild(mediaElement);
  pictureCard.append(pictureBottom);
  pictureBottom.appendChild(pictureTitle);
  pictureBottom.appendChild(pictureLikes);
  pictureLikes.appendChild(pictureHeart);

  openPictureModal();
}


// STYLE THE FIRST AND LAST ELEMENT OF THE SELECT DROPDOWN
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


// TOGGLE THE DROPDOWN FOR THE FILTERS
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

// SWAPPING THE ELEMENTS AT THE FIRST PLACE OF THE SELECT
function swapElements() {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((filterButton) => {
    filterButton.addEventListener("click", (e) => {
      // WHETHER ITS TOGGLE OR NOT WE SHOW THE DROPDOWN
      if (!toggle) {
        toggleDropdown("block");
        toggle = true;
      } else {
        toggleDropdown("none");
        toggle = false;
      }
      // CHECKING THE TITLE FROM THE TARGET THAT HAS BEEN CLICKED
      let find = titles.find((title) => title === e.target.innerHTML);
      // CHECKING ITS INDEX
      let titlePosition = titles.indexOf(e.target.innerHTML);
      // FIRSTPOSITION OF THE DROPDOWN IS EQUAL TO THE FIRST ELEMENT IN THE ARRAY
      const firstPosition = titles[0];
      // THE FIRST ELEMENT IS EQUAL TO THE TARGET
      titles[0] = find;
      // DISPLAYING THE CORRECT TITLE
      titles[titlePosition] = firstPosition;
      // UPDATE THE DOM
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

// FILTERS THE CARDS ACCORDING THE THE DROPDOWN
function filterCards(filterName, value) {
  let filters = document.querySelectorAll(".filter-button");
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      totalLikes = 0;
      pictureParent.innerText = "";
      modalContent.innerText = "";
      if (filters[0].innerHTML === filterName) {
        // SORTING THE ARRAY ACCORDING TO THE FILTER
        media.sort((a, b) => {
          // SWITCH CASE WITH THE CORRECT VALUES
          switch (value) {
            // FILTER BY LIKES
            case "likes":
              return b[value] - a[value];

            // FILTER BY DATES
            case "date":
              return new Date(a[value]) - new Date(b[value]);

            // FILTER BY TITLE
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
        // DISPLAYING THE PICTURES WITH THE SORTED ARRAY
        displayPictures(sortedMedia);
        displayModalPictures(sortedMedia);
      });
    });
  });
}

function moveCarouselPictures() {
  carouselWrapper.style.right = (585*modalIndex) - 585 + "px";
}

function openFormModal() {
  const contactModal = document.querySelector('#contactModal');
  const closeContactIcon = document.querySelector('.close-contact');
  const contactButton = document.querySelector('.photographer-page-details-head__contact');
  const sendContact = document.querySelector('.send-contact');

  // HIDE MODAL
  closeContactIcon.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.style.display = 'none';
  })

  // OPEN THE CONTACT MODAL
  contactButton.addEventListener('click', () => {
    contactModal.style.display = "block";
  })


  // SENDING THE CONTACT INFOS
  sendContact.addEventListener('click', () => {
    const firstName = document.querySelector('#firstname').value;
    const lastName = document.querySelector('#lastname').value;
    const email = document.querySelector('#email').value;
    const yourMessage = document.querySelector('#your-message').value;

    
    console.log({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      YourMessage : yourMessage
    });

  })
}

function openPictureModal() {
  let cards = document.querySelectorAll(".picture-link");
  const picturesModal = document.querySelector("#myModal");
  const closeIcon = document.querySelector('.fa-times');

 

  cards.forEach((card, index) => {
    // MOVING TO THE EXACT PICTURE THAT WE CLICKED ON
    card.addEventListener("click", (e) => {
      e.preventDefault();
      modalIndex = index + 1;
      picturesModal.style.display = "block";
      if(modalIndex > 1) {
        prevSlide.style.display = 'block';
      } else if (modalIndex === 1) {
        prevSlide.style.display = 'none';
      }
      if (modalIndex === 10) {
        nextSlide.style.display = 'none'
      } else if (modalIndex < 10) {
        nextSlide.style.display = 'block'
      }
        moveCarouselPictures();
    });
  });
 
  // CLOSE THE MODAL
  closeIcon.addEventListener('click', () => {
    picturesModal.style.display = 'none';
  })



  
}

createFilters();
styleFirstElement();
swapElements();
openFormModal();
