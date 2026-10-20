(function () {
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  // Theme toggle: an explicit choice is stored; otherwise follow the system setting.
  function isDark() {
    return root.dataset.theme ? root.dataset.theme === "dark" : media.matches;
  }
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Copy the email address to the clipboard.
  document.querySelectorAll(".copy").forEach(function (button) {
    var use = button.querySelector("use");
    var timer;
    button.addEventListener("click", function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(button.dataset.copy).then(function () {
        button.dataset.label = "Copied";
        button.classList.add("copied");
        if (use) use.setAttribute("href", "#i-check");
        clearTimeout(timer);
        timer = setTimeout(function () {
          button.classList.remove("copied");
          if (use) use.setAttribute("href", "#i-copy");
          setTimeout(function () { button.dataset.label = "Copy"; }, 200);
        }, 1600);
      });
    });
  });

  // Highlight the section currently in view in the sidebar navigation.
  var links = document.querySelectorAll(".toc a");
  if (!("IntersectionObserver" in window) || !links.length) return;
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var link = byId[entry.target.id];
      if (link) link.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-35% 0px -60% 0px" });
  Object.keys(byId).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();
