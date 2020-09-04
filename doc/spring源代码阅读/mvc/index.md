# 架构

请求被分发器分发到对应的 context，一个请求对应一个 context，是一个 servlet 的属性

一个请求绑定一个 context，一个 locate（语言解析器），主体解析器，文件上传解析器，
搜索到的解析器（前置，后置，controllers）执行。

一个请求对应一个处理器列表

# 注解

## @Controller

用来定义一个控制器（bean）

## @RequestMapping

用来定义拦截条件

用在类上
用在方法上 如果方法和类都定义，方法是相对路径，否则绝对路径

    拦截路径 path=
    方法  method =
    请求参数 /user/{userId}
    媒体类型  consumes = "application/json" 方法上用会覆盖类配置 支持否定表达式类似于 !text/html 匹配所有非text/html
    accept类型  produces = MediaType.APPLICATION_JSON_UTF8_VALUE 支持编码选择 方法上用会覆盖类配置 支持否定表达式类似于

## @RequestMapping 的组合

的组合就是下面这些，对应方法

@GetMapping
@PostMapping
@PutMapping
@DeleteMapping
@PatchMapping

## @PathVariable

用来获取路径参数

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

路径支持正则,包含*和\*\* \*\*意思是匹配任意路径加别名
默认匹配.*后缀

## @RequestParam

获取请求参数,可设置是否必填,默认为 true,如果注入类型是 map,会把所有参数弄成 map 注入

public String setupForm(@RequestParam("petId") int petId, ModelMap model

@RequestParam(name="id", required=false)).

## @RequestBody

将请求 body 转换成对象或把对象转换成 response body
可转换成:byte,string,object(from or to from/data),xml()

## @ResponseBody

将函数返回值直接写入 responsebody 中

## @RestController

标志一个类是 restFul api 支持的,只用于处理 xml 或 json 数据.不用每个处理器标记 responseBody 了.

## HttpEntity 类型

获取原始的 http request 和 http resposne 对象

public ResponseEntity<String> handle(HttpEntity<byte[]> requestEntity) throws UnsupportedEncodingException {
String requestHeader = requestEntity.getHeaders().getFirst("MyRequestHeader"));

## @ModelAttribute

在执行 RequestMapping 之前调用，在一个 controller 里

作用在方法上：

1. 返回值会自动添加到 model 属性上。默认名称是返回值类型
   添加 account 属性(或自定义@ModelAttribute('myAccount'))
   @ModelAttribute
   public Account addAccount(@RequestParam String number) {
   return accountManager.findAccount(number);
   }
2. 返回值 void，通过 model.addAttribute 添加

作用在参数上：
如果不存在 model 中，初始化。
然后从参数中找到匹配 key，同步 model

## 响应函数的参数

所有的路由处理器参数类型:
https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/mvc.html#mvc-ann-arguments

类型：
原生 request 类
原生 response 类
Map Model 模型对象
注解：
@PathVariable 路径对象
@RequestParam 请求参数
@RequestHeader 请求参数
@RequestBody 请求参数
@RequestPart 上传文件部分
@SessionAttribute session 相关

## 响应函数的返回值

https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/mvc.html#mvc-ann-return-types

## @SessionAttribute

保存到 session 或读取 session 注入到参数

## @RequestAttribute

获取请求 request 的属性，请求 request 对象的属性，不是 url 参数

## @CookieValue

根据 key 获取 cookie 的值

JSESSIONID=415A4AC178C59DACE0B2C9CA727CDD84
@CookieValue("JSESSIONID") String cookie

## @RequestHeader

获取请求头字段注入参数
如果参数类型是 Map 或 string 或 HttpHeaders 或 string[]类型，自动注入
string[]对应有;分割的

## @InitBinder

设置解析器

## @JsonView

将返回对象字段进行郭论热庵后序列化

## 全局配置

controllerAdvice

## 文件上传支持

@RequestParam("file") MultipartFile file

## 异常处理

@ExceptionHandler

## jsonP 支持

# 问题:

Prior to Spring 3.1, type and method-level request mappings were examined in two separate stages — a controller was selected first by the DefaultAnnotationHandlerMapping and the actual method to invoke was narrowed down second by the AnnotationMethodHandlerAdapter.

With the new support classes in Spring 3.1, the RequestMappingHandlerMapping is the only place where a decision is made about which method should process the request. Think of controller methods as a collection of unique endpoints with mappings for each method derived from type and method-level @RequestMapping information.
3.1 和之后的处理不同没看懂

书签：https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/mvc.html#mvc-ann-modelattrib-methods
