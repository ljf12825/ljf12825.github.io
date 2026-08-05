---
title: TUI Game
author: ljf12825
date: 2026-06-28
tags: [cli, gamedev, note]
summary: A personal rethinking of TUI Game in Unix-like system
---

TUI (Text-based User Interface) Game 就是命令行游戏

## 背景

TUI Games的发展史就是半部计算机发展史\
它是早期黑客们在硬件极度匮乏的年代下的极致智力和想象力的结晶，它大致可以分为三个阶段

### TTY时期

60年代到70年代初期的计算机没有屏幕，程序员和计算机交互的设备是电传打字机(Teletypewriter, TTY)，游戏内容通过在纸上打印出来，世界上第一款文字冒险游戏"Colossal Cave Adventure"和"The Oregon Trail"就是在这个背景下诞生的。游戏没有画面，全靠文字描述\

下面以Colossal Cave Adventure为例，它被收录在`bsdgames`中，在Debian/Ubuntu的apt仓库里可以直接下载，以下为游戏画面

[![ccaimage](/images/content/cca_image.png)](/images/content/cca_image.png)

## 我与TUI Game的三次接触

我最早接触命令行游戏还是在上大学的时候，刚接触编程语言，那时候喜欢看网课，我看的那个C++网课里有一个阶段性测验就是实现一个命令行的贪吃蛇，当时还没有被命令行深深地吸引，更不知道TUI games这个概念，当时就觉得这是垃圾，是插曲，就是一个高级版的Hello World!

然后就是去年刚开始使用Linux系统的时候，看man手册，发现手册里 Section 6叫做Games，很好奇，上网搜了一下，似乎是打开了新世界的大门，并从Ubuntu的apt里下载了几个TUI games，比如Rouge, CDDA, Dwarf Fortress, DCSS等，玩了一会被全英文的界面劝退了，当时有两个感觉，第一，命令行游戏也能做的很丰富，第二，古董

第三次接触就是现在，我在Linux里发现了`/usr/games/`目录，上网一查知道了TUI Games这个概念，意识到事情不简单，下载了`bsdgames`里玩了几个，发现更不简单，这才觉得有必要好好研究一下了，毕竟我也是搞游戏开发的，可以将其理解，吸收，扩展

## 现代TUI Games

## 我的构想
