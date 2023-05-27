# 更新 ejs 大版本的问题

## 问题原因

早期的 ejs 是 2.x.x 有 npm audit 警告，所以需要升级成 3.x.x

更新之后项目无法运行，判断可能是 ejs 模板变化造成的

## 解决方法

参考报错信息，使用 EJS-Lint 工具检查格式错误，全局安装后，执行

~~~bash
ejslint ./src/views/*.ejs
~~~

会提示具体的错误位置，稍后手动修改 include 语法，即可正常运行

~~~diff
- <%- include style %>
+ <%- include('style') %>
~~~


## 参考资料

https://www.npmjs.com/package/ejs

https://github.com/RyanZim/EJS-Lint

