document.addEventListener("DOMContentLoaded", function () {


    const brand = document.querySelector('.animated-brand');
    const text = brand.textContent;
    brand.innerHTML = '';
  
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.animationDelay = `${index * 0.1}s`;
      brand.appendChild(span);
    });
  
  
    // Navbar toggle button
    const toggleBtn = document.querySelector(".toggle-btn");
    const fullPagePanel = document.querySelector(".full-page-panel");
    const closeBtn = document.querySelector(".close-btn");
  
    toggleBtn.addEventListener("click", function () {
      fullPagePanel.classList.toggle("open");
    });
  
    closeBtn.addEventListener("click", function () {
      fullPagePanel.classList.remove("open");
    });
  

  });
  
  
  var cards,
  nCards,
  cover,
  openContent,
  openContentText,
  pageIsOpen = false,
  openContentImage,
  closeContent,
  windowWidth,
  windowHeight,
  currentCard;

// initiate the process
init();

function init() {
  resize();
  selectElements();
  attachListeners();
}

// select all the elements in the DOM that are going to be used
function selectElements() {
  cards = document.getElementsByClassName("card");
  nCards = cards.length;
  cover = document.getElementById("cover");
  openContent = document.getElementById("open-content");
  openContentText = document.getElementById("open-content-text");
  openContentImage = document.getElementById("open-content-image");
  closeContent = document.getElementById("close-content");
  header = document.getElementById("header");
}

/* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
*/
function attachListeners() {
  for (var i = 0; i < nCards; i++) {
    attachListenerToCard(i);
  }
  closeContent.addEventListener("click", onCloseClick);
  window.addEventListener("resize", resize);
}

function attachListenerToCard(i) {
  cards[i].addEventListener("click", function (e) {
    var card = getCardElement(e.target);
    onCardClick(card, i);
  });
}

/* When a card is clicked */
function onCardClick(card, i) {
  // set the current card
  currentCard = card;
  // add the 'clicked' class to the card, so it animates out
  currentCard.className += " clicked";
  // animate the card 'cover' after a 500ms delay
  setTimeout(function () {
    animateCoverUp(currentCard);
  }, 500);
  // animate out the other cards
  animateOtherCards(currentCard, true);
  // add the open class to the page content
  openContent.className += " open";
  // hide the header
  header.style.visibility = 'hidden';
  header.style.opacity = 0;
}


function animateCoverUp(card) {
  // get the position of the clicked card
  var cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  var cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition);
  setCoverColor(cardStyle);
  scaleCoverToFillWindow(cardPosition);
  // update the content of the opened page
  openContentText.innerHTML =
    "<h1>" + card.children[2].textContent + "</h1>" + paragraphText;
  openContentImage.src = card.children[1].src;
  setTimeout(function () {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);

  // Smooth scroll to open content after 1 second
  setTimeout(function () {
    openContent.scrollIntoView({ behavior: 'smooth' });
  }, 1000);
}

function animateCoverBack(card) {
  var cardPosition = card.getBoundingClientRect();
  // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
  setCoverPosition(cardPosition);
  scaleCoverToFillWindow(cardPosition);
  // animate scale back to the card size and position
  cover.style.transform =
    "scaleX(" +
    1 +
    ") scaleY(" +
    1 +
    ") translate3d(" +
    0 +
    "px, " +
    0 +
    "px, 0px)";
  setTimeout(function () {
    // set content back to empty
    openContentText.innerHTML = "";
    openContentImage.src = "";
    // style the cover to 0x0 so it is hidden
    cover.style.width = "0px";
    cover.style.height = "0px";
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(" clicked", "");
  }, 301);
}

function setCoverPosition(cardPosition) {
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + "px";
  cover.style.top = cardPosition.top + "px";
  cover.style.width = cardPosition.width + "px";
  cover.style.height = cardPosition.height + "px";
}

function setCoverColor(cardStyle) {
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
}

function scaleCoverToFillWindow(cardPosition) {
  // calculate the scale and position for the card to fill the page,
  var scaleX = windowWidth / cardPosition.width;
  var scaleY = windowHeight / cardPosition.height;
  var offsetX =
    (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  var offsetY =
    (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform =
    "scaleX(" +
    scaleX +
    ") scaleY(" +
    scaleY +
    ") translate3d(" +
    offsetX +
    "px, " +
    offsetY +
    "px, 0px)";
}

/* When the close is clicked */
function onCloseClick() {
  // remove the open class so the page content animates out
  openContent.className = openContent.className.replace(" open", "");
  // animate the cover back to the original position card and size
  animateCoverBack(currentCard);
  // animate in other cards
  animateOtherCards(currentCard, false);
  // show the header again
  header.style.visibility = 'visible';
  header.style.opacity = 1;
}

function animateOtherCards(card, out) {
  var delay = 100;
  for (var i = 0; i < nCards; i++) {
    // animate cards on a stagger, 1 each 100ms
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
}

// animations on individual cards (by adding/removing card names)
function animateOutCard(card, delay) {
  setTimeout(function () {
    card.className += " out";
  }, delay);
}

function animateInCard(card, delay) {
  setTimeout(function () {
    card.className = card.className.replace(" out", "");
  }, delay);
}

// this function searches up the DOM tree until it reaches the card element that has been clicked
function getCardElement(el) {
  if (el.className.indexOf("card ") > -1) return el;
  else return getCardElement(el.parentElement);
}

// resize function - records the window width and height
function resize() {
  if (pageIsOpen) {
    // update position of cover
    var cardPosition = currentCard.getBoundingClientRect();
    setCoverPosition(cardPosition);
    scaleCoverToFillWindow(cardPosition);
  }
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
}

var paragraphText =
  "<p>Somebody once told me the world is gonna roll me. I ain't the sharpest tool in the shed. She was looking kind of dumb with her finger and her thumb in the shape of an \"L\" on her forehead. Well the years start coming and they don't stop coming. Fed to the rules and I hit the ground running. Didn't make sense not to live for fun. Your brain gets smart but your head gets dumb. So much to do, so much to see. So what's wrong with taking the back streets? You'll never know if you don't go. You'll never shine if you don't glow.</p><p>Hey now, you're an all-star, get your game on, go play. Hey now, you're a rock star, get the show on, get paid. And all that glitters is gold. Only shooting stars break the mold.</p><p>It's a cool place and they say it gets colder. You're bundled up now, wait till you get older. But the meteor men beg to differ. Judging by the hole in the satellite picture. The ice we skate is getting pretty thin. The water's getting warm so you might as well swim. My world's on fire, how about yours? That's the way I like it and I never get bored.</p>";
 function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to add 'active' class to elements when they are in viewport
function addActiveClass() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(element => {
    if (isInViewport(element)) {
      element.classList.add('active');
    }
  });
}

// Event listener for scroll to trigger the addActiveClass function
window.addEventListener('scroll', addActiveClass);

// Initial trigger for elements in viewport on page load
document.addEventListener('DOMContentLoaded', addActiveClass);   
// JavaScript for text animation
document.addEventListener('DOMContentLoaded', function() {
  // Get the <p> element
  const feedbackText = document.getElementById('feedback');
  
  // Animate text using opacity transition
  feedbackText.style.opacity = 0;
  fadeInElement(feedbackText);
});

// Function to fade in an element gradually
function fadeInElement(element) {
  let opacity = 0;
  const intervalId = setInterval(function() {
    opacity += 0.05;
    element.style.opacity = opacity;
    
    if (opacity >= 1) {
      clearInterval(intervalId);
    }
  }, 50); // Adjust the duration by changing the interval time (milliseconds)
}
document.addEventListener('DOMContentLoaded', function() {
  const testimonialSection = document.querySelector('.testimonial');
  
  // Array of background colors to animate
  const colors = ['#291b26'];

  let index = 0;

  function changeBackgroundColor() {
    testimonialSection.style.backgroundColor = colors[index];
    index = (index + 1) % colors.length;
  }

  // Change background color every 3 seconds (adjust as needed)
  setInterval(changeBackgroundColor, 100);
});
document.addEventListener('DOMContentLoaded', function() {
  const feedbackText = document.getElementById('feedback');
  let opacity = 1;
  let fadeDirection = -0.01; // Fade out direction (decrease opacity)

  function animateFade() {
    // Update opacity
    opacity += fadeDirection;
    
    // Apply opacity to element
    feedbackText.style.opacity = opacity;

    // Reverse fade direction when reaching boundaries
    if (opacity <= 0 || opacity >= 1) {
      fadeDirection *= -1;
    }

    // Recursive call for smooth animation
    requestAnimationFrame(animateFade);
  }

  // Start animation
  animateFade();
});

document.addEventListener('DOMContentLoaded', function() {
  const listItems = document.querySelectorAll('.list-inline-item');

  listItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('a').style.backgroundColor = '#e0e0e0'; // Change background color on hover
    });

    item.addEventListener('mouseleave', function() {
      this.querySelector('a').style.backgroundColor = '#fff'; // Restore original background color on mouse leave
    });
  });
});