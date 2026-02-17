---
title: Linked List
date: 2025-12-31
author: ljf12825
summary: linked list structure
type: files
---

链表是一种线性数据结构，其中的元素（节点）不是通过物理顺序存储，而是通过指针（或引用）连接在一起

```css
[data | next] -> [data | next] -> [data | next]
```

核心特点

- 动态内存分配：不需要预先知道数据量大小
- 非连续存储：节点在内存中可以是分散的
- 顺序访问：不能像数组一样直接通过索引访问

缺点

- 访问速度慢：需要遍历才能访问特定元素
- 内存开销大：需要额外的空间存储指针
- 缓存不友好：非连续存储，CPU缓存命中率低

| 操作 | 时间复杂度 |
| - | - |
| 遍历 | O(n) |
| 查找 | O(n) |
| 插入 | O(1)* |
| 删除 | O(1)* |

`*`前提是已知节点

## Single LinkedList

### 结构

节点结构

```css
[data|next]
```

- `data`：实际存储的数据
- `next`：指向后一个节点的地址

```css
[data|next] -> [data|next] -> [data|next] -> null
```

- 每个节点只能指向下一个节点（`next`）
- 单链表只能向前遍历，无法回溯

### 适用场景

1. 需要频繁插入/删除的场景
2. 内存受限或数据规模不确定的场景
3. 只需要单向遍历
4. 实现栈/队列

### 不适用场景

1. 频繁随机访问
2. 需要双向遍历
3. 数据量大：指针占用空间
4. 需要快速查找
5. 缓存性能重要

### 应用案例

LRU缓存淘汰算法

### 实现

#### 遍历

时间复杂度O(n)

```cpp
void traverse(ListNode* head) {
    ListNode* current = head;
    while (current != nullptr) {
        cout << current->val << " ";
        current = current->next;
    }
}
```

#### 查找

```cpp
ListNode* search(ListNode* head, int target) {
    ListNode* current = head;
    while (current != nullptr) {
        if (current->val == target) {
            return current;
        }
        current = current->next;
    }
    return nullptr;
}
```

#### 插入

1.头插（O(1)）

```cpp
ListNode* insertAtHead(ListNode* head, int val) {
    ListNode* newNode = new ListNode(val);
    newNode->next = head;
    return newNode;  // 新节点成为新的头节点
}
```

2.在指定位置后插入（O(1)）

```cpp
void insertAfter(ListNode* prevNode, int val) {
    if (prevNode == nullptr) return;
    
    ListNode* newNode = new ListNode(val);
    newNode->next = prevNode->next;
    prevNode->next = newNode;
}
```

#### 删除

1.删除指定值的节点

```cpp
ListNode* deleteNode(ListNode* head, int val) {
    // 处理头节点就是要删除的节点
    while (head != nullptr && head->val == val) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
    }
    
    // 处理中间节点
    ListNode* current = head;
    while (current != nullptr && current->next != nullptr) {
        if (current->next->val == val) {
            ListNode* temp = current->next;
            current->next = current->next->next;
            delete temp;
        } else {
            current = current->next;
        }
    }
    return head;
}
```

2.删除指定位置的节点

```cpp
void deleteNode(ListNode* node) {
    // 假设node不是尾节点
    node->val = node->next->val;
    ListNode* temp = node->next;
    node->next = node->next->next;
    delete temp;
}
```

### 哨兵节点(sentinel/dummy node)

```cpp
if (head == nullptr) { ... }
if (pos == head) { ... }
if (head->data = val) { ... }
```

这些判断有几个共同点

- 逻辑分叉多
- 易错（边界条件）
- 代码重复
- 插入/删除要“特判头节点”

因此哨兵节点的目标只有一个：让头节点变成普通节点

哨兵节点 = 永远存在的“假节点”，不存放有效数据

```css
[sentinel] -> [data1] -> [data2] -> nullptr
```

- `sentinel`不算链表元素
- `sentinel->next`才是真正的第一个节点
- 链表永远非空（至少有哨兵）

#### 产生变化

##### 结构变化

```css
head -> [data|next] -> [data|next] -> [data|next] -> null
```

传统单链表`head`指向第一个有效节点或nullptr，若有哨兵节点，永远指向哨兵节点

初始化

```cpp
head = new Node<T>(T{});
head->next = nullptr;
```

- `T{}`：C++11 列表初始化语法（brace-init），表示用类型T的默认值来构造一个对象

判空

```cpp
bool isEmpty() const {
    return head->next == nullptr;
}
```

头节点特判不复存在，退化为普通节点处理

哨兵节点在工程实践中是一种强烈推荐的做法，广泛应用于Linux内核/STL/各种容器中

## Double LinkedList

节点结构

```css
[prev|data|next]
```

- `prev`：指向前一个节点的地址
- `data`：实际存储的数据
- `next`：指向后一个节点的地址

链表结构

```css
NULL <-> [data|next] <-> [data|next] <-> [data|next] <-> NULL
```

### 双向的好处

单向链表有一个致命缺陷：无法O(1)从当前节点回到前一个节点\
只能沿着next的方向遍历，想要倒退需要重新遍历\
双向链表解决了这个问题，任意节点都能O(1)前进/后退\
即用空间换时间\
这直接带来了几个重要能力

- 删除当前节点不需要“前驱节点”
- 支持双向遍历
- 非常适合LRU/Undo/双端操作

### 核心操作

#### 插入节点（中间插入）

假设结构

```css
A <-> B <-> C
```

要在B和C之间插入X\
需要修改的指针（4个）

```text
X.prev = B
X.next = C
B.next = X
C.prev = X
```

顺序很重要，错一个就断链

#### 删除节点

删除节点`B`

```css
A <-> B <-> C
```

操作

```text
A.next = C
C.prev = A
```

不需要从head找前驱，O(1), 这正是双向链表存在的核心理由之一

#### 遍历

正向遍历

```text
for (node = head; node != null; node = node.next)
```

反向遍历

```text
for (node = tail; node != null; node = node.prev)
```

时间复杂度

| 操作 | 时间复杂度 |
| - | - |
| 随机访问 | O(n) |
| 头部插入 | O(1) |
| 中间插入 | O(1) |
| 删除节点 | O(1) |

### 哨兵节点对比

哨兵节点通过引入一个（或多个）永远存在的特殊节点，将链表在头尾处的边界情况统一为普通节点，从而消除插入和删除时对`nullptr`的分支判断\
循环哨兵节点进一步通过将头尾连接成环，把“前边界”和“后边界”合并为同一个哨兵节点，使所有节点在结构上完全等价

| 类型                    | 结构示意                                  | 空链表状态                                      |
| --------------------- | ------------------------------------- | ------------------------------------------ |
| **No Sentinel**       | `nullptr <- A <-> B <-> C -> nullptr` | `head = nullptr`, `tail = nullptr`         |
| **Normal Sentinel**   | `[HEAD] <-> A <-> B <-> C <-> [TAIL]` | `HEAD.next = TAIL`, `TAIL.prev = HEAD`     |
| **Circular Sentinel** | `[SENTINEL] <-> A <-> B <-> C <-> [SENTINEL]` | `sentinel.next = sentinel.prev = sentinel` |

#### 边界处理对比

| 操作    | No Sentinel       | Normal Sentinel      | Circular Sentinel           |
| ----- | ----------------- | -------------------- | --------------------------- |
| 插入头   | 要判断 head 是否为空     | 直接插在 head 后，无需判断     | 直接插在 sentinel 后，无需判断        |
| 插入尾   | 要判断 tail 是否为空     | 直接插在 tail 前，无需判断     | 直接插在 sentinel 前，无需判断        |
| 删除头   | 要判断 head 是否为空     | 直接删除 node，无需判断       | 直接删除 node，无需判断              |
| 删除尾   | 要判断 tail 是否为空     | 同上                   | 同上                          |
| 空链表判断 | `head == nullptr` | `head->next == tail` | `sentinel.next == sentinel` |

#### 节点数量与存储开销

| 类型                | 每条链表额外节点       |
| ----------------- | -------------- |
| No Sentinel       | 0              |
| Normal Sentinel   | 2（head & tail） |
| Circular Sentinel | 1（sentinel）    |

#### 操作复杂度对比

| 操作              | No Sentinel               | Normal Sentinel | Circular Sentinel |
| --------------- | ------------------------- | --------------- | ----------------- |
| push_front/back | O(1)                      | O(1)            | O(1)              |
| remove          | 需要判断 prev/next 是否 nullptr | 不需判断            | 不需判断              |
| empty           | O(1)                      | O(1)            | O(1)              |

#### 安全性对比

| 类型                | UB / 崩溃风险         | 指针错误概率 |
| ----------------- | ----------------- | ------ |
| No Sentinel       | 边界判断少写就 UB        | 高      |
| Normal Sentinel   | sentinel 管控了头尾    | 中      |
| Circular Sentinel | sentinel + 循环保证安全 | 低      |

循环哨兵节点是工业级链表的首选，如Linux`list_head`, STL内部`_List_node_base`

## Circular LinkedList

循环链表是最后一个节点指向头节点的链表\
从任意节点出发，都能转一圈回到自己

### 单向循环链表

```css
 ┌──────────┐
 v          │
[A]->[B]-> [C]
head       tail
```

- `tail->next = head`

#### 设计理念

- `tail` base （推荐）

因为是next 单链表\
`tail`永远是最后一个节点\
`tail->next`永远是头节点\
这是工程中常见的做法

- `head` base

`head`永远指向头节点\
尾节点的`next == head`\
如果不关心尾插，只需要从头遍历，从头取元素，可以这样写\
但工程中几乎永远不会这样做

| 操作 | `head` base | `tail` base |
| - | - | - |
| 头插 | O(1) | O(1) |
| 尾插 | O(n) | O(1) |
| 删除头 | O(n) 要找尾 | O(1) |
| 删除尾 | O(n) | O(n) |
| 任意插入 | O(n) | O(n) |
| 遍历 | 一样 | 一样 |

简而言之，`tail`能很快找到`head`，`head`找`tail`需要遍历

### 双向循环链表

```css
      ↖─────────────↗
head ↔ [A] ↔ [B] ↔ [C]
```

- `head->prev = tail`
- `tail->next = head`

## 链表相关算法

1. 链表反转（Reverse Linked List）
2. 快慢指针（Floyd思想）
3. 删除倒数第N各节点
4. 合并两个有序链表
5. 判断链表是否回文
6. 两两交换节点（Swap Nodes in Pairs）
7. K个一组反转链表
8. LRU Cache（链表 + 哈希表）
9. 侵入式链表（Intrusive List）
10. 空闲链表（Free List）
11. 链表排序
12. 链表相交判断
13. 判断链表是否有环
