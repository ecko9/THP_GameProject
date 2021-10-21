import { PageList } from "./page_list.js";

const PageDetail = (argument) => {

  const displaySimilarGames = (response) => {
    for (let i = 0; i < 4 && i < response.results.length; i++) {
      document.querySelector('.similar-games').insertAdjacentHTML('beforeend', `<div class="similar similar${response.results[i].id}"></div>`);
      document.querySelector(`.similar${response.results[i].id}`).style.backgroundImage = `url(${response.results[i].background_image})`;
      document.querySelector(`.similar${response.results[i].id}`).innerHTML = `<h3>${response.results[i].name}</h3>`;
      document.querySelector(`.similar${response.results[i].id}`).addEventListener('click', (e) => {
        PageDetail(response.results[i].id);
      })
    }
    return;
  }

  const displayScreenshots = (response, name) => {
    for (let i = 0; i < 4 && i < response.results.length; i++) {
      document.querySelector('.screenshots').insertAdjacentHTML('beforeend', `<div class="screen screen${response.results[i].id}"></div>`);
      document.querySelector(`.screen${response.results[i].id}`).style.backgroundImage = `url(${response.results[i].image})`;
    }

    fetch(`https://api.rawg.io/api/games?${process.env.APIKEY}&search=${name}`)
      .then((response2) => response2.json())
      .then((response2) => { return displaySimilarGames(response2) })
      .catch((error) => console.error('error:', error));
  }

  const displayTrailer = (response, id, name) => {
    if (response.results[0] != null || response.results[0] != undefined)
      document.querySelector(".trailer").insertAdjacentHTML('beforeend', `
      <video controls>
        <source src="${response.results[0].data['480']}" type="video/mp4">
      </video>
      `);

    fetch(`https://api.rawg.io/api/games/${id}/screenshots?${process.env.APIKEY}`)
      .then((response2) => response2.json())
      .then((response2) => { return displayScreenshots(response2, name) })
      .catch((error) => console.error('error:', error));
  }

  const displayCard = (response) => {
    let articles = document.querySelector(".page-list .articles");
    articles.innerHTML = "";
    articles.insertAdjacentHTML('beforeend', `
      <div class="bigCardGame">
        <div class="topBigCard">
        </div>
        <div class="botBigCard">
          <div class="header">
            <h1 class="titleBotBigCard">${response.name}</h1>
            <div class="rating">${response.rating} / 5 (${response.ratings_count})</div>
          </div>
          <div class="description">
            ${response.description}
          </div>
          <div class="additional-infos">
            <div class="release">
              <h2 class="addTitle">Released Date</h2>
              <p>${response.released}</p>
            </div>
            <div class="developers">
              <h2 class="addTitle">Developers</h2>
            </div>
            <div class="platforms">
              <h2 class="addTitle">Platforms</h2>
            </div>
            <div class="editors">
              <h2 class="addTitle">Editors</h2>
            </div>
          </div>
          <div class="additional-infos2">
            <div class="tags">
              <h2>Tags</h2>
            </div>
            <div class="genres">
              <h2>Genres</h2>
            </div>
          </div>
        </div>
        <div class="stores">
          <h2>Stores</h2>
        </div>
        <div class="trailer">
          <h2>Trailer</h2>
        </div>
        <div class="screenshots">
          <h2>Screenshots</h2>
        </div>
        <div class="similar-games">
          <h2>Similar Games</h2>
        </div>
      </div>
      `);
    document.querySelector(".topBigCard").style.backgroundImage = `url(${response.background_image})`;
    if (response.developers.length > 0)
      for (let value of response.developers)
        document.querySelector(".developers").insertAdjacentHTML('beforeend', `<a href="#games/${value.name}" class="int-link">${value.name}</a>`);

    if (response.publishers.length > 0)
      for (let value of response.publishers)
        document.querySelector(".editors").insertAdjacentHTML('beforeend', `<a href="#games/${value.name}" class="int-link">${value.name}</a>`);

    if (response.platforms.length > 0)
      for (let value of response.platforms)
        document.querySelector(".platforms").insertAdjacentHTML('beforeend', `<a href="#games/${value.platform.name}" class="int-link">${value.platform.name}</a>`);

    if (response.stores.length > 0)
      for (let value of response.stores)
        document.querySelector(".stores").insertAdjacentHTML('beforeend', `<a href="https://www.${value.store.domain}">${value.store.name}</a>`);

    if (response.genres.length > 0)
      for (let value of response.genres)
        document.querySelector(".genres").insertAdjacentHTML('beforeend', `<a href="#games/${value.name}" class="int-link">${value.name}</a> `);

    if (response.tags.length > 0)
      for (let value of response.tags)
        document.querySelector(".tags").insertAdjacentHTML('beforeend', `<a href="#games/${value.name}" class="int-link">${value.name}</a> `);
  }

  const displayGame = (response) => {
    displayCard(response);

    fetch(`https://api.rawg.io/api/games/${response.id}/movies?${process.env.APIKEY}`)
      .then((response1) => response1.json())
      .then((response1) => { return displayTrailer(response1, response.id, response.name) })
      .catch((error) => console.error('error:', error));
  }

  const fetchList = (url) => {
    fetch(`${url} `)
      .then((response) => response.json())
      .then((response) => { return displayGame(response) })
      .catch((error) => console.error('error:', error));
  }

  const render = () => {
    document.querySelector('.topDescription').style.display = "none";
    document.querySelector('.topSelect').style.display = "none";
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles articles-pd">...loading</div>
      </section >
  `;
    fetchList(`https://api.rawg.io/api/games/${argument}?${process.env.APIKEY}`);
  }
  render();
};

export { PageDetail };