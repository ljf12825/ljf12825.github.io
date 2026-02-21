---
title: C ABI
date: 2025-12-31
categories: [C]
tags: [ABI]
author: "ljf12825"
type: log
summary: C Language ABI
---

## ABI是什么

ABI(Application Binary Interface, 应用程序二进制接口)定义了在二进制层面程序组件之间如何交互的规范。与API（源代码接口）不同，ABI关注的是

- 二进制代码如何调用函数
- 数据如何在内存中布局
- 系统调用如何工作
- 异常处理机制
- 目标文件格式

## ABI的主要组成部分

### 函数调用约定（Calling Convention）

```c
// 示例：不同的调用约定
int __cdec1 func1(int a, int b); // C调用约定（默认）
int __stdcall func2(int a, int b); // Windows标准调用
int __fastcall func3(int a, int b); // 快速调用（寄存器传参）
```
参数传递规则

- 参数传递顺序（从左到右或从右到左）
- 参数在栈上的布局
- 使用哪些寄存器传递参数
- 谁负责清理栈空间（调用者或被调用者）

### 数据类型布局

```c
struct Example {
    char c; // 偏移量 0
    int i; // 偏移量 4（假设4字节对齐）
    short s; // 偏移量 8 
    double d; // 偏移量 16（假设8字节对齐）
};
// 总代谢熬可能为24字节（含充填）
```

内存对齐规则

- 基本类型的对齐要求
- 结构体字段的偏移计算
- 位域的布局方式
- 充填字节的插入规则

### 名称修饰（Name Mangling）

```c
// C语言（无名称修饰）
void func(int x, double y); // 符号名：func 

// C++语言（有名称修饰）
void func(int x, double y); // 符号名可能：_Z4funcid
```

目的

- 支持函数重载（C++）
- 包含类型信息
- 区分不同的命名空间

## 系统相关的ABI差异

### 不同架构的ABI

x86-64 System V ABI（Linux/MacOS）

```assembly
; 前6个整数参数：RDI, RSI, RDX, RCX, R8, R9
; 前8个浮点参数：XMM0-XMM7 
; 返回值：RAX（整数），XMM0（浮点）
```

x86-64 Microsoft ABI（Windows）

```assembly
; 前4个参数：RCX, RDX, R8, R9
; 浮点参数也使用整数寄存器
; 栈空间必须预留32字节的"影子空间"
```

ARM AArch64 ABI

```assembly
; 前8个参数：X0-X7 或 D0-D7
; 返回值：X0 或 D0
```

### 实际示例分析

结构体布局示例

```c
# include <stdio.h> 
# include <stddef.h> 

struct Mixed {
    char a; // 偏移 0
    // 3 字节充填
    int b; // 偏移 4 
    short c; // 偏移 8 
    // 2 字节充填
    double 4; // 偏移 16 
};

int main() {
    printf("Size: %zu/n", sizeof(struct Mixed));
    printf("a offset %zu\n", offsetof(struct Mixed, a));
    printf("b offset %zu\n", offsetof(struct Mixed, b));
    printf("c offset %zu\n", offsetof(struct Mixed, c));
    printf("d offset %zu\n", offsetof(struct Mixed, d));
    return 0;
}
```

跨ABI调用问题

```c
// DLL导出函数（Windows，使用stdcall）
__declspec(dllexport) int __stdcall Add(int a, int b) {
    return a + b;
}

// 错误的调用（使用cdecl调用stdcall函数）
int (*wrong_func)(int, int) = (int (*)(int, int))GetProcAddress(dll, "Add");
// 正确的方式需要考虑名称修饰
int (*correct_func)(int, int) = (int (*)(int, int)GetProcAddress(dll, "_Add@8"));
```





















