---
title: '-,eol:$'
author: ljf12825
date: 2026-05-16
type: log
tags: [Vim]
categories: [Debug]
summary: An erroneous operation and the mechanism behind it
image: "/images/content/vim_title.png"
---

## 问题

这已经是第二次我在~/下 `ls` 发现了一个奇怪的文件名 `'-,eol:$'`，上次出现的时候没有在意\
通过`ls -la` 和 `stat` 查看了文件的具体信息，发现是一个空文件，然后使用 `rm -- '-meol:$'` 命令删除了它\
但是它又出现了，而且这次由于我`ls`的时间距离我上次改动内容的时间很接近，这让我迅速意识到它的出现和我上次改动的动作有关\
我上次改动的是`.bashrc`和`.vimrc`，两个配置相关的内容\
查看`.bashrc`文件没有发现`-,eol:$`这种字符串，查看`.vimrc`，发现了问题的根源

以下是我`.vimrc`中的一段配置

```vim
set list
set listchars=space:·,tab:>-,eol:$
```

这两行的含义是开启列表模式，Vim会把按照listchars的定义，把原本不可见的字符替换为可见的符号显示；比如上述的

- `space:·`，空格显示为`·`
- `tab:>-`，制表符显示为`>---`，以`>`开头，后面跟`-`补齐（长度由`tabstop`决定）
- `eol:$`，行尾显示为`$`

## 触发机理

为什么这个诡异的文件名是`'-,eol:$'`，而不是listchars这一行的完整字符串呢\
值得注意的是，`>`符号在某些终端中，比如Bash中是重定向符号，它一定在某一个瞬间误触了，我可能在`~/`下执行了类似`>-,eol:$`的命令\
这会导致Bash会这样解析：它看到`>`，以为要把`set listchars=space:·, tab:` 这串命令的输出重定向到一个文件中，文件名就是紧跟在`>` 后面的 `-,eol:$`，但是不存在这个文件于是系统就自动创建，因为这串字符包含特殊字符，系统自动给它加上了单引号防止解析出错，于是就变成了`'-,eol:$'`

我很清楚地记得，我没有在Bash中输入过类似命令，还是在`~`下，命令里历史也没有\
但我执行过`source .vimrc`，因为和`.bashrc`一起更改的，虽然两者都是配置文件，但是它们语法的底层逻辑完全不同\
当执行`source .vimrc`时，Bash会尝试像执行Shell脚本一样去解析Vim配置\
一旦Shell解析到`>`符号，它会立刻去目标路径下检查，如果文件不存在，创建一个；如果存在，它会truncate它\
然后Shell会尝试执行`>`左边的命令，但这是Vim命令而非Bash命令，`set`是Bash的合法命令，但是其他内容`set`并不认识，结果就是执行失败，它产生的只有标准错误(stderr)，而stderr并没有被重定向，因此它直接显示在屏幕上，怪异名称空文件就这么产生了

`source .vimrc`时，Bash会逐行解析，到`set listchars=space:·,tab:>-,eol:$`这一行时

- 先创建（或清空）文件`-,eol:$`
- 然后尝试执行命令：`set listchars=space:·,tab:`
- Bash报错类似：`bash: set: listchars=space:·,tab:: invalid option`或`set: invalid option`

重定向会截断`>`之前的部分，所以`eol:$`成了文件名，而不是作为`set`的参数

特别的，文件并不是在命令成功之后才写入的；Bash的重定向是一个“抢跑”操作。它在确定`set`命令是否合法前，就已经在文件系统中通过`open()`系统调用（带`O_CREAT`和`O_TRUNC`标志）完成了拓扑占位\
Bash处理`>-,eol:$`的步骤是

1. 先做重定向——`open("-,eol:$", O_CREAT | O_TRUNC, 0666)，文件此时被创建或清空
2. 再执行命令——尝试把`set listchars=space:·,tab:`当作命令运行
3. 命令失败，标准错误输出到屏幕，但文件已经留下了

## 总结

绝对不要`source ,vimrc`，要重新加载Vim配置，在Vim内执行`:source ~/.vimrc`即可；或者重新打开Vim\
Bash的重定向解析在语法错误检查之前，用Shell执行非Shell配置文件一定会导致非预期副作用
