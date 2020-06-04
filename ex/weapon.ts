interface Weapon {
  getName(): string;
  getAttack(): number;
}
class Sword implements Weapon {
  private name: string;
  private attack: number;
  constructor(attack: number) {
    this.name = 'sword';
    this.attack = attack;
  }

  getName() {
    return this.name;
  }

  getAttack() {
    return this.attack;
  }
}
class Axe implements Weapon {
  private name: string = 'axe';
  private attack: number;
  constructor(attack: number) {
    this.attack = attack;
  }

  getName() {
    return this.name;
  }

  getAttack() {
    return this.attack;
  }
}
export { Sword, Axe, Weapon };
