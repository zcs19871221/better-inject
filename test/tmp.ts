import Condition from '../mvc/condition/request_url_condition';

const c = new Condition(['/other/**', 'u', '/list']);
const d = new Condition(['/id1', '/id2']);

const obj = c.combine(d);
console.log(obj);
obj.getContent().map(each => each.getContent());
