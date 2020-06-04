# node typescript server

## 文件命名规范

不允许大写,全小写,用\_代替
因为 windows 不区分大小写,linux 区分,有意外错误

## 中间件命名规范

一个中间件一个文件

中间件必须有函数名且必须和文件名一致。这样可以通过 内置路由 `/trace/list` `/trace/check` 快速定位。

## 命令

### npm test

执行单元测试

### npm run compile

typescript 编译

### npm run build

进行单元测试，清空 dist 目录后编译输出到 dist 目录。

### npm run analyze

以性能模式启动 server。配合 chrome 开发者工具进行 cpu 和内存分析。
详情见[性能文档](./doc/性能分析)
