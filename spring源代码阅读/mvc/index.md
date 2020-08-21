请求被分发器分发到对应的context，一个请求对应一个context，是一个servlet的属性

一个请求绑定一个context，一个locate（语言解析器），主体解析器，文件上传解析器，
搜索到的解析器（前置，后置，controllers）执行。

一个请求对应一个处理器列表

@Controller 用来定义一个控制器（bean）

@RequestMapping 用来定义拦截条件
  用在类上
  用在方法上 如果方法和类都定义，方法是相对路径，否则绝对路径
  可以拦截路径，method，请求参数


@RequestMapping的组合就是下面这些，对应方法

  @GetMapping
  @PostMapping
  @PutMapping
  @DeleteMapping
  @PatchMapping

@PathVariable 用来获取路径参数
1. 明确指明名称
@GetMapping("/owners/{ownerId}")
public String findOwner(@PathVariable("ownerId") String theOwner, Model model) {
    // implementation omitted
}
2. 当注入参数名称和路径参数名相等时，不用显示定义名称
@GetMapping("/owners/{ownerId}")
public String findOwner(@PathVariable String ownerId, Model model) {
    // implementation omitted
}

Prior to Spring 3.1, type and method-level request mappings were examined in two separate stages — a controller was selected first by the DefaultAnnotationHandlerMapping and the actual method to invoke was narrowed down second by the AnnotationMethodHandlerAdapter.

With the new support classes in Spring 3.1, the RequestMappingHandlerMapping is the only place where a decision is made about which method should process the request. Think of controller methods as a collection of unique endpoints with mappings for each method derived from type and method-level @RequestMapping information.
3.1 和之后的处理不同没看懂

书签：https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/mvc.html#mvc-ann-requestmapping-uri-templates-regex