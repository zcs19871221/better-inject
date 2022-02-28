import Invoker from './invoker';

interface AdviceArgs {
  advice: any;
  adviceMethod: string;
}
interface AdviceCtr {
  new (input: AdviceArgs): Advice;
}
const Advice_Position = [
  'afterReturn',
  'afterThrow',
  'after',
  'around',
  'before',
] as const;
type ADVICE_POSITION = typeof Advice_Position[number];
export { AdviceCtr, Advice_Position, ADVICE_POSITION };
export default abstract class Advice {
  private aopObject: any;
  private adviceMethod: string;

  constructor({ advice, adviceMethod }: AdviceArgs) {
    this.aopObject = advice;
    this.adviceMethod = adviceMethod;
  }

  protected invokeAdvice(invoker: Invoker, ...args: any[]): any {
    return this.aopObject[this.adviceMethod](invoker, ...args);
  }

  abstract invoke(invoker: Invoker): any;

  abstract getPosition(): ADVICE_POSITION;
}
