---
title: ldd using
date: 2026-04-24
author: ljf12825
type: lab
status: archived # active/archived/dead/unstable/suspended
tags: ldd
categories: experiment
summary: Write a project by hand and use the ldd command to troubleshoot
repo: https://github.com/ljf12825/unix-like/tree/main/src/ldd 
---

## 手写一个简单项目，制造问题场景用`ldd`进行排查

### 条件

1. 一个自定义共享库 `mymath.h`, `mymath.c`编译为共享库
2. 一个依赖该库的主程序
3. 创建符号链接，模拟标准库的版本管理

```c
// mymath.h
#ifndef MYMATH_H
#define MYMATH_H

int add(int a, int b);
int multiply(int a, int b);

#endif
```

```c
// mymath.c
#include "mymath.h"

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
     return a * b;
}
```

```bash
#!/bin/bash

# 生成位置无关代码
gcc -c -fPIC mymath.c -o mymath.o

# 生成共享库，版本号设为 1.0.0
gcc -shared -Wl,-soname,libmymath.so.1 -o libmymath.so.1.0.0 mymath.o

# 创建符号链接（模拟标准库的版本管理）
ln -s libmymath.so.1.0.0 libmymath.so.1
ln -s libmymath.so.1 libmymath.so
```

```c
// main.c
#include <stdio.h>
#include "mymath.h"

int main() {
    int a = 10, b = 5;
    printf("Testing custom math library:\n");
    printf("%d + %d = %d\n", a, b, add(a, b));
    printf("%d * %d = %d\n", a, b, multiply(a, b));
    return 0;
}
```

```bash
gcc main.c -L -lmymath -o my_program
```

### 制造问题场景

#### 场景1：直接运行

直接运行会报错：找不到库

```txt
error while loading shared libraries: libmymath.so.1: cannot open shared object file: No such file or directory
```

用`ldd`查看会发现`libmymath.so.1 => not found`，说明动态链接器找不到自定义库

临时解决方案

```bash
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
```

#### 场景2：库版本升级导致符号缺失

升级库，但故意移除一个函数，模拟API不兼容的情况

修改`mymath.c`，移除`multiply`

```c
#include "mymath.h"

int add(int a, int b) {
    return a + b;
}
```

编译新版本并更新符号链接

```bash
gcc -c -fPIC mymath.c -o mymath.o
gcc -shared -Wl, -soname,libmymath.so.1 -o libmymath.so.1.1.0 mymath.o

# 更新符号链接
ln -sf libmymath.so.1.1.0 libmymath.so.1
ln -sf libmymath.so.1 libmymath.so
```

运行程序，仍然用旧的main没有重新编译

```bash
$ export LD_LIBRARY_PATH=.:LD_LIBRARY_PATH
$ ./my_program
```

报错

```txt
./my_program: symbol lookup error: ./my_program: undefined symbol: multiply
```

用`ldd -r` 深入排查

```bash
$ LD_LIBRARY_PATH=. ldd -r ./my_program
        linux-vdso.so.1 (0x00007286cb3c5000)
        libmymath.so.1 => ./libmymath.so.1 (0x00007286cb3b3000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007286cb000000)
        /lib64/ld-linux-x86-64.so.2 (0x00007286cb3c7000)
undefined symbol: multiply      (./my_program)
```

最后一行明确指出，说明程序需要的函数在新版库中不存在

验证库中的符号

```bash
$ nm -D libmymath.so.1 | grep ' T '
00000000000010f9 T add
```

解决方案

- 如果API兼容性很重要，重新编译程序链接新版库
- 或者保留旧版库在另一个路径，用`RPATH`指向它

#### 场景3：使用RPATH固化路径

不想每次设置`LD_LIBRARY_PATH`，把库路径写入程序

```bash
# gcc main.c -L -lmymath -Wl, -rpath,[绝对路径] -o my_program_rpath
```

验证

```bash
$ unset LD_LIBRARY_PATH
$ ldd ./my_program_rpath
```

输出

```txt
        linux-vdso.so.1 (0x00007f8e61fee000)
        libmymath.so.1 => libmymath.so.1的绝对路径 (0x00007f8e61fdc000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f8e61c00000)
        /lib64/ld-linux-x86-64.so.2 (0x00007f8e61ff0000)
```

无需任何变量，直接运行即可

#### 场景4：用-u找出多余的链接

编译时故意多加一个不需要的库

```bash
gcc main.c -L. -lmymath -Wl,--no-as-needed -lm -o my_program_extra
```
- 用`--no-as-needed`强制保留未使用的库，以免被链接器优化掉

用`ldd -u` 检查

```bash
$ LD_LIBRARY_PATH=. ldd -u ./my_program_extra
Unused direct dependencies:
        /lib/x86_64-linux-gnu/libm.so.6
```
