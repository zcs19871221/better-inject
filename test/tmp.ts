import B from './B';

interface A {
  a1: string;
  a2: string;
  type: 'a';
}
interface B {
  b1: string;
  b2: string;
  type: 'b';
}
type X = A | B;
