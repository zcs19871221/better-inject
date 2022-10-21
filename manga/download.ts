// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly({
  name: '剑豪生死斗',
  mangaEntryUrl: 'https://www.maofly.com/manga/23757.html',
});

m.download().catch((er: any) => {
  console.error(er);
});
