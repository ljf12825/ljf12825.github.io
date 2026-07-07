---
title: C/C++ Main Function
author: ljf12825
date: 2026-07-01
tags: [C/C++]
summary: Principle of main function in C/C++
---

C/C++中，`main`不是普通函数，它是程序和运行时(CRT)、操作系统之间约定好的入口函数

## 标准

根据标准，可移植的`main`函数签名只有三种
```c
int main(); // 参数未指定
int main(void); // 无参数
int main(int argc, char* argv[]); // 带参数
```

像`void main()`这种写法是不符合标准的\
此外，很多实现(如Linux/Unix环境)支持第三个环境变量参数

```c
int main(int argc, char* argv[], char* envp[]);
```

- `envp`同样是一个指向可修改字符串的指针数组

### 为什么会有`void main()`这种写法

`void main()`可以在某些编译器上运行，但它不是标准C，也不是标准C++的合法写法\
标准规定`main`必须返回`int`，而不是`void`

操作系统需要知道程序是如何退出的

例如

```c
int main() {
    return 5;
}
```

5就是程序的退出状态码(Exit Status)

Shell、脚本、父进程都会根据这个返回值判断程序是否执行成功

```bash
if ./program; then
    echo "success"
else
    echo "failed"
fi
```

实际上就是在检查`main`返回的`int`

为什么很多书上会写`void main()`

这是历史原因，一些编译器（尤其是Turbo C, Borland C++，某些DOS编译器）允许`void main()`。因为当时

- 没有严格遵循标准
- DOS对退出码要求不高
- 编译器为了方便教学放宽了限制

很多教材直接照着写，于是流传了很久\
但是今天主流编译器都建议甚至要求使用标准规定写法\
有些编译器为了兼容旧代码，会接受`void main()`\
如果开启严格标准

```bash
g++ -std=c++23 -pedantic
```

通常会报类似的错误

```txt
error: 'main' must return 'int'
```

## 返回值

C/C++标准规定

- `main`返回0表示成功终止程序
- 返回`EXIT_SUCCESS`也表示成功
- 返回`EXIT_FAILURE`表示失败

比如

```cpp
#include <cstdlib>

int main() {
    return EXIT_SUCCESS;
}
```

或者

```cpp
#include <cstdlib>

int main() {
    return EXIT_FAILURE;
}
```

都是标准推荐的写法

0表示一定成功

```cpp
int main() {
    return 0;
}
```

标准规定：这一定表示程序正常结束\
因此`return 0;`等价于`return EXIT_SUCCESS;`

此外在C++中

```cpp
int main() {}
```

也是合法的\
如果执行到`main`的末尾没有写`return`，编译器会自动当作`return 0;`

但是标准没有规定非零表示什么，非零的定义由操作系统、运行环境或程序自己约定

比如Linux（POSIX)规定，退出码是一个8位整数，也就是说`0~255`，真正会保存的只有低八位\

```cpp
return 300;
```

实际上：300 % 256 = 44

```bash
echo $?
```

得到44

```cpp
return -1;
```

实际上是`255`，因为`-1`会变成`0xFFFFFFFF`，低八位就是`255`

Linux上有很多自己的约定，比如

```txt
0 成功
1 一般错误
2 参数错误
126 找到文件但不能执行
127 找不到命令
128 + n 被信号n终止
```

例如

```bash
$ asdfasdf
```

输出

```txt
command not found
```

然后

```bash
echo $?
```

得到`127`

这是Shell的约定，不是C++标准规定的

对于Windows来说，退出码一般是

```txt
DWORD
```

也就是32位\
所以Windows不受Linux的0~255限制，很多Windows API都返回`0xC0000005`这种退出码

## 参数

```c
int main();
int main(void);
```

这两种写法在C语言中是不同的\
`int main()`表示参数未指定，调用时仍可传参（这是C语言的遗留设计，从C89开始就存在了）\
`int main(void)`表示此函数不接受任何参数，`int main(void)`这种写法是标准且推荐的，反而写`int main()`显得不够严谨

但是在C++中

```cpp
int main();
int main(void);
```

就没有区别，虽然也是合法的，但是在C++中是完全等价的，C++从一开始就取消了C的“未指定参数列表”这一规则

```c
int main(int argc, char* argv[]);
```

看上述`main`函数的标准签名，这是显式接收命令行参数的写法，其中

- `argc`(Argument Count)代表参数数量，这个值恒大于等于1，因为程序永远包含一个叫做自己名字的参数
- `argv[]`(Argument Vector)是参数列表，相应的`argv[0]`就是程序的名字

例如

```bash
./program hello world
```

argc = 3

```txt
argv[0] -> "./program"
argv[1] -> "hello"
argv[2] -> "world"
```

特别需要注意的是，为什么`argv[]`的类型是`char*`，而不是`const char*`\
这意味着，命令行参数进入程序后可以被修改

事实上，确实如此\
这是C语言的遗留接口，几十年前标准制定者认为命令行参数在进入程序后，允许被程序内部修改，并且这些值在程序的整个生命周期内都有效

- C标准(C11 5.1.2.2.1)提到：`argv`所指向的字符串组成的数组，其内容可以被程序修改
- C+标准也沿用了这一规定，明确允许修改`argv`中的字符

当在终端写下`./program command arg0 arg1`时，Linux内核会做以下几件事

- 为该进程划分一块专属的内存空间，叫做栈
- 把终端中的字符，从终端进程里拷贝一份，塞进这个新的进程的栈顶
- 在栈上创建一个指针数组，让`argv[0]`, `argv[1]`分别指向这些刚拷贝过来的栈内存

`argv`指向的字符串，在运行时就是在进程的栈内存里的，是完全可读可写的

那么这种行为的意义是什么，看以下两个场景：

### 场景一：隐藏敏感信息

假设写了一个数据库备份工具，用户是这样启动它的

```bash
./backup_tool --user root --password my_secret_password_123
```

在Linux下，任何其他人只需要在终端输入`ps -aux`或者`cat /proc/<PID>/cmdline`，就能把这个进程的启动参数看个精光，用户的密码就泄漏了

为了安全，很多优秀的底层软件（比如Redis, MySQL）在`main`函数一启动时，会立刻就修改`argv`里的内容

```cpp
if (strcmp(argv[3], "--password") == 0) {
    memset(argv[4], 'X', strlen(argv[4])); // 把密码区域全部变成XXXXXX
}
```

这样别人再用`ps`命令偷看时，只能看到`XXXXXX`

### 场景二：修改进程在系统的显示名称

在Linux下用`ps`查看进程时，显示的名字默认是可执行文件名（比如`./program`)\
但是在很多高并发的分布式服务（比如Nginx或PostgreSQL）中，一个主进程会fork出很多子进程。为了能一眼看出哪个子进程在干什么，子进程会直接就地覆盖修改`argv[0]`

```cpp
strcpy(argv[0], "nginx: worker process running...");
```

这样在执行`ps`命令时，就能清晰地看到进程的状态变化

其实上述场景并不是`char* argv[]`的最根本原因，最根本原因还是历史包袱

C语言诞生于1972年，而`const`关键字直到1989年（C89标准）才被正式引入。在C语言诞生之初的十几年时间里，根本没有“只读”的概念\
当`const`诞生时，`int main(int argc, char* argv[])`早就成为全球数百万行底层代码的核心基石。如果贸然强行修改函数签名，会让全世界所有古老的C/C++代码在编译时全部报错瘫痪

### envp

```c
int main(int argc, char* argv[], char* envp[]);
```

它多了一个参数`char* envp[]`表示进程启动时的环境变量(Environment Variables)数组

例如Linux

```bash
export MY_NAME = Tom
export AGE=20
```

运行程序

```bash
./program
```

程序中

```cpp
for (char** p = envp; *p != nullptr; ++p) {
    std::cout << "*p" << '\n';
}
```

可能输出

```txt
HOME=/home/user
PATH=/usr/bin:/bin
USER=ljf12825
MY_NAME=Tom
AGE=20
LANG=en_US.UTF-8
...
```

可以理解为

```txt
envp
v
+-------------------------+
| "PATH=/usr/bin:..."     |
+-------------------------+
| "HOME=/home/user"       |
+-------------------------+
| "USER=ljf12825"         |
+-------------------------+
| "LANG=en_US.UTF-8"      |
+-------------------------+
| NULL                    |
+-------------------------+
```

每个元素都是`KEY=VALUE`形式的字符串

当执行

```bash
./program hello world
```

实际上发生了大致如下的过程

```txt
Shell
|
|-- argv[]
|-- envp[]
|
v
execve()
|
v
Kernel
|
v
新进程
|
v
main(argc, argv, envp)
```

也就是说，Shell把命令行参数和环境变量整理好，通过系统调用交给内核，内核创建新进程后再把这些数据放到新进程的初始用户栈中。运行时启动代码会从初始栈中取出这些信息，最后调用`main`

大多数时间很少见到`envp`\
首先，它不是可移植的\
其次，大多数程序直接使用标准库提供的接口获取环境变量

```cpp
#include <cstdlib>

const char* path = std::getenv("PATH");
```

或在Linux中直接使用

```cpp
extern char** environ;
```

所以三参数虽然很多编译器支持，但它不是标准规定的`main`形式

## 现代C++的最佳实践：尽早“只读化”

正因为`argv`指向的原始内存可修改且类型不安全，现代C++强烈建议不要直接操作`argv`，而是立即将其封装到更安全的容器中。这样做可以把不安全的边界限制在程序的最开始，让主体逻辑更安全、清晰

比如，可以直接将参数写入`std::vector<std::string>`，此时数据就从原始的、可被覆盖的栈内存，转移到了由`std::string`管理的独立内存中，并且自动获得了值语义和类型安全

```cpp
#include <vector>
#include <string>

int main(int argc, char* argv[]) {
    std::vector<std::string> args(argv, argv + argc);

    if (args.size() >= 4 && args[3] == "--password") {
        std::string password = args[4];
    }
}
```

这种封装后的`args`向量与`argv`指向的原始内存已无关联。如果需要实现“隐藏密码”这类功能，必须在封装前直接对`argv`指针进行`memset`或直接覆盖操作。一旦数据被拷贝到`std::string`，修改`argv`就失去安全意义了

## 程序启动流程




