---
title: Shell
author: ljf12825
date: 2026-04-04
type: file
summary: overview of Shell and syntax of Shell
---

## 定义

Shell是一个接收用户输入命令并调用操作系统内核来执行任务的程序，它是用户与内核的桥梁

- 内核（Kernel）：底层，控制硬件和资源（CPU、内存、文件系统...），它是高精度且脆弱的，不能让认直接操作，否则一个错误指令就会导致内核崩溃
- 壳(Shell)：包在Kernel外部的外壳，起到保护和交互的作用，它接收用户输入（命令/脚本），翻译成系统调用，让内核去执行

CLI是一种交互方式/交互模式\
它回答的是：用户和计算机之间以什么形式对话，答案是：文本命令

Shell是一个具体的程序/软件\
它回答的是：谁来接收、理解、执行用户输入的命令，答案是：Shell程序（如Bash, Zsh）

这就像C/C++语言标准与不同编译器实现(MSVC, GCC, LLVM)，数据结构概念和具体实现（C++ STL, C# .NET）

为了方便自动化任务，Shell把自己接收和执行命令的这套语法规则系统化，形成了一门编程，即Shell Script Language；不同的Shell实现（如Bash, Zsh）有不同的Shell Script Language，但核心共通。大多数Shell都遵循POSIX Shell标准(`sh`标准)，所以基础语法是通用的，但每个Shell有自己的扩展语法

### Shell的类型

Shell不是只有一种，而是有很多实现：

- Sh(Bourne Shell)：最早的Unix Shell
- Bash(Bourne Again Shell)：Linux最常见的Shell，功能强大，几乎是默认标准
- Zsh：可定制性强，搭配Oh-My-Zsh用起来很炫酷
- Fish(Friendly Interactive Shell)：语法友好，自动补全更智能
- Csh/Tcsh：C like，早期流行

### Shell的两种使用方式
1. 交互式
  - 打开终端输入命令
  ```bash
  ls -l
  cd /home
  mkdir test
  ```
  - Shell逐条接收命令、执行、返回结果

2. 脚本式
  - 把一堆命令写进文件里(`.sh`)，让Shell一次性执行
  ```bash
  #!/bin/bash
  echo "Hello, Linux"
  for i in {1..5}; do
    echo "Count: $i"
  done
  ```
  - 执行：`bash script.sh`

这就是Shell脚本编程

### Shell提供的功能
- 命令执行：直接在Shell中输入命令，Shell解释并执行
  - 例如，输入`ls`列出目录内容
- 输入输出重定向：通过重定向符号（`>`,`>>`,`<`）控制输入输出流
  - 例如，`echo "Hello World" > output.txt`会将输出写入到`output.txt`文件
- 管道(`|`)：将一个命令的输出直接传递给另一个命令作为输入
  - 例如，`ps aux | grep 'python'`会列出所有与`python`相关的进程
- 命令替换：可以将命令的输出作为另一个命令的输入，使用反引号或`$()`语法
  - 例如，`echo $(date)`会输出当前的日期和时间
- 环境变量：Shell通过环境变量来存储系统的配置信息
  - 例如，`$HOME`表示当前用户的主目录，`$PATH`存储可执行文件搜索路径
- 命令别名：使用`alias`创建命令的别名，方便快捷
  - 例如，`alias ll='ls -l'`可以将`ll`作为`ls -l`的简写

### Shell脚本
Shell脚本是由一系列命令组成的文件，通常用于自动化重复性任务。脚本的基本语法如下
```bash 
#!/bin/bash 
# 这是一个注释

echo "Hello, Wrold!" # 打印输出
```
- `#!/bin/bash`：称为Shebang或Hashbang。它告诉系统使用哪个解释器来执行这个脚本。这是脚本的第一行，必须是绝对路径
- `# 这是一个注释`：以`#`开头的行是注释，不会被解释执行
- `echo "Hello, World!"`：一个简单的Shell命令，用于输出文本

#### Shebang 

Shebang（也叫hashbang或bang line）是指在脚本文件的第一行中的一个特殊符号`#!`，后面跟着解释器的路径，用于告诉操作系统该脚本文件应由哪个解释器来执行。它使得用户可以直接通过执行脚本文件来执行程序，而不需要显式地调用解释器（例如`bash script.sh`）

shebang是`#!`的读法(sh + bang)

- `#` -> hash/sharp
- `!` -> bang（感叹号的俚语说法）

在早期UNIX黑客圈里，`#!`被念作：sh-bang -> shebang

`#!`最早的用途是

```bash
#!/bin/sh
```

- `sh` = shell
- `bang` = `!`

##### Shebang语法
Shebang的基本形式是
```bash 
#!/path/to/interpreter 
```
- `#`和`!`组成的符号`#!`是一个固定的标志，用来告诉操作系统这是一个shebang行
- `/path/to/interpreter`是解释器的完整路径，例如`/bin/bash`， `/usr/bin/python3`等 

##### 如何工作
- Shebang行让脚本文件在执行时知道该用哪个解释器来执行它。当你运行一个脚本时，操作系统会读取脚本的第一行，看到`#!`后，自动去查找并调用执行的解释器（例如`/bin/bash`）
- 例如，如果有一个`hello.sh`脚本，并且它的第一行是
```bash 
#!/bin/bash 
```
当你通过命令`./hello.sh`来执行它时，系统会使用`/bin/bash`来解释和执行该脚本的内容，而不需要显式地在命令行中输入`bash hello.sh`

##### Shebang存在的意义
- 便捷性：它让脚本可以直接运行，而无需显式指定解释器。例如，只需`./script.sh`就能隐匿性脚本，而不是先运行`bash script.sh`
- 可移植性：Shebang使得脚本可以在不同的系统中运行，只要该解释器存在于相同的路径下。它还支持使用`/usr/bin/env`来查找解释器，这样即使解释器路径不同，脚本也可以在各种系统上运行
- 指定解释器：它允许你指定脚本需要的解释器，不论系统上默认的Shell是什么。这样就可以确保脚本按照你希望的方式执行

##### Shebang与文件权限
为了使脚本能够被执行，脚本文件必须具备执行权限。可以使用`chmod`命令赋予执行权限

##### Shebang与`/usr/bin/env`
有时，直接指定解释器的路径可能会在不同系统中产生问题，因为解释器的路径可能不同。例如，Python解释器可能位于`usr/bin/python`, `usr/local/bin/python`或`/bin/python`，这取决于安装方式和操作系统

为了解决这个问题，可以使用`/usr/bin/env`，它会自动查找环境变量中的解释器路径
```bash 
#!/usr/bin/env python3 
```
使用这种方式，系统会使用`env`查找系统中第一个可用的`python3`解释器，而不需要硬编码具体的路径

##### Shebang的例外
- 交互式Shell：如果在终端中直接启动一个Shell（如`bash`），而没有使用Shebang行，那么Shell会交互式地运行，而不会自动去找指定的解释器
- Shebang脚本的兼容性：大多数Linux系统支持Bash脚本的Shebang，但如果使用了不同类型的Shell（如Zsh），确保脚本首行指向正确的Shell解释器

##### 为什么有时候不写shebang也能运行



#### 如何执行脚本
1. 添加执行权限（推荐）：
```bash 
chmod +x hello.sh 
./hello.sh # 在当前目录下执行
```

2. 直接使用解释器（无需执行权限）
```bash 
bash hello.sh 
```
#### 变量
##### 定义和使用变量
- 定义：变量名=变量值（等号两边不能有空格）
- 使用：在变量名前加`$`符号，或者用`${变量名}`(推荐，明确变量边界)

```bash 
#!/bin/bash 

name="Alice"
age=30

echo "My name is $name."
echo "I am ${age} years old."

# 将一个命令的结果赋值给变量
current_time=$(date) # 或者用反引号 `date`
echo "Current time is: $current_time"
```
注意：变量名区分大小写，且默认都是字符串类型。进行数学运算需要特殊处理

##### 只读变量和删除变量
```bash 
#!/bin/bash 

readonly my_var="This is constant"
my_var="Change it" # 这行会报错

normal_var="To be delete"
unset normal_var
echo $normal_var # 输出空行
```

##### 环境变量和局部变量
- 环境变量：对所有Shell会话和子进程都可见，通常用`export`定义
- 局部变量：只在当前Shell脚本中可见

```bash 
#!/bin/bash 

local_var="I'm local"
export CLOBAL_VAR="I'm global"

# 在脚本中调用另一个脚本，GLOBAL_VAR会被传递过去
```

#### 字符串操作
Shell中的变量值通常都被当作字符串处理
```bash 
#!/bin/bash 

str="Hello World"

# 获取长度
echo ${#str} # 输出11

# 字符串切片
echo ${str:0:5} # 从索引0开始，截取5个字符，输出“Hello”

# 查找字符串（返回索引，从1开始计数）
echo `expr index "$str" "Wo"` # 输出 7

# 字符串替换
echo ${str/World/There} # 输出 “Hello There”

# 更多替换
path="/home/user/file.txt"
echo ${path%.txt} # 删除后缀，输出”/home/user/file"
echo ${path%/*} # 删除最后一部分，输出 “home/user”
echo ${path##*/} # 只保留最后一部分，输出“file.txt”
```

#### 传递参数
在执行脚本时，可以向其传递参数
```bash
#!/bin/bash
# 假设脚本名为 test.sh

echo "Script name: $0"
echo "First argument: $1"
echo "Second argument: $2"
echo "Number of arguments: $#"
echo "All arguments (as a string): $*"
echo "All arguments (as an array): $@"
echo "Exit status of last command: $?"
echo "Process ID (PID) of this script: $$"
```
执行`./test.sh arg1 arg2`，输出
```text 
Script name: ./test.sh
First argument: arg1
Second argument: arg2
Number of arguments: 2
All arguments (as a string): arg1 arg2
All arguments (as an array): arg1 arg2
Exit status of last command: 0
Process ID (PID) of this script: 12345
```
`$*`与`$@`的区别（在循环中尤其重要）
- `$*`：将所有参数都视为一个整体字符串（"arg1arg2"）
- `$@`：将每个参数视为独立的字符串（"arg1""arg2"）

#### 数组
Bash支持一位数组
```bash 
#!/bin/bash 

# 定义数组
fruits=("Apple" "Banana" "Orange")

# 按索引赋值
fruits[3]="Grape"

# 读取数组元素
echo ${fruits[0]} # 输出 Apple

# 读取所有元素
echo ${fruits[@]} # 输出所有元素为独立字符串
echo ${fruits[*]} # 输出所有元素为整体字符串

# 获取数组长度
echo ${#fruits[@]} # 输出 4

# 遍历数组
for fruit in "${fruits[@]}"; do 
    echo "Fruit: $fruit"
done 
```

#### 基本运算符
##### 算术运算符
在Bash中，不能直接用`a=1+1`，需要使用以下方式
1. `$(( ... ))`（最常用，推荐）
```bash 
a=$(( 10 + 5  ))
echo $a # 15 
echo $(( 10 % 3 )) # 取模，输出1 
(( a++  )) # 自增
```

2. `expr`命令（较老的方式）
```bash 
a=`expr 10 + 5` # 注意运算符两边的空格
```

3. `let`命令
```bash 
let "a = 10 + 5"
```

##### 关系运算符（常用于`[[]]`或`test`命令）
- `-eq`：等于
- `-ne`：不等于
- `-gt`：大于
- `-lt`：小于
- `-ge`：大于等于
- `-le`：小于等于

##### 字符串运算符
- `=`或`==`：相等
- `!=`：不相等
- `-z`：字符串长度为0（空）
- `-n`：字符串长度非0
- `str`：检查字符串是否不为空（简单写法）

##### 文件测试运算符
- `-e file`：文件/目录是否存在
- `-f file`：是否是普通文件
- `-d file`：是否是目录
- `-r file`：是否可读
- `-w file`：是否可写
- `-x file`：是否可执行
- `-s file`：文件大小是否大于0（非空）

#### 流程控制
##### 条件语句`if`
```bash 
#!/bin/bash 

if [[ condition  ]]; then 
    # 执行命令
elif [[ condition2  ]]; then 
    # 执行命令
else
    # 执行命令
fi 
```
`[  ]` vs `[[  ]]` vs `test`
- `test expression`和`[ expression ]`是等价的，是POSIX标准，但功能较弱
- `[[ expression ]]`是Bash的扩展，功能更强大、更安全（例如，支持`&&`, `||`，字符串比较不需要引号也能处理空格）

示例
```bash 
#!/bin/bash 

read -p "Enter a number: " num 

if [[ $num -gt 10 ]]; then 
    echo "Number is greater than 10."
elif [[ $num -eq 10 ]]; then 
    echo "Number is exactly 10."
else 
    echo "Number is less than 10."
fi 

# 检查文件
file="/path/to/file"
if [[ -f "$file" && -r "$file" ]]; then 
    echo "File exists and is readable."
fi 

# 字符串比较
name="Bob"
if [[ $name == "Bob" ]]; then 
    echo "Hello, Bob!"
fi 
```

##### 选择语句`case`
```bash 
#!/bin/bash 

read -p "Enter yes or no: " answer 

case $answer in 
    [Yy]|[Yy][Ee][Ss])
        echo "You agreed."
        ;;
    [Nn]|[Nn][Oo])
        echo "You disagreed."
        ;;
    *)
        echo "Invalid input"
        ;;
esac 
```

##### 循环语句
`for`循环
```bash 
#!/bin/bash 

# 遍历值列表
for color in red green blue; do 
    echo "Color is $color"
done 

# 遍历命令输出
for file in $(ls *.txt); do 
    echo "Processing $file"
done 

# C语言风格
for (( i=0; i<5; i++ )); do 
    echo "i=$i" 
done 
```

`while`循环
```bash 
#!/bin/bash 

count=1
while [[ $count -le 5 ]]; do 
    echo "Count: $count"
    ((count++))
done 

# 读取文件逐行处理（经典用法）
while IFS= read -r line; do 
    echo "Line: $line"
done < "/path/to/file"
```

`until`循环（与`while`相反，条件为假时执行）
```bash 
#!/bin/bash 

count=1 
until [[ $count -gt 5 ]]; do 
    echo "Count: $count" 
    ((count++))
done 
```
循环控制：
- `break`：跳出整个循环
- `countinue`：跳过本次循环，进入下一次

#### 函数
函数用于封装可重用的代码块
```bash 
#!/bin/bash 

# 定义函数
my_function() {
    local local_var="I'm local" # 局部变量，推荐使用
    echo "Hello from function"
    echo "First argument to function is: $1" # 使用函数自己的参数
    return 0 # 返回值（0-255），通常0表示成功
}

# 另一种定义方式
function another_func {
    echo "Another function"
}

# 调用函数
my_function "arg1"

# 获取函数返回值
my_function
echo "Function exit status: $?"
```
注意：函数内的变量默认是全局的，使用`local`关键字可以定义局部变量

#### 输入输出重定向

#### 调试技巧
- `-x`：跟踪执行，显示每一行命令及其参数
```bash 
bash -x your_script.sh 
# 或在脚本开头 set -x 
```
- `-e`：遇到错误（命令返回非零状态）立即退出脚本
- `-u`：遇到未定义的变量时报错
- `-o pipefail`：管道中任何一个命令失败，整个管道就失败

通常可以在脚本开头这样写
```bash 
#!/bin/bash 
set -euo pipefail # 严格的错误处理模式
```

### Bash

Bash(Bourne Again Shell)是一个命令行解释器和脚本语言，是Linux和macOS等类Unix操作系统中最常用的Shell之一。Bash是由Brian Fox为GNU项目开发的，是Unix的Bourne Shell(sh)的替代品，因此得名"Bourne Again Shell"

Bash不仅作为一个交互式命令行解释器使用，也广泛用于编写脚本来自动化各种系统管理任务、应用程序部署等工作
