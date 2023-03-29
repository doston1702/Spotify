let doc = document;

// Spotify API post запрос для получения токена
let clientIdTokens = [
  "343a57134ca84bbfad33b93ac6c9d375",
  "780552beb61849d496f159c841f77834",
  "8ce7eaf0329446ffa0bc238e7a2f8d45",
];
let clientSecretTokens = [
  "4255e9967e5747349fb117ed89edca8a",
  "35cb6644ccba42b1805f8444b198bed7",
  "e9f4a9a3eba848ad974b38a0e252523a",
];

const clientId = clientIdTokens[0];
const clientSecret = clientSecretTokens[0];

const getToken = async () => {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
};

// Запрещаем пользователю выделять или перетаскивать картинки
let dragAllower = () => {
  let img = doc.querySelectorAll("img");
  for (let item of img) {
    item.setAttribute("draggable", false);
  }
};
setInterval(dragAllower);

// Уникальная функция для проверки: есть ли в массиве элемент?
function contains(arr, elem) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === elem) {
      return true;
    }
  }
  return false;
}

// Стилизация тега audio
let audio = doc.querySelector("#audio");
let time = doc.querySelector(".time");
let durat = doc.querySelector(".dur");
let fill_bar = doc.querySelector(".fill-bar");
let filled = doc.querySelector(".filled");
let vol_fill = doc.querySelector(".vol-fill");
let voll_inp = doc.querySelector(".vol-bar-fill");
let vol_icon = doc.querySelectorAll(".vol-icon")[2];
let trackInfo = doc.querySelector(".player-left");

let play = doc.querySelector(".play-icon");

let timeUpdate = () => {
  let seekPosition = 0;
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    fill_bar.value = seekPosition * 10;
    filled.style.width = `${seekPosition}%`;

    let seekFunc = () => {
      fill_bar.value = fill_bar.value;
      audio.currentTime = audio.duration * (fill_bar.value / 1000);
    };
    fill_bar.addEventListener("input", seekFunc);

    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }

    time.innerHTML = currentMinutes + ":" + currentSeconds;
    durat.innerHTML = durationMinutes + ":" + durationSeconds;
  } else {
    time.innerHTML = "0:00";
    durat.innerHTML = "0:00";
  }
};

let playFunc = () => {
  if (audio.src != "") {
    let audioPlay;
    if (play.getAttribute("src") == "./Images/play.png") {
      audio.play();
      timeUpdate();
      audioPlay = setInterval(function () {
        timeUpdate();
      }, 10);
    } else {
      audio.pause();
      clearInterval(audioPlay);
    }
  }
};
play.addEventListener("click", playFunc);
audio.addEventListener("play", playFunc);
audio.addEventListener("pause", playFunc);

let changeFunc = () => {
  if (audio.src != "") {
    if (play.getAttribute("src") == "./Images/play.png") {
      play.setAttribute("src", "./Images/stop.png");
    } else {
      play.setAttribute("src", "./Images/play.png");
    }
  }
};
audio.addEventListener("play", changeFunc);
audio.addEventListener("pause", changeFunc);

let volumeValue;
let volumeUpdate = () => {
  volumeValue = voll_inp.value;
  vol_fill.style.width = `${volumeValue}%`;
  audio.volume = volumeValue / 100;
};
voll_inp.addEventListener("input", volumeUpdate);
vol_icon.addEventListener("click", volumeUpdate);

let volFunc = () => {
  if (voll_inp.value != 0) {
    voll_inp.value = 0;
    vol_fill.style.width = `${0}%`;
    audio.volume = 0;
  } else {
    if (!(volumeValue <= 5)) {
      voll_inp.value = volumeValue;
      vol_fill.style.width = `${volumeValue}%`;
      audio.volume = volumeValue / 100;
    } else {
      voll_inp.value = 100;
      vol_fill.style.width = `${100}%`;
      audio.volume = 1;
    }
  }
};
vol_icon.addEventListener("click", volFunc);

setInterval(() => {
  if (audio.src == "") {
    trackInfo.style.opacity = 0;
  } else trackInfo.style.opacity = 1;
});

// Анимация при заходе на сайт
let video = doc.querySelector("#video");
let videoArr = [
  "./Videos/animation-1.mp4",
  "./Videos/animation-2.mp4",
  "./Videos/animation-3.mp4",
];
let videoRandom = Math.floor(Math.random() * videoArr.length);
video.setAttribute("src", videoArr[videoRandom]);

video.addEventListener("ended", function () {
  video.parentElement.style.opacity = 0;

  doc.querySelector(".audio-player").style.animation = `player ${1}s`;
  doc.querySelector(".aside-onleft").style.animation = `left_aside ${1}s`;
  doc.querySelector(".aside-onright").style.animation = `right_aside ${1}s`;
  doc.querySelector("main").style.animation = `main ${1}s`;

  setTimeout(() => {
    video.parentElement.remove();
  }, 300);
});

video.parentElement.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

// Функция любимые треки
let heart = doc.querySelector(".heart");
let heartCheck = () => {
  heart.style.transform = `scale(${0})`;
  setTimeout(() => {
    heart.style.transform = `scale(${1})`;

    if (heart.getAttribute("src") == "./Images/heartfill.png") {
      heart.setAttribute("src", "./Images/heart.png");
    } else heart.setAttribute("src", "./Images/heartfill.png");
  }, 200);
};
heart.addEventListener("click", heartCheck);

// Функция большое фото при нажатиии кнопки
let mainPhoto = doc.querySelector(".song-pic");
let openClose = doc.querySelector(".forward");
let bigImg = doc.querySelector(".big-img");

let openCloseFunc = () => {
  let photoWidth = mainPhoto.clientWidth;
  if (photoWidth <= 72) {
    mainPhoto.classList.add("big-photo");
    bigImg.classList.add("absolute-img");
    openClose.classList.add("rotate");
  } else if (photoWidth > 72) {
    mainPhoto.classList.remove("big-photo");
    bigImg.classList.remove("absolute-img");
    openClose.classList.remove("rotate");
  }
};
openClose.addEventListener("click", openCloseFunc);

// Полноэкранный режим сайта (fullscreen)
let elem = document.documentElement;
let bigscreen_icon = doc.querySelector(".bigscreen");

let openFullscreen = () => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
};

let closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
};

let screenLoader = () => {
  if (bigscreen_icon.getAttribute("src") == "./Images/bigscreen.png") {
    bigscreen_icon.setAttribute("src", "./Images/smallscreen.png");
    bigscreen_icon.style.filter = `invert(${100}%)`;

    openFullscreen();
  } else {
    bigscreen_icon.setAttribute("src", "./Images/bigscreen.png");
    bigscreen_icon.style.filter = `invert(${0}%)`;

    closeFullscreen();
  }
};
bigscreen_icon.addEventListener("click", screenLoader);

document.addEventListener("keydown", function (event) {
  if (event.code == "KeyO" && event.altKey) {
    screenLoader();
  }
});

// Функция миксирования песен (меняется иконка)
let mix = doc.querySelector(".mix");
let mixCheckFunc = () => {
  mix.classList.toggle("icon");
  if (mix.getAttribute("src") == "./Images/mix.svg") {
    mix.setAttribute("src", "./Images/mixgreen.svg");
  } else {
    mix.setAttribute("src", "./Images/mix.svg");
  }
};
mix.addEventListener("click", mixCheckFunc);

// Функция циклирования песен (меняется иконка)
let cycle = doc.querySelector(".cycle");
let cycleFunc = () => {
  cycle.classList.toggle("icon");
  if (cycle.getAttribute("src") == "./Images/cycle.svg") {
    cycle.setAttribute("src", "./Images/cyclegreen.svg");
    audio.setAttribute("loop", true);
  } else {
    cycle.setAttribute("src", "./Images/cycle.svg");
    audio.removeAttribute("loop");
  }
};
cycle.addEventListener("click", cycleFunc);

// Функция для страниц в aside
let menuZone = doc.querySelector(".menu-zone");
let radioInps = doc.querySelectorAll(".menu-radio");
let radioInp1 = radioInps[0];
let radioInp2 = radioInps[1];
let radioInp3 = radioInps[2];

for (let item of radioInps) {
  let rangeChecker = () => {
    if (item.checked) {
      item.parentElement.classList.add("scale");
      item.nextElementSibling.style.filter = `invert(${0}%)`;
      item.nextElementSibling.nextElementSibling.style.opacity = 1;
      item.nextElementSibling.nextElementSibling.style.fontWeight = 700;
    } else if (!item.checked) {
      item.parentElement.classList.remove("scale");
      item.nextElementSibling.style.filter = `invert(${40}%)`;
      item.nextElementSibling.nextElementSibling.style.opacity = 0.6;
      item.nextElementSibling.nextElementSibling.style.fontWeight = 600;
    }
  };
  rangeChecker();
  menuZone.addEventListener("click", rangeChecker);
}

let checkRange = () => {
  if (radioInp1.checked) {
    radioInp1.nextElementSibling.setAttribute("src", "./Images/home-fill.png");
  } else radioInp1.nextElementSibling.setAttribute("src", "./Images/home.png");
  if (radioInp2.checked) {
    radioInp2.nextElementSibling.setAttribute(
      "src",
      "./Images/search-fill.png"
    );
  } else
    radioInp2.nextElementSibling.setAttribute("src", "./Images/search.png");
  if (radioInp3.checked) {
    radioInp3.nextElementSibling.setAttribute(
      "src",
      "./Images/library-fill.png"
    );
  } else
    radioInp3.nextElementSibling.setAttribute("src", "./Images/library.png");
};
checkRange();
menuZone.addEventListener("click", checkRange);

// Swiper js
const mySwiper1 = new Swiper(".mySwiper", {
  direction: "vertical",
  slidesPerView: "auto",
  freeMode: true,
  mouseWheel: true,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
});

const mySwiper2 = new Swiper(".mySwiper2", {
  direction: "vertical",
  slidesPerView: "auto",
  freeMode: true,
  mouseWheel: true,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
});

// Функция закрытия чата друзей
let close = doc.querySelector(".close");
let right_aside = doc.querySelector(".aside-onright");
let main = doc.querySelector("main");
let header = doc.querySelector("header");

let closeFunc = () => {
  let mix_items = doc.querySelectorAll(".mix-item");

  for (let item of mix_items) {
    item.classList.add("small-item");
  }
  right_aside.style.right = `${-100}%`;
  if (main.style.width == `${71}%`) {
    main.style.width = `${93}%`;
    header.style.width = `${93}%`;
  } else {
    main.style.width = `${82}%`;
    header.style.width = `${82}%`;
  }
  setTimeout(() => {
    right_aside.classList.add("hide");
  }, 300);
};
close.addEventListener("click", closeFunc);

// Функция открытия и закрытия левого блока
let arrow = doc.querySelector(".arrow");
let left_aside = doc.querySelector(".aside-onleft");
let aside_logo = doc.querySelector(".aside-logo");
let logo = doc.querySelector(".logo");
let aside_text = doc.querySelectorAll(".aside-text");
let mySwiper = doc.querySelector(".mySwiper");
let download_btn = doc.querySelector(".download-btn");
let line = doc.querySelector(".line");

let arrowFunc = () => {
  let mix_items = doc.querySelectorAll(".mix-item");
  // Логика
  aside_logo.classList.toggle("flex-column-r");
  mySwiper.classList.toggle("hide");
  left_aside.classList.toggle("small-aside");
  line.classList.toggle("hide");

  for (let item of aside_text) {
    item.classList.toggle("hide");
  }

  let bool;
  for (let item of right_aside.classList) {
    if (item == "hide") {
      bool = true;
    } else bool = false;
  }

  for (let item of mix_items) {
    if (bool == true) {
      item.classList.toggle("small-item");
    } else item.classList.toggle("big-item");
  }

  if (arrow.style.rotate == `${180}deg`) {
    arrow.style.rotate = `${0}deg`;
    logo.setAttribute("src", "./Images/logo.svg");
    download_btn.innerHTML = "Download app";

    main.style.margin = `0 ${18}% ${112}px ${18}%`;
    header.style.left = `${18}%`;
    if (main.style.width == `${93}%`) {
      main.style.width = `${82}%`;
      header.style.width = `${82}`;
    } else {
      main.style.width = `${60}%`;
      header.style.width = `${60}`;
    }
    if (header.style.width == "71%") {
      header.style.width = "60%";
    } else if (header.style.width == "93%") {
      header.style.width = "82%";
    }
  } else {
    arrow.style.rotate = `${180}deg`;
    logo.setAttribute("src", "./Images/white-logo.png");
    download_btn.innerHTML = '<img src="./Images/download.png">';

    main.style.margin = `0 ${18}% ${112}px ${7}%`;
    header.style.left = `${7}%`;
    if (main.style.width == `${82}%`) {
      main.style.width = `${93}%`;
      header.style.width = `${93}%`;
    } else {
      main.style.width = `${71}%`;
      header.style.width = `${71}%`;
    }
  }
};
arrow.addEventListener("click", arrowFunc);

// Создаю функцию алерт, но свой стиль
let myAlert = (content, time) => {
  let alert_box = doc.createElement("div");
  alert_box.classList.add("alert");
  alert_box.style.animationDuration = time + 10 + "ms";

  let alert_content = doc.createElement("p");
  alert_content.classList.add("alert-text");
  alert_content.innerHTML = content;
  alert_box.appendChild(alert_content);

  let alert_cancel = doc.createElement("img");
  alert_cancel.classList.add("alert-cancel");
  alert_cancel.setAttribute("src", "./Images/cancel-icon.png");
  alert_box.appendChild(alert_cancel);

  main.appendChild(alert_box);

  alert_cancel.addEventListener("click", function () {
    alert_box.style.animation = "none";
    alert_box.style.top = `${-100}%`;
  });

  setTimeout(() => {
    alert_box.remove();
  }, time);
};

// Срочное удаление моего алерта
let myAlertDelete = () => {
  let alert_boxes = doc.querySelectorAll(".alert");
  for (let item of alert_boxes) {
    setTimeout(() => {
      item.remove();
    }, 100);
  }
};

// Вытаскиваем текущее время и говорим Доброе утро, день и тд.
let main_title = doc.querySelector(".main-title");
let date = new Date();
let currentHours = date.getHours();

if (currentHours <= 6) {
  main_title.innerHTML = "Good night";
} else if (currentHours <= 12 && currentHours > 6) {
  main_title.innerHTML = "Good morning";
} else if (currentHours <= 18 && currentHours > 12) {
  main_title.innerHTML = "Good afternoon";
} else if (currentHours <= 24 && currentHours > 18) {
  main_title.innerHTML = "Good evening";
}

// Меню аккаунта
let user_acc = doc.querySelector(".user-account");
let user_menu1 = doc.querySelector(".user-menu-1");

user_acc.addEventListener("click", function () {
  user_menu1.classList.toggle("hide");
});

for (let item of [
  user_acc.firstElementChild,
  user_acc.firstElementChild.nextElementSibling,
  user_acc.firstElementChild.nextElementSibling.nextElementSibling,
]) {
  item.addEventListener("click", myAlertDelete);
}

// Функция для кнопки "SEE ALL"
let see_all = doc.querySelectorAll(".see-all");
for (let item of see_all) {
  item.addEventListener("click", function () {
    item.parentElement.nextElementSibling.classList.toggle("flex-justify");
    if (item.innerHTML.toLocaleLowerCase() == "see all") {
      item.innerHTML = "close";
    } else {
      item.innerHTML = "see all";
    }
  });
}

// Функция поиска песен внутри плейлиста
let search_icon = doc.querySelector(".playlist-search");
let search_inp = doc.querySelector(".search-inp");

search_icon.addEventListener("click", function (event) {
  search_inp.classList.toggle("no-width");
  search_inp.value = "";
  playlistSearchSystem();
});
let playlistSearchSystem = () => {
  let tbody = doc.querySelector("tbody");
  for (let item of tbody.children) {
    if (search_inp.value != "") {
      if (
        item.firstElementChild.nextElementSibling.firstElementChild.lastElementChild.firstElementChild.innerHTML
          .toLocaleLowerCase()
          .replace(/ /gi, "")
          .includes(search_inp.value.toLocaleLowerCase().replace(/ /gi, "")) ||
        item.firstElementChild.nextElementSibling.firstElementChild.lastElementChild.lastElementChild.innerHTML
          .toLocaleLowerCase()
          .replace(/ /gi, "")
          .includes(search_inp.value.toLocaleLowerCase().replace(/ /gi, "")) ||
        item.firstElementChild.nextElementSibling.nextElementSibling.innerHTML
          .toLocaleLowerCase()
          .replace(/ /gi, "")
          .includes(search_inp.value.toLocaleLowerCase().replace(/ /gi, ""))
      ) {
        item.classList.remove("hide");
      } else item.classList.add("hide");
    } else item.classList.remove("hide");
  }
};
search_inp.addEventListener("input", playlistSearchSystem);

// Функция для кнопок "Назад" и "Вперёд"
let backArrow = doc.querySelector(".left-arrow");
let forthArrow = doc.querySelector(".right-arrow");
let backArray = [];
let forthArray = [];

setInterval(() => {
  let prevPageFunc = () => {
    if (backArray.length != 0) {
      setRandomBg();
      let nextObj = {
        addHide: [],
        removeHide: [],
      };
      for (let item of backArray[backArray.length - 1].addHide) {
        item.classList.add("hide");
        nextObj.removeHide.push(item);
      }
      for (let item of backArray[backArray.length - 1].removeHide) {
        item.classList.remove("hide");
        nextObj.addHide.push(item);
      }
      forthArray.push(nextObj);
      backArray.pop();
    }
  };

  if (backArray.length != 0) {
    backArrow.classList.add("active-arrow");
    backArrow.addEventListener("click", prevPageFunc);
  } else {
    backArrow.classList.remove("active-arrow");
    backArrow.removeEventListener("click", prevPageFunc);
  }

  let nextPageFunc = () => {
    if (forthArray.length != 0) {
      setRandomBg();
      let prevObj = {
        addHide: [],
        removeHide: [],
      };
      for (let item of forthArray[forthArray.length - 1].addHide) {
        item.classList.add("hide");
        prevObj.removeHide.push(item);
      }
      for (let item of forthArray[forthArray.length - 1].removeHide) {
        item.classList.remove("hide");
        prevObj.addHide.push(item);
      }
      backArray.push(prevObj);
      forthArray.pop();
    }
  };

  if (forthArray.length != 0) {
    forthArrow.classList.add("active-arrow");
    forthArrow.addEventListener("click", nextPageFunc);
  } else {
    forthArrow.classList.remove("active-arrow");
    forthArrow.removeEventListener("click", nextPageFunc);
  }
}, 100);

// Функция рандомного HEX цвета
let layer = doc.querySelector(".main-layer");
let getRandomBg = () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
};
let setRandomBg = () => {
  layer.style.backgroundImage = `linear-gradient(to bottom, #${getRandomBg()}, transparent)`;
};

// Функция удаления детей tbody в HTML
let tbodyDelFunc = () => {
  let children = doc.querySelectorAll(".playlist-tr");
  for (let item of children) {
    item.remove();
  }
};

// Регистр и вход
let form1 = doc.querySelectorAll(".signup-inp-wrap")[0];
let form2 = doc.querySelectorAll(".signup-inp-wrap")[1];
let form3 = doc.querySelectorAll(".signup-inp-wrap")[2];
let btn1 = doc.querySelector(".signup-btn");
let btn2 = doc.querySelector(".login-btn");
let preview_img = doc.querySelectorAll(".preview-img")[0];

preview_img.addEventListener("click", function () {
  form1.firstElementChild.lastElementChild.click();
});

form1.firstElementChild.lastElementChild.addEventListener(
  "change",
  function () {
    form1.firstElementChild.firstElementChild.innerHTML = "Image uploaded";

    let reader = new FileReader();
    reader.readAsDataURL(form1.firstElementChild.lastElementChild.files[0]);
    reader.onload = () => {
      preview_img.src = reader.result;
    };
  }
);

form1.addEventListener("submit", function (event) {
  event.preventDefault();

  fetch(
    `http://localhost:3300/users?username=${form1.firstElementChild.nextElementSibling.value.toLocaleLowerCase()}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length == 0) {
        myAlert("You created your account!", 3000);
        let mainID = Math.floor(Math.random() * 1000000);
        let userObj = {
          username:
            form1.firstElementChild.nextElementSibling.value.toLocaleLowerCase(),
          password:
            form1.firstElementChild.nextElementSibling.nextElementSibling.value,
          email:
            form1.firstElementChild.nextElementSibling.nextElementSibling
              .nextElementSibling.value,
          img: "",
          id: mainID,
        };
        if (form1.firstElementChild.lastElementChild.files[0]) {
          userObj.img = preview_img.getAttribute("src");
        } else {
          userObj.img = "./Images/profile-icon.png";
        }

        axios.put("http://localhost:3300/active-user", { id: userObj.id });
        axios.post("http://localhost:3300/users", userObj);

        setTimeout(getActiveUser, 100);
        form1.parentElement.parentElement.classList.add("hide");
        form2.parentElement.parentElement.classList.add("hide");
        form3.parentElement.parentElement.classList.add("hide");
      } else myAlert("Sorry, but this username already exists", 5000);
    });
});

form2.addEventListener("submit", function (event) {
  event.preventDefault();

  fetch(
    `http://localhost:3300/users?username=${form2.firstElementChild.value.toLocaleLowerCase()}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length != 0) {
        if (
          form2.firstElementChild.nextElementSibling.value == data[0].password
        ) {
          myAlert("You logged in!", 3000);
          axios.put("http://localhost:3300/active-user", { id: data[0].id });

          setTimeout(getActiveUser, 100);
          form1.parentElement.parentElement.classList.add("hide");
          form2.parentElement.parentElement.classList.add("hide");
          form3.parentElement.parentElement.classList.add("hide");
        } else myAlert(`Sorry, but password is wrong`, 5000);
      } else myAlert(`Sorry, but this username doesn't exists`, 5000);
    });
});

btn1.addEventListener("click", function () {
  form1.parentElement.parentElement.classList.toggle("hide");
});
btn2.addEventListener("click", function () {
  form2.parentElement.parentElement.classList.toggle("hide");
});

document.addEventListener("keydown", function (event) {
  if (event.code == "Escape") {
    form1.parentElement.parentElement.classList.add("hide");
    form2.parentElement.parentElement.classList.add("hide");
    form3.parentElement.parentElement.classList.add("hide");
  }
});

// Слова песни
// let artistName = "INTERWORLD";
// let trackName = "METAMORPHOSIS";

// $.ajax({
//   type: "GET",
//   data: {
//       apikey: "",
//       q_artist: artistName,
//       q_track: trackName,
//       format: "jsonp",
//       callback: "jsonp_callback"
//   },
//   url: "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
//   dataType: "jsonp",
//   jsonpCallback: 'jsonp_callback',
//   contentType: 'application/json',
//   success: function (data) {
//     console.log(data);
//   }
// })

// Получаю активного пользователя
let getActiveUser = () => {
  let btn_wrap = doc.querySelector(".btn-wrapper");
  let username = doc.querySelector(".profile-name");
  let profile_img = doc.querySelector(".profile-icon");

  fetch("http://localhost:3300/active-user")
    .then((res) => res.json())
    .then((db) => {
      if (db.id != (null && undefined)) {
        fetch(`http://localhost:3300/users/${db.id}`)
          .then((res) => res.json())
          .then((data) => {
            user_acc.classList.remove("hide");
            btn_wrap.classList.add("hide");

            username.innerHTML = data.username;
            profile_img.src = data.img;
          });
      } else {
        user_acc.classList.add("hide");
        btn_wrap.classList.remove("hide");

        username.innerHTML = "You";
        profile_img.src = "./Images/profile-icon.png";
      }
    });
};
setTimeout(getActiveUser, 100);

// Выход из аккаунта
let logout_btn = doc.querySelector(".logout-btn");
logout_btn.addEventListener("click", function () {
  myAlert(`You logged out successfully!`, 3000);
  axios.put("http://localhost:3300/active-user", {});
  setTimeout(getActiveUser, 100);
  form1.parentElement.parentElement.classList.add("hide");
  form2.parentElement.parentElement.classList.add("hide");
  form3.parentElement.parentElement.classList.add("hide");
});

// Изменение аккаунта
let profile_btn = doc.querySelector(".profile-btn");

profile_btn.addEventListener("click", function () {
  myAlertDelete();

  form3.parentElement.parentElement.classList.toggle("hide");

  fetch("http://localhost:3300/active-user")
    .then((res) => res.json())
    .then((db) => {
      fetch(`http://localhost:3300/users/${db.id}`)
        .then((res) => res.json())
        .then((data) => {
          form3.previousElementSibling.src = data.img;
          form3.firstElementChild.nextElementSibling.value = data.username;
          form3.firstElementChild.nextElementSibling.nextElementSibling.value =
            data.password;
          form3.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.value =
            data.email;
        });
    });
});

form3.firstElementChild.lastElementChild.addEventListener(
  "change",
  function () {
    form3.firstElementChild.firstElementChild.innerHTML = "Image updated";

    let reader = new FileReader();
    reader.readAsDataURL(form3.firstElementChild.lastElementChild.files[0]);
    reader.onload = () => {
      form3.previousElementSibling.src = reader.result;
    };
  }
);

form3.previousElementSibling.addEventListener("click", function () {
  form3.firstElementChild.lastElementChild.click();
});

form3.addEventListener("submit", function (event) {
  event.preventDefault();

  fetch(
    `http://localhost:3300/users?username=${form3.firstElementChild.nextElementSibling.value.toLocaleLowerCase()}`
  )
    .then((res) => res.json())
    .then((db) => {
      fetch(`http://localhost:3300/active-user`)
        .then((res) => res.json())
        .then((database) => {
          if (db.length == 0 || db[0].id == database.id) {
            myAlert("Your account was changed successfully!", 3000);

            let putObj = {
              username:
                form3.firstElementChild.nextElementSibling.value.toLocaleLowerCase(),
              password:
                form3.firstElementChild.nextElementSibling.nextElementSibling
                  .value,
              email:
                form3.firstElementChild.nextElementSibling.nextElementSibling
                  .nextElementSibling.value,
              img: form3.previousElementSibling.src,
              id: database.id,
            };
            axios.put(`http://localhost:3300/users/${database.id}`, putObj);

            setTimeout(getActiveUser, 100);
            form1.parentElement.parentElement.classList.add("hide");
            form2.parentElement.parentElement.classList.add("hide");
            form3.parentElement.parentElement.classList.add("hide");
          } else myAlert("Sorry, but this username already exists", 5000);
        });
    });
});

form3.lastElementChild.lastElementChild.addEventListener("click", function () {
  fetch("http://localhost:3300/active-user")
    .then((res) => res.json())
    .then((data) => {
      myAlert("Your account was deleted successfully!", 3000);

      axios.put(`http://localhost:3300/active-user`, {});
      axios.delete(`http://localhost:3300/users/${data.id}`);

      setTimeout(getActiveUser, 100);
      form1.parentElement.parentElement.classList.add("hide");
      form2.parentElement.parentElement.classList.add("hide");
      form3.parentElement.parentElement.classList.add("hide");
    });
});

// Функция GET запрос в Spotify API
getToken().then(function (result) {
  const accessToken = result;
  let mainContent = doc.querySelector(".main-content");
  let playlistSection = doc.querySelector(".playlist-section");
  let searchSection = doc.querySelector(".search-section");
  let mixWrap = doc.querySelector(".mixes-wrap");
  let prevBtn = doc.querySelector(".prev");
  let nextBtn = doc.querySelector(".next");
  let songImg = doc.querySelector(".song-pic");
  let songTitle = doc.querySelector(".song-name");
  let songAuthor = doc.querySelector(".song-author");
  let plWrap = doc.querySelector(".playlists-wrap");
  let playlistImage = doc.querySelector(".playlist-image");
  let playlistName = doc.querySelector(".playlist-name");
  let playlistArtists = doc.querySelector(".playlist-artists");
  let playlistType = doc.querySelector(".playlist-type");
  let playlistMoreInfo = doc.querySelector(".more-info");
  let playlistPlaygreen = doc.querySelector(".playlist-inp");
  let heart = doc.querySelector(".heart");
  let main_search = doc.querySelector(".main-search-inp");
  let header_search = doc.querySelector(".main-search");
  let category_wrap = doc.querySelector(".browse-wrap");
  let search_btn = doc.querySelector(".search-tap");
  let pages = [mainContent, playlistSection, searchSection];
  let sendArr = [];
  let favourArr = [];

  // Уникальная функция для проигрывания песен в плейлисте
  let playlistPlayFunc = (link, data, hrefs, playGreen, clickTitle) => {
    let song_index = 0;
    let playGreenFunc = () => {
      if (playGreen.checked) {
        if (data.items[song_index].track.preview_url != (null || undefined)) {
          audio.src = data.items[song_index].track.preview_url;
        } else audio.src = "./Audios/voxworker-voice-file.mp3";

        songImg.setAttribute(
          "src",
          data.items[song_index].track.album.images[0].url
        );
        songTitle.innerHTML = `<a>${data.items[song_index].track.name}</a>`;
        songAuthor.innerHTML = "";
        for (let item of data.items[song_index].track.artists) {
          songAuthor.innerHTML += `, <a>${item.name}</a>`;
        }
        songAuthor.innerHTML = songAuthor.innerHTML.replace(/\,/, "");

        play.click();
        if (play.getAttribute("src") == "./Images/stop.png") {
          audio.pause();
          playGreen.checked = false;
          play.setAttribute("src", "./Images/play.png");
        } else {
          playGreen.checked = true;
        }

        let sendObj = {
          name: data.items[song_index].track.name,
          href: data.items[song_index].track.href,
          id: data.items[song_index].track.id,
        };

        axios.get("http://localhost:3300/recently-played").then((res) => {
          if (res.data.length != 0) {
            for (let item of res.data) {
              if (item.id != sendObj.id) {
                localStorage.removeItem("sendArr");
                sendArr.push(sendObj);
                localStorage.setItem("sendArr", JSON.stringify(sendArr));
              }
            }
          } else {
            localStorage.removeItem("sendArr");
            sendArr.push(sendObj);
            localStorage.setItem("sendArr", JSON.stringify(sendArr));
          }
        });

        let favourObj = {
          name: data.items[song_index].track.name,
          href: data.items[song_index].track.href,
          id: data.items[song_index].track.id,
        };
        let favoursArray = [];

        let heartCheckFunc = () => {
          fetch("http://localhost:3300/liked-songs")
            .then((res) => res.json())
            .then((db) => {
              setTimeout(() => {
                for (let item of db) {
                  if (
                    db.length != 0 &&
                    item.id == data.items[song_index].track.id
                  ) {
                    favoursArray.push(item.id);
                  } else {
                    axios.delete(
                      `http://localhost:3300/liked-songs/${item.id}`
                    );
                  }
                }
              }, 200);
              setTimeout(() => {
                if (
                  favoursArray[favoursArray.length - 1] ==
                  data.items[song_index].track.id
                ) {
                  heart.setAttribute("src", "./Images/heartfill.png");
                } else {
                  heart.setAttribute("src", "./Images/heart.png");
                }
              }, 200);
            });
          let lightFunc = () => {
            setTimeout(() => {
              if (heart.getAttribute("src") == "./Images/heartfill.png") {
                localStorage.removeItem("favourArr");
                favourArr.push(favourObj);
                localStorage.setItem("favourArr", JSON.stringify(favourArr));
              }
            }, 100);
          };
          lightFunc();
          audio.addEventListener("ended", lightFunc);
        };
        heartCheckFunc();
        audio.addEventListener("ended", heartCheck);
      }
    };
    playGreen.addEventListener("click", playGreenFunc);

    audio.addEventListener("ended", function () {
      if (hrefs[0] == hrefs[hrefs.length - 1]) {
        if (mix.getAttribute("src") == "./Images/mix.svg") {
          song_index++;
        } else {
          song_index = Math.floor(Math.random() * data.items.length);
        }
      } else {
        song_index = 0;
        hrefs.splice(0, hrefs.length);
      }

      if (song_index >= data.items.length - 1) {
        song_index = 0;
      }
      playGreenFunc();
    });

    let nextSongFunc = () => {
      if (song_index < data.items.length - 1) {
        audio.currentTime = audio.duration;
      } else song_index = 0;
    };
    nextBtn.addEventListener("click", nextSongFunc);

    let prevSongFunc = () => {
      if (song_index > 0) {
        song_index -= 2;
      } else song_index = data.items.length - 1;
      audio.currentTime = audio.duration;
    };
    prevBtn.addEventListener("click", prevSongFunc);

    document.addEventListener("keydown", function (event) {
      if (event.code == "MediaTrackPrevious") {
        prevSongFunc();
      } else if (event.code == "MediaTrackNext") {
        nextSongFunc();
      }
    });

    clickTitle.addEventListener("click", function () {
      playlistPageFunc(link, data, playGreen);
    });
  };

  // Уникальная функция для страницы плейлиста
  let playlistPageFunc = (link, data, playgreen) => {
    tbodyDelFunc();
    setRandomBg();
    mainContent.classList.add("hide");
    playlistSection.classList.remove("hide");
    let tbody = doc.querySelector("tbody");

    let prevObj = {
      removeHide: [mainContent],
      addHide: [playlistSection],
    };
    backArray.push(prevObj);

    playlistImage.setAttribute("src", link.images[0].url);
    if (link.name.length > 8) {
      playlistName.innerHTML = `${link.name.slice(0, 7)}...`;
    } else playlistName.innerHTML = link.name;
    playlistArtists.innerHTML = link.owner.display_name;
    if (link.public == true) {
      playlistType.innerHTML = "PUBLIC PLAYLIST";
    } else if (link.public == false) {
      playlistType.innerHTML = "PRIVATE PLAYLIST";
    } else playlistType.innerHTML = "PUBLIC OR PRIVATE PLAYLIST";
    playlistMoreInfo.firstElementChild.innerHTML = `Made for <span>${
      doc.querySelector(".profile-name").innerHTML
    }</span>`;
    playlistMoreInfo.lastElementChild.innerHTML = `${link.tracks.total} songs`;

    if (playgreen.checked) {
      playlistPlaygreen.checked = true;
    }
    playlistPlaygreen.addEventListener("click", function () {
      playgreen.click();
    });

    let i = 0;
    for (let item of data.items) {
      i++;

      let tr = doc.createElement("tr");
      tr.classList.add("playlist-tr");
      if (i == 1) {
        tr.classList.add("top-tr");
      } else tr.classList.add("normal-tr");

      let number_th = doc.createElement("th");
      number_th.innerHTML = i;
      number_th.classList.add("number");
      tr.appendChild(number_th);

      let title_th = doc.createElement("th");
      title_th.classList.add("title-th");
      tr.appendChild(title_th);

      let playlist_info = doc.createElement("div");
      playlist_info.classList.add("playlist-song-info");
      title_th.appendChild(playlist_info);

      let title_img = doc.createElement("img");
      title_img.src = item.track.album.images[0].url;
      title_img.classList.add("title-img");
      playlist_info.appendChild(title_img);

      let playlist_text = doc.createElement("div");
      playlist_text.classList.add("playlist-song-text");
      playlist_info.appendChild(playlist_text);

      let playlist_title = doc.createElement("p");
      playlist_title.innerHTML = item.track.name;
      playlist_title.classList.add("playlist-song-title");
      playlist_text.appendChild(playlist_title);

      let playlist_artists = doc.createElement("p");
      playlist_artists.classList.add("playlist-song-artists");
      for (let item2 of item.track.artists) {
        playlist_artists.innerHTML += `, ${item2.name}`;
      }
      playlist_artists.innerHTML = playlist_artists.innerHTML.replace(/\,/, "");
      playlist_text.appendChild(playlist_artists);

      let album_name = doc.createElement("th");
      album_name.classList.add("album-name");
      album_name.innerHTML = item.track.album.name;
      tr.appendChild(album_name);

      let date_added = doc.createElement("th");
      date_added.classList.add("date-added");
      date_added.innerHTML = item.added_at.match(/........../).join("");
      tr.appendChild(date_added);

      let favourite_checker = doc.createElement("th");
      favourite_checker.classList.add("favourite");
      setTimeout(() => {
        fetch("http://localhost:3300/liked-songs")
          .then((res) => res.json())
          .then((database) => {
            if (database.length != 0) {
              for (let item2 of database) {
                if (item2.id == item.id) {
                  let favourite_img = doc.createElement("img");
                  favourite_img.setAttribute("src", "./Images/heartfill.png");
                  favourite_checker.appendChild(favourite_img);
                }
              }
            }
          });
      }, 100);
      tr.appendChild(favourite_checker);

      let song_duration = doc.createElement("th");
      song_duration.classList.add("playlist-song-duration");
      let song_minutes = Math.floor(item.track.duration_ms / 60000);
      let song_seconds = Math.floor((item.track.duration_ms / 1000) % 60);
      if (song_seconds < 10) {
        song_seconds = `0${song_seconds}`;
      }
      song_duration.innerHTML = `${song_minutes} : ${song_seconds}`;
      tr.appendChild(song_duration);

      let song_menu = doc.createElement("th");
      song_menu.classList.add("song-menu");
      song_menu.innerHTML = `
        <div class="menu-wrap">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="user-menu user-menu-2 hide">
          <div class="u-item">
            <p class="u-text">Add to queue</p>
          </div>
          <hr class="line">
          <div class="u-item">
            <p class="u-text">Go to song radio</p>
          </div>
          <div class="u-item">
            <p class="u-text">Go to artist</p>
            <img src="./Images/bottom-arrow.png" class="u-arrow" />
          </div>
          <div class="u-item">
            <p class="u-text">Go to album</p>
          </div>
          <div class="u-item">
            <p class="u-text">Report</p>
          </div>
          <div class="u-item">
            <p class="u-text">Show credits</p>
          </div>
          <hr class="line">
          <div class="u-item">
            <p class="u-text">Save to your Liked Songs</p>
          </div>
          <div class="u-item">
            <p class="u-text">Add to playlist</p>
            <img src="./Images/bottom-arrow.png" class="u-arrow" />
          </div>
          <hr class="line">
          <div class="u-item">
            <p class="u-text">Share</p>
            <img src="./Images/bottom-arrow.png" class="u-arrow" />
          </div>
        </div>
      `;
      tr.appendChild(song_menu);

      song_menu.addEventListener("click", function () {
        song_menu.lastElementChild.classList.toggle("hide");
      });

      song_menu.lastElementChild.addEventListener("click", function () {
        myAlert(`Sorry, but this is not available yet`, 5000);
      });

      tbody.appendChild(tr);

      let oldNum = number_th.innerHTML;
      tr.addEventListener("mouseenter", function () {
        if (!isNaN(number_th.innerHTML)) {
          number_th.innerHTML = `<img src="./Images/play-white.png" class="play-white">`;
        } else {
          number_th.innerHTML = `<img src="./Images/stop-white.png" class="play-white">`;
        }
      });

      tr.addEventListener("mouseleave", function () {
        if (
          number_th.firstElementChild.getAttribute("src") ==
          "./Images/stop-white.png"
        ) {
          number_th.innerHTML = `
        <div class="playing-boxes">
          <div class="col column-1"></div>
          <div class="col column-2"></div>
          <div class="col column-3"></div>
          <div class="col column-4"></div>
        </div>
      `;
        } else {
          number_th.innerHTML = oldNum;
        }
      });

      let checkFunc = () => {
        if (audio.src == item.track.preview_url) {
          playlist_title.classList.add("active-title");
          number_th.innerHTML = `
          <div class="playing-boxes">
            <div class="col column-1"></div>
            <div class="col column-2"></div>
            <div class="col column-3"></div>
            <div class="col column-4"></div>
          </div>
        `;
        } else {
          playlist_title.classList.remove("active-title");
          number_th.innerHTML = oldNum;
        }
      };
      playlistPlaygreen.addEventListener("click", checkFunc);
      playgreen.addEventListener("click", checkFunc);
      audio.addEventListener("ended", checkFunc);
    }
  };

  // Создаю первые 6 элементов через цикл на свой HTML
  fetch("https://api.spotify.com/v1/browse/categories?limit=50", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      for (let i = 0; i < 6; i++) {
        fetch(`${res.categories.items[i].href}/playlists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            let num = Math.floor(Math.random() * data.playlists.items.length);

            if (
              data.playlists.items[num] == (null || undefined) ||
              data.playlists.items == (null || undefined) ||
              data.playlists == (null || undefined)
            ) {
              num = Math.floor(Math.random() * data.playlists.items.length);
            }

            let mixItem = doc.createElement("div");
            mixItem.classList.add("mix-item");

            let mixImg = doc.createElement("img");
            mixImg.classList.add("mix-img");
            mixImg.src = data.playlists.items[num].images[0].url;
            mixItem.appendChild(mixImg);

            let mixTitle = doc.createElement("p");
            mixTitle.classList.add("mix-title");
            mixTitle.innerHTML = data.playlists.items[num].name;
            mixItem.appendChild(mixTitle);

            let playGreen = doc.createElement("input");
            playGreen.setAttribute("type", "radio");
            playGreen.setAttribute("name", "playgreen");
            playGreen.classList.add("play-green");
            mixItem.appendChild(playGreen);

            mixWrap.appendChild(mixItem);

            let hrefs = [];
            fetch(data.playlists.items[num].tracks.href, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            })
              .then((res) => res.json())
              .then((db) => {
                playlistPlayFunc(
                  data.playlists.items[num],
                  db,
                  hrefs,
                  playGreen,
                  mixTitle
                );
              });
          });
      }

      // GET запрос для миксов
      // Сначала создаём уникальную функцию
      let mixGetRequest = (wrap, cat_num) => {
        let hrefs = [];
        fetch(`${res.categories.items[cat_num].href}/playlists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            for (let item of data.playlists.items) {
              if (item != null) {
                let playItem = doc.createElement("div");
                playItem.classList.add("play-item");

                let playImgBox = doc.createElement("div");
                playImgBox.classList.add("play-img");
                playItem.appendChild(playImgBox);

                let playImg = doc.createElement("img");
                playImg.src = item.images[item.images.length - 1].url;
                playImgBox.appendChild(playImg);

                let playMixgreen = doc.createElement("input");
                playMixgreen.setAttribute("type", "radio");
                playMixgreen.setAttribute("name", "playgreen");
                playMixgreen.classList.add("play-mixgreen");
                playImgBox.appendChild(playMixgreen);

                let playName = doc.createElement("h3");
                playName.classList.add("play-name");
                playName.innerHTML = item.name;
                playItem.appendChild(playName);

                let playArtist = doc.createElement("h3");
                playArtist.classList.add("play-artist");
                playArtist.innerHTML = item.owner.display_name;
                playItem.appendChild(playArtist);

                wrap.appendChild(playItem);

                fetch(`${item.href}/tracks`, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
                  },
                })
                  .then((res) => res.json())
                  .then((db) => {
                    playlistPlayFunc(item, db, hrefs, playMixgreen, playName);
                  });
              }
            }
          });
      };

      // Запускаем эту функцию
      let wrap1 = doc.querySelector(".wrap-1");
      let wrap2 = doc.querySelector(".wrap-2");
      let wrap4 = doc.querySelector(".wrap-4");
      let wrap6 = doc.querySelector(".wrap-6");
      mixGetRequest(wrap1, 8);
      mixGetRequest(wrap2, 6);
      mixGetRequest(wrap4, 4);
      mixGetRequest(wrap6, 0);

      // Функция кнопки "домой"
      let homepage_btn = doc.querySelector(".homepage");
      let homepageFunc = () => {
        if (contains(mainContent.classList, "hide")) {
          mainContent.classList.remove("hide");
          header_search.classList.add("hide");

          let arrowObj = {
            addHide: [mainContent],
            removeHide: [],
          };

          for (let item of pages) {
            if (item != mainContent) {
              if (!contains(item.classList, "hide")) {
                item.classList.add("hide");
                if (item == searchSection) {
                  arrowObj.removeHide.push(header_search);
                }
                arrowObj.removeHide.push(item);
              }
            }
          }

          backArray.push(arrowObj);
        }
      };
      homepage_btn.addEventListener("click", homepageFunc);

      let clickArrow = () => {
        setTimeout(() => {
          if (!contains(mainContent.classList, "hide")) {
            homepage_btn.firstElementChild.click();
          } else if (!contains(searchSection.classList, "hide")) {
            search_btn.firstElementChild.click();
          }
        }, 100);
      };
      backArrow.addEventListener("click", clickArrow);
      forthArrow.addEventListener("click", clickArrow);

      // Засовываем категории в поиск
      search_btn.addEventListener("click", function () {
        searchSection.classList.remove("hide");
        header_search.classList.remove("hide");

        let arrowObj = {
          addHide: [header_search, searchSection],
          removeHide: [],
        };

        for (let item of pages) {
          if (item != searchSection) {
            if (!contains(item.classList, "hide")) {
              item.classList.add("hide");
              arrowObj.removeHide.push(item);
            }
          }
        }

        backArray.push(arrowObj);

        if (category_wrap.children.length == 0) {
          for (let item of res.categories.items) {
            let browse_item = doc.createElement("div");
            browse_item.classList.add("browse-item");
            setTimeout(() => {
              browse_item.style.backgroundColor = `#${getRandomBg()}`;
            }, 200);

            let browse_name = doc.createElement("h3");
            browse_name.classList.add("browse-name");
            browse_name.innerHTML = item.name;
            browse_item.appendChild(browse_name);

            let browse_img = doc.createElement("img");
            browse_img.classList.add("browse-img");
            browse_img.src = item.icons[0].url;
            browse_item.appendChild(browse_img);

            category_wrap.appendChild(browse_item);
          }
        }
      });

      // Поиск песен в Spotify API
      let artist_result = doc.querySelector(".artist-result");
      let album_result = doc.querySelector(".album-result");
      let playlist_result = doc.querySelector(".playlist-result");
      let track_result = doc.querySelector(".track-result");

      let mainSearchSystem = () => {
        if (main_search.value != "") {
          searchSection.firstElementChild.classList.remove("hide");
          searchSection.lastElementChild.classList.add("hide");

          fetch(
            `https://api.spotify.com/v1/search?q=${main_search.value}&type=album,artist,playlist,track&limit=20&offset=0`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            }
          )
            .then((res) => res.json())
            .then((data) => {
              // Создаём элементы поиска с помощью уникальной функции
              let createFunc = (database, wrap, classGive) => {
                for (let item of doc.querySelectorAll(`.${classGive}`)) {
                  item.remove()
                }
                console.log(database);
                let hrefs = [];
                for (let item of database) {
                  if (item != (null && undefined)) {
                    wrap.parentElement.classList.remove('hide')
                    let playItem = doc.createElement("div");
                    playItem.classList.add("play-item");
                    playItem.classList.add(classGive)

                    let playImgBox = doc.createElement("div");
                    playImgBox.classList.add("play-img");
                    playItem.appendChild(playImgBox);

                    let playImg = doc.createElement("img");
                    if (database != data.tracks.items) {
                      if (item != (null && undefined)) {
                        playImg.src = item.images[0].url;
                      } else playImg.src = "../Images/example-mix.png"
                    } else {
                      if (item != (null && undefined)) {
                        playImg.src = item.album.images[0].url;
                      } else playImg.src = "../Images/example-mix.png"
                    }
                    playImgBox.appendChild(playImg);

                    let playMixgreen = doc.createElement("input");
                    playMixgreen.setAttribute("type", "radio");
                    playMixgreen.setAttribute("name", "playgreen");
                    playMixgreen.classList.add("play-mixgreen");
                    playImgBox.appendChild(playMixgreen);

                    let playName = doc.createElement("h3");
                    playName.classList.add("play-name");
                    playName.innerHTML = item.name;
                    playItem.appendChild(playName);

                    let playArtist = doc.createElement("h3");
                    playArtist.classList.add("play-artist");
                    if (
                      database == data.albums.items ||
                      database == data.tracks.items
                    ) {
                      for (let item2 of item.artists) {
                        playArtist.innerHTML += `, <a>${item2.name}</a>`;
                      }
                    } else if (database == data.playlists.items) {
                      playArtist.innerHTML = item.owner.display_name;
                    } else if (database == data.artists.items) {
                      for (let item2 of item.genres) {
                        playArtist.innerHTML = `, <a>${item2}</a>`;
                      }
                    }
                    playArtist.innerHTML = playArtist.innerHTML.replace(
                      /\,/,
                      ""
                    );
                    playItem.appendChild(playArtist);

                    wrap.appendChild(playItem);

                    if (
                      database != data.tracks.items &&
                      database != data.artists.items
                    ) {
                      fetch(`${item.href}/tracks`, {
                        method: "GET",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + accessToken,
                        },
                      })
                        .then((res) => res.json())
                        .then((db) => {
                          playlistPlayFunc(
                            item,
                            db,
                            hrefs,
                            playMixgreen,
                            playName
                          );
                        });
                    } else if (database == data.tracks.items) {
                      let trackPlayFunc = () => {
                        if (item.preview_url != (null || undefined)) {
                          audio.src = item.preview_url;
                        } else audio.src = "./Audios/voxworker-voice-file.mp3";

                        songTitle.innerHTML = `<a>${playName.innerHTML}</a>`;
                        songAuthor.innerHTML = playArtist.innerHTML;
                        songImg.src = playImg.getAttribute("src");

                        play.click();
                        if (play.getAttribute("src") == "./Images/stop.png") {
                          audio.pause();
                          playMixgreen.checked = false;
                          play.setAttribute("src", "./Images/play.png");
                        } else {
                          playMixgreen.checked = true;
                        }
                      };
                      playMixgreen.addEventListener("click", trackPlayFunc);
                    }
                  } else {
                    wrap.parentElement.classList.add('hide')
                  }
                }
              };
              createFunc(data.albums.items, album_result.lastElementChild, "album_item");
              createFunc(
                data.playlists.items,
                playlist_result.lastElementChild,
                "playlist_item"
              );
              createFunc(data.tracks.items, track_result.lastElementChild, "track_item");
              createFunc(data.artists.items, artist_result.lastElementChild, "artist_item");
            });
        } else {
          main_search.focus();
          searchSection.firstElementChild.classList.add("hide");
          searchSection.lastElementChild.classList.remove("hide");
        }
      };
      main_search.previousElementSibling.addEventListener(
        "click",
        mainSearchSystem
      );
      main_search.addEventListener("click", function () {
        setTimeout(() => {
          mainSearchSystem();
        }, 100);
      });
      main_search.addEventListener("keydown", function (event) {
        if (event.code == "Enter") {
          mainSearchSystem();
        }
      });
    });

  // Получаем с localStorage прослушанные пользователем песни чтобы закинуть их в localhost
  let sendItems = JSON.parse(localStorage.getItem("sendArr"));
  setTimeout(() => {
    if (
      localStorage.getItem("sendArr") != (null && undefined) &&
      sendItems.length != 0
    ) {
      for (let item of sendItems) {
        axios.post("http://localhost:3300/recently-played", item);
      }
      localStorage.removeItem("sendArr");
    }
  }, 100);

  // Получаем с localStorage любимые песни чтобы закинуть их в localhost
  let favours = JSON.parse(localStorage.getItem("favourArr"));
  setTimeout(() => {
    if (
      localStorage.getItem("favourArr") != (null && undefined) &&
      favours.length != 0
    ) {
      for (let item of favours) {
        axios.post("http://localhost:3300/liked-songs", item);
      }
      localStorage.removeItem("favourArr");
    }
  }, 100);

  // Получаем недавно прослушанные песни с localhost
  let wrap3 = doc.querySelector(".wrap-3");
  fetch("http://localhost:3300/recently-played")
    .then((res) => res.json())
    .then((data) => {
      if (data.length != 0) {
        wrap3.previousElementSibling.classList.remove("hide");
        wrap3.classList.remove("hide");
        let songsLimit = 20;

        for (let i = songsLimit - 1; i > -1; i--) {
          if (data[i] != (undefined && null)) {
            fetch(data[i].href, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            })
              .then((res) => res.json())
              .then((db) => {
                let playItem = doc.createElement("div");
                playItem.classList.add("play-item");

                let playImgBox = doc.createElement("div");
                playImgBox.classList.add("play-img");
                playItem.appendChild(playImgBox);

                let playImg = doc.createElement("img");
                playImg.src = db.album.images[0].url;
                playImgBox.appendChild(playImg);

                let playMixgreen = doc.createElement("input");
                playMixgreen.setAttribute("type", "radio");
                playMixgreen.setAttribute("name", "playgreen");
                playMixgreen.classList.add("play-mixgreen");
                playImgBox.appendChild(playMixgreen);

                let playName = doc.createElement("h3");
                playName.classList.add("play-name");
                playName.innerHTML = `<a>${db.name}</a>`;
                playItem.appendChild(playName);

                let playArtist = doc.createElement("h3");
                playArtist.classList.add("play-artist");
                for (let item2 of db.artists) {
                  playArtist.innerHTML += `, <a>${item2.name}</a>`;
                }
                playArtist.innerHTML = playArtist.innerHTML.replace(/\,/, "");
                playItem.appendChild(playArtist);

                wrap3.appendChild(playItem);

                playMixgreen.addEventListener("click", function () {
                  if (cycle.getAttribute("src") == "./Images/cycle.svg") {
                    cycle.click();
                  }
                  if (playMixgreen.checked) {
                    if (db.preview_url != (null || undefined)) {
                      audio.src = db.preview_url;
                    } else audio.src = "./Audios/voxworker-voice-file.mp3";

                    songImg.setAttribute("src", db.album.images[0].url);
                    songTitle.innerHTML = `<a>${db.name}</a>`;
                    songAuthor.innerHTML = "";
                    for (let item of db.artists) {
                      songAuthor.innerHTML += `, ${item.name}`;
                    }
                    songAuthor.innerHTML = songAuthor.innerHTML.replace(
                      /./,
                      ""
                    );

                    play.click();
                    if (play.getAttribute("src") == "./Images/stop.png") {
                      audio.pause();
                      playMixgreen.checked = false;
                      play.setAttribute("src", "./Images/play.png");
                    } else {
                      playMixgreen.checked = true;
                    }
                  }
                });
              });
          }
        }
      } else {
        wrap3.previousElementSibling.classList.add("hide");
        wrap3.classList.add("hide");
      }
    });

  // Получаем любимые песни с localhost
  let favor = doc.querySelectorAll(".creater")[1];
  let favorSongFunc = () => {
    fetch("http://localhost:3300/liked-songs")
      .then((res) => res.json())
      .then((data) => {
        let song_index = 0;
        mainContent.classList.add("hide");
        playlistSection.classList.remove("hide");

        let prevObj = {
          removeHide: [mainContent],
          addHide: [playlistSection],
        };
        backArray.push(prevObj);

        let favPlayFunc = () => {
          fetch(data[song_index].href, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          })
            .then((res) => res.json())
            .then((db) => {
              if (playlistPlaygreen.checked) {
                songImg.src = db.album.images[0].url;
                songTitle.innerHTML = `<a>${db.name}</a>`;
                songAuthor.innerHTML = "";
                for (let item of db.artists) {
                  songAuthor.innerHTML += `, <a>${item.name}</a>`;
                }
                songAuthor.innerHTML = songAuthor.innerHTML.replace(/\,/gi, "");
                audio.src = db.preview_url;
                play.click();
              } else {
                audio.pause();
              }
            });
        };
        playlistPlaygreen.addEventListener("click", favPlayFunc);

        audio.addEventListener("ended", function () {
          song_index++;
          favPlayFunc();
        });

        let prevSongFunc = () => {
          if (song_index > 0) {
            song_index -= 2;
          } else song_index = 0;
        };
        prevBtn.addEventListener("click", prevSongFunc);

        document.addEventListener("keydown", function (event) {
          if (event.code == "MediaTrackPrevious") {
            prevSongFunc();
          }
        });

        playlistImage.setAttribute("src", "./Images/liked-cover.png");
        playlistName.innerHTML = "Liked Songs";
        playlistType.innerHTML = "PUBLIC PLAYLIST";
        playlistMoreInfo.firstElementChild.innerHTML = `<img src="${doc
          .querySelector(".profile-icon")
          .getAttribute("src")}"> <span>${
          doc.querySelector(".profile-name").innerHTML
        }</span>`;
        playlistMoreInfo.lastElementChild.innerHTML = `${data.length} songs`;
        tbodyDelFunc();
        setRandomBg();

        let ind = 0;
        let tbody = doc.querySelector("tbody");
        for (item of data) {
          fetch(item.href, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          })
            .then((res) => res.json())
            .then((item) => {
              ind++;

              let tr = doc.createElement("tr");
              tr.classList.add("playlist-tr");
              if (ind == 1) {
                tr.classList.add("top-tr");
              } else tr.classList.add("normal-tr");

              let number_th = doc.createElement("th");
              number_th.innerHTML = ind;
              number_th.classList.add("number");
              tr.appendChild(number_th);

              let title_th = doc.createElement("th");
              title_th.classList.add("title-th");
              tr.appendChild(title_th);

              let playlist_info = doc.createElement("div");
              playlist_info.classList.add("playlist-song-info");
              title_th.appendChild(playlist_info);

              let title_img = doc.createElement("img");
              title_img.src = item.album.images[0].url;
              title_img.classList.add("title-img");
              playlist_info.appendChild(title_img);

              let playlist_text = doc.createElement("div");
              playlist_text.classList.add("playlist-song-text");
              playlist_info.appendChild(playlist_text);

              let playlist_title = doc.createElement("p");
              playlist_title.innerHTML = item.name;
              playlist_title.classList.add("playlist-song-title");
              playlist_text.appendChild(playlist_title);

              let playlist_artists = doc.createElement("p");
              playlist_artists.classList.add("playlist-song-artists");
              for (let item2 of item.artists) {
                playlist_artists.innerHTML += `, ${item2.name}`;
              }
              playlist_artists.innerHTML = playlist_artists.innerHTML.replace(
                /\,/,
                ""
              );
              playlist_text.appendChild(playlist_artists);

              let album_name = doc.createElement("th");
              album_name.classList.add("album-name");
              album_name.innerHTML = item.album.name;
              tr.appendChild(album_name);

              let date_added = doc.createElement("th");
              date_added.classList.add("date-added");
              date_added.innerHTML = item.album.release_date
                .match(/........../)
                .join("");
              tr.appendChild(date_added);

              let favourite_checker = doc.createElement("th");
              favourite_checker.classList.add("favourite");
              fetch("http://localhost:3300/liked-songs")
                .then((res) => res.json())
                .then((database) => {
                  if (database.length != 0) {
                    for (let item2 of database) {
                      if (item2.id == item.id) {
                        let favourite_img = doc.createElement("img");
                        favourite_img.setAttribute(
                          "src",
                          "./Images/heartfill.png"
                        );
                        favourite_checker.appendChild(favourite_img);
                      }
                    }
                  }
                });
              tr.appendChild(favourite_checker);

              let song_duration = doc.createElement("th");
              song_duration.classList.add("playlist-song-duration");
              let song_minutes = Math.floor(item.duration_ms / 60000);
              let song_seconds = Math.floor((item.duration_ms / 1000) % 60);
              if (song_seconds < 10) {
                song_seconds = `0${song_seconds}`;
              }
              song_duration.innerHTML = `${song_minutes} : ${song_seconds}`;
              tr.appendChild(song_duration);

              let song_menu = doc.createElement("th");
              song_menu.classList.add("song-menu");
              song_menu.innerHTML = `
                <div class="menu-wrap">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <div class="user-menu user-menu-2 hide">
                  <div class="u-item">
                    <p class="u-text">Add to queue</p>
                  </div>
                  <hr class="line">
                  <div class="u-item">
                    <p class="u-text">Go to song radio</p>
                  </div>
                  <div class="u-item">
                    <p class="u-text">Go to artist</p>
                    <img src="./Images/bottom-arrow.png" class="u-arrow" />
                  </div>
                  <div class="u-item">
                    <p class="u-text">Go to album</p>
                  </div>
                  <div class="u-item">
                    <p class="u-text">Report</p>
                  </div>
                  <div class="u-item">
                    <p class="u-text">Show credits</p>
                  </div>
                  <hr class="line">
                  <div class="u-item">
                    <p class="u-text">Save to your Liked Songs</p>
                  </div>
                  <div class="u-item">
                    <p class="u-text">Add to playlist</p>
                    <img src="./Images/bottom-arrow.png" class="u-arrow" />
                  </div>
                  <hr class="line">
                  <div class="u-item">
                    <p class="u-text">Share</p>
                    <img src="./Images/bottom-arrow.png" class="u-arrow" />
                  </div>
                </div>
              `;
              tr.appendChild(song_menu);

              song_menu.addEventListener("click", function () {
                song_menu.lastElementChild.classList.toggle("hide");
              });

              song_menu.lastElementChild.addEventListener("click", function () {
                myAlert(`Sorry, but this is not available yet`, 5000);
              });

              tbody.appendChild(tr);

              let oldNum = number_th.innerHTML;
              tr.addEventListener("mouseenter", function () {
                if (!isNaN(number_th.innerHTML)) {
                  number_th.innerHTML = `<img src="./Images/play-white.png" class="play-white">`;
                } else {
                  number_th.innerHTML = `<img src="./Images/stop-white.png" class="play-white">`;
                }
              });

              tr.addEventListener("mouseleave", function () {
                if (
                  number_th.firstElementChild.getAttribute("src") ==
                  "./Images/stop-white.png"
                ) {
                  number_th.innerHTML = `
                    <div class="playing-boxes">
                      <div class="col column-1"></div>
                      <div class="col column-2"></div>
                      <div class="col column-3"></div>
                      <div class="col column-4"></div>
                    </div>
                  `;
                } else {
                  number_th.innerHTML = oldNum;
                }
              });

              let checkFunc = () => {
                if (audio.src == item.preview_url) {
                  playlist_title.classList.add("active-title");
                  number_th.innerHTML = `
                    <div class="playing-boxes">
                      <div class="col column-1"></div>
                      <div class="col column-2"></div>
                      <div class="col column-3"></div>
                      <div class="col column-4"></div>
                    </div>
                  `;
                } else {
                  playlist_title.classList.remove("active-title");
                  number_th.innerHTML = oldNum;
                }
              };
              playlistPlaygreen.addEventListener("click", checkFunc);
              audio.addEventListener("ended", checkFunc);
            });
        }
      });
  };
  favor.addEventListener("click", favorSongFunc);
});
AOS.init();
