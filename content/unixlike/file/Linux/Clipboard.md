---
title: linux clipboard
date: 2026-01-14
draft: false
summary: linux clipboard PRIMARY CLIPBOARD SECONDARY
---

# Clipboard

## X Window System(X11)剪贴板

在使用X11（也就是大多数Linux系统的默认窗口系统）时，剪贴板有多个不同的机制，其中最常用的是`PRIMARY`, `SECONDARY`和`CLIPBOARD`

### PRIMARY（主剪贴板）

- 使用方法：选中文本即自动复制，鼠标中键粘贴
- 特点：最符合Unix哲学，快速便捷
- 查看内容：`xclip -o -selection primary`

### CLIPBOARD（剪贴板）

- 使用方法：^C复制，^V粘贴
- 特点：与Windows/macOS习惯一致
- 查看内容：`xclip -o -selection clipboard`

### SECONDARY（次剪贴板）

- 较少使用，某些程序用于特殊用途

## Wayland剪贴板

Wayland是X11的一个现代替代品，越来越多的Linux发行版和桌面（如GNOME和KDE）开始采用它。在Wayland中，剪贴板的管理方式有了一些不同

Wayland不再区分`PRIMARY`和`CLIPBOARD`剪贴板。相反，所有的剪贴板操作都是基于同一个标准剪贴板进行的，类似于Windows或macOS的行为。它依赖于特定的协议来处理剪贴板的数据交换

Wayland的`wl_clipboard`协议允许客户端应用共享剪贴板内容，但它的使用和实现方式可能因桌面环境和应用而异

## 命令行操作工具

### xclip（X11）

```bash
# 复制到 CLIPBOARD
echo "内容" | xclip -selection clipboard
cat file.txt | xclip -sel clip

# 从CLIPBOARD粘贴
xclip -o -selection clipboard > output.txt

# 复制到 PRIMARY
echo "内容" | xclip -selection primary
```

## 剪贴板历史，安全与隐私

Linux系统的默认剪贴板并不保存历史记录，复制的内容会被新的数据覆盖。因此，有些工具（例如`Clipman`, `CopyQ`）可以让你查看和管理剪贴板历史，允许你恢复先前复制过的内容

由于Linux的剪贴板机制和多样性，特别是X11 系统下的`PRIMARY`剪贴板，它有可能在某些情况下暴露不需要的数据。例如，意外地通过中键点击鼠标粘贴到来不希望粘贴的内容

如果希望保护隐私或避免泄露剪贴板数据，可以使用工具如`xclip`来清理剪贴板内容

```bash
xclip -selection clipboard /dev/null
```
