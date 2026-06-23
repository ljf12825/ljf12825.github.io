---
title: RISC-V ABI
type: file
---

# RICS-V ABI

<!--more-->

RISC-V 的 ABI 是一套组合，由两部分组成

| 项目 | 选项 | 含义 |
| - | - | - |
| 数据模型 | `LP64` / `ILP32` | `int` 32位 / `long` + 指针 64位 |
| 浮点支持 | `D`/`F`/`NULL` | 是否使用浮点寄存器 |

所以 RICS-V 的 ABI 有

- `ilp32`
- `ilp32f`
- `ilp32d`
- `lp64`
- `lp64f`
- `lp64d`
