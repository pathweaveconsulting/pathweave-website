/* PathWeave — navigation behaviour only (mobile menu + Practices menu). */
(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var subToggles = document.querySelectorAll(".sub-toggle");

  function setSub(toggle, open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.parentElement.classList.toggle("is-open", open);
  }

  function closeSubs(except) {
    subToggles.forEach(function (t) { if (t !== except) setSub(t, false); });
  }

  function setMenu(open) {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector(".menu-label").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
  }

  subToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      closeSubs(toggle);
      setSub(toggle, open);
    });
  });

  if (menuButton) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openSub = document.querySelector('.sub-toggle[aria-expanded="true"]');
    if (openSub) { setSub(openSub, false); openSub.focus(); return; }
    if (menuButton && menuButton.getAttribute("aria-expanded") === "true") { setMenu(false); menuButton.focus(); }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-sub")) closeSubs();
  });

  // Close the desktop dropdown when focus leaves it.
  document.querySelectorAll(".has-sub").forEach(function (item) {
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget) && window.matchMedia("(min-width: 981px)").matches) {
        setSub(item.querySelector(".sub-toggle"), false);
      }
    });
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });
})();
