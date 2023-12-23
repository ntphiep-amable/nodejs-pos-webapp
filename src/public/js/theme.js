const setColorSVG = (colorClass, parent) => {
  // get hex color from class pri-color
  let color = $(colorClass).css('color');
  svg = $(`${parent}`).contents().find('svg');
  // set color to svg
  svg.attr('style', `color: ${color};`);
};
const modes = ['light', 'dark-simple', 'dark-christmas'],
  icons = ['d-block-dark', 'd-block-dark-star', 'd-block-light'];
let currentMode = 0;
function switchMode(currentMode) {
  $('.' + icons[currentMode]).toggleClass('d-none');
  currentMode++;
  if (currentMode < 0 || currentMode >= modes.length) {
    currentMode = 0;
  }
  $('.' + icons[currentMode]).toggleClass('d-none');
  let modeName = modes[currentMode];
  document.body.className = modeName;
  return modeName;
}
$(document).ready(function () {
  var storedTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light';
  var toggle = document.getElementById('theme-toggle');
  document.documentElement.setAttribute('data-theme', storedTheme);
  $('.' + icons[modes.indexOf(storedTheme)]).toggleClass('d-none');

  document.querySelector('#signoutBtn').addEventListener('click', async (e) => {
    localStorage.clear();
    let res = await fetch('/login', {
      method: 'DELETE',
    });
    window.location.href = '/';
  });

  // document.querySelector('#changePass').addEventListener('click', async (e) => {
  //   e.preventDefault();
  //   window.location.href = '/admin/p/update';
  // });

  toggle.onclick = function () {
    var currentTheme = document.documentElement.getAttribute('data-theme');
    let currentMode = modes.indexOf(currentTheme);
    let targetTheme = switchMode(currentMode);
    // $('body').removeClass(currentTheme);
    // $('body').addClass(targetTheme);

    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('theme', targetTheme);
    setColorSVG('.pri-color', '#illustration object');
  };

  $('#theme-toggle').hover(
    function () {
      // find the span that not have d-none class
      let element = $(this).find('span:not(.d-none)');
      // if this is d-block-dark-star then toggle 2 svgs
      if (element.hasClass('d-block-dark-star')) {
        let svgs = element.find('svg');
        svgs.toggleClass('d-none');
      } else {
        // child svg of element
        element.find('svg').attr('fill', 'none');
      }
    },
    function () {
      let element = $(this).find('span:not(.d-none)');
      if (element.hasClass('d-block-dark-star')) {
        element.find('svg').toggleClass('d-none');
      } else {
        element.find('svg').attr('fill', 'currentColor');
      }
    },
  );
});


/* ------------------------------ *\
| *  * SOME HELPER FUNCTIONS *  *  |
\* ------------------------------ */

// use await to get return value from this promise
const confirmDialog = (title, message, acceptName = "OK") => {
  let $dia = $("#message-dia");
  $dia.find(".modal-title").text(title);
  $dia.find(".modal-body").text(message);
  $dia.find(".bg-btn").text(acceptName);
  $dia.find(".bg-btn").show();
  return new Promise((resolve, reject) => {
      $dia.modal("show");
      $dia.find(".bg-btn").click(() => {
          $dia.find(".bg-btn").hide();
          resolve(true);
      });
      $dia.on("hidden.bs.modal", () => {
          $dia.find(".bg-btn").hide();
          resolve(false);
      });
  });
};
const dialogAlert = (title = "Announcement", message) => {
  let $dia = $("#message-dia");
  $dia.find(".modal-title").text(title);
  $dia.find(".modal-body").text(message);
  $dia.modal("show");
};
const dialogAlertWait = (title = "Announcement", message) => {
  let $dia = $("#message-dia");
  $dia.find(".modal-title").text(title);
  $dia.find(".modal-body").text(message);
  $dia.find(".bg-btn").hide();
  $dia.modal("show");
  return new Promise((resolve, reject) => {
      $dia.on("hidden.bs.modal", () => {
          resolve();
      });
  });
};
const hideCustomDialog = () => {
  let $dia = $("#message-dia");
  $dia.modal("hide");
};

/* ------------------------------ *\
|  *  * SOME HOVER FUNCTIONS *  *  |
\* ------------------------------ */
$(window).on('load', function () {
  $(".search-spec input").focus(function () {
      $(".search-spec").addClass("focus");
  });
  $(".search-spec input").blur(function () {
      $(".search-spec").removeClass("focus");
  });
});