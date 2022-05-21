// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly(50);

m.download('GIGANT', 'https://www.maofly.com/manga/41088.html').catch(
  (er: any) => {
    console.error(er);
  },
);
