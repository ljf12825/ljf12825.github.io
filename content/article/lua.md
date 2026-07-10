---
title: Lua
date: 2026-02-22
author: ljf12825
summary: lua overview, install, configuration, luarocks, luajit
type: file
---

[lua.org](https://lua.org/)

Lua的名字来自葡萄牙语“月亮”，1993年诞生于巴西里约热内卢天主教大学计算机图形技术组(Tecgraf)，由Roberto lerusalimschy, Luiz Henrique de Figueiredo和Waldemar Celes创建

特点：

- C语言实现，极致轻量级：源文件～100个，核心实现～2万行C代码
- 为嵌入而生：设计初衷不是做独立应用，而是作为C/C++程序的扩展脚本语言
- 动态类型
- 解释执行
- 多范式：支持过程式、函数式、原型式编程

设计哲学：Lua不是为了做应用层语言像Python那样，而是为了给C/C++程序提供一个可控脚本层提供一个“小而完整”的语言核心，通过宿主程序扩展能力

## 为什么选择Lua

选择Lua的唯一正当理由，就是要为一个更大的程序（通常是C/C++写的）提供一个内嵌的脚本层

| 需求 | 匹配度 | 说明 |
| - | - | - |
| C/C++ 互调用要极简单 | 5/5 | 这是Lua存在的根本意义。Lua的C API设计极其精巧，从C调用Lua函数、从Lua操作C数据都像是语言内置能力。LuaJIT的FFI甚至能直接在Lua里声明C函数并调用，连绑定代码都不用写 |
| 宿主程序要对脚本有绝对控制 | 5/5 | 可以限制脚本能访问哪些库、能分配多少内存、能执行多长时间。脚本坏了不会搞垮宿主 |
| 体积要小 | 5/5 | 核心引擎约2万行C代码，完整静态编译进项目才几百KB。对于客户端软件、嵌入式设备，这是硬指标 |
| 执行要快（相对脚本语言） | 4/5 | 标准Lua已经是解释型语言里最快的之一；LuaJIT在数值计算场景接近C速度 |
| 语法要简单，非程序员能上手 | 4/5 | 语法元素少，table是万金油，策划、美术都能写简单逻辑 |
| 生态丰富 | 1/5 | Lua标准库极薄，第三方库远不如Python/JS |

总的来说，如果你的程序是C/C++写的，需要一个脚本扩展能力，选Lua。否则不选

## 使用场景：

### 游戏逻辑与热更新

游戏引擎是C/C++重资产，但业务逻辑需要频繁调整，Lua承担了所有“易变”的部分

- 技能/战斗系统：一个角色的几百个技能，每个技能的触发条件、伤害公式、Buff逻辑全用Lua写，策划自己调，不用动C++代码
- 关卡/任务脚本：关卡机关触发、NPC对话树、任务完成条件
- UI逻辑：按钮点击后做什么，界面间的跳转
- 热更新：线上出了Bug，不改C++代码，只下发新的Lua脚本就能修复逻辑

代表引擎：Unity的xLua/Tolua, Cocos2d-x，自研引擎

### 嵌入式与物理网设备

设备资源受限，跑不了Python/Node，但又需要给用户或二次开发者一个可编程接口

- 路由器固件(OpenWrt的Web管理后台LuCl就是Lua写的)
- 工业控制器的配置与逻辑脚本
- 打印机、扫描仪的业务流程控制

### 服务端的高性能逻辑层

场景：用C写网络层和性能瓶颈，用Lua写业务逻辑

- Nginx扩展
- Redis脚本：Redis内置的脚本引擎就是Lua，用于原子性执行复杂逻辑
- 游戏服务器：C处理网络/数据库，Lua写房间逻辑、匹配规则

### 非程序员的“配置即逻辑”

table既是数据容器，也是唯一的复合数据结构，格式上跟JSON几乎一一对应。这带来了一个很实用的写法：

- 本来只是写JSON配置，后来发现某些值需哟“根据这个变量动态计算”
- Lua可以直接把配置文件当代码执行，既允许纯数据声明，也允许嵌入计算逻辑
- 无痛从“静态配置”升级成“可编程配置”

常见于游戏的数值表、软件的插件规则

### 桌面应用的脚本扩展

让用户可以自定义应用行为

- Wireshark的协议解析插件用Lua写
- Nmap的扫描脚本(NSE)用Lua写
- Redis Desktop Manager之类的工具内置Lua来做批量操作
- Awesome WM 这类窗口管理器直接用Lua做配置文件

Lua也有以下缺点:

- 标准库极小
- 无class
- 无静态类型
- 生态弱于Python

## 安装与环境搭建

### Linux下通过源码安装

Lua诞生于Unix-like环境，从源码编译是最本源的方式

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

### LuaRocks

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

#### 基本用法

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

##### 示例

安装luasocket后就可以

```lua
local socket = require("socket")
```

如果是C扩展模块，它会自动

- 编译
- 链接
- 放到Lua模块路径里

#### LuaRocks的核心能力

1. 依赖管理：自动处理依赖链
2. 版本管理
3. 本地安装

#### 局限性

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

## LuaJIT

<https://luajit.org/>

LuaJIT是Lua的第三方高性能实现版本\
它的核心特征是：使用JIT编译，把Lua字节码编译为机器码执行\
LuaJIT的作者是Mike Pall,他几乎一个人完成了LuaJIT的核心设计

| 实现     | 执行方式      | 性能   |
| ------ | --------- | ---- |
| 标准 Lua | 字节码解释器    | 中等   |
| LuaJIT | 解释 + 动态编译 | 接近 C |

很多benchmark中，LuaJIT比标准Lua快5～20倍

但LuaJIT基于老版本Lua语义（主要兼容5.1），无法享受后续版本的语言特性

### 核心技术

LuaJIT不是简单加了个编译器，它采用了

1. Trace-base JIT：不是把整个函数一下子编译成机器码，二十运行时追踪“热路径”（频繁执行的代码轨迹），只把这些线性轨迹编译优化
2. SSA + IR优化：内部使用静态单赋值形式的中间表示，能在编译时做常量折叠、死代码消除等深度优化
3. FFI(Foreign Function Interface)：直接在Lua里声明C数据结构、调用C函数，无需写C绑定代码，大幅减少跨语言开销
