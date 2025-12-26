//---------------------------- Biztonság ----------------------------//

// XSS védelem: HTML speciális karaktereket átalakít, hogy a felhasználói input ne okozhasson script támadást
const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Form adatkezelés: a contactForm minden inputját és textarea-ját megtisztítja a beküldés előtt
document.getElementById('contactForm')?.addEventListener('submit', (e) => {
  const inputs = e.target.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.value = sanitizeInput(input.value);
  });
});

// Canvas fingerprinting védelem: letiltja az érintés alapú "touch-action"-t canvas elemeknél
document.querySelectorAll('canvas').forEach(canvas => {
  canvas.style.touchAction = 'none';
  canvas.style.msTouchAction = 'none';
});

//---------------------------- SEO ----------------------------//

// Lazy loading képekhez: csak akkor tölti be a képeket, ha láthatóvá válnak (jobb betöltési idő)
document.addEventListener("DOMContentLoaded", function() {
  const lazyImages = [].slice.call(document.querySelectorAll("img[loading='lazy']"));
  
  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src; // tényleges kép betöltése
          lazyImage.classList.add("loaded"); // opcionális animációhoz/stílushoz
          lazyImageObserver.unobserve(lazyImage); // már nem kell figyelni
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
});

// Google Analytics eseménykövetés: ha van gtag, akkor contact form elküldéskor eventet küld
document.getElementById('contactForm')?.addEventListener('submit', function() {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'contact_form_submit', {
      'event_category': 'engagement',
      'event_label': 'Contact Form Submission'
    });
  }
});

//---------------------------- Navigáció ----------------------------//

const navlinks = document.getElementById("navlinks");
const navul = document.getElementById("ull");
const navham = document.getElementById("ham");
const hambi = document.getElementById("hambi")

// Menü megnyitása: hozzáadja az 'active' osztályokat az animációhoz és láthatósághoz
function toggleMenu(){
    navlinks.classList.add('active');
    navul.classList.add('ulactive');
    navham.classList.add('hamactive');
    hambi.classList.add('hambiactive');
}

// Menü bezárása: eltávolítja az 'active' osztályokat
function removetoggle(){
    navlinks.classList.remove('active');
    navul.classList.remove('ulactive');
    navham.classList.remove('hamactive');
    hambi.classList.remove('hambiactive');
}

//---------------------------- Home háttér animáció (pontok és vonalak) ----------------------------//

const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
let width, height;
let points = [];

// Canvas méret beállítása teljes ablakra
function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// Random szám generálása adott tartományban
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Pont objektum
class Point {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.vx = random(-0.3, 0.3); // x irányú sebesség
    this.vy = random(-0.3, 0.3); // y irányú sebesség
  }
  move() {
    // mozgás + visszapattanás a képernyő széléről
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // kis kör a pont
    ctx.fillStyle = '#80cbc4';
    ctx.fill();
  }
}

// Pontok összekötése vonalakkal ha túl közel vannak egymáshoz
function connectPoints(points) {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[i].x - points[j].x;
      let dy = points[i].y - points[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.strokeStyle = 'rgba(128, 203, 196,' + (1 - dist / 150) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animáció frissítése
function animate() {
  ctx.clearRect(0, 0, width, height);
  points.forEach((p) => {
    p.move();
    p.draw();
  });
  connectPoints(points);
  requestAnimationFrame(animate);
}

// pontok létrehozása
for (let i = 0; i < 50; i++) {
  points.push(new Point());
}

animate();

//---------------------------- Ads háttér animáció ----------------------------//
// Grafikon vonalakkal és pontokkal, csak akkor animál, ha látható (IntersectionObserver)

// Itt nem részletezem minden sorát, de lényege: pontokat generál, vonalakat rajzol,
// animáció progress-től függően, majd újraindítja magát 3s után

//---------------------------- Contact animáció ----------------------------//
// Ha a contact szekció láthatóvá válik scrollnál, akkor hozzáad egy 'animate' osztályt (CSS animációhoz)
const contactSection = document.querySelector('.maincontact');
window.addEventListener('scroll', () => {
  const rect = contactSection.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight - 100;
  if (isVisible) {
    contactSection.classList.add('animate');
  }
});

//---------------------------- Egér / Parallax animáció ----------------------------//

// Egér alapú parallax: kép enyhe eltolása X/Y irányban
window.addEventListener("load", () => {
  setTimeout(() => {
    document.addEventListener("mousemove", e => {
      const img = document.querySelector(".parallax");
      const moveX = (e.clientX - window.innerWidth / 2) / -50;
      const moveY = (e.clientY - window.innerHeight / 2) / -50;
      img.style.transform = `translateX(calc(-50% + ${moveX}px)) translateY(${moveY}px) scale(1.05)`;
    });
  }, 4000);
});

// Parallax címekhez / elemekhez
window.addEventListener("load", () => {
  setTimeout(() => {
    function moveParallax(x, y, el) {
      const moveX = (x - window.innerWidth / 2) / 50;
      const moveY = (y - window.innerHeight / 2) / 50;
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    const parallaxElements = document.querySelectorAll(".parallax-title");

    // Desktop egér
    document.addEventListener("mousemove", e => {
      parallaxElements.forEach(el => moveParallax(e.clientX, e.clientY, el));
    });

    // Mobil érintés
    document.addEventListener("touchmove", e => {
      const touch = e.touches[0];
      parallaxElements.forEach(el => moveParallax(touch.clientX, touch.clientY, el));
    });

  }, 4000);
});

// Oldal tetejére ugrás frissítéskor
window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo({ top: 0 });
  }, 100);
});

// Parallax animáció – desktop: egér, mobil: scroll/touch
function updateParallax(x, y) {
  document.querySelectorAll(".parallax-item").forEach(el => {
    const speed = parseFloat(el.dataset.speed);
    // Desktopon mindkét irány, mobilon csak Y
    if (x !== null && y !== null) {
      el.style.transform = `translate(${x * 90 * speed}px, ${y * 90 * speed}px)`;
    } else {
      const scrollY = window.scrollY || window.pageYOffset;
      el.style.transform = `translateY(${scrollY * speed * 0.2}px)`;
    }
  });
}

// --- Desktop egér ---
document.addEventListener("mousemove", (e) => {
  // csak desktopon legyen aktiv
  if (window.innerWidth > 768) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    updateParallax(x, y);
  }
});

// --- Mobil scroll / touch ---
function handleMobileParallax() {
  updateParallax(null, null);
}
window.addEventListener("scroll", handleMobileParallax);
window.addEventListener("touchmove", handleMobileParallax);


//---------------------------- Scroll animáció ----------------------------//
// A '.scroll-animate' elemek láthatóságát figyeli, ha láthatóvá válik, hozzáad 'visible' osztályt CSS animációhoz
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
});
document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));





document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  // Ha már elfogadta, ne mutassa
  if (localStorage.getItem("cookiesAccepted") === "true") {
    banner.style.display = "none";
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    banner.style.display = "none";
  });
});







(function () {

  const pbCarouselTrack = document.getElementById("infiniteCarousel");
  if (!pbCarouselTrack) return;

  // Duplikálás a végtelen loophoz
  pbCarouselTrack.innerHTML += pbCarouselTrack.innerHTML;

  let pbCarouselPos = 0;
  const pbCarouselSpeed = 0.4;

  let pbIsDragging = false;
  let pbDragMoved = false;
  let pbLastX = 0;

  function pbCarouselAnimate() {
    if (!pbIsDragging) {
      pbCarouselPos -= pbCarouselSpeed;
    }

    const pbWidth = pbCarouselTrack.scrollWidth / 2;
    if (Math.abs(pbCarouselPos) >= pbWidth) {
      pbCarouselPos = 0;
    }

    pbCarouselTrack.style.transform = `translateX(${pbCarouselPos}px)`;
    requestAnimationFrame(pbCarouselAnimate);
  }

  pbCarouselAnimate();

  /* ===== DESKTOP ===== */
  pbCarouselTrack.addEventListener("mousedown", (e) => {
    pbIsDragging = true;
    pbDragMoved = false;
    pbLastX = e.clientX;
  });

  window.addEventListener("mousemove", (e) => {
    if (!pbIsDragging) return;
    const delta = e.clientX - pbLastX;
    if (Math.abs(delta) > 5) pbDragMoved = true;
    pbCarouselPos += delta;
    pbLastX = e.clientX;
  });

  window.addEventListener("mouseup", () => {
    pbIsDragging = false;
  });

  /* ===== TOUCH ===== */
  pbCarouselTrack.addEventListener("touchstart", (e) => {
    pbIsDragging = true;
    pbDragMoved = false;
    pbLastX = e.touches[0].clientX;
  }, { passive: true });

  pbCarouselTrack.addEventListener("touchmove", (e) => {
    if (!pbIsDragging) return;
    const x = e.touches[0].clientX;
    const delta = x - pbLastX;
    if (Math.abs(delta) > 5) pbDragMoved = true;
    pbCarouselPos += delta;
    pbLastX = x;
  }, { passive: true });

  pbCarouselTrack.addEventListener("touchend", () => {
    pbIsDragging = false;
  });

  /* ===== CLICK KEZELÉS ===== */
  pbCarouselTrack.addEventListener("click", (e) => {
    const item = e.target.closest(".carousel-item");
    if (!item) return;

    // Ha drag volt → NEM nyitjuk meg
    if (pbDragMoved) {
      pbDragMoved = false;
      return;
    }

    const url = item.dataset.url;
    if (url) {
      window.open(url, "_blank");
    }
  });

})();

