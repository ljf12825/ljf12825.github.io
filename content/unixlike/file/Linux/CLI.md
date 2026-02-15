---
title: linux cli
date: 2026-01-14
draft: false
summary: linux cli and shell
---

# Linux CLI(Command Line Interface)
CLI(Command Line Interface)即命令行界面，是一种用户与计算机交互的方式，用户通过输入文本命令来控制计算机系统，而不是通过图形界面（GUI）进行操作。CLI是一种基于文本的用户界面，用户通过键盘输入命令，计算机则执行相应的操作并返回文本结果

- CLI的特点
    1. 文本输入输出：用户通过输入文本命令与计算机交互，结果也以文本的形式返回
    2. 高效和灵活：CLI通常比图形界面更加高效，尤其对于技术人员、开发者和系统管理员来说，能够快速执行批量操作、脚本执行、系统管理等任务
    3. 精确控制：命令行通常允许用户以非常精确的方式控制系统。用户可以通过组合不同的命令和选项来完成复杂的任务
    4. 无图形界面：CLI不依赖图形界面，因此占用的系统资源较少，运行速度较快

- CLI的优势
    - 高效性：用户可以通过键盘快速输入多个命令进行批量操作，不需要通过鼠标点击菜单等操作
    - 灵活性：CLI可以组合多个命令来执行复杂的操作，支持脚本编写，可以自动化很多任务
    - 资源占用少：由于没有图形界面，CLI界面占用的系统资源较少，适用于低资源环境
    - 远程操作：CLI非常适合远程操作和管理，比如通过SSH连接到远程服务器时，通常使用CLI进行系统管理和调试

## 命令提示符（Command Prompt）

在 Linux 中，命令提示符（Command Prompt）是 Shell 提供的一个接口，用户通过命令行输入命令与操作系统交互。命令提示符不仅仅是一个等待用户输入的标志，它通常会显示一些有用的信息，如当前目录、用户名、主机名等，帮助用户更好地理解当前的工作环境

在 Linux 中，命令提示符通常由 Shell 来控制，最常用的是 Bash（Bourne Again Shell）。Bash默认会显示一个包含系统状态信息的命令提示符

### 命令提示符组成部分

在Linux中，命令提示符通常包含以下几个元素

- 用户名：显示当前登录的用户
- 主机名：显示当前计算机或主机的名称
- 当前目录：显示用户所在的工作目录，`~`代表用户的主目录
- 权限符号：指示用户权限状态。对于普通用户通常是`$`，对于root用户是`#` 

示例
```bash 
user@hostname:home/user$ 
```
- user：当前登录的用户名
- hostname：当前计算机的主机名
- /home/user：当前工作目录
- $：表现普通用户的命令提示符

### Bash的命令提示符：PS1 
在Bash中，命令提示符的格式由环境变量`PS1`控制。`PS1`是一个存储命令提示符格式的变量，用户可以修改它来定制提示符的显示样式。通过修改`PS1`，可以改变命令提示符的内容和样式

在大多数Linux发行版中，`PS1`默认值类似于
```bash 
[\u@\h \W]\$
```

#### 常用的`PS1`转义符
Bash支持在`PS1`中使用一些转义符来定制提示符的样式
- `\u`：用户名
- `\h`：主机名（主机名的第一个部分，不包含域名）
- `\H`：主机名（包含域名）
- `\w`：当前工作目录的完整路径
- `\W`：当前工作目录的基目录（仅显示当前目录的名称）
- `\d`：当前日期，格式为`Weekday Month Date`
- `\t`：当前时间，格式为`HH:MM:SS`
- `\@`：当前日期，格式为`HH:MM AM/PM`
- `\#`：命令的历史记录编号
- `\$`：如果是普通用户显示`$`，如果是root用户显示`#`
- `\n`：换行符
- `\e[COLOR]`：用于设置颜色，例如`\e[32m`设置绿色

#### 命令提示符的定制
可以通过编辑`~/.bashrc`文件来修改`PS1`变量，从而定制命令提示符

##### 颜色和样式
可以为命令提示符添加颜色，使其更具可读性。Bash使用ANSI转义码来设置颜色\
例如，将提示符中的用户名显示为红色，目录显示为绿色
```bash 
PS1="\[\e[31m\]\u\[\e[0m\]@\[\e[34m\]\h\[\e[0m\]:\[\e[32m\]\w\[\e[0m\]\$ "
```
- `\[\e[31m\]`：设置文本为红色
- `\[\e[32m\]`：设置文本为绿色
- `\[\e[34m\]`：设置文本为蓝色
- `\[\e[0m\]`：重置颜色

#### 其他提示符设置
##### PS2（多行提示符）
`PS2`是多行命令提示符，在命令需要多行输入时会使用\
例如，当输入一个没有完整结尾的命令时，系统会显示`PS2`提示符，等待你继续输入\
默认的`PS2`设置为`PS2="> "`\
例如，当你输入一个不完整的命令时
```bash
$ echo "This is a long command
> that spans multiple lines"
```

##### PS3（select命令的提示符）
`PS3`是在使用`select`命令时的提示符，用于创建菜单选项。默认值通常是`#?`

##### PS4（调试模式提示符）
`PS4`用于调试脚本时设置提示符，默认值为`+`

## TTY(Teletypewriter)
Linux中的TTY原本指的是终端设备，尤其是早期的打印机终端设备，后来被用来代指所有的终端接口。在现代Linux系统中，TTY的含义更广泛，通常指的是系统中的文本终端，无论是物理终端（例如，串口连接）还是虚拟终端

### TTY的类型
1. 物理TTY（硬件TTY）：这些是连接到计算机的实际终端设备，早期的例子是通过串口与计算机连接的打字机，后来变成了专用的终端设备
    - 设备文件：`/dev/tty1`, `/dev/tty2`, ... `/dev/tty63`
    - 访问方式：通过`Ctrl + Alt + F1`到`F7`键进行切换
      - 通常`F1` - `F6`是文本控制台（`tty1` - `tty6`）
      - `F7`或`F1`（取决于发行版）通常留给图形桌面环境（X11或Wayland）
    - 特点：直接由内核管理，是系统最底层的用户接口

2. 虚拟TTY（虚拟控制台）：现代计算机通过虚拟控制台来模拟多个TTY,用户可以在每个虚拟终端上独立地进行操作。在Linux中，通常使用Ctrl + Alt + F1 到 F6来切换到不同的虚拟终端，这些终端会显示在不同的TTY上
    - 设备文件：`/dev/pts/0`, `/dev/pts/1`, ... （pts是”pseudo-terminal slave“的缩写）
    - 访问方式：在图形桌面中点击终端图标
    - 特点
      - 它们运行在图形界面之上
      - 每个打开的终端窗口通常对应一个独立的`/dev/pts/X`设备
      - 可以通过`tty`命令查看当前终端对应的设备文件

3. 伪终端（PTY）：伪终端通常用于在程序之间模拟交互式终端，最典型的例子就是通过终端程序（如SSH）连接到远程系统时，实际上是通过伪终端与系统交互。伪终端通常由两部分组成：主设备（master）和从设备（slave）

4. 串行端口
这最接近TTY的历史起源。它通过物理串行端口（如RS-232）连接终端设备。现在主要用于嵌入式系统开发、调试路由器或交换机等场景
    - 设备文件：`/dev/ttyS0`，`/dev/ttyS1`, ...（S代表Serial）

### TTY与控制台
- 控制台（Console）通常指的是与系统的主要输出和输入设备（如显示器和键盘）相关的终端。在Linux系统中，控制台通常是`/dev/console`
- TTY设备通常是指虚拟控制台或连接到系统的终端设备，它们是作为`/dev/ttyX`（X为数字）来表示的

### 关键组件与工作流程
一个完整的TTY子系统由三部分组成
1. 终端设备（`/dev/ttyX`, `/dev/pts/X`）
    - 这是提供给用户程序（如Shell）的接口。程序向这个设备文件写入数据，数据就会显示在终端屏幕上；程序从这个设备文件读取数据，就是在读取用户的键盘输入

2. 行规程（Line Discipline）
    - 这是TTY的”大脑“，一个位于内核中的中间处理层。它负责在用户输入的原始模式和加工模式之间转换
    - 加工模式（Cooked Mode / Canonical Mode）：这是默认模式。行规程会处理基本的行编辑功能，比如
      - 当按退格键，它会在将字符发送给程序前删除前一个字符
      - 当按`Ctrl+C`，它不会发送字符C,而是生成一个`SIGINT`信号来终止前台程序
      - 当按`Ctrl+Z`，它会生成`SIGTSTP`信号来挂起程序
      - 当按下回车，将整行数据发送给程序
    - 原始模式（Raw Mode）：在此模式下，行规程几乎不做任何处理。用户的每一个按键都会立即、原封不动地发送给应用程序。这对于像`vim`, `bash`（在命令行编辑时）、SSH客户端等需要精细控制输入的程序至关重要

3. UART驱动/终端模拟器
    - 对于物理串口，这是UART硬件驱动
    - 对于虚拟终端，这是一个在用户空间运行的终端模拟器程序（如GNOME Terminal），它模拟了物理终端的行为，并提供了一个图形窗口来显示输出和接收输入

#### 数据流向简化示例（在虚拟终端中）
1. 在GNOME Terminal里按下键盘按键`A`
2. 终端模拟器（GNEMO Terminal）捕获到按键，通过`/dev/ptmx`（伪终端主设备）将字符`A`发送给内核的行规程
3. 行规程（如果处于加工模式）可能会处理这个字符（比如，如果之前是退格键，则进行删除）
4. 行规程将处理后的数据放入`/dev/pts/0`（从设备）的缓冲区
5. Shell（比如bash）正在从`/dev/pts/0`读取输入，它读到了字符`A`
6. Bash处理这个字符，可能会将其回显。回显的流程反过来：Bash将字符`A`写入`/dev/pts/0` -> 行规程 -> 终端模拟器 -> 终端模拟器在窗口上绘制字符`A` 

### 使用TTY 
1. 切换虚拟终端：按下`Ctrl + Alt + F1 到 F6`，可以切换到不同的TTY,回到图形界面可以使用`Ctrl + Alt + F7 或者 F1`（具体取决于分配的设置）

2. 登录到TTY：可以在虚拟终端上使用用户名和密码登录。每个TTY都可以有一个独立的会话

### 相关的重要命令与文件
- `tty`：打印当前终端对应的设备文件路径
```bash 
$ tty 
/dev/pts/2 
```

- `who`或`w`：查看当前系统中有哪些用户登录，以及他们使用的是哪个TTY 
```bash 
$ who 
alice tty1 2025-10-22 17:06
bob pts/0 2025-10-22 17:07 
```

- `ps -ef`：查看进程运行在哪个TTY上（`TTY`列）
```bash 
$ ps -ef | grep bash
alice   1234  1233  0 10:23 tty1     00:00:00 -bash
bob     5678  5677  0 11:05 pts/0    00:00:00 -bash
```

- `stty`：查看和修改TTY设备的设置（即行规程的行为）
  - `stty -a`：显示所有当前设置
  - `stty sane`：如果终端设置混乱导致输入输出异常，可以使用这个命令重置
  - `stty echo` / `stty -echo`：开启/关闭回显（比如输入密码时）
- `/dev/tty`：这是一个特殊的”魔法“文件，它总是指向当前进程的控制终端。无论你在哪个TTY下，向`/dev/tty`写入都会显示在你自己的屏幕上
- `/dev/console`：系统控制台，通常指向当前活跃的TTY（可能是`tty0`或某个串口），用于接收内核启动消息和系统严重错误

#### 为什么`Ctrl+C`能终止程序
1. 当按下`Ctrl+C`
2. 终端模拟器收到这个组合键
3. 行规程识别出`Ctrl+C`不是一个普通的字符，而是一个特殊控制字符（对应ASCII码 0x03，即ETX）
4. 行规程不会将字符`0x03`发送给前台进程，而是会向前台进程组发送一个`SIGINT`信号
5. 程序收到`SIGINT`信号，默认行为是终止自己

## Shell
Shell = 壳\
它是操作系统中用户与内核之间的接口
  - 内核（Kernel）：底层，控制硬件和资源（CPU、内存、文件系统...）
  - Shell：接收用户输入（命令/脚本），翻译成系统调用，让内核去执行

Linux的Shell是一种命令行界面（CLI），允许用户与操作系统进行交互。它接受用户输入的命令，然后执行相应的操作。Shell既可以是一个用户与系统之间的“桥梁”，也可以是一个强大的脚本语言，用来自动化任务

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

## Terminal
在Linux中，Terminal是一个用于与操作系统交互的应用程序，它提供一个命令行界面（CLI）。通过Terminal，用户可以执行命令、运行脚本、管理文件、配置系统等。它是与计算机进行交互的一种非常强大的方式，尤其是对于开发者和系统管理员来说

### 定义
Terminal（终端）是一个文本界面程序，它允许用户通过键盘输入命令来与操作系统的内核交互。用户通过终端输入命令并接收操作系统的输出结果。Terminal本身不处理这些命令，它会将输入传递给操作系统的Shell（例如Bash, Zsh, Fish等），然后显示命令执行的结果

### 组成
- Shell：Terminal中运行的程序，解释用户输入的命令并执行。常见的Shell包括Bash（默认的Shell）、Zsh、Fish、Sh等 
- 提示符：在Terminal中通常会看到一个命令提示符（例如`user@hostname:~$`），它表示系统准备接收输入命令
- 终端程序：像GNOME Terminal、Konsole, Xterm, Terminator等是不同的终端仿真器，它们是用户使用命令行界面的应用程序

### 功能
- 执行命令：通过Terminal，用户可以执行各种操作系统命令来管理文件、运行程序、安装软件、配置系统等
- 脚本执行：Terminal允许运行Shell脚本，用户可以编写一系列命令并批量执行
- 文件管理：通过命令行工具（如`ls`, `cp`, `mv`, `rm`, `touch`）进行文件管理，查看目录内容，移动文件，复制文件，删除文件等
- 程序启动与调试：用户可以在Terminal中启动程序，也可以进行程序的调试，查看日志输出等
- 远程管理：通过SSH（Secure Shell）等协议，用户可以远程登录并管理其他计算机，通常通过Terminal完成

### 常见的Terminal仿真器
Linux系统中有很多Terminal仿真器，它们为用户提供了访问Shell的界面。常见的Terminal仪器包括
- GNOME Terminal：默认的GNOME桌面环境中的终端仿真器
- Konsole：KDE桌面环境中的终端
- Xterm：传统的终端仿真器，提供基本的功能
- Terminator：一个功能丰富的终端仿真器，支持多窗口分割
- Alacritty：一个注重性能的GPU加速终端
- LXTerminal：轻量级的终端仿真器，适用于LXDE

## Job Control

作业控制是Shell的一个功能，允许用户同时运行和管理多个进程（作业）。它让用户可以在前台和后台之间移动作业，暂停和恢复作业\
作业控制 = Shell借助内核的进程组 + 终端前台控制 + 信号，实现前台/后台切换、暂停、恢复

### 基本概念

#### 前台作业（Foreground Job）

与终端交互的作业，接收键盘输入和信号，一个终端只能有一个前台作业

#### 后台作业（Background Job）

在后台运行的作业，不接收键盘输入，可以同时运行多个后台作业

#### 四层结构

##### 1. 进程（process）

##### 2. 进程组（process group）

一组相关的进程，用PGID标识（通常等于leader的PID），用来整体接收信号

```bash
ls | grep foo
```

- `ls`是一个进程
- `grep`是一个进程
- 它们在同一个进程组

管道 = 一个进程组，这是作业控制的基石

##### 3. 会话（session）

- 一个进程组
- 由`setsid()`创建
- 有一个控制终端（controlling terminal）

通常

- 一个终端 = 一个session
- 一个shell = session leader

```text
Session
|__ 前台进程组（foreground PG）
|__ 后台进程组（background PGs）
```

##### 4. 作业（job）

作业不是内核概念，是Shell自己维护的结构

Shell里

```bash
sleep 100 | cat &
```

Shell会记录

- Job ID：`%1`
- 对应的PGID
- 状态：Running/Stopped

内核完全不知道`%1`这种东西

### 控制终端

控制终端通常是指tty/pty，它有一个关键属性：同一时刻，只允许一个进程组成为“前台进程组”，这个状态保存在内核的tty结构里

前台进程组可以从终端读取输入（`read`, `scanf`），接收键盘产生的信号\
后台进程组如果敢读终端，内核会向该进程组发送`SIGTTIN`（后台进程读终端，一定不行）或`SIGTTOU`（后台进程写终端，部分情况），它们的默认行为都是Stop（暂停），写终端不一定能会被暂停，因为很多程序允许后台打印日志

### Shell如何进行控制作业

以Bash为例，流程是这样的

#### 启动作业（前台）

```bash
vim file.txt 
```

Shell进行如下行为

1. `fork()`
2. 子进程`setpgid()` -> 新进程组
3. `tcsetpgrp(tty, pgid)` 把终端前台交给这个进程足足
4. `execve(vim)`
5. Shell`waitpid()`等待

#### 暂停作业

当按下`^Z`

1. 终端驱动捕获按键
2. 内核向前台进程组发送`SIGTSTP`
3. 进程默认行为：暂停
4. `waitpid()`返回`WIFSTOPPED`
5. Shell发现这个job被停
6. Shell重新拿回终端`tcsetpgrp()`，记录job状态 = Stopped

Shell并不是被信号暂停的那个，它是观察者

### 命令

#### 启动作业

```bash
# 正常启动
$ command

# 后台启动
$ command &
$ sleep 100 &

# 启动后立即转为后台
$ command
# 暂停
$ bg # 转为后台运行
```

#### 作业控制

```bash
# 列出所有作业
$ jobs
[1] - running sleep 200
[2] + stopped vim file.txt 

# 带详细信息的列表
$ jobs -l
[1] + 12345 Running sleep 200
[2] - 12346 Stopped vim file.txt

# 带进程组信息的列表
$ jobs -p
```

#### 前后台切换

```bash
# 暂停当前前台作业（^Z）
# 生成SIGSTP信号

# 将暂停的作业转为后台运行
$ bg [%job_number]

# 将作业带到前台
$ fg [%job_number]

# 示例
$ sleep 200 
# 暂停
[1] + 12345 suspended sleep 200
$ bg %1 # 后台继续运行
$ fg %1 # 带回前台
```

#### 作业标识符

```bash
%n # 作业号 n
%string # 以 string 开头的作业
%?string # 包含 string 的作业
%% 或 %+ # 当前作业（最近暂停或后台的）
$- # 前一个作业
```

#### 信号控制

`kill` 发送信号，默认发送`SIGTERM`

```bash
# 发送信号到作业
$ kill %1 # 终止作业1
$ kill -SIGSTOP %1 # 暂停作业1
$ kill -SIGCONT %1 # 继续作业1
```

##### 常用信号

- `SIGINT`： ^C 中断
- `SIGTSTP`： ^Z 请求暂停，可捕获、可忽略
- `SIGQUIT`：core dump
- `SIGCONT`： 继续运行
- `SIGTERM`： 可清理退出
- `SIGKILL`： 内核强杀
- `SIGSTOP`：强制暂停，不可捕获，不可忽略

```bash
kill -STOP pid
```

- `SIGTTIN`：后台进程读终端，默认暂停
- `SIGTTOU`：后台进程写终端（部分情况），默认暂停
- `SIGHUP`：控制终端挂断，shell退出时发给作业

#### 防止作业被挂起信号暂停

```bash
# 使用 nohup 运行作业
$ nohup command &

# 或
$ command &
$ disown # 从作业表中移除
```

#### 监视后台作业

```bash
# 等待后台作业完成
$ wait %1

# 等待所有后台作业
$ wait
```

#### 退出Shell时保持作业运行

```bash
# 使用 disown
$ disown %1 

# 或使用 setsid
$ setsid command
```

#### 示例

##### 下载文件时编辑文档

```bash
# 开始下载大文件
$ wget http://example.com/large-file.zip &
[1] 12345

# 编辑文档
$ vim notes.txt
# 暂停vim
[2] + 12346 suspended vim notes.txt

# 查看下载进度
$ jobs
[1] - 12345 Running wget http://example.com/large-file.zip
[2] + 12346 Stopped vim notes.txt

# 返回vim编辑
$ fg %2 
```

##### 编译项目

```bash
# 后台编译
$ make all &
[1] 12347

# 继续其他工作
$ ls -la 
$ grep "pattern" *.txt

# 检查编译状态
$ jobs
[1] + 12347 Running make all

# 如果有错误，带回前台查看
$ fg %1
```
