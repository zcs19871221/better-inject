// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly({
  name: '炎拳',
  mangaEntryUrl: 'https://www.maofly.com/manga/31203.html',
});

m.download().catch((er: any) => {
  console.error(er);
});
