import Context from '../../context';

const context = new Context({
  scanFiles: '*.ts',
});
console.log((<any>context.getBean('parser')).parse());
