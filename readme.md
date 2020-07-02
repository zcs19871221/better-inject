# 基于 typescript 的模仿 spring 依赖注入

# 特性

1. 支持注解 两个，一个自动的`@Resource` 和注入value的`@inject`
2. 支持配置文件
3. 支持同时注解和配置文件
4. 循环依赖检测
5. 扫描文件支持\*\*和\*占位符
6. 支持 factoryBean 特性
7. 支持接口类型注入
8. 目前只支持构造函数注入

# 流程原理

实例化`Context`类获取文件地址，解析后找到配置文件或(和)注解文件。进行解析生成`BeanDefinition`。执行`context.getBean(id)`时候，根据id查找BeanDefinition并根据数据实例化返回

# 安装

`npm install better-inject`

# 使用

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
    console.log(context.get('service))


    // service.ts
    import { Resource } from 'better-inject';
    import Dao from './dao';

    @Resource(/** single 或 prototype 默认 prototype**/)
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

    @Resource('single')
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
    import Context from '../../context';
    // 可以不使用Context.valid,直接导出数组，但是这样就没有ts数据格式校验
    export default Context.valid([
      {
        // id，对应getBean()的参数
        id: 'jdbc',
        // 别名，对应getBean()的参数
        alias: ['Jdbc', 'JDBC'],
        // 这个bean对应类
        beanClass: Jdbc,
        // 构造函数参数
        constructParams: [
          {
            // 位置
            index: 0,
            // 值
            value: 'oracle',
            // 表示把这个value看做id，用于注入
            isBean: true,
          },
        ],
        // 实例化类型 single 单例模式 prototype 原型模式 默认是prototype
        type: 'single'
      },
    ]);

# 注意

1. context 的 root 默认是 process.cwd()

# Resouce内部逻辑
1. 把这个类标记成一个可通过容器获取的目标，把类名小写作为id。
2. 然后会读取类中的构造函数参数，如果认为某个构造函数是类，就会自动把它认为是一个依赖注入项，把这个类的类名小写作为要注入的id。或者通过inject标签主动注入，inject的值默认认为是id。

