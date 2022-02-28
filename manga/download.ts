// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly();

m.download('进击的巨人', 'https://www.maofly.com/manga/15325.html').catch(
  er => {
    console.error(er);
  },
);
