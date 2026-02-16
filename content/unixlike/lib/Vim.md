---
title: Vim
date: 2025-12-31
categories: [Linux]
tags: [Editor]
author: "ljf12825"
type: blog
summary: usage of vim
---

# vi（历史背景 from Wikipedia）

vi是一款面向屏幕的文本编辑器，最初是为Unix操作系统创建的。vi的可移植行为子集以及它所支持的ex编辑器语言，被Single UNIX Specification 和 POSIX标准正式规范\
vi实际上是更早的ex编辑器的一个模式（visual mode），而不是一个独立的程序\
最初的ex只有行编辑能力，没有全屏显示。1976年，Bill Joy 为ex增加里visual编辑模式。`ex`启动进入行模式，`vi`启动进入visual模式\
`vi`这个名字来自ex中的`visual`命令的最短不歧义缩写\
vi的技术源头是ed(Unix最早的行编辑器)，ed为电传打字机（TTY）设计，极其简陋。1976年，George Coulouris基于ed开发里em(editor for mortals)，Bill Joy在UC Berkeley借鉴em改造ed,开发出ex,再在ex中加入全屏visual模式 -> vi. vi的很多思想（如模式编辑，`.`重复命令）借鉴自Xerox PARC的Bravo编辑器\
Bill Joy使用的是ADM-3A终端，`Esc`键位就是现代键盘的`TAB`键位，没有独立方向键，而是和`hjkl`键共用，300波特率调制解调器非常慢。因此，命令设计极度简洁，支持“提前输入”，鼓励不离开主键区操作，这直接塑造了vi今天的操作方式\
1978年，vi(ex 1.1)随BSD Unix发布，很多Unix系统免费自带vi,这是vi普及的决定性原因之一。后来AT&T System V,各商业Unix(Sun, HP, IBM, DEC)都内置并维护自己的vi变种。最终vi成为Unix世界的事实标准编辑器，并被POSIX明确要求支持\
由于早期vi代码依赖AT&T Unix授权，无法自由分发，于是出现了大量兼容克隆：Elvis(1990), nvi(BSD官方替代)，Vim（从Stevie演化而来），BusyBox vi, Neovim（Vim的现代重构）。BSD系统最终使用nvi，Linux和macOS世界则几乎全面采用Vim/Neovim\
vi是一个模态编辑器（modal editor），学习曲线陡峭，但熟练后效率极高\
原始vi(POSIX vi)的能力非常有限：无语法高亮，无插件系统，无LSP/补全，无现代编码支持（UTF-8）支持不完整，无多窗口/多标签（或极其原始）。它的定位是：最低可用编辑器，而不是高效开发环境。vi当年的核心使命是：在任何Unix系统上，在极端受限环境下，提供一个可视化文本编辑能力。而现在，终端性能不再是瓶颈，GUI编辑器普及，SSH环境也能跑功能完整的Vim,原始vi不需要再承担主力开发工具的角色，而是成为一种标准和哲学，活在现代vi分发版本中

# Modal Editor

模态编辑器指的是编辑操作分不同“模式”来完成的文本编辑器，而不是像普通的编辑器那样随时都在“插入文字”状态

## 核心思想

在模态编辑器中，键盘的输入行为取决于当前模式

- 普通模式（Normal Mode）
主要用来浏览、移动光标、删除、复制、粘贴等操作，按下字母并不会直接插入文字
- 插入模式（Insert Mode）
像常见编辑器一样，输入的字符直接写入文件
- 命令模式（Command/Ex Mode）
可以执行保存、查找替换、退出等命令

不同模式下，同样的键盘按键代表着不同的功能，这就是模态的本质

## 优势

- 双手不离开主键区
- 命令高度可组合
- 编辑操作高度抽象

## 缺点

- 模式切换反馈弱
- 新手极易“输错模式”

# Vim
Vim是一款免费开源的文本编辑器。Vim既提供终端屏幕用户界面，也提供图形用户界面（gvim）\
Vim的文档将其描述为旧版vi文本编辑器的改进版本。在发布信息中，作者最初暗示Vim是Vi Imitation的缩写。但后来，由于作者所描述的功能已经超越了vi克隆版，因此其缩写改为Vi IMproved.

- [vim.org](vim.org)
- git@github.com:vim/vim.git

## 安装
大部分Linux发行版都自带Vim,但通常是精简版（`vim-tiny`），目的是提供默认语义，现代开发架构和教程默认vi存在。以及在最坏情况下保证正常使用。Linux允许同一软件多版本存在，通过alternatives进行管理。如果想要完整版本，需要手动安装

### 通过包管理器安装
通过包管理器安装的vim通常是系统编译好的Vim,能满足最低使用，但可能不会支持一些功能如剪贴板，语言支持等，且版本可能会滞后
- Debian
```bash 
sudo apt install vim 
```
- Arch Linux 
```bash 
sudo pacman -S vim 
```

### 从源码安装
从源码编译安装Vim可以让你根据自己的需求定制Vim的功能

1. 安装必要的依赖
```bash 
sudo apt update 
sudo apt install -y git build-essential ncurses-dev 
```
对于其他Linux发行版，安装方式可能不同，但大致依赖是`git`, `build-essential`（或`gcc`, `make`）和`ncurses`库

2. 获取Vim源码
```bash 
git clone https://github.com/vim/vim.git
```
3. 配置编译选项
进入Vim源码目录并执行`./configure`来设置编译选项。可以通过`./configure --help`查看可用的选项。以下是一些常用的编译选项
- `--enable-gui=gtk2`：启用GTK2图形界面（如果需要图形界面版本）
- `--with-feature=huge`：启用尽可能多的功能
- `--enable-multibyte`：支持多字节字符集（如果需要支持其他语言）
- `--enable-python3interp`：启用Python3插件支持
- `--enable-cscope`：启用Cscope支持

示例：如果只想编译一个支持Python3和最大功能的Vim,可以这样写
```bash 
cd vim 
./configure --with-feature=huge --enable-python3interp --enable-multibyte
```

当运行`./configure`时，它会生成一个名为`config.log`的文件，里面详细记录了配置过程中检查每个功能是否可用的结果\
在运行`./configure`后，它会生成一个`Makefile`文件，其中包含了配置的选项。在其中，可以找到一些启用的功能，尤其是和编译相关的设置

4. 编译Vim
配置完成后，使用`make`命令进行编译。这一步会编译Vim的所有源代码，过程可能需要几分钟时间，取决于机器性能

5. 安装Vim
编译完成后，可以用以下命令进行安装
```bash 
sudo make install 
```

6. 检查安装
安装完成后，可以通过以下命令检查Vim是否正确安装
```bash 
vim --version 
```
如果显示了你配置时选择的功能选项，说明安装成功

7. 卸载Vim
如果不再需要编译版的Vim,或者想要重新配置，使用以下命令卸载
```bash 
sudo make uninstall
```
如果需要卸载其他版本的Vim,记得先删除系统的Vim或将其替换

## 使用
### 内置帮助
Vim自带一个完整、详细的帮助系统，可以在终端里直接访问\
基本命令
```vim 
:help " 打开帮助页
:help <topic> " 查询某个主题
:help user-manual " 打开用户手册
```

### Vim Tutor
Vim Tutor是Vim自带的交互式入门教程，用于帮助新手快速掌握Vim的基础操作，它直接在终端中运行，不需要额外安装\
在CLI中的
```bash 
vimtutor 
```
这个命令会打开一个交互式教程文件，通常路径在
```text  
/usr/share/vim/vim<edition>/tutor/tutor<language>.txt
```
中文教程为
```bash 
vimtutor zh 
```

## 配置

## Vimscript


### Vim
**启动与退出**\
- `vim <filename>` 打开文件
- `:q` 退出（无修改时）
- `:q!` 强制退出（不保存）
- `:w` 保存
- `:wq`或`:x` 保存并退出

**模式切换**\
Vim有多种模式，常见的有：
- 普通模式（Normal Mode）
  - 默认模式，用于导航和命令操作
- 插入模式（Insert Mode）
  - 在此模式下可以编辑文本
- 命令模式（Command Mode）
  - 用来执行保存、退出等命令
- 可视模式（Visual Mode）
  - 选择文本进行操作，如复制、粘贴、删除、格式化等

**普通模式**\
启动Vim时，默认进入普通模式，或从其他模式按`Esc`进入普通模式\

常见操作
1. 导航：在普通模式下，移动光标是最常见的操作
  - `h`：光标左移
  - `j`：光标下移
  - `k`：光标上移
  - `l`：光标右移
  - `w`：跳到下一个单词的开头
  - `b`：跳到当前单词的开头
  - `0`：跳到行首
  - `$`：跳到行尾
  - `gg`：跳到文件的第一行
  - `G`：跳到文件的最后一行
  - `Ctrl-u`：向上滚动一页
  - `Ctrl-d`：向下滚动一页

2. 删除文本
  - `d`：删除（需要指定范围，例如`dw`删除一个单词，`dd`删除整行）
  - `d$`：删除从光标当前位置到行尾的所有文本
  - `d0`：删除光标从当前位置到行首的所有文本

3. 复制和粘贴
  - `y`：复制（需要指定范围，例如`yw`复制一个单词，`yy`复制一行）
  - `p`：粘贴（在光标后粘贴）
  - `P`：粘贴（在光标前粘贴）

4. 替换文本
  - `r<char>`：将光标所在的字符替换为指定字符。例如，`rx`会将光标处的字符替换成`x`
  - `s`：删除光标处的字符并进入插入模式
  - `cc`：删除当前行并进入插入模式

5. 撤销和重做
  - `u`：撤销最近的操作
  - `Ctrl-r`：重做最近的撤销操作

6. 查找
  - `/text`：向下查找text，然后按`n`查找下一个匹配项，`N`查找上一个匹配项
  - `?text`：向上查找`text`，然后按`n`查找下一个匹配项，`N`查找上一个匹配项

7. 替换
  - `:s/old/new/g`：替换当前行的所有`old`为`new`
  - `:%s/old/new/g`：替换文件中所有的`old`为`new`

8. 打开和关闭文件
  - `:e filename`：打开指定的文件
  - `:w`：保存当前文件
  - `:q`：退出当前文件
  - `:wq`：保存并退出
  - `:q!`：强制退出，不保存修改

9. 其他操作
  - `.`：重复上一个修改操作
  - `Ctrl-o`：跳到上一个位置
  - `Ctrl-i`：跳到下一个位置

**插入模式**\
在Vim中，插入模式可以直接输入文本，当处于插入模式时，可以像使用任何普通文本编辑器一样，输入和编辑内容\
在Vim的普通模式下，可以通过输入以下指令进入插入模式：
- `i`：在光标前插入文本
- `I`在光标所在行的行首插入文本
- `a`：在光标后插入文本
- `A`：在光标所在行的行尾插入文本
- `o`：在当前行下方插入一行（并进入插入模式）
- `O`：在当前行上方插入一行（并进入插入模式）

1. 在插入模式下的基本操作
  - 输入文本：进入插入模式后，可以像普通文本编辑器一样输入字符
  - 删除字符：按`Backspace`键删除光标前的字符，或按`Delete`键删除光标后的字符

2. 退出插入模式
  - 按`Esc`键：返回普通模式

3. 插入模式的快捷操作
  - 光标移动，在插入模式中，仍然可以使用箭头键或`Ctrl + h`（删除字符）等快捷键来移动光标或字符
  - 自动完成：在插入模式下，Vim可以自动完成单词或命令。按`Ctrl + n`或`Ctrl + p`来启用自动完成（向前和向后）

插入模式使用场景\
1. 直接输入文本：插入模式是直接输入或编辑文件内容的地方，通常是处理普通文本、代码注释、字符串等的场景
2. 编写代码：虽然Vim的强大之处在于普通模式下的操作，但在插入模式下可以像使用普通编辑器一样快速编写代码

**命令模式**\
在Vim中，命令模式允许执行一些文件级的操作，比如保存、退出、查找、替换、设置选项等\
命令模式是Vim操作的核心之一，可以通过命令来控制Vim的行为\

如何进入命令模式：
- 按`:`键从普通模式进入命令模式
- 在命令模式下，可以输入各种命令，并按`Enter`执行

场景命令模式操作
1. 保存文件
  - `:w`：保存当前文件，但不退出Vim
  - `:w filename`：保存文件并为其指定新的文件名

2. 退出Vim
  - `:q`：退出Vim，如果文件没有保存，Vim会警告
  - `:q!`：强制退出Vim，不报错文件中的修改
  - `:wq`或`:x`：保存文件并退出
  - `:wq!`：强制保存并退出

3. 查找和替换
  - 查找
    - `: /pattern`：查找`pattern`，按`n`查找下一个匹配项，`N`查找上一个匹配项
    - `:?pattern`：向上查找`pattern`

  - 替换
    - `:s/old/new/`：替换当前行中的第一个`old`为`new`
    - `:s/old/new/g`：替换当前行中的所有`old`为`new`
    - `:%s/old/new/g`：替换文件中的所有`old`为`new`
    - `:%s/old/new/gc`：替换文件中的所有`old`为`new`，并在每次替换前询问确认

4. 文件跳转
  - `:e filename`：打开或编辑指定文件
  - `:bn`：跳转到下一个缓冲区（打开的文件）
  - `:bp`：跳转到上一个缓冲区
  - `:b N`：跳转到第N个缓冲区
  - `:args`：查看打开的文件列表

5. 撤销和重做
  - `:undo`：撤销上一步操作
  - `:redo`：重做已撤销的操作

6. 设置Vim选项
  - `:set number`：显示行号
  - `:set nonumber`：隐藏行号
  - `:set tabstop=4`：设置制表符宽度为4个空格
  - `:set expandtab`：使用空格代替制表符
  - `:set autoindent`：自动缩进

7. 查看和跳转到文件行
  - `:line_number`：跳转到指定的行号
  - `:n`：跳转到第n个文件的当前位置（如果有多个文件已打开）
  - `:normal <command>`：执行普通模式命令

8. 帮助命令
  - `:help`：显示Vim的帮助文档
  - `:help command`：显示特定命令的帮助文档
  - `:q`：退出帮助文档

9. 执行外部命令
  - `:!command`：执行外部命令并返回结果
  - `:w !command`：将当前文件通过管道传递给外部命令并保存其输出

10. 退出其他模式
  - `normal`：退出插入模式并返回普通模式

**命令模式的特点**\
- 输入方式：命令模式以`:`开头，输入命令后按`Enter`执行
- 全局命令：命令模式中的操作通常影响整个文件或Vim的全局设置，而不是单纯的光标或行操作
- 快捷键：在命令模式下，可以利用键盘快捷键进行某些命令
- 命令历史：命令模式支持命令历史，可以通过按上下箭头浏览之前输入的命令

**命令模式应用场景**\
- 保存和退出：可以在编辑完文件后使用命令模式保存文件或退出Vim
- 查找和替换：命令模式非常适合进行复杂的查找和替换操作，尤其是需要对文件中的大量内容进行批量修改时
- 配置Vim：在命令模式下设置Vim行为（如行号显示、制表符宽度）
- 执行外部命令：命令模式可以在Vim内部运行外部命令，灵活集成工作流

**可视模式**\
可视模式允许选择文本进行操作

如何进入可视模式\
在普通模式下：
- `v`：进入字符选择模式（Visual Mode）。按此键后，光标将开始选择字符，可以通过移动光标来扩展选择区域
- `V`：进入行选择模式（Visual Line Mode）。按此键后，会选择光标所在的整行，移动光标可以选择更多的行
- `Ctrl` + `V`：进入块选择模式（Visual Block Mode）。这是一个非常强大的模式，允许选择矩形区域（列选择），尤其适用于对列式数据或代码进行操作

**可视模式操作**\
一旦进入可视模式，可以通过以下方式进行文本选择和编辑

1. 选择文本
  - 字符选择模式（`v`）：按`v`进入字符选择模式后，可以通过移动光标（`h/j/k/l`、方向键等）来选择字符。选择的文本将高亮显示
  - 行选择模式（`V`）：按`V`进入行选择模式后，Vim会选择当前光标所在的整行。可以通过按`j`或`k`来选择更多的行
  - 块选择模式（`Ctrl` + `V`）：按`Ctrl` + `V`进入块选择模式后，可以选择矩形区域。按方向键（`h/j/k/l`）扩展选区，选区可以跨越多行

2. 移动光标
在可视模式中，光标会随着移动而扩大或缩小选区
  - 可以按`h/j/k/l`（或者方向键）来移动光标并调整选择区域
  - 也可以使用`w`（到下一个单词）、`b`（到前一个单词）、`$`（到行尾）等命令快速跳转

3. 对选中的文本进行操作
一旦选择了文本，可以执行以下操作
  - 删除：按`d`删除选中的文本
  - 复制（Yank）：按`y`复制选中的文本
  - 粘贴：按`p`将复制的文本粘贴到光标后，按`P`粘贴到光标前
  - 替换：按`c`修改选中的文本并进入插入模式，或者按`r<cahr>`替换选中的字符
  - 缩进：按`>`增加缩进，按`<`减少缩进
  - 格式化：按`=`对选中的文本进行格式化（适用于代码格式化）

4. 撤销和重做
  - 撤销：按`u`撤销在可视模式下的操作
  - 重做：按`Ctrl-r`重做操作

5. 退出可视模式
  - 按`Esc`返回普通模式

6. 扩展选区
  - 在可视模式中，可以使用Vim的基本移动命令来扩展或缩小选择范围
    - `w`：扩展选择到下一个单词的开始
    - `b`：扩展选择到当前单词的开始
    - `$`：扩展选择到当前行的行尾
    - `0`：扩展选择到行的开头

7. 块选择模式（Ctrl + v）
  - 在块选择模式下，可以选择一个矩形区域，这对于多行列操作特别有用
  - 批量编辑列：选择列后，可以使用`I`来在每行开头插入文本，或者使用`D`删除整列
  - 例如，选中几行或某一列后，按`I`然后输入文本，按`Esc`会在每行相同位置插入文本

8. 复制到剪贴板
  - 如果希望将选中的文本复制到系统剪贴板，可以使用`"+y`或`"*y`（具体取决于Vim配置和系统）将选中的内容复制到剪贴板中

9. 多个操作
  - 在可视模式下，可以使用多个命令进行符合操作。例如，可以选择文本后直接进行缩进、删除、复制或修改
  - `>`：向右缩进选中的文本
  - `<`：向左缩进选中的文本

**可视模式应用场景**\
- 文本编辑：可视模式非常适合快速选择并操作文本，如删除一段文本、复制并粘贴到其他位置等
- 代码修改：在编程时，可以使用可视模式来选择并修改多行代码，特别是在进行批量修改时（如缩进、对齐等）
- 列操作：在处理列式数据时，块选择模式（`Ctrl` + `V`）非常有用，可以方便地选择和编辑矩形区域的文本

**分屏操作**\
- `:sp <filename>`/`:split <filename>`：水平分屏
- `:vsp <filename>`/`:vs <filename>` / `:vsplit <filename>`：垂直分屏
- `Ctrl+w, ^v<>` / `Ctrl+w, hjkl`：切换分屏
- `Ctrl+w, =`：均分窗口大小
- `Ctrl+w, s`：当前窗口水平分割
- `:new <filename>`：创建新文件并水平分屏
- `vnew <filename>`：创建新文件并垂直分屏
- `Ctrl+w, v`：当前窗口垂直分割
- `Ctrl+w, w`：循环切换所有窗口
- `Ctrl+w, p`：切换到前一个窗口
- `Ctrl+w, t`：切换到顶部窗口
- `Ctrl+w, b`：切换到底部窗口 
- `Ctrl+w, _`：当前窗口最大化高度
- `Ctrl+w, |`：当前窗口最大化宽度
- `Ctrl+w, +`：增加当前窗口高度
- `Ctrl+w, -`：减少当前窗口高度
- `:res[ize] +N`：增加N行高度
- `:res[ize] -N`：减少N行高度
- `Ctrl+w, >`：增加当前窗口宽度
- `Ctrl+w, <`：减少当前窗口宽度
- `:vertical resize +N`：增加N列宽度
- `:vertical resize -N`：减少N列宽度
- `Ctrl+w, r`：向右/向下旋转窗口
- `Ctrl+w, R`：向左/向上旋转窗口
- `Ctrl+w, x`：交换当前窗口和下一个窗口
- `Ctrl+w, K`：将窗口移到顶部
- `Ctrl+w, J`：将窗口移到底部
- `Ctrl+w, H`：将窗口移到最左
- `Ctrl+w, L`：将窗口移到最右
- `:q`：关闭当前窗口
- `:close`/`:clo`：关闭当前窗口
- `:only`/`:on`：关闭其他所有窗口
- `Ctrl+w, c`：关闭当前窗口
- `Ctrl+w, o`：关闭其他所有窗口
- `vim -o file1 file2 file3`：水平分屏打开多个文件
- `vim -O file1 file2 file3`：垂直分屏打开多个文件

**指令教程**\
- 指令速查表[Vim Cheat Sheet](https://vim.rtorr.com/)
- 在线练习[openvim](https://openvim.com/)
- 终端运行`vimtutor`（内置教程）

**插件管理**\
Vim的插件系统能够扩展和定制Vim的功能，使其更加适应工作流程。通过安装和使用插件，可以增强Vim的能力，比如自动完成、语法高亮、代码片段、文件浏览器等

**插件管理器**\
要高效管理Vim插件，通常需要使用插件管理器。以下是一些常用的插件管理器
  - Vundle：最早的Vim插件管理工具之一，易于使用
  - vim-plug：现代的插件管理器，安装和配置插件都非常简单
  - Pathogen：简单的插件管理工具，但不如vim-plug灵活

vim-plug的安装与配置
安装`vim-plug`，首先将`vim-plug`插件管理器下载到Vim配置目录中
```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
  https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```
这个命令会将`pulg.vim`文件下载到`~/.vim/autodownload/`目录下，并创建相应的目录结构
然后，可以在`~/.vimrc`文件中配置插件，插件声明用`Plug`关键字
```vim
" 启动插件管理器
call plug#begin('~/.vim/plugged')

" 列出需要安装的插件
Plug 'tpope/vim-sensible'  " 基础配置插件
Plug 'junegunn/fzf.vim'   " 文件搜索插件
Plug 'neoclide/coc.nvim'   " 自动完成插件

" 结束插件配置
call plug#end()
```
保存并退出`.vimrc`后，重新启动Vim，并运行以下命令来安装插件
```vim
:PlugInstall
```
- `call plug#begin()`：这是 vim-plug 插件管理器的开始指令，括号内的路径指向插件安装目录。~/.vim/plugged 是插件的安装目录，你可以根据需要修改
- `Plug '插件仓库地址'`：这里列出你要安装的插件，插件的名称通常是 GitHub 上的仓库地址
- `call plug#end()`：这是插件配置的结束指令，表示 vim-plug 配置的结束

vim-plug的使用
`vim-plug`是一个轻量级、易于使用的Vim插件管理器，可以帮助快速安装、更新和管理插件。与其他插件管理器相比，`vim-plug`配置简单，支持并行安装插件，并且具有高效的更新机制

更新插件
```vim
:PlugUpdate
```

删除插件
1. 打开`.vimrc`文件
2. 删除不需要的插件行
3. 在Vim中
```vim
:PlugClean
```

常用vim-plug命令
- `:PlugInstall`：安装插件
- `:PlugUpdate`：更新所有插件
- `:PlugUpgrade`：升级 vim-plug 插件管理器
- `:PlugClean`：删除未在 .vimrc 配置中的插件
- `:PlugStatus`：查看插件的当前状态，列出已安装的插件及其状态

插件的更多配置选项\
可以在插件声明时指定一些额外的选项来控制插件行为
- 延迟加载插件：通过`on`或`for`选项指定插件在特定条件下加载。例如，只在打开某些文件类型时才加载
```vim
Plug 'junegunn/fzf.vim', { 'for': ['vim', 'bash'] }
```
- 仅在特定命令下加载插件
```vim
Plug 'tpope/vim-fugitive', { 'on' : 'Gstatus' }
```
- 自动安装插件
```vim
:PlugInstall --sync
```

**常用的Vim插件**\
1. 自动补全插件
  - coc.nvim：自动补全，支持LSP协议，支持多种语言智能补全
  - YouCompleteMe

2. 文件浏览器
  - NERDTree：文件系统浏览器，可以帮助在Vim中管理和浏览文件和目录
  - fugitive.vim：一个Git插件，提供Git操作的简洁命令

3. 语法高亮与代码格式
  - vim-polyglot：一个集成多种语言的语法高亮插件，支持很多编程语言的高亮显示
  - auto-pairs：自动补全括号、引号等配对字符

4. 代码片段插件
  - UltiSnips
  - snipmate.vim

5. 增强的查找和替换
  - fzf.vim：集成了FZF（模糊查找工具）的插件，提供快速查找为念、文本和命令的能力
  - ctrlp.vim：

6. 状态栏和界面增强
  - lightline.vim：一个轻量级的状态栏插件，提供美观的界面和状态栏定制
  - vim-airline：支持多种颜色主题和动态信息

7. 增强的搜索功能
  - ack.vim：集成了Ack搜索工具，能快速搜索项目中的文件
  - ag.vim：集成了Silver Searcher（Ag），比grep更快

8. Git集成
  - vim-gitgutter：显示Git状态的插件，显示已修改、已删除、已新增的行
  - vim-fugitive：一个Git集成插件，允许在Vim中执行Git操作（如提交、查看历史等）

**插件配置和优化**
- 配置插件：大部分插件都提供了可定制的选项，可以通过修改`.vimrc`文件中的配置来调整插件的行为
```vim
" 配置 coc.nvim 自动补全
let g:coc_global_extensions = ['coc-tsserver', 'coc-python']
```
- 禁用不需要的插件：有时候可能只需要启用某些插件，禁用其他插件。可以通过注释掉相关的`Plug`或`Plugin`配置来禁用查文件，或者使用插件的`disable`选项
- 定期更新插件：可以使用插件管理器提供的命令定期更新插件
  - 在`vim-plug`中：` :PlugUpdate`

--- 

- d 删除操作符，删除并存入寄存器
  - d + number + motion 删除指定number的motion 
  - dd 删除整行
    - number + dd 执行number次dd，删除number行 

- motion 操作符的操作对象
  - w 从当前光标当前位置直到下一个单词起始处，不包括它的第一个字符
  - e 从当前光标当前位置直到单词末尾，包括最后一个字符
  - $ 从当前光标当前位置直到当前行末
  - 0 从当前光标当前位置直到当前行首

- number 重复行为计数
  - 2w 向前移动两个单词，光标到第二个单词的首字母
  - 3e 向前移动三个单词，光标到第三个单词的末尾

- u 撤销最后一次命令
- U 撤销对一行的修改
- ^R 重做

- y 复制选中文本
  - yw 复制一个单词
- p 粘贴到光标之后

- r char 替换光标所在位置的字符
- R char1char2char3... 连续替换多个字符

- c 更改操作符，删除，存入寄存器并原地进入插入模式
  - c + number + motion

- G 跳转到文件最后一行
  - number + G 跳转到number行
- gg 跳转到文件第一行

- /str 顺序查找字符串
  - 回车
  - n 跳转到下一个匹配项
  - N 跳转到上一个匹配项
  - ?/str逆序查找

- CTRL+G 显示状态信息
- CTRL+O 跳转到上个位置
- CTRL+I 跳转到下个位置
- CTRL+W 窗口间切换
- CTRL+D 显示所有补全选项


- 光标在任意{[()]}处按%，跳转到匹配括号处

- 替换
  - 命令`:s/old/new` 替换光标所在行的第一个匹配串"old -> new"
  - `s/old/new/g`：匹配全行所有"old -> new"
  - `:#,#s/old/new/g`：匹配#行 -> #行所有"old -> new"
  - `:%s/old/new/g`：匹配整个文件
  - `:%s/old/new/gc`：交互式匹配整个文件

- `:!command` 执行外部命令
- :w FILENAME 保存文件名为FILENAME 
- 部分保存：v motion :w FILENAME 
  - visual mode下，选择内容后，按:进入命令模式，屏幕底部出现`:'<,'>`，然后输入w FILENAME。该操作会将选中内容保存到FILENAME中 
- 插入外部内容 :r FILENAME 将磁盘文件FILENAME插入到光标所在位置；`:r !command`将外部命令输出插入文件中
- o下方换行插入，O上方换行插入
- a光标后插入，A行尾插入
- i光标前插入，I行首插入
- :set ic （ignorecase，查找忽略大小写）
- :set noic 禁用忽略大小写
- :set hls (hlsearch)设置匹配项高亮
- :nohlsearch 移除匹配项高亮
- :set is （incsearch）查找短语时显示部分匹配项
- :set nois 关闭部分匹配项显示
- 完整拼写和缩写均可


- <HELP>，<F1>, :help 打开在线帮助系统
- :help keyword 关于keyword的帮助


- <TAB> 补全


---

## 终端模式
Vim 8.1+ 
```vim 
:term bash " 水平分割终端窗口
:vert term bash " 垂直分割终端窗口
:term " 启动默认shell
```
终端窗口操作
- 进入终端模式后可直接输入bash命令
- 按`CTRL+W`后再按`N`进入普通模式
- 按`i`或`a`返回终端输入模式
- `:close`关闭终端窗口

## tabs 
标签页是Vim中组织窗口的容器，每个标签页可以包含多个分割窗口

### 创建标签页
- 从命令行启动
```bash 
vim -p file1 file2 file3 # 用标签页打开多个文件
vim -p *.py  # 用标签页打开所有py文件
```
- 在Vim中创建
```vim 
:tabnew <filename> " 新建标签页，<filename>可选
:tabedit <filename> " 同上，简写 :tabe
:tabs " 显示所有标签页列表
```
- 其他创建方式
```vim 
:tab split " 当前窗口移到新标签页
:tab sball " 为每个缓冲区开标签页
:tab ball " 同上
:tab help topic " 在新标签页打开帮助
```
### 标签页导航
```vim 
:tabn[ext] " 下一个标签页
:tabp[revious] " 上一个标签页
:tabN[ext] " 上一个标签页
:tabfirst / :tabr " 第一个标签页
:tablast " 最后一个标签页
```

### 标签页操作
- 关闭标签页
```vim 
:tabc[lose] " 关闭当前标签页
:tabo[nly] " 关闭其他所有标签页，只留当前
```
- 移动标签页
```vim 
:tabm[ove] [N] " 移动当前标签页到第N位置
:tabm 0 " 移到最前面
:tabm " 移到最后面
:tabm +1 " 向后移动一位
:tabm -1 " 向前移动一位
```

### 标签页与窗口的配合
```vim 
Ctrl+w, T " 将当前窗口移到新标签页
Ctrl+w, c " 关闭当前窗口但不关闭标签页
```

## Buffer 
- Buffer：内存中加载的文件内容
- Window：查看缓冲区的视口
- Tab：包含一组窗口的容器

```text 
关系：文件 -> 缓冲区 -> 窗口 -> 标签页
      磁盘    内存      视图    容器
```

### 重要特性
- 一个文件对应一个缓冲区
- 缓冲区可以没有对应文件（新建未保存）
- 缓冲区可以被多个窗口同时查看
- 缓冲区可以隐藏而不显示任何窗口

`set hidden`：允许隐藏已修改的缓冲区

### 缓冲区状态
缓冲区有4种状态
1. 活动（active）：显示在窗口中
2. 隐藏（hidden）：已加载但未显示
3. 未加载（inactive）：在列表但未加载内容
4. 已列出（listed）：在`:ls`中显示

### 查看缓冲区
#### 列出缓冲区
```vim 
:ls " 列出所有缓冲区
:buffers " 同上
:files " 同上，显示更详细
```
示例输出
```text 
1 %a "file1.txt" line 1
2 #h "file2.py"  line 99 
3    "file3.js"  line 0 
```
状态标记
- `%`：当前窗口的缓冲区
- `#`：交替缓冲区（按Ctrl+^可切换）
- `a`：活动（显示在窗口中）
- `h`：隐藏（已加载但不显示）
- `=`：只读缓冲区
- `+`：已修改未保存
- `-`：不可修改
- `x`：有读取错误

#### 详细列表
```vim 
:ls! " 显示所有缓冲区（包括未列出的）
:buffer " 显示当前缓冲区信息
:file " 显示当前文件名和状态
```

### 打开/创建缓冲区
#### 从文件打开
```vim 
:e file.txt " 编辑文件（新建缓冲区）
:enew " 新建空缓冲区
:view file.txt " 以只读方式打开
:badd file.txt " 添加到缓冲区列表但不显示
```

#### 命令行打开
```bash 
vim file1 file2 file3 # 打开多个文件到缓冲区
vim *.py # 通配符打开
vim -p file1 file2 # 用标签页打开
```

### 切换缓冲区
- `:buffer N`/`:bN`：切换到第N个缓冲区
- `:b file`:切换到文件名包含`file`的缓冲区
- `:buf[fer] filename`：切换到指定文件名的缓冲区
- `:bn[ext]`：下一个缓冲区
- `:bp[revious]`：上一个缓冲区
- `:blast`：最后一个缓冲区
- `:bfirst`：第一个缓冲区
- `Ctrl+^`：切换当前缓冲区和交替缓冲区
- `:buffer #`：切换到交替缓冲区
- `:brewind`：回到第一个缓冲区
- `:bN[ext]`：上一个缓冲区

### 删除缓冲区
- `:bdelete N`/`:bdN`：删除第N个缓冲区
- `:bd[elete] filename`：删除指定缓冲区
- `:bdelete!`：强制删除，即使有未保存修改
- `:bufdo bd`：删除所有缓冲区（危险！）
- `:%bd`：删除所有缓冲区，保留当前
- `:1,5bd`：删除1-5号缓冲区
- `:bd file*.txt`：删除匹配文件名的缓冲区

### 缓冲区操作
- `:saveas newname`：另存为新文件并切换到新缓冲区
- `:file newname`：重命名当前缓冲区
- `:f[ile]! newname`：强制重命名（可能丢失原文件）
- `:e`：重新加载当前文件（放弃修改）
- `:e!`：强制重新加载（放弃所有修改）
- `:checktime`：检查文件是否被外部修改
- `:set readonly`：设为只读
- `:set noreadonly`：取消只读
- `:view file`：以只读方式打开

### 缓冲区与窗口
- `sbuffer N`：水平分割窗口显示缓冲区N 
- `vert sbuffer N`：垂直分割窗口显示缓冲区N 
- `Ctrl+w, Shift+H/J/K/l`：将缓冲区移到左/下/上/右边窗口

### 批量操作
- `:bufdo command`：在所有缓冲区执行命令
- `:bufdo %s/foo/bar/g`：所有缓冲区替换
- `:bufdo set ft=python`：所有缓冲区设为python语法
- `:bufdo update`：保存所有已修改的缓冲区

## 终端窗口

vim 8.0 开始，vim内置了一个终端模拟器，可以在vim窗口里直接运行任何CLI工具\
本质是一个特殊buffer(terminal buffer)

### 使用

#### 打开

```vim
:terminal " 打开终端（缩写 :term）
:vert terminal " 垂直分割打开终端
:tab terminal " 在新标签页打开终端
```

使用默认`$SHELL`

#### 指定shell或命令

```vim
:terminal bash
:terminal zsh
:terminal python
:terminal gdb a.out
:terminal make run
```

#### 模式切换

- 终端模式 -> 普通模式：`^\, ^n`
- 普通模式 -> 终端模式：`i`

#### 调整位置

终端是一个buffer + job

横向分屏终端

```vim
:split | terminal
```

纵向分屏终端

```vim
:vsplit | terminal
```

底部固定终端

```vim
:botright split | terminal
```

固定高度

```vim
:botright 10split | terminal
```

#### 复制/粘贴

复制终端输出

1. 进入普通模式
2. 像普通文本一样
    - `v`
    - `y`
    - `/pattern`

终端buffer在普通模式下是只读的，但可以选中

#### 退出

- 关闭缓冲区，同时杀死进程：`bdelete!`
- 终端中直接退出：`exit`

### 设置

#### 终端自动进入插入模式

在`vimrc`里

```vim
autocmd TermOpen* startinsert
```

#### 禁用行号

```vim
autocmd TermOpen * setlocal nonumber norelativenumber
```

## vimdiff

Vim diff 是在多个窗口中对齐显示差异\
它不是只给你一份补丁文本，而是

- 并排显示文件
- 自动对齐对应行
- 高亮增/删/改
- 支持交互式合并

本质是一个可编辑的、实时diff视图

### 进入Vim diff模式

在命令行中

```bash
vimdiff a.cpp b.cpp
```

或

```bash
vim -d a.cpp b.cpp
```

已在Vim里

```vim
:diffthis
```

在两个窗口分别执行

```vim
:diffthis
```

这两个窗口就进入diff模式

退出

```vim
:diffoff
```

Git工作流`git difftool`默认就会拉起Vim diff

### 使用

颜色/高亮（逻辑）

| 高亮 | 含义 |
| - | - |
| 红色背景 | 删除 |
| 绿色背景 | 新增 |
| 蓝色/紫色 | 修改 |
| 空白充填 | 对齐占位 |

Vim diff会找最相似的行块，用虚拟空行把两边对齐，保证能横向比较，这些空行不能编辑，他们只是视觉占位

#### 操作

##### 在差异间跳转

```text
]c 下一个差异
[c 上一个差异
```

##### 选择改动

假设

```
左边 = 旧
右边 = 新
```

从另一边拉内容

- `do`：用另一侧的内容覆盖当前
- `dp`：把当前内容覆盖到另一侧


##### 同步滚动

默认开启

```vim
:set scrollbind
```

关闭

```vim
:set noscrollbind
```

### diff配置

```vim
" 更易读的 diff
set diffopt=filler,context:3

" 忽略空白差异
set diffopt+=iwhite

" 更自然的算方法
set diffopt+=algorithm:patience
```

diff算法

- `myers` 默认，速度快
- `patience` 更符合人类阅读
- `histogram` 折中

## 行号跳转

```vim
:number " 跳转到number行

numbergg " 跳转到number行
numberG " 跳转到number行

numberk " 向上移动number行
numberj " 向下移动number行

number% " 跳转到number%处
```

## 插件 vim-markdown 快捷键

| 快捷键 | 功能 |
| - | - |
| `zR` | 展开所有折叠 |
| `zM` | 折叠所有 |
| `zr` | 展开一级折叠 |
| `zm` | 折叠一级 |
| `zo` | 打开当前折叠 |
| `zc` | 关闭当前折叠 |
| `za` | 切换折叠状态 |
| `zO` | 递归打开 |
| `zC` | 递归关闭 |

## .swp 文件

`Swap Files`，Vim交换文件，这是Vim的崩溃恢复机制，类似于

- Word的自动恢复文件（.asd）
- Photoshop的恢复文件
- 游戏中的自动保存点

文件命名格式：`.sourcename.swp`，是一个隐藏文件

主要作用

1.崩溃恢复

当异常退出Vim时，重新打开文件，Vim提示

```vim
[O]pen Read-Only   # 只读打开
(E)dit anyway      # 强制编辑（危险）
(R)ecover          # 恢复交换文件内容
(D)elete it        # 删除交换文件
(Q)uit             # 退出
(A)bort            # 中止
```

2.防止编辑冲突

如果另一个Vim实例正在编辑同一文件

```vim
" 如果另一个 Vim 实例正在编辑同一文件：
E325: ATTENTION
Found a swap file by the name ".filename.swp"
          owned by: username   pid: 1234
          dated: Thu Jan 1 12:00:00 2026

(1) Another program may be editing the same file.
(2) An edit session for this file crashed.
```

3.保存编辑状态

交换文件包括

- 未保存的修改内容
- 光标位置和视图状态
- 撤销历史树
- 寄存器内容
- 标记位置

### 工作原理

创建时机：\
Vim在以下情况更新交换文件

1. 打开文件时立即创建
2. 每输入'updatecount'个字符后
3. 每 'updatetime'毫秒后
4. 切换到其他缓冲区时
5. 执行某些命令时

相关设置

```vim
set updatetime=4000 " 每4秒保存一次（默认）
set updatecount=100 "每输入100字符保存一次
```

文件结构

```text
[交换文件头]
├── 魔数（标识为 Vim 交换文件）
├── 原始文件名
├── 进程ID和时间戳
├── 文件修改时间
└── ...

[数据块]
├── 文本内容（增量变化）
├── 撤销历史
├── 寄存器内容
└── 标记信息
```

### 管理交换文件

#### 基本命令
```vim
:sw " 在 Vim中管理交换文件
:sw! " 强制写入交换文件
:swp " 同 :sw
:swapname " 显示当前交换文件路径

" 列出所有交换文件
:swap!            " 显示所有可恢复的交换文件
:swap list        " 显示交换文件列表
:swap next        " 跳转到下一个交换文件
:swap prev        " 跳转到上一个交换文件
```

#### 恢复编辑会话

```vim
" 方法1：启动时恢复
vim -r filename.txt " 恢复指定文件
vim -r

" 方法2：在Vim中恢复
:recover filename.txt " 从交换文件恢复
:recover! filename.txt " 强制恢复

" 方法3：手动比较
:diffthis   " 当前文件
:split filename.txt " 打开源文件
:diffthis " 对比模式
" 然后手动合并差异
```

#### 交换文件位置控制

```vim
" 在 ~/.vimrc 中配置

" 1. 集中存放（推荐）
set directory=~/.vim/swap//   " 所有交换文件放这里
" 注意：末尾 // 表示保留完整路径结构

" 2. 项目特定目录
set directory=./.vim-swap//   " 放在项目内的 .vim-swap 目录

" 3. 多级目录（按文件路径组织）
set directory=~/.vim/swap/%:p:h   " 按原文件路径创建子目录
```

#### 配置选项

##### 启用/禁用

```vim
" 完全禁用（不推荐）
set noswapfile

" 针对特定文件类型禁用
autocmd FileType python setlocal noswapfile
autocmd FileType markdown setlocal noswapfile

" 条件启用
set swapfile                    " 默认启用
set swapsync=fsync              " 同步写入（更安全但更慢）
set swapsync=                   " 异步写入（默认）
```

##### 行为控制

```vim
" 1. 只读文件的交换文件
set swapfile                    " 默认启用
set swapsync=fsync              " 同步到磁盘
set updatecount=50              " 每50字符保存
set updatetime=2000             " 每2秒保存

" 2. 大文件处理
" Vim 7.3+ 对大文件有特殊处理
set maxmem=500000               " 每个缓冲区最大内存（KB）
set maxmemtot=1000000           " 所有缓冲区最大内存（KB）
```

#### 文件扩展名

```vim
" Vim 使用不同扩展名区分状态：
.swp   " 活跃的交换文件
.swo   " 旧的交换文件（如果 .swp 已存在）
.swn   " 更旧的版本
" Vim 会自动使用这些扩展名避免冲突
```

## sign column

## 寄存器

Vim的寄存器是Vim内置的多个文本存储槽\
每个寄存器用一个名字表示，存放内容来自`y`（复制），`d`（删除），`c`（修改），`x`（删除字符）\
使用时通过

```vim
"registername + operation
```

例如

```vim
"ayw  " 复制一个单词到寄存器 a
"ap   " 从寄存器a粘贴
```

### 寄存器总览

| 类型 | 名称 | 说明 |
| - | - | - |
| 未命名 | `"` | 默认寄存器 |
| 数字 | `0-9` | 删除历史 |
| 命名 | `a-z` | 用户自定义 |
| 系统剪贴板 | `+`, `*` | 和系统交互 |
| 小删除 | `-` | 小范围删除 |
| 黑洞 | `_` | 什么都不保存 |
| 只读 | `:` `.` `%` | 命令/文件名 |
| 表达式 | `=` | 计算结果 |

### 未命名寄存器 `"`

Vim的默认剪贴板

所有`y/d/c`都会写入这里\
`p`实际等价于

```vim
""p
```

这就是p默认的读取的寄存器

### 数字寄存器 `0-9`

#### `0`最近一次yank

```vim
yy " 存入0
dd " 不会影响0
"0p " 还能粘贴刚才复制的内容
```

#### `1-9` 删除历史

- `1`：最近一次删除
- `2`：上一次的上一次删除
- 依次类推

```vim
"1p
"2p
```

### 命名寄存器`a-z`

自定义寄存器\
可以手动控制不会覆盖的内容

```vim
"ayw " 复制单词到 a 
"ap  " 粘贴 a 
```

大写 = 追加

```vim
"Ayy " 追加到 a
```

使用场景

- 保存一段“模板代码”
- 多处反复粘贴
- 防止被`dd`覆盖

### 系统剪贴板`+`/`*`

- `+` 系统剪贴板（在Windows和Mac中）

```vim
"+yy " 复制到系统剪贴板
"+p  " 从系统剪贴板粘贴
```

- `*` 选择剪贴板（X11系统的主选择）

需要vim `+clipboard`

### 黑洞寄存器 `_`

不存入寄存器的删除

```vim
"_dd
"_daw
```

解决经典痛点：复制了一段代码 -> 想删几行 -> 结果复制的内容没了

### 小删除寄存器 `-`

- 删除少于一行（如`x`/`dw`）
- 不污染主寄存器

```vim
x " 存入 - 
"-p
```

### 只读寄存器 `:`, `.`, `%`

- `:` 上一次命令
- `.` 上一次插入的文本
- `%` 当前文件名
- `#` 轮换文件名
- `/` 最后搜索的模式

### 表达式寄存器 `=`

Vim自带计算器

```vim
"=1+2*3
p
```

还能用函数

```vim
"=strlen("hello")
```

### 查看所有寄存器

```vim
:registers
" 或
:reg
```

查看指定寄存器内容

```vim
:reg + registername
```

### 追加到寄存器

大写寄存器名

```vim
"Ayy  " 追加一行到寄存器a
```

### 特殊粘贴

```vim
" 在插入模式下粘贴寄存器内容
<C-r>a " 插入模式下粘贴寄存器a的内容
<C-r>"  " 插入模式下粘贴默认寄存器的内容
```

## `.`

在Vim中，`.`命令表示重复上一次操作的命令\
适用于插入、删除、替换、修改等操作，可以配合移动命令使用，进行批量重复

```vim
iHello<Esc> " 插入 ’Hello'
.           " 再按 . 会在光标处插入同样的 'Hello'
```

### 可被重复的操作类型

`.`可以重复的操作大致有

- 插入

```vim
iHello<Esc> " 插入文本
.           " 重复插入相同文本
```

- 删除

```vim
dw           " 删除一个单词
.            " 再删除下一个单词
```

- 替换

```vim
rX           " 将光标处字符替换成 X
.            " 再替换下一个字符
```

- 更改

```vim
cwHello<Esc> " 改变一个词
.            " 再改变下一个单词
```

- 复杂命令，`.`可以重复组合命令，例如`daw`删除一个单词，再按`.`可以删除下一个单词

`.`重复的是上一次完整的编辑操作，而不是上一次键入的按键

### 示例

批量修改列

```vim
" 如果光标在多行同列位置
I# <Esc> " 在每行行首插入 #
j.       " 向下移动并重复插入
```

注意光标位置

## 宏(macro)

宏，记录一串按键，然后在别的地方重复执行\
记录的是按键序列（包括移动、删除、搜索），不是语义，而是操作流程\
非常适合：重复但有结构的编辑

### 使用

开始录制

```text
q{寄存器}
```

例如

```text
qa
```

表示把宏录到寄存器a

然后开始编辑操作

停止录制

```text
q
```

命令行会显示

```text
recording @a
```

播放宏

```text
@a
```

执行多次

```text
10@a
```

重复上一次宏

```text
@@
```

### 示例

场景：每行末尾加`;`

原始文本

```text
int a
int b
int c
```

步骤

1.光标放第一行
2.开始录宏

```text
qa
```

3.执行操作

```text
A;<Esc>j
```

4.停止

```text
q
```

5.执行

```text
2@a
```

结果

```text
int a;
int b;
int c;
```

### 宏的本质：寄存器

宏其实就在寄存器里

查看宏内容

```vim
:reg a
```

可以看到

```text
a A;<Esc>j
```

宏 = 可读、可编辑的文本

#### 修改宏

1.直接编辑寄存器

```vim
:let @a = 'A;<Esc>j
```

2.粘出来改

```vim
"ap
```

修改后再复制回去

### 使用技巧

#### 宏 + 计数

```text
20@a
```

#### 宏 + 搜索

```text
/ERROR<CR>
qa
dd
n
q
```

#### 宏 + Normal命令

```vim
:%normal @a
```

对每一行执行宏

#### 递归宏

```text
qa
...操作...
@a
q
```

### 宏 与 `.`

| 能力 | . | 宏 |
|----|----| - |
| 重复一次修改 | yes | no |
| 多步骤操作 | no | yes |
| 多次执行 |no | yes |
| 可编辑 | no | yes |

`.` 是最小宏

### 宏的使用场景

- 至少重复3次
- 操作步骤稳定
- 不想写脚本/正则

一次性任务使用`.`或手动

## Insert mode ^O

Insert下，按下^O, 可临时执行一条普通模式命令，执行完立刻自殴打能够回到插入模式

在Vim帮助里，它叫`:help i_CTRL-O`，官方定义是：Execute one command in Normal mode

示例

| 按键 | 效果 |
| - | - |
| `^O0` | 跳到行首 |
| `^O^` | 跳到第一个非空字符 |
| `^O$` | 跳到行尾 |
| `^Ow` | 下一个单词 |
| `^Ob` | 上一个单词 |
| `^Ogg` | 文件开头 |
| `^OG` | 文件结尾 |
| `^Odw` | 删除一个单词 |
| `^OD` | 删除行尾 |
| `^Occ` | 改整行并继续插入 |
| `^Ox` | 删一个字符 |

## mark

