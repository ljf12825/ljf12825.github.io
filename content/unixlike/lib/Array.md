---
title: Array
date: 2025-12-31
categories: [C]
tags: [Array]
author: "ljf12825"
type: blog
summary: usage of array and ram structure, string, array with pointer
---

数组是一段连续的、元素类型完全相同的内存区域，并且他是一个”非一等公民“

## 连续内存（Contiguous Memory）
```c 
int a[5];
```
内存布局一定是
```txt 
a[0] a[1] a[2] a[3] a[4]
```
- 每个元素大小 = `sizeof(int)`
- `a[i]`的地址 = `&a[0] + i * sizeof(int)` 

这不是”实现细节“，而是语言规范保证的

## 数组不是”普通对象“
```c 
int a[5];
```
- `a`不是指针
- `a`不能被赋值
- `a`不能作为返回值
- `sizeof(a)` != `sizeof(int*)`

数组是语法级别的构造，不是运行时对象
