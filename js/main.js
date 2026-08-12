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
    if (event.key === "Escape") {
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
    if (window.innerWidth > 1180) setMenuState(false);
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
      "A hardened leader with a measured voice and little patience for bravado. The last voyage left her capable, scarred, and guarded.",
      "She refuses the map at first. Returning means facing the place that took her crew—and the possibility that what happened there was never finished.",
    ],
  },
  gambler: {
    title: "The Gambler",
    image: "assets/images/gambler.png",
    alt: "Portrait of The Gambler",
    lead: "He lost the map in a card game. That may have been the first move, not the last.",
    paragraphs: [
      "Cloaked, unsettling, and impossible to read, he always seems to know more than he says. His warning follows the map out of the room.",
      "Whether he wants the treasure found, the crew tested, or something carried back from the reef remains unclear.",
    ],
  },
  scout: {
    title: "The Scout",
    image: "assets/images/scout.png",
    alt: "Portrait of The Scout",
    lead: "First toward danger, and usually the first to see it coming.",
    paragraphs: [
      "Sharp-eyed, resourceful, and practical, the Scout reads terrain faster than most people read a chart.",
      "Unknown ground rewards caution, but the crew needs someone willing to cross the line between watching and moving.",
    ],
  },
  cartographer: {
    title: "The Cartographer",
    image: "assets/images/cartographer.png",
    alt: "Portrait of The Cartographer",
    lead: "Maps reveal a path. They can also decide what a traveller fails to see.",
    paragraphs: [
      "Keeper of routes, fragments, tide notes, and hidden passages, the Cartographer understands how much uncertainty can hide inside a confident line of ink.",
      "At Black Reef, every mark must be questioned—and every missing mark may be a warning.",
    ],
  },
  survivor: {
    title: "The Survivor",
    image: "assets/images/survivor.png",
    alt: "Portrait of The Survivor",
    lead: "One of the few who escaped the deep, carrying fear, memory, and unfinished knowledge.",
    paragraphs: [
      "Survival did not make the past clearer. It left fragments: sounds beneath the water, a route that should not exist, and faces that still return in sleep.",
      "Going back may be the only way to learn which memories are warnings and which are invitations.",
    ],
  },
  rat: {
    title: "The Rat",
    image: "assets/images/rat.png",
    alt: "Portrait of The Rat",
    lead: "The smallest witness aboard, and the one most able to go where humans cannot.",
    paragraphs: [
      "Clever, quick, and easily underestimated, the Rat slips through locked spaces, narrow passages, and the blind spots of larger creatures.",
      "On a voyage built around hidden entrances, being small may be the crew's greatest advantage.",
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
      characterDialog.showModal();
    });
  });

  dialogClose?.addEventListener("click", () => characterDialog.close());
  characterDialog.addEventListener("click", (event) => {
    if (event.target === characterDialog) characterDialog.close();
  });
  characterDialog.addEventListener("close", () => activeCharacterTrigger?.focus());
}

const roadmap = document.querySelector("[data-roadmap]");

if (roadmap) {
  const roadmapToggles = [...roadmap.querySelectorAll(".roadmap__toggle")];

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

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const formFields = contactForm.querySelector("[data-form-fields]");
  const successMessage = contactForm.querySelector("[data-form-success]");
  const errorMessage = contactForm.querySelector("[data-form-error]");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const formIsActive = contactForm.dataset.formMode === "active";

  if (formFields) formFields.disabled = !formIsActive;

  if (formIsActive && submitButton && successMessage && errorMessage) {
    submitButton.textContent = "Send Message";

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      successMessage.hidden = true;
      errorMessage.hidden = true;
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { accept: "application/json" },
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "The message could not be sent.");
        }

        contactForm.reset();
        successMessage.hidden = false;
      } catch (error) {
        errorMessage.textContent = error.message || "Something went wrong. Please check the form and try again.";
        errorMessage.hidden = false;
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    });
  }
}
