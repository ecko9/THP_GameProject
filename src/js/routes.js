import { PageList } from './page_list.js';
import { PageDetail } from './page_detail.js';

const routes = {
  "": PageList,
  "games": PageList,
  "game": PageDetail,
};

export { routes };