---
title: Command Pattern
author: ljf12825
date: 2026-05-08
type: file
summary: ..
---

Command Pattern 的核心思想是：把一个操作变成对象

比如一个按钮

```cpp
class Button {
public:
    void Click() {
        player.Jump();
    }

    Player player;
};
```

它存在以下问题

- Button 强依赖 Player
- Button 只能做 Jump
- 无法动态切换行为
- 无法撤销
- 无法记录操作
- 无法排队
- 无法网络同步
- 无法做宏命令

“调用者”和“真正执行者”耦合太死