---
title: Shell Parsing Pipeline
author: ljf12825
date: 2026-06-17
type: file
summary: Overview of Shell parsing pipeline
---

## Shell解析管线

Shell对输入的一行字符串，逐步变成“可执行结构（命令+参数+进程）的一整套处理流程，大致分为五个核心阶段

```txt
Input
v
1. Tokenization（词法拆分）
v
2. Expansion（各种展开）
v
3. Parsing（语法结构生成）
v
4. Resolution（命令解析）
v
5. Execution（执行）
```
