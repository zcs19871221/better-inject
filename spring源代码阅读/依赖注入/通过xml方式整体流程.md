# 测试代码

    // xml定义
    <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="
            http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
            ">
        <!-- 声明accountDao对象,交给spring创建 -->
        <bean name="accountDao" class="com.zejian.spring.springIoc.dao.impl.AccountDaoImpl"/>
        <!-- 声明accountService对象,交给spring创建 -->
        <bean name="accountService" class="com.zejian.spring.springIoc.service.impl.AccountServiceImpl">
              <!-- 注入accountDao对象,需要set方法-->
              <property name="accountDao" ref="accountDao"/>
        </bean>

    </beans>

    // 测试代码
    @Test
    public void testByXml() throws Exception {
        //加载配置文件
        ApplicationContext applicationContext=new ClassPathXmlApplicationContext("spring/spring-ioc.xml");

    //        AccountService accountService=applicationContext.getBean("accountService",AccountService.class);
        //多次获取并不会创建多个accountService对象,因为spring默认创建是单实例的作用域
        AccountService accountService= (AccountService) applicationContext.getBean("accountService");
        accountService.doSomething();
    }

# 源代码解读

    说明：
      1. 不缩进表示同级别
      2. 缩进表示进入该调用的方法。
      3. 如果调用函数没加调用者，默认是上一级缩进的类调用的

ClassPathXmlApplicationContext 构造函数137：
  参数：传入字符串或字符串数组
  解析字符串，数组成实际地址，放入 configLocations变量
  调用父类 AbstractApplicationContext.refresh()
    调用 prepareRefresh()方法：初始化时间参数，初始化，检查环境变量
    调用 obtainFreshBeanFactory() 获取初始化的beanFactory,初始化一个BeanDefineReader，使用这个reader去读xml文件，然后注册到工厂
      调用子类 AbstractRefreshableApplicationContext.refreshBeanFactory():
        如果有 beanFactory，beanFactory.destory()摧毁工厂（摧毁单例对象）;关闭工厂：beanFactory.close().beanFactroy引用为null
        调用 createBeanFactory创建 DefaultListableBeanFactory 工厂beanFactory
        调用 beanFactory.setSerializationId设置该工厂的序列化id,这样通过id可以实现序列化和反序列化对象
        调用 beanFactory.customizeBeanFactory设置自定义属性：是否允许覆盖bean；是否允许循环依赖。
        调用子类 AbstractXmlApplicationContext.loadBeanDefinitions(beanFactory)
          beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory) 这样beanDefinitionReader中设置this.registry = beanFactory
          调用 beanDefinitionReader.setEnvironment setResourceLoader setEntityResolver设置bean读取器
          调用 loadBeanDefinitions
            调用 AbstractRefreshableConfigApplicationContext.getConfigLocations
            调用 XmlBeanDefinitionReader.loadBeanDefinitions(configLocations)
              最终调用 DefaultBeanDefinitionDocumentReader.doRegisterBeanDefinitions 递归的处理xml中的bean和嵌套的bean
              再最终调用 DefaultListableBeanFactory.registerBeanDefinition(beanName, BeanDefinition) 设置 beanDefinitionMap hashMap键值对，键是beanName 值是BeanDefinition
        this.beanFactory = beanFactory;
    调用prepareBeanFactory进行beanFactory的一系列设置

getBean 调用 AbstractBeanFactory .doGetBean()方法
  transformedBeanName 解析名字和别名并返回骆驼形式名字
  调用 DefaultSingletonBeanRegistry .getSingleton 获取单例模式bean对象
    一个map记录beanName到对象映射，如果存在返回
    从早期单例对象map中获取对象，如果存在返回。
    否则从单例工厂中创建，然后放入早期单例对象map。然后从单例工厂中移除。
  如果单例对象存在，调用 getObjectForBeanInstance 
    判断是否是factoryBean，如果是的话，执行factoryBean接口的方法返回对象。如果不是，直接返回
  不存在对象，递归获取自己的和依赖的 BeanDefinition





