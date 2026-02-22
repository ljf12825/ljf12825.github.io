---
title: Lua
date: 2026-02-22
author: ljf12825
summary: lua overview, install, configuration
type: file
---

[lua.org](lua.org)

Lua来自葡萄牙语，意为月亮\
诞生于1993年，由巴西里约热内卢天主教大学计算机图形技术组(Tecgraf)的成员Roberto lerusalimschy, Luiz Henrique de Figueiredo和Waldemar Celes创建

特点：

- C语言实现
- 轻量级：源文件～100个，核心实现～2万行C
- Designed to be embedded
- 动态类型
- 解释执行
- 多范式

核心理念：提供一个“小而完整”的语言核心，通过宿主程序扩展能力

设计哲学：Lua不是为了做应用层语言（like Python），而是为了给C/C++程序提供一个可控脚本层

使用场景：

- C的“可编程配置系统”
- 游戏引擎的“行为层语言”
- 嵌入式系统的“扩展DSL”

缺点

- 标准库极小
- 无class
- 无静态类型
- 生态弱于Python


## Linux下通过源码安装

Lua诞生于Unix-like环境

```bash
curl -L -R -O https://www.lua.org/ftp/lua-5.5.0.tar.gz
tar zxf lua-5.5.0.tar.gz
cd lua-5.5.0
make all test
sudo make install
lua -v
```

### VSCode配置

官方推荐插件：Lua Language Server，插件名：Lua by sumneko(现LuaLS)

setting.json

```json
{
  "Lua.runtime.version": "Lua 5.5",
  "Lua.diagnostics.globals": ["vim"],
  "Lua.workspace.checkThirdParty": false
}
```

调试插件：Local Lua Debugger

launch.json

```json
{
  "type": "lua-local",
  "request": "launch",
  "name": "Launch",
  "program": "${file}"
}
```

### Vim配置

Lua Language Server

```bash
git clone https://github.com/LuaLS/lua-language-server
```

格式化工具：stylua

```bash
cargo install stylua
```

## LuaRocks

LuaRocks是Lua的官方包管理器，是独立于Lua的工具

[LuaRocks官网](https://luarocks.org)

Lua的标准库非常小，官方只提供

- 基础字符串
- table
- 数学
- IO
- 协程

但没有

- HTTP客户端
- JSON库
- ORM
- Web框架
- 加密库

LuaRocks的作用就是：管理这些第三方库的安装、版本、依赖

LuaRocks里的包叫做rock,每个rock本质上是一个Lua源代码包或者包含C扩展的编译模块，带有一个rockspec描述文件，类似

```
package.json
Cargo.toml
CMakeLists.txt
```

### 基本用法

安装包

```bash
luarocks install luasocket
```

搜索

```bash
luarocks search json
```

查看已安装

```bash
luarocks list
```

#### 示例

安装luasocket后就可以

```lua
local socket = require("socket")
```

如果是C扩展模块，它会自动

- 编译
- 链接
- 放到Lua模块路径里

### LuaRocks的核心能力

1. 依赖管理：自动处理依赖链
2. 版本管理
3. 本地安装

### 局限性

很多商业游戏不使用LuaRocks，因为游戏构建系统自定义，需要严格控制版本，静态打包，无外部依赖

LuaRocks更常见于

- 服务端Lua
- 工具链
- CLI程序
- 嵌入式应用

除此之外，LuaRocks

- 生态规模远小于pip/npm
- 有些包长期无人维护
- C扩展在Windows下安装可能麻烦
- 版本碎片

## [LuaJIT](https://luajit.org/)

LuaJIT是Lua的第三方高性能实现版本\
它的核心特征是：使用JIT编译，把Lua字节码编译为机器码执行\
LuaJIT的作者是Mike Pall,他几乎一个人完成了LuaJIT的核心设计

| 实现     | 执行方式      | 性能   |
| ------ | --------- | ---- |
| 标准 Lua | 字节码解释器    | 中等   |
| LuaJIT | 解释 + 动态编译 | 接近 C |

很多benchmark中，LuaJIT比标准Lua快5～20倍

但LuaJIT基于老版本Lua语义

### 核心技术

LuaJIT不是简单加了个编译器，它采用了

1. Trace-base JIT
2. SSA + IR优化
3. FFI
