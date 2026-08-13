document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");

function getMenuLinks() {
  return siteNavigation ? [...siteNavigation.querySelectorAll("a[href]")] : [];
}

function setMenuState(isOpen) {
  if (!menuButton || !siteNavigation) return;

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteNavigation.dataset.open = String(isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

if (menuButton && siteNavigation) {
  menuButton.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    setMenuState(willOpen);
    if (willOpen) getMenuLinks()[0]?.focus();
  });

  siteNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuState(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      menuButton.focus();
    }

    if (event.key === "Tab" && menuButton.getAttribute("aria-expanded") === "true") {
      const menuLinks = getMenuLinks();
      const lastItem = menuLinks[menuLinks.length - 1];

      if (event.shiftKey && document.activeElement === menuButton) {
        event.preventDefault();
        lastItem?.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        menuButton.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1250) setMenuState(false);
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

const homepageSections = document.querySelectorAll(".home-page main > section:not(.home-hero)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (homepageSections.length) {
  homepageSections.forEach((section) => section.classList.add("reveal-section"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    homepageSections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
    );

    homepageSections.forEach((section) => revealObserver.observe(section));
  }
}

const characterProfiles = {
  captain: {
    title: "The Captain",
    image: "assets/images/captain.png",
    alt: "Portrait of The Captain",
    lead: "She has been to Black Reef before. Nineteen of her crew never came back.",
    paragraphs: [
      "She initially refuses to return to the place where she lost them.",
      "She ultimately agrees because she still wants answers about what happened.",
    ],
  },
  gambler: {
    title: "The Gambler",
    image: "assets/images/gambler.png",
    alt: "Portrait of The Gambler",
    lead: "A sinister, cloaked Gambler ties a secret map to a card-game wager.",
    paragraphs: [
      "The three adventurers win the map.",
      "His warning follows them: “You won the map. Don’t mistake that for winning the treasure.”",
    ],
  },
  adventurers: {
    title: "The Adventurers",
    image: "assets/images/crew-group.png",
    alt: "The adventurers and crew of The Black Reef",
    lead: "Three adventurers win the secret map to Black Reef in a card-game wager.",
    paragraphs: [
      "They need a ship and a Captain to follow it.",
      "Their individual identities remain part of the film’s unfolding mystery.",
    ],
  },
  rat: {
    title: "The Rat",
    image: "assets/images/rat.png",
    alt: "Portrait of The Rat",
    lead: "A recurring companion able to reach places the human characters cannot.",
    paragraphs: [
      "The Rat travels with the adventurers and remains active in the story.",
      "Small passages can offer a route where the others cannot follow.",
    ],
  },
};

const characterDialog = document.querySelector("[data-character-dialog]");
const characterTriggers = document.querySelectorAll(".character-trigger[data-character]");
let activeCharacterTrigger = null;

if (characterDialog && characterTriggers.length) {
  const dialogImage = characterDialog.querySelector("[data-character-image]");
  const dialogTitle = characterDialog.querySelector("[data-character-title]");
  const dialogLead = characterDialog.querySelector("[data-character-lead]");
  const dialogCopy = characterDialog.querySelector("[data-character-copy]");
  const dialogClose = characterDialog.querySelector("[data-dialog-close]");

  characterTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const profile = characterProfiles[trigger.dataset.character];
      if (!profile) return;

      activeCharacterTrigger = trigger;
      dialogImage.src = profile.image;
      dialogImage.alt = profile.alt;
      dialogTitle.textContent = profile.title;
      dialogLead.textContent = profile.lead;
      dialogCopy.replaceChildren(...profile.paragraphs.map((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        return element;
      }));
      document.body.classList.add("dialog-open");
      characterDialog.showModal();
    });
  });

  dialogClose?.addEventListener("click", () => characterDialog.close());
  characterDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    characterDialog.close();
  });
  characterDialog.addEventListener("click", (event) => {
    if (event.target === characterDialog) characterDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && characterDialog.open) characterDialog.close();
  });
  characterDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    activeCharacterTrigger?.focus();
  });
}

const roadmap = document.querySelector("[data-roadmap]");

if (roadmap) {
  const roadmapToggles = [...roadmap.querySelectorAll(".roadmap__toggle")];

  if (reduceMotion || !("IntersectionObserver" in window)) {
    roadmap.classList.add("is-visible");
  } else {
    const roadmapObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 },
    );
    roadmapObserver.observe(roadmap);
  }

  roadmapToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";

      roadmapToggles.forEach((otherToggle) => {
        const otherDetail = document.getElementById(otherToggle.getAttribute("aria-controls"));
        const otherMark = otherToggle.querySelector(".roadmap__toggle-mark");
        otherToggle.setAttribute("aria-expanded", "false");
        otherToggle.querySelector("span:first-child").textContent = "Explore stage";
        if (otherMark) otherMark.textContent = "+";
        if (otherDetail) otherDetail.hidden = true;
      });

      if (willOpen) {
        const detail = document.getElementById(toggle.getAttribute("aria-controls"));
        const mark = toggle.querySelector(".roadmap__toggle-mark");
        toggle.setAttribute("aria-expanded", "true");
        toggle.querySelector("span:first-child").textContent = "Hide stage";
        if (mark) mark.textContent = "−";
        if (detail) detail.hidden = false;
      }
    });
  });
}
