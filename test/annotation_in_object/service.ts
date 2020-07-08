import 'reflect-metadata';
import Dao from './dao';
import { Inject } from 'context';
// import { Resource } from '../../context';

function Resouce() {
  return (ctr: any) => {
    const originParams = Reflect.getMetadata('design:paramtypes', ctr);
    console.log(originParams);
  };
}
@Resouce()
class Service {
  private dao: Dao;
  private name: string;
  constructor( { @Inject('sss') dao, name }: { dao: Dao; name: string }) {
    this.dao = dao;
    this.name = name;
  }

  getDao() {
    return this.dao;
  }

  getName() {
    return this.name;
  }
}
export default Service;
