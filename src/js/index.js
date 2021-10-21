import '../sass/style.scss';
import { routes } from './routes.js';


let pageArgument;
let form = document.querySelector('#form1');

const setRoute = () => {
  let path = window.location.hash.substring(1).split("/");
  pageArgument = path[1] || "";

  let pageContent = document.getElementById("pageContent");
  routes[path[0]](pageArgument);
  return true;
};

window.addEventListener("hashchange", () => setRoute());
window.addEventListener("DOMContentLoaded", () => setRoute());
form.addEventListener("submit", (event) => {
  event.preventDefault();
  window.location.hash = "#games/" + document.querySelector('#search').value;
});