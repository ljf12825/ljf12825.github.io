---
title: C Program Structure
date: 2025-12-31
categories: [C]
tags: [Program, Main]
author: "ljf12825"
type: blog
summary: C Program Structure, Command Line Argument
---

## 一个最小的C程序结构
Hello World实例
```c
// hello.c 
#include <stdio.h>

int main()
{
    /*my first C program */
    printf("Hello, World! \n");

    return 0;
}
```
- 预处理指令：`#include <stdio.h>`，告诉C编译器在实际编译之前要包含的stdio.h文件
- 主函数：`int main()`，程序从这里开始执行
- 注释：`/*...*/`，注释中的内容会被编译器忽略
- 函数：`printf(...)`，C中的一个可用函数
- 返回：`return 0`，终止main()函数，并返回值0

### 命令行参数
执行程序时，可以从命令行传值给C程序，它让程序在启动时就能获得配置信息。这些值被成为命令行参数，它们对程序很重要，特别是当想从外部控制程序，而不是在代码内进行硬编码时，显得尤为重要，是编写命令行工具的基础

#### 是什么
当这样运行程序时
```bash 
./myprogram -v --output=result.txt input1.dat input2.dat 
```
`-v`, `--output=result.txt`, `input1.dat`, `input2.dat`就是命令行参数。它们通过操作系统传递给程序的`main`函数

#### 为什么main能有参数
程序启动是程序加载器(loader)调用——在Linux是`ld-linux-x86-64`，它把命令行参数从栈上传给main 

#### main函数的标准形式
C程序的`main`函数有多种标准形式来接收参数
```c 
// 形式一：双参数（C标准形式）
int main(int argc, char *argv[]) {
    // argc：参数计数(argument count)
    // argv：参数向量/值(argument vector)
    // 返回值：通常0表示成功，非0表示错误
}

// 形式二：简略版（C标准形式，不关心参数）
int main(void) {
    // 不接受任何命令行参数
}

// 形式三：三参数（POSIX标准）
int main(int argc, char *argv[], char *envp[]) {
    // envp：表示环境变量列表(environment pointer) 
    // 这在POSIX, GNU/Linux, 系统编程中是合法且使用广泛的，只是它不是C标准指定的形式
    // 但C标准也允许实现定义（implementation-defined）的额外参数，而Linux就扩展允许环境变量指针
}

// 形式四：二级指针版（本质同形式一）
int main(int argc, char **argv, char **envp) {
    // char **argv和char *argv[]本质完全一样，只是语法不同
    // 系统编程中用char **argv更多，因为它强调指向指针的指针，更贴合内存模型
}
```

#### 参数详解与访问
1. `argc`和`argv`的含义
```c 
#include <stdio.h> 

int main(int argc, char *argv[]) {
    printf("程序名：%s\n", argv[0]); // argv[0]总是程序自己的名字
    printf("参数总数（含程序名）：%d\n", argc);

    // 遍历所有参数
    for (int i = 0; i < argc; i++) {
         printf("argv[%d] = %s\n", i, argv[i]);
    }

    return 0;
}
```

编译后运行
```bash 
$ ./example hello world 123
程序名: ./example
参数总数 (含程序名): 4
argv[0] = ./example  # 第0个参数总是程序路径
argv[1] = hello       # 第一个实际参数
argv[2] = world
argv[3] = 123
```

2. `argv`的内存布局
抽象来说，`argv`实际上是一个字符串指针数组，最后一个元素是`NULL`
```c 
// argv 的实际结构
char *argv[] = {
    "./example", // argv[0]
    "hello", // argv[1]
    "world", // argv[2]
    "123", //argv[3]
    NULL // argv[argc] 总是NULL
};
```
这意味着可以这样遍历
```c 
// 另一种遍历方式（利用 argv[argc] == NULL 的特性
for(int i = 0; argv[i] != NULL; i++) {
    printf("参数 %d: %s\n", i, argv[i]);
}
```

但实际上Linux的内存布局大概是
```text 
argc 
argv[0]
argv[1]
...
argv[argc-1]
NULL
envp[0]
envp[1]
...
NULL
auxv # 辅助向量，ABI视角的额外参数
...
```
命令行参数和环境变量是紧挨着的

3. envp的结构
与argv类似，envp是一个以NULL结束的字符串数组
```c 
envp[0] = "PATH=/usr/bin"
envp[1] = "HOME=/home/user"
...
envp[n] = NULL
```
访问示例
```c 
#include <stdio.h> 

int main(int argc, char *argv[], char *envp[])
{
    for (char **p = envp; *p != NULL; p++) {
        printf("%s\n", *p);
    }
    return 0;
}
``` 

`envp`很少被提及，因为C标准库已经提供了更规范的接口

```c 
#include <stdlib.h> 
char *getenv(const char *name);
```
不同系统对`envp`的支持不完全一致，为了可移植性，通常只说前两个参数，但在Linux下，`envp`完全合法

4. 实际ABI中的main通常是四个参数
Linux程序入口不是main, 而是`_start`
```text 
_start -> __libc_start_main -> main 
```
`__libc_start_main`实际调用main的原型是（glibc中定义）
```c 
int main(int argc, char **argv, char **envp);
```
但此外，加载器还会传递
- `auxv`（辅助向量）
- 程序堆栈布局信息
- ELF header信息

只是这些不是传给main, 而是留在用户栈顶由glibc解析

`auxv`的定义（来自`<elf.h>`）
```c 
typedef struct {
    uint32_t a_type;
    uint64_t a_un;
} Elf64_auxv_t
```
它包含系统级关键信息
- 程序入口地址（AT_ENTRY）
- 页大小（AT_PAGESZ）
- 运行时动态链接器地址（AT_BASE）
- 程序头表位置（AT_PHDR）
- 随机数（AT_RANDOM）
- CPU特性（AT_HWCAP）

## 编译和执行
将上述代码保存为`hello.c`，在`hello.c`所在目录下执行：
- `gcc hello.c`进行编译
如果代码没有错误，命令提示符会跳到下一行，并生成`a.out`可执行文件
- `./a.out`执行程序
输出`Hello, World!`

### GCC的基本用法
假设有源文件`hello.c`
- `gcc hello.c`：编译生成可执行文件a.out（默认名）
- `gcc hello.c -o hello`：编译并指定输出文件名hello 

#### GCC链路的五个阶段
实际上，GCC的链路分为五个阶段，编译占前四个阶段
```bash 
# 1. 预处理：展开头文件和宏
gcc -E hello.c -o hello.i 

# 2. 编译：将预处理后的代码编译为汇编代码
gcc -S hello.i -o hello.s 

# 3. 汇编：将汇编代码转换为机器码（目标文件）
gcc -c hello.s -o hello.o 

# 4. 链接：将目标文件和库文件链接为可执行文件
gcc hello.o -o hello 

# 5. 加载：Loader运行时工作，加载不属于编译阶段，但实际执行前一定会发生
```

#### `cc`与`gcc`
有时，可以看到这样的命令
```bash 
$ cc main.c
```
1. `cc`是系统默认C编译器的抽象层
    - 在绝大多数类Unix系统中，`cc`不是具体编译器，而是一个符号连接或统一入口
    - 执行`cc`，系统会根据发行版、环境、安装情况，将它指向某个真正的编译器

`cc`是接口，不是实现，保持兼容性，让Makefile等构建工具可以使用通用的`cc`命令

2. `gcc`是GNU Compiler Collection 中的C编译器前端
    - `gcc`明确是GNU编译器
    - 功能更全，选项更多，版本特性更固定、可控

`gcc`是一个具体的武器

#### 多文件项目编译
```bash
# 直接编译多个源文件
gcc main.c utils.c helper.c -o myapp

# 或者先分别编译，再链接（适合大型项目）
gcc -c main.c 
gcc -c utils.c 
gcc -c helper.c 
gcc main.o utils.o helper.o -o myapp 
```
单纯`gcc main.c utils.c -o app`没问题，但构建性能差，每次都是全量编译\
专业做法
```text 
main.c -> main.o （只编译改过的文件）
utils.c -> util.o 
helper.c -> helper.o 
```
然后
```bash 
gcc main.o utils.o helper.o -o app 
```
这就是增量构建的原理，提高效率

#### 使用外部库
比如，源码用到了`<math.h> `
```c 
// math_example.c 
#include <stdio.h> 
#include <math.h> 

int main()
{
    double x = 4.0;
    printf("sqrt(%f) = %f\n", x, sqrt(x));
    return 0;
}
```
编译时需要链接数学库
```bash 
gcc math_example.c -o math_example -lm
```

#### 包含自定义头文件
```bash 
# 项目结构
# myproject/
#   ├── src/main.c
#   ├── src/utils.c
#   ├── include/utils.h
#   └── lib/

# 编译时指定头文件路径
gcc src/main.c src/utils.c -I./include -o myapp

# 如果使用了动态库
gcc src/main.c src/utils.c -I./include -L./lib -lmylib -o myapp
```
##### C文件本质结构
C文件天然分成三类
1. 声明（头文件）
    - 函数声明
    - 结构体声明
    - 常量定义
    - 宏
2. 实现（源文件）
    - 函数定义
    - 局部变量
    - 静态内部实现（static）
3. 接口（API）
对外暴露的可链接符，链接器最终会根据符号表决定是否能成功链接

### 完整项目结构示例
创建项目目录结构
```text 
myproject/
├── src/
│   ├── main.c
│   ├── math_utils.c
│   └── io_utils.c
├── include/
│   ├── math_utils.h
│   └── io_utils.h
├── build/
└── Makefile
```
编译运行
```bash 
# 进入项目目录
cd myproject

# 创建build目录
mkdir -p build 

# 编译
gcc src/*.c -I./include -o build/myapp 

# 运行
./build/myapp 
```
