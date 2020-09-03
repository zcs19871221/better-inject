import Condition from '../mvc/condition/request_header_condition';

const condition = new Condition('myHeader=abcde;accept-language;;!cookie');
condition.getMatchingCondition(<any>{
  headers: {
    myHeader: 'abcde',
    'accept-language': 'fuck',
    cookie: 'sdfsdfd',
  },
});
