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

ClassPathXmlApplicationContext构造函数137：
  参数：传入字符串或字符串数组
  解析字符串，数组成实际地址，放入 configLocations变量
  调用父类AbstractApplicationContext.refresh()
    调用prepareRefresh()方法：初始化时间参数，初始化，检查环境变量
    调用obtainFreshBeanFactory()
      调用子类AbstractRefreshableApplicationContext.refreshBeanFactory():
        如果有beanFactory，beanFactory.destory()摧毁工厂（摧毁单例对象）;关闭工厂：beanFactory.close().beanFactroy引用为null
        调用createBeanFactory创建DefaultListableBeanFactory工厂beanFactory
        调用beanFactory.setSerializationId设置该工厂的序列化id,这样通过id可以实现序列化和反序列化对象
        调用beanFactory.customizeBeanFactory设置自定义属性：是否允许覆盖bean；是否允许循环依赖。
        调用子类AbstractXml