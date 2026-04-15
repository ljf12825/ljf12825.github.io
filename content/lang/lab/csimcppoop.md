---
title: C Sim C++ OOP
type: lab
date: 2026-04-15
status: active # active/archived/dead/unstable/suspended
category: experiment
summary: Use C to simulate C++ OOP
repo: https://github.com/ljf12825/cpp/tree/main/csimcppoop
---

C++ 面向对象的三大特性在 C 中的模拟方式

| C++ 特性 | C 语言模拟方式 |
| - | - |
| 类与成员变量 | 结构体 + 函数指针 |
| 成员函数 | 函数指针 + 显式传递`this`指针 |
| 构造函数/析构函数 | 专门的`new_xxx`/`delete_xxx`函数 |
| 继承 | 在子结构体中包含父结构体作为第一个成员 |
| 多态（虚函数）| 虚函数表(vtable)指针 |









