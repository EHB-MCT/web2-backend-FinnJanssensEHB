"use strict";

const BASE_URL = "https://airbox-backend.herokuapp.com/";

window.onload = () => {
  const logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.addEventListener("click", function () {
    window.location.replace(BASE_URL + "logout");
  });
  const videosTableBody = document.getElementById("videosTableBody");
  let featuredVideos;
  getFeaturedVideos().then((featured) => {
    featuredVideos = featured;
    renderVideos(videosTableBody, featuredVideos);
  });
};

function renderVideos(container, featuredVideos) {
  let HTMLstring = "";
  let favoriteHTML = "";
  container.innerHTML = `
    <div class="spinner-grow" role="status">
      <span class="sr-only"></span>
    </div>
  `;
  fetch(BASE_URL + "Videos", {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Content-Security-Policy": "upgrade-insecure-requests",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((video) => {
        favoriteHTML = isVideoFeatured(video, featuredVideos);
        HTMLstring += `
            <tr id=${video.link}>
                <td>${video.name}</td>
                <td>
                    <a href="${video.link}">
                        ${video.link}
                    </a>
                </td>
                <td>${video.duration}</td>
                <td>${video.created_time}</td>
                <td><i class="bi ${favoriteHTML} featuredBtn"></i></td>
            </tr> 
            `;
      });
      container.innerHTML = HTMLstring;
    })
    .then(function () {
      let featuredButtons = document.getElementsByClassName("featuredBtn");
      [...featuredButtons].forEach((btn) => {
        btn.addEventListener("click", function (e) {
          let id = String(e.target.closest("tr").id).substring(18);
          console.log(id);
          fetch(BASE_URL + `featured/${id}`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Content-Security-Policy": "upgrade-insecure-requests",
            },
          }).then(function () {
            getFeaturedVideos().then((featured) => {
              featuredVideos = featured;
              renderVideos(videosTableBody, featuredVideos);
            });
          });
        });
      });
    });
}

async function getFeaturedVideos() {
  const response = await fetch(BASE_URL + "featured");
  const data = await response.json();
  return data;
}

function isVideoFeatured(video, featuredVideos) {
  let favorite;
  for (let i = 0; i < featuredVideos.length; i++) {
    if (featuredVideos[i].link == video.link) {
      favorite = true;
      break;
    } else {
      favorite = false;
    }
  }
  if (favorite) {
    return "bi-star-fill";
  } else {
    return "bi-star";
  }
}
