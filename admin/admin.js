"use strict";

const BASE_URL = "http://localhost:3000/";

window.onload = () => {
  const logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.addEventListener("click", function () {
    window.location.replace(BASE_URL + "logout");
  });
  const videosTableBody = document.getElementById("videosTableBody");
  renderVideos(BASE_URL + "videos", videosTableBody);
};

function renderVideos(fetch_url, container) {
  let HTMLstring = "";
  container.innerHTML = `
    <div class="spinner-grow" role="status">
      <span class="sr-only"></span>
    </div>
  `;
  console.log(fetch_url);
  fetch(fetch_url)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((video) => {
        console.log(video);
        HTMLstring += `
            <tr>
                <td>${video.name}</td>
                <td>
                    <a href="${video.link}">
                        ${video.link}
                    </a>
                </td>
                <td>${video.duration}</td>
                <td>${video.created_time}</td>
                <td></td>
            </tr> 
            `;
      });
      container.innerHTML = HTMLstring;
    });
}
