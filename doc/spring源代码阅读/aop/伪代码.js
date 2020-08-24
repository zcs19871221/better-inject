const { match } = require("assert");

const commonBeanAsAdvice =  {
  id: 'log',
  beanClass: Log,
  constructParams: {
    0: {
      value: 'db',
    },
  },
  type: 'single',
};
const pointCut = {
  id: 'logArgs_Return',
  beanNameFilter: /a/,
  methodFilter: /a/,
}

const aspect = {
  id: 'logArgs_Return',
  advice: 'log',
  adivcePostion: {
    before: 'registArgs',
    around: 'spendTime',
  }
}
class BeforeAdvisor {
  pointCut;
  beanId;
  invokeMethod;
  execute(chainMethod, ...args) {
    args = this.advice.execute(args);
    return chainMethod()
  }
}
class AroundAdvisor {
  pointCut;
  advice;
  execute(chainMethod) {
    return this.advice.execute(chainMethod)
  }
}
[
 new  BeforeAdvisor(),
 new  AroundAdvisor(),
]

getBean() {
  const bean = null;
  const advisors = getAdvisor();
  const usedAdvisors = advisors.filter(advisor => {
    return advisor.match(beanDefination)
  })
  if (used.length > 0) {
    return createProxy(bean, usedAdvisors)
  }
}

const createProxy = (bean, usedAdvisors) => {

  const proxy = new Proxy(bean, {
    get: function(target, prop, receiver) {
      const chains = usedAdvisors.find(prop);
      if (chains.length > 0) {
        let index = 0;
        const execute = (...args) => {
          if (index < this.advisors.length) {
            return chains[index++].execute(execute, ...args)
          } else {
            return Reflect.get(...args);
          }
        }
        return execute()
      }
      return Reflect.get(...arguments);
    }
  })
}