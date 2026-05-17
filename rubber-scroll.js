(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var page = document.querySelector("main");

  if (!page || reduceMotion.matches) {
    return;
  }

  var pull = 0;
  var releaseTimer;
  var touchY = null;
  var maxPull = 34;

  function scrollBottom() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function atTop() {
    return window.scrollY <= 0;
  }

  function atBottom() {
    return window.scrollY >= scrollBottom() - 1;
  }

  function setPull(value) {
    pull = Math.max(-maxPull, Math.min(maxPull, value));
    document.body.classList.add("is-bouncing");
    page.style.transform = "translateY(" + pull + "px)";
  }

  function release() {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(function () {
      pull = 0;
      page.style.transform = "translateY(0)";
      setTimeout(function () {
        if (pull === 0) {
          document.body.classList.remove("is-bouncing");
        }
      }, 340);
    }, 70);
  }

  function stretch(amount) {
    setPull(pull + amount * .28);
    release();
  }

  window.addEventListener("wheel", function (event) {
    if (atTop() && event.deltaY < 0) {
      stretch(-event.deltaY);
    } else if (atBottom() && event.deltaY > 0) {
      stretch(-event.deltaY);
    }
  }, { passive: true });

  window.addEventListener("touchstart", function (event) {
    touchY = event.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchmove", function (event) {
    if (touchY === null) {
      return;
    }

    var currentY = event.touches[0].clientY;
    var delta = currentY - touchY;
    touchY = currentY;

    if ((atTop() && delta > 0) || (atBottom() && delta < 0)) {
      stretch(delta);
    }
  }, { passive: true });

  window.addEventListener("touchend", release, { passive: true });
}());
