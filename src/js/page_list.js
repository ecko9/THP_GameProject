const PageList = (argument = "", page_size = 9, platform_id = null) => {

  const displayBtnShowMore = (articles) => {
    if (page_size <= 18)
      articles.insertAdjacentHTML('beforeend', `<button id="button-show-more" type="button" name="bsm${page_size + 9}">Show More</button>`);

    if (document.querySelector("#button-show-more"))
      document.querySelector("#button-show-more").addEventListener("click", (event) => {
        PageList(argument, page_size + 9, platform_id);
      });
  }

  const displayBotCardInfo = (game) => {
    document.querySelector(`.game${game.id} .botCard`).insertAdjacentHTML('beforeend', `<div class="textBotCard"></div>`);

    if (game.platforms.length >= 1)
      for (let value of game.platforms)
        document.querySelector(`.game${game.id} .botCard .textBotCard`).innerHTML += `<div class="textPlatform">${value.platform.name}</div>`;
  }

  const displayTopCardInfo = (game, devs, editors) => {
    let urlImg = game.background_image;
    let topCard = document.querySelector(`.game${game.id} .topCard`);

    topCard.style.backgroundImage = `url(${urlImg})`;
    topCard.addEventListener('mouseenter', (event) => {
      topCard.style.backgroundImage = ``;
      topCard.innerHTML = `
        <p>Date de sortie: ${game.released}</p>
        <p>Note Globale: ${game.rating} (${game.ratings_count})</p>
        <p>Note Métacritic: ${game.metacritic}</p>
        <p>Genre(s):</p>
        `;
      for (let value of game.genres)
        topCard.innerHTML += `<p>#${value.name}</p>`;

      topCard.innerHTML += `<p>Développeurs: </p>`
      for (let value of devs)
        topCard.innerHTML += `<p>#${value.name}</p>`;

      topCard.innerHTML += `<p>Editeurs: </p>`
      for (let value of editors)
        topCard.innerHTML += `<p>#${value.name}</p>`;
    });

    topCard.addEventListener('mouseleave', (event) => {
      topCard.style.backgroundImage = `url(${urlImg})`;
      topCard.innerHTML = ``;
    });
  }
  const displayCardGame = (game) => {
    let articles = document.querySelector(".page-list .articles");
    articles.insertAdjacentHTML('beforeend', `
      <div class="cardGame game${game.id}">
        <div class="topCard">
        </div>
        <div class="botCard">
          <h1 class="titleBotCard">${game.name}</h1>
        </div>
      </div> 
      `);
    document.querySelector(`.game${game.id}`).addEventListener('click', (e) => {
      window.location.hash = `#game/${game.id}`;
    });
  }

  const displayGames = (response) => {
    let articles = document.querySelector(".page-list .articles");
    articles.innerHTML = "";

    for (let game of response.results) {
      displayCardGame(game);

      fetch(`https://api.rawg.io/api/games/${game.id}?${process.env.APIKEY}`)
        .then((response) => response.json())
        .then((response) => {
          let devs = response.developers.map(x => x);
          let editors = response.publishers.map(x => x);
          displayTopCardInfo(game, devs, editors);
          displayBotCardInfo(game);
        })
        .catch((error) => console.error('error:', error));
    }

    displayBtnShowMore(articles);
    return;
  }

  const fetchList = (url, argument) => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    let finalURL = url;

    if (cleanedArgument)
      finalURL = url + "&search=" + cleanedArgument + `&page_size=${page_size}`;

    if ((platform_id != null || platform_id != undefined) && platform_id >= 0)
      finalURL += `&platforms=${platform_id}`;

    fetch(`${finalURL}`)
      .then((response) => response.json())
      .then((response) => { return displayGames(response) })
      .catch((error) => console.error('error:', error));
  }

  const createSelectPlatform = (allPlatforms) => {
    document.querySelector('.topSelect').style.display = "";

    if (document.querySelector('#select-platform') != null || document.querySelector('#select-platform') != undefined)
      document.querySelector('#select-platform').remove();
    document.querySelector('.topSelect').insertAdjacentHTML("beforeend", `<select id="select-platform"></select>`);

    let select = document.querySelector('#select-platform');

    select.insertAdjacentHTML("beforeend", `<option value="${null}" id="no-platform">PLATEFORME</option>`);
    for (let platform of allPlatforms)
      select.insertAdjacentHTML("beforeend", `<option value="${platform.id}" id="platform${platform.id}">${platform.name}</option>`);
    select.addEventListener('change', (event) => {
      if (select.value != null || select.value != undefined)
        PageList(argument, 9, select.value);
    });
    return fetchList(`https://api.rawg.io/api/games?${process.env.APIKEY}`, argument);
  }

  const allPlatforms = () => {
    let allPlatforms = [];
    fetch(`https://api.rawg.io/api/platforms?${process.env.APIKEY}`)
      .then((response) => response.json())
      .then((response) => {
        for (let platform of response.results)
          allPlatforms.push(platform);
        return createSelectPlatform(allPlatforms);
      })
      .catch((error) => console.error('error:', error));
  }

  const render = () => {
    document.querySelector('.topDescription').style.display = "";
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles articles-pl">...loading</div>
      </section>
    `;
    allPlatforms();
  }
  render();
};

export { PageList };