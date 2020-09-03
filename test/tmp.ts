import Condition from '../mvc/condition/request_header_condition';

const a = new Condition('myHeader=abcde;accept-language;!cookie');
const b = new Condition('myHeader=abcde;accept-language;!cookie;myHeader2');
console.log(a.combine(b).getContent());
