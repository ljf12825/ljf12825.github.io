---
title: reStructuredText(RST)
author: ljf12825
date: 2026-05-12
type: file
summary: overview of rst
---

reStructuredText（简称reST或RST）是一种轻量级标记语言，主要用于Python生态圈的文档编写。它设计上更注重可读性和扩展性，纯文本状态就很易读，同时能转换成为HTML, LaTeX, PDF等多种格式

核心特点：

- 纯文本易读
- 强扩展性：支持自定义指令和角色，可嵌入代码块、数学公式、警告框等复杂结构
- Python 官方标准：Python 文档使用 Sphinx 工具（基于 RST）生成，绝大多数Python项目的README和文档也采用此格式

## 标准

### 核心规范(PEP 258)

规范原文：<https://peps.python.org/pep-0258/>

这是由Python社区发布的增强提案，从Python 2.2时期起，就定义了reStructuredText的基本语法和解析规则。这份文档本身也是用reST写的

### 解析器

Docutils 项目：<https://docutils.sourceforge.io/>

Docutils 是 reStructuredText 的官方参考实现，它的解析器定义了严格的解析细节和算法。在实践中，能通过Docutils解析，就符合标准。这个组件也成了几乎所有衍生工具（如Sphinx）的基石

### 扩展标准(Sphinx)

Sphinx 项目：<https://www.sphinx-doc.org/en/master/>

Sphinx是Python文档和大多数技术项目实际使用的工具。为满足复杂文档需求，它在Docutils基础上又增加了一套成为“标准”的扩展指令和角色。这套约定现在已是事实上的通用扩展标准
