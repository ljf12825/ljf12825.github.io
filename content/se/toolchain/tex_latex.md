---
title: TeX & LaTeX
author: ljf12825
date: 2026-05-12
type: file
summary: overview of TeX and LaTeX
---

TeX是Donald Knuth从零打造的、极致的电子排版系统\
它的核心思想是：让你专注于内容，用算法来处理排版

根源是高德纳对自己著作《计算机程序设计艺术》的排版质量忍无可忍。在70年代，铅排衰落、光电照排兴起，但数学书的排版效果依然糟糕。于是他暂停了写作，花了近十年时间，用编程的思维来从根本上解决“美”的问题。他设计的 TeX 算法，能精确控制每个字符、间距、断行和数学公式的位置，以达到他认为的完美。

TeX可以被理解为一个专业的排版编译器：

- 源文件是代码：用任何纯文本编辑器，在文档中混合内容和`\command`来告诉TeX你的意图
- 编译生成PDF：像写C语言一样，你需要一个“编译器”来执行你写的代码，最后输出一份`.pdf`文件

优点：

- 数学公式支持完美
- 优美：断行、分页算法顶级
- 稳定且开源

缺点：难


Tex源码：<http://ftp.cs.stanford.edu/pub/tex/>

今天所有的TeX发行版用的都是 Donald 这套Pascal源码转换后的C语言版本`Web2C`

Web2C 源码 <https://github.com/TeX-Live/texlive-source>

## LaTeX

