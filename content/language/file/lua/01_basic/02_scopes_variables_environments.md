---
title: Scopes, Variables, and Environments
author: ljf12825
date: 2026-02-23
type: file
summary: ..
---

## 变量的两种本质形态

Lua里只有两种变量

| 类型 | 本质 |
| - | - |
| 局部变量 | 栈上的名字绑定 |
| 全局变量 | `_ENV`表中的字段 |

Lua没有真正“特殊”的全局变量机制\
所谓全局变量，其实是

```lua
x = 10
```

等价于

```lua
_ENV.x = 10
```

## 默认规则：Global by Default

每个chunk开始时，隐式存在

```lua
global *
```

这意味着：所有未声明变量默认是全局变量

```lua
X = 1 -- 默认是全局
```

## global声明块（严格模式）

在`global`声明内部

- 取消默认全局
- 所有变量必须显式声明


















