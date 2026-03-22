## 核心思想：Git是一个“内容寻址文件系统”
Git的核心是一个键值对存储系统（Key-Value Store）。向Git仓库中插入任意类型的内容（文件、目录、提交等），它会返回一个唯一的键（Key），通过这个键可以在任何时候取回该内容\
这个键就是SHA-1哈希值。它是一个有40个十六进制字符组成的字符串，通过对文件内容或提交信息进行加密计算得来的。关键是：只要内容有一丁点改变，哈希值就会彻底改变

指针（Pointer）就是一个包含另一个对象哈希值（SHA-1）的文件或实体。它“指向”那个对象

### Git对象与指针
Git仓库中有四种基本对象，它们共同构成了Git的数据库（位于`.git/objects`目录），它们之间的关系由指针链接

| 文件类型 | 存储内容 | 示例SHA-1来源（指针指向哪里）|
| - | - | - |
| Blob | 文件的内容（数据）| 文件内容的哈希值 |
| Tree | 目录结构（哪些文件在哪个目录）| 包含的文件名和其Blob的SHA-1，子目录和其Tree的SHA-1 |
| Commit | 提交信息（作者、时间、消息）|包含顶层根目录Tree的SHA-1和父提交的SHA-1 |
| Tag | 一个标签，通常用于标记发布 | 包含一个Commit对象的SHA-1 |

- Commit指向Tree，定义了项目的快照结构
- Tree指向Bolb或其他树：定义了文件内容和目录结构
- Commit指向父提交（Commit），形成了项目的历史记录链
- Tag指向Commit，为某个重要提交提供了一个永久的、易记的名字

### Refs
SHA-1哈希值戳人类极其不友好，无法记忆。Refs就是为了解决这个问题而生的\
引用本质上是一个简单的文本文件，保存在`.git/refs`目录下，文件内容就是它指向的提交对象的SHA-1哈希值。引用就是人类可读的指针（例如`main`, `v1.0`）

#### 主要引用类型
1. 分支（Branches）：指向一个提交的可移动的引用
  - 位置：`.git/refs/heads/<branch-name>`
  - 当在这个分支上做新的提交时，这个分支引用会自动更新（移动）到新提交。这就是分支增长的方式

2. 标签（Tags）：通常指向一个固定的提交的不可移动的引用
  - 位置：`git/refs/tags/<tag-name>`
  - 例如：`git/refs/tags/v1.0`文件内容可能是一个SHA-1（轻量标签）或者指向一个Tag对象（附注标签）
  - 标签创建后，通常不会改变它指向的提交

3. 远程跟踪分支（Remote-Tracking Branches）：记录最后一次从远程仓库获取时，远程分支所在的位置
  - 位置：`.git/refs/remotes/<remote-name>/<branch-name>`
  - 不能直接再这些分支上提交。它们由`git fetch`和`git pull`自动更新

#### HEAD
`HEAD`是一个特殊的引用，它是一个指针，指向当前所在分支或提交。它可以被理解为当前的工作位置或活动分支
- 位置：`.git/HEAD`（一个文件）
- 通常内容：`ref: refs/heads/main`
  - 这表示`HEAD`是一个符号引用（symbolic reference），它间接地指向了`refs/heads/main`这个分支引用所指向的提交
  - 所以，`git commit`知道该让哪个分支前进

##### Detached HEAD（分离头指针）
如果`.git/HEAD`文件的内容直接是一个提交的哈希值，而不是一个分支引用，这就是“分离头指针”状态。这意味着不再任何一个分支上工作，而是直接检出了一个具体的提交。再这种状态下创建新的提交，分支引用不会移动，很容易“丢失”这个新提交（除非创建一个新的分支指向它）\

Detached HEAD可以让用户再不影响任何已有分支的情况下，自由地探索和试验代码库的历史状态\
常见用途有以下几种：
1. 查看历史代码的精确状态（最主要、最安全的用途）
这是最常用且毫无风险的场景。只读
```bash
# 查看 v1.0发布时的代码
git checkout v1.0

# 或者查看某次特定提交的代码
git checkout a1b2c3d
```
之后会看到提示
```text
Note: switching to 'a1b2c3d'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

...
```
在这个状态下，可以：
- 编译、运行代码，重现当时的bug或行为
- 查看文件结构
- 进行测试

做完之后，只需简单地切回一个分支（如`git checkout main`），工作区就会恢复，就像什么都没发生过一样。这是一种“只读”模式

2. 进行实验性提交（高风险、高回报）
这是Detached HEAD的更高级用法，想基于某个历史点尝试一些激进的改动，但还不确定这些改动是否值得创建一个正式的分支
```bash
# 从某个旧提交开始实验
git checkout a1b2c3d

# 进行一些修改，然后提交
git add .
git commit -m "Experiment: try a new approach from the past"
# 再重复几次体骄傲
```
现在基于`a1b2c3d`创建了一个或多个新的提交。这些提交形成了一个新的、短暂的历史线，但没有任何分支指向它\
此时有两个选择：
- 放弃实验：如果对实验结果不满意，直接切回分支。这些实验性提交因为没有引用指向它们，最终会被Git清理掉。这是一种非常干净的“撤销”方式
- 保留实验：如果满意，可以为这条新的历史线创建一个分支来“拯救”这些提交
```bash
# 首先，任然在分离头指针状态，最新的实验提交时当前HEAD
# 创建一个新分支来指向当前HEAD，从而保留整个提交链
git branch new-feature-branch

# 然后切换到新分支
git checkout new-feature-branch
```
现在，实验成果就被永久地保留在了`new-feature-branch`分支上，可以像操作其他分支一样推送、合并它

3. 调试和定位问题（Git Bisect）
`git bisect`是一个强大的调试工具，用于使用二分查找来定位引入bug的提交。`git bisect`的过程就是在自动地、反复地置于Detached HEAD状态

4. 修改历史提交（交互式Rebase的起点）
当进行交互时变基`git rebase -i`时，本质上时指定了一个提交范围让Git重新应用。在这个过程中，Git经常会先将HEAD分离到目标基础提交，然后开始逐个应用新的提交。虽然这个过程对用户时透明的，但其内部机制涉及Detached HEAD

**注意**\
Detached HEAD最大的危险在于遗忘。如果在Detached HEAD状态下创建了一堆重要的提交，然后直接`git switch main`，Git不会像丢弃未暂存的更改那样发出警告。那些提交会立刻编程“孤儿提交”，在界面上很难再找到它们，建议在头指针分离状态下创建临时分支

> HEAD就像一个窗口，使开发者能和Git的交互；
> Git仓库就是一个巨大的、多维的时空连续体，里面包含了项目的所有历史版本、所有分支和所有标签
> `.git/objects`数据库是整个“宇宙”，存储这所有提交、文件和目录的所有状态
> 分支和标签是宇宙中的地标或坐标点
> HEAD就是你现在正通过它来观察和操作这个宇宙的窗口
