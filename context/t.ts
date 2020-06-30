import Context from './context';

const c = new Context({ scanFiles: 'test/*_r.ts' });

c.getBean('service');
