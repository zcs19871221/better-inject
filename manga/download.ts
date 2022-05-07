// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly();

m.download('齐木楠雄的灾难', 'https://www.maofly.com/manga/13662.html').catch(
  (er: any) => {
    console.error(er);
  },
);
