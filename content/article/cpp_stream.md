---
title: C++ Stream
author: ljf12825
date: 2026-07-08
tags: [C++, Stream]
summary: Overview of C++ Stream
---

在C++中，流(Stream)是一个抽象概念，它表示数据在程序与外部设备（或程序内部）之间的流动，就像水流在水管中一样，数据在流中“流淌”

## 核心思想

流将数据的生产和消费、传输过程与具体的设备（键盘、屏幕、文件、内存等）解耦\
可以用同一套接口来读取键盘输入、文件内容或网络数据，而无需关心底层设备细节

## 主要组成部分

### 基本类层次结构

```txt
ios_base
  └── ios
       ├── istream (输入流)
       │    └── ifstream (文件输入流)
       │         └── istringstream (字符串输入流)
       └── ostream (输出流)
            ├── ofstream (文件输出流)
            ├── ostringstream (字符串输出流)
            └── iostream (输入输出流)
                 ├── fstream (文件输入输出流)
                 └── stringstream (字符串输入输出流)
```

### 标准流对象（预定义）

- `std::cin` - 标准输入流（键盘）
- `std::cout` - 标准输出流（屏幕）
- `std::cerr` - 标准错误流（无缓冲）
- `std::clog` - 标准日志流（有缓冲）

### 按数据源/目标分类

| 类型 | 头文件 | 说明 |
| - | - | - |
| 控制台流 | `<iostream>` | `cin`, `cout`, `cerr`, `clog` |
| 文件流 | `<fstream>` | `ifstream`, `ofstream`, `fstream` |
| 字符串流 | `<sstream>` | `istringstream`, `ostringstream`, `stringstream` |

## 工作原理

流内部有一个缓冲区(buffer)，数据和设备之间通过缓冲区交互，减少了频繁访问设备的开销\
流通过操作符重载实现优雅的语法

```cpp
// 插入运算符 <<
cout << "Hello" << 42; // 将数据插入输出流

// 提取运算符 <<
int x;
cin >> x; // 从输入流提取数据
```

## 流式操作符

## 流的状态

每个流都有状态标志，用来检测操作是否成功

- `good()` - 流正常
- `eof()` - 达到文件末尾
- `fail()` - 操作失败（格式错误等）
- `bad()` - 流已损坏（不可恢复）

```cpp
if (cin.fail()) {
    // 处理输入失败
}
```














