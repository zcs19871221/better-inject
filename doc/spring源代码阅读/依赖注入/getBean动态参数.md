需要在Bean中指定构造函数参数，

<bean id="myBean" class="A" scope="prototype">
  <constructor-arg value="0"/> <!-- dummy value --> 
</bean>


然后将值传递给bean工厂，

getBean("myBean", argument);