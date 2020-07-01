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
