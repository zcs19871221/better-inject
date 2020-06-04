import { Weapon } from './weapon';
export default class Hero {
  private weapon: Weapon;
  constructor(weapon: Weapon) {
    this.weapon = weapon;
  }

  fight() {
    console.log(
      `use ${this.weapon.getName()} damged ${this.weapon.getAttack()}`,
    );
  }
}
