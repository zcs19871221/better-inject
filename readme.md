# 基于 typescript 的模仿 spring 依赖注入和面向切面

# 依赖注入

1. 支持注解 3 个，自动扫描`@Resource` 注入构造函数参数`@inject` 注入对象类型的构造函数参数`@injectObj`
2. 支持配置文件
3. 支持同时注解和配置文件
4. 循环依赖检测
5. 可扫描文件注解文件和配置文件，支持\*\*和\*占位符
6. 支持继承父亲构造函数注入
7. 支持工厂类，继承 factoryBean 类,默认获取 getObject 返回对象；可通过&id 获取工厂对象自身
8. 获取实例时候可动态传参数覆盖注解或配置文件的参数
9. 支持 factoryBean 特性
10. 支持接口类型注入
11. 目前只支持构造函数注入

# 面向切面

1. 提供注解 `Aspect Before After Around AfterReturn AfterThrow PointCut`
2. 提供配置文件,使用`Checker`校验
3. Aspect 的类必须同时使用`Resource`标记为 bean
4. 配置文件的 adviceId 如果省略，默认为 aspectId
5. Before After Around 的对应方法，只有一个 Invoker 类型的参数. AfterThrow 和 AfterReturn 有第二个参数，分别是返回值和抛出的错误。
6. 注解模式的全局切点：如果一个类标记了 PointCut,但是没有标记 Advice，会把这些 PointCut 作为全局切点
7. Aspect(number)设置优先级,数字>=0，数字越小优先级越高。
8. 默认优先级都是 0，相同优先级的切面按照 Around Before After AfterReturn AfterThrow 的顺序执行，不同切面优先级不同的按照优先级先执行。比如有两个切面 a1 和 a2.
   a1: around1 before1 after1 afterReturn1
   a2: around2 before2 after2 afterReturn2

如果 a1 和 a2 优先级相同，执行顺序为 around1-start around2-start before1 before2 原生方法 around2-end around1-end after2 after1 afterReturn2 afterReturn1

如果 a1 优先级 0 a2 优先级 1，则为 around1 before1 around2 before2 原生方法 around2-end after2 afterReturn2 around1-end after1 afterReturn1

# 安装

`npm install better-inject`

# 使用

    有一个service类，依赖dao类，依赖jdbc类。
    下面的例子通过注解扫描到service和dao类。
    通过配置文件定义jdbc类。
    然后通过getBean获取到注入后的service实例。

    // 主文件
    import Context from 'better-inject'

    const root = '绝对路径地址'
    const context = new Context({
      // 注解目标文件扫描
      // 如果是相对路径，相对于root地址解析
      // 占位符包含** 和 *
      // **在目录中间代表目录下所有文件
      // *在文件地址中表示正则.*
      scanFiles: [
        'service.ts',
        'dao.ts',
        // 这个含义是查找test目录下，第一层所有目录下的*.ts文件
        'test/**/*.ts'
      ],
      // 配置文件扫描
      configFiles: 'config.ts',
      root,
    });
    console.log(context.get('service'))


    // service.ts
    import { Resource } from 'better-inject';
    import Dao from './dao';

    @Resource(/** 默认 type: prototype id: 类名 parent: 无**/)
    // 内部生成类似service: {dao: Dao}的定义数据
    class Service {
      private dao: Dao;
      // 这里如果没有@Inject，会获取Dao类，并默认要注入一个id为dao的对象
      // 如果你想注入一些别的东西或者Dao是一个接口，必须使用配置文件或Inject
      // 注解主动注入
      constructor(@Inject('oracledao')dao: Dao) {
        this.dao = dao;
      }

      getDao() {
        return this.dao;
      }
    }
    export default Service;

    // Dao.ts
    import { Resource } from 'better-inject';
    import Jdbc from './jdbc';

    @Resource({type: 'single'})
    export default class Dao {
      private jdbc: Jdbc;
      constructor(jdbc: Jdbc) {
        this.jdbc = jdbc;
      }

      getJdbc() {
        return this.jdbc;
      }
    }

    // Jdbc.ts
    export default class Jdbc {
      private name: string;
      constructor(name: string) {
        this.name = name;
      }

      getName() {
        return this.name;
      }
    }

    // config.ts 可以通过配置文件定义全部数据关系,
    import Jdbc from './jdbc';
    import {Checker} from '../../context';
    // 可以不使用Checker,直接导出，但是这样就没有ts数据格式校验
    export default Checker([
      {
        // id，对应getBean()的参数
        id: 'jdbc',
        // 别名，对应getBean()的参数
        alias: ['Jdbc', 'JDBC'],
        // 这个bean对应类
        beanClass: Jdbc,
        // 构造函数参数直接值
        constructParams: {
            // 位置
            0: {
              // 值
              value: 'oracle',
              // 表示把这个value看做id，用于注入
              isBean: true,
            }
        },
        // 构造函数参数使用对象merge
        constructParams: {
            // 位置 表示注入一个对象，包含jdbc和name
            两个属性，会和getBean的参数进行merge，getBean参数优先级高
            0: [{
              jdbc: {
                // 值
                value: 'oracle',
                // 表示把这个value看做id，用于注入
                isBean: true,
              },
              name: {
                value: 'zcs',
              },
            }]
        },
        // 实例化类型 single 单例模式 prototype 原型模式 默认是prototype
        type: 'single'
      },
    ]);

# 注意

1. context 的 root 默认是 process.cwd()

# Resouce 内部逻辑

1. 把这个类标记成一个可通过容器获取的目标，把类名小写作为 id。
2. 然后会读取类中的构造函数参数，如果认为某个构造函数是类，就会自动把它认为是一个依赖注入项，把这个类的类名小写作为要注入的 id。或者通过 inject 标签主动注入，inject 的值默认认为是 id。
