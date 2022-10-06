// import { Laimanhua } from './laimanhua';

// const m = new Laimanhua(1000);
import { Maofly } from './maofly';

const m = new Maofly({
  name: '电锯人',
  mangaEntryUrl: 'https://www.maofly.com/manga/33914.html',
});

m.download().catch((er: any) => {
  console.error(er);
});
