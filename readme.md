# 基于 typescript 的模仿 spring 依赖注入

# 特性

1. 支持注解
2. 支持配置文件
3. 循环依赖检测
4. 扫描文件支持\*占位符
5. 支持 factoryBean 特性
6. 目前只支持构造函数注入

# 安装

`npm install better-inject`

# 使用

    // 主文件
    import Context from 'better-inject'

    const root = '绝对路径地址'
    const context = new Context({
      // 注解目标文件扫描
      scanFiles: [
        'service.ts',
        'dao.ts',
      ],
      // 配置文件扫描
      configFiles: 'config.ts',
      root,
    });
    console.log(context.get('service))


    // service.ts
    import { Resource } from 'better-inject';
    import Dao from './dao';

    @Resource()
    class Service {
      private dao: Dao;
      constructor(dao: Dao) {
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

    // config.ts
    import Jdbc from './jdbc';
    import Context from '../../context';
    export default Context.valid([
      {
        id: 'jdbc',
        alias: ['Jdbc', 'JDBC'],
        beanClass: Jdbc,
        constructParams: [
          {
            index: 0,
            value: 'oracle',
          },
        ],
      },
    ]);

# 注意

1. context 的 root 默认是 process.cwd()
2. 如果注入参数是 typescript 接口，只能使用 config 模式，注解不起作用。因为 typescript 接口在运行时会被移走，用注解的 reflect 反射是获取不到接口名称的。获取不到名称就没法生成 id
3. 注解的原理：首先把类名小写话作为 beanId，然后通过反射获取构造函数参数类型，判断类型是不是类，如果是类，那么认为是注入项，将这个参数类名小写作为待注入的 id。
