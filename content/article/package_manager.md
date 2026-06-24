---
title: Package Manager
date: 2026-05-14
author: ljf12825
type: file
summary: apt, appimage, snap, flatpak
---

## 包

“包”是软件的分发单位，通常是一个压缩文件，里面包含：
- 已编译好的二进制文件（可执行程序、库）
- 配置文件
- 软件的元数据（依赖、版本号、维护者信息等）

不同发行版的包格式不同：
- Deb系：`.deb`（Debian, Ubuntu, Mint）
- RPM系：`.rpm`（RHEL, CentOS, Fedora, openSUSE）
- 其他：Arch用`.pkg.tar.zst`, Gentoo是源码ebuild, Nix用derivations

## 包管理器

Linux的包管理器是一套工具，用来安装、更新、卸载、查询软件包，并自动处理依赖关系（别的软件库和工具）。它是Linux发行版的“软件中枢”，决定了系统如何获取和维护软件

### 前端与后端

包管理器通常分为两层

- 低层工具（真正的安装包、处理依赖）：
  - `dpkg`（Debian）
  - `rpm`（Red Hat）
- 高层前端（联网下载、自动依赖、升级系统）
  - `apt`/ `apt-get`, `aptitude`（Deb系）
  - `dnf`(Fedora/RHEL8+)，`yum`（旧的）（RPM系）
  - `pacman`(Arch)
  - `zypper`(openSUSE)
  - `emerge`(Gentoo)

### 高阶玩法

- 滚动发行 vs 固定发行 
Arch用pacman滚动更新，总是最新；Debian Stable保守
- 源码管理器：Gentoo的`emerge`，Nix/Guix直接从源码或声明式环境构建
- 跨发行包：Flatpak, Snap, AppImage试图绕过传统包管理，提供统一分发

Ubuntu基于Debian系，软件包管理工具主要是APT系列（Advanced Package Tool）。可以把它理解为“Linux的应用商店 + 包管理器”

### 核心概念

- APT（Adbanced Package Tool）：高级包工具，是管理软件包的核心系统，处理依赖关系和软件源
- 软件源（Repository）：软件包的来源服务器，列表存储在`/etc/apt/sources.list`和`/etc/apt/sources.list.d/`目录下
- 本地缓存（`/var/lib/apt/lists/`）：`apt update`刷新的就是这个缓存，它包含了软件源中所有可用包的信息
- `.deb`包：Debian/Ubuntu系统的软件包格式，相当于Windows的`.msi`或macOS的`.pkg`

### 工作流程

一个典型的安装过程

1. 用户执行命令，例如`sudo apt install vim`
2. 前端去软件源(repository)下载对应的`.deb`包
3. 自动解析依赖关系，下载所有包
4. 调用底层工具（如`dpkg`）安装，并更新系统数据库

## 依赖（dependency）

在Linux中，依赖指的是一个软件包在运行时需要其他软件包提供的功能或库文件。换句话说，一个软件包可能需要其他软件包的支持才能正常运行\
依赖通常分为以下几种类型：

1. 直接依赖(Direct Dependency)
这是最常见的依赖关系。某个软件包需要另一个软件包的功能才能正常运行

2. 间接依赖(Indirect Dependency)
间接依赖是指通过其他包间依赖的库或工具。例如，软件A直接依赖软件B,而软件B又依赖软件C,那么软件A就间接依赖软件C

3. 推荐依赖(Recommends)
这是一个建议的依赖项。某个软件包可能运行没有问题，即使缺少推荐的软件包，但如果安装了推荐的软件包，通常会改善软件的功能或用户体验。例如，某些软件的推荐依赖可能是图形界面包，而不是命令行版本

4. 建议依赖(Suggests)
建议依赖是一个软依赖，表示一个包可以运行，但如果安装了他所建议的软件包，可能会使得功能更加完整或增强

5. 增强依赖(Enhances)
增强依赖是某个软件包功能的增强。当你安装某个包时，可能有额外的软件包来增强其功能。此时，增强依赖项的包是可选的，但如果有这些增强包，它们能够提升某个软件的功能

6. 冲突(Confilicts)
冲突表示两个软件包不能一起安装。例如，两个软件包提供相同的功能或修改了相同的文件，这时安装其中一个会导致另一个无法正常工作

7. 替代(Replaces)
当一个软件包替代另一个软件包时，这意味着可以用新包来代替旧包，通常会卸载旧包并安装新包

8. 依赖关系的生命周期
    - 安装时依赖：软件包在安装时会检查它所依赖的其他包，如果缺少这些依赖，系统会提示并安装缺失的包
    - 运行时依赖：在软件包运行时，系统需要满足其他依赖项，否则软件包可能会无法启动或工作不正常
    - 开发时依赖：这些依赖项通常在开发阶段使用，如编译库、调试工具库等，但不是软件正常运行所必须的

### 依赖管理的重要性

- 稳定性：依赖管理能确保软件在不同系统和环境中的稳定运行
- 安全性：通过依赖管理，系统能够自动更新相关的库和工具，确保你使用的是经过修复和验证的版本
- 避免版本冲突：依赖管理工具会帮助你避免因为版本不兼容而导致的软件冲突或崩溃

### 依赖的问题

- 依赖地狱(Dependency Hell)：当两个或多个软件包依赖不同版本的同一软件包时，可能会导致安装冲突或不兼容问题。这种情况就是所谓的依赖地狱
- 不完整的依赖：有时，软件包可能没有正确列出其所有的依赖项，导致安装后出现运行时错误

### 解决依赖问题

现代的包管理系统（如APT）会尽量避免依赖地狱，通过智能算法自动解决版本和冲突问题

## 软件源

APT 的“源”指的是软件仓库（Software Repository），这些仓库是存储在互联网服务器上的集合，里面包含了大量的软件包（.deb文件）及其元数据（如版本、依赖关系等）。

### 源的组成和位置

#### 源列表文件（Sources List）

Ubuntu 从以下文件中知道服务器的地址

- 主文件列表：`/etc/apt/sources.list`
- 附加列表目录：`etc/apt/sources.list.d/` 这个目录下的 `.list` 文件也会被识别。（推荐方式）当通过 PPA 或手动添加第三方源时，通常会在这里创建新的文件
可以用`cat`命令查看主列表文件的内容

```bash
cat /etc/apt/sources.list
```

#### 源的格式

```bash
deb http://archive.ubuntu.com/ubuntu noble main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu noble-security main restricted universe multiverse
```

- 格式：`deb [选项] <镜像服务器网址> <发行版代号> <组件>`
  - `deb`：表示这是二进制软件包的源。如果是`eb-src` 则表示是源代码包的源
  - `<镜像服务器网址>`：软件仓库的实际网络地址。
  - `<发行版代号>`：指定你的 Ubuntu 版本代号（如 `noble (24.04)`, `jammy (22.04)`, `focal (20.04`）。
  - `lsb_release -c` 命令可以查看你当前的代号。
  - `<组件>`：表示软件的种类和授权许可。
    - main: Canonical 官方维护的自由开源软件。
    - restricted: 官方支持但非完全自由的软件（如硬件专有驱动）。
    - universe: 社区维护的自由开源软件（软件数量最多）。
    - multiverse: 非自由软件（有版权或法律限制）。

### 源的种类和来源

#### 官方源 (Official Repositories)

由 Canonical (Ubuntu 背后的公司) 维护。
  
  - 主仓库：archive.ubuntu.com
    - 包含所有在发布时就存在的软件。
  - 安全更新仓库：security.ubuntu.com
    - 极其重要！专门用于发布系统安全补丁和关键漏洞修复。系统会默认配置此源。
  - 更新仓库：archive.ubuntu.com (路径不同)
    - 用于发布稳定的软件更新和 bug 修复。

#### 镜像源 (Mirrors)

为了缓解主服务器的压力并提供更快的下载速度，全球各地有很多大学、机构或公司搭建了镜像源。

- 例如中国的知名镜像源有：
  - 清华大学：https://mirrors.tuna.tsinghua.edu.cn/ubuntu/
  - 阿里云：https://mirrors.aliyun.com/ubuntu/
  - 华为云：https://repo.huaweicloud.com/ubuntu/
  - 网易：http://mirrors.163.com/ubuntu/

可以通过修改 sources.list 文件中的网址，将默认源替换为距离更近的镜像源，这可以大幅提升 apt update 和软件下载的速度。

#### 第三方源 (Third-Party Repositories)

除了官方软件，还有很多软件开发者维护着自己的 APT 源。

- PPA (Personal Package Archive)：
  - 由 Launchpad.net 提供支持，允许个人开发者为自己或项目创建软件仓库。
  - 格式：ppa:user/ppa-name
  - 添加命令：sudo add-apt-repository ppa:user/ppa-name
  - 添加后，PPA 源的信息会单独生成一个文件在 /etc/apt/sources.list.d/ 目录下。
- 独立第三方源：
  - 一些公司（如 Google, Docker, NodeSource）会提供自己的源。
  - 通常需要按照他们的指导文档手动下载并添加一个 .list 文件到 /etc/apt/sources.list.d/ 目录，有时还需要添加 GPG 密钥以验证软件包签名。


### Ubuntu软件包管理命令

#### apt

APT命令是APT前端工具，比`apt-get`更人性化，交互信息更友好
```

##### 查看 apt 历史日志

Linux发行版会把包管理操作记录到日志里`/var/log/apt/history.log`

会看到类似

```txt
Start-Date:
Commandline:
REquested-By:
Upgrade/Install/Remove/Purge/...:
End-Date:
```

apt会自动压缩旧日志

```bash
$ ls /var/log/apt
eipp.log.xz       history.log.3.gz  history.log.7.gz  term.log.2.gz  term.log.6.gz
history.log       history.log.4.gz  history.log.8.gz  term.log.3.gz  term.log.7.gz
history.log.1.gz  history.log.5.gz  term.log          term.log.4.gz  term.log.8.gz
history.log.2.gz  history.log.6.gz  term.log.1.gz     term.log.5.gz
```

#### apt-get（老牌工具，脚本里常见）
`apt-get`功能更底层、更全面。常用命令和`apt`类似，输出没有`apt`美观，但功能更全

#### apt-cache（包信息查询）

专门用来查找和查看包信息

- `apt-cache search <关键词>`：搜索包
- `apt-cache show <包名>`：显示包信息（依赖、描述等）
- `apt-cache depends <包名>`：查看依赖关系树
- `apt-cache rdepends <包名>`：查看反向依赖

> 新系统使用`apt search/show`就足够了，`apt-cache`更偏底层

#### dpkg（更底层，直接操作`.deb`包）
`dpkg`是Debian和基于Debian的Linux发行版（如Ubunt）中的一个低级包管理工具，主要用于安装、卸载、查询和管理`.deb`格式的软件包
该命令将会配置所有尚未完成配置的包

##### dpkg依赖问题
`dpkg`本身不处理依赖关系，因此如果在安装`.deb`包时遇到缺少依赖项，`dpkg`只会提示错误。此时，需要手动安装缺少的依赖包

1. 安装依赖问题

如果在安装某个`.deb`包时遇到类似`dependency problems`的错误，可以先使用以下命令尝试修复依赖问题

```bash
sudo apt-get install -f 
```

这个命令会自动查找缺失的依赖并安装他们。`apt-get`会解析依赖关系，下载并安装缺少的包

2. 强制安装

如果不想解决依赖问题，或者希望强制安装一个`.deb`包（通常不建议）

```bash
sudo dpkg -i --force-all <package_name>.deb
```

##### dpkg与apt/apt-get的关系

`dpkg`是Debian系列发行版的底层包管理工具，它直接操作`.deb`文件。而`apt`或`apt-get`是高层包管理工具，它依赖于`dpkg`来安装和管理包，但同时也处理包的依赖关系\
通常，我们使用`apt-get`或`apt`来安装、更新、卸载包，因为它们会自动处理依赖关系。但有时你会直接使用`dpkg`，比如在下载了`.deb`文件后手动安装，或者在没有网络连接的环境中操作

##### dpkg常见的错误和解决方法
- 错误：`dpkg: error processing package`
这种错误通常是由于包的损坏或者软件依赖关系缺失导致的。解决方法通常是运行
```bash
sudo apt-get install -f 
```
或者使用`dpkg --configure -a`来重新配置未完全安装的包

- 错误：`dpkg: serious warning: files list file for package`
这种错误通常是由于系统包数据库损坏。可以通过重新安装该包或修复文件来解决
```bash
sudo dpkg --configure -a 
```
- 错误：`dependency problems`
如果在安装时遇到依赖问题，`dpkg`会报告缺少的依赖项。可以使用`apt-get install -f`来解决缺失的问题

##### dpkg 安装记录

`apt` 最终调用的是 `dpkg`，所以更够查看更底层，更详细的dpkg记录 `/var/log/dpkg.log`

#### Snap
`Snap`是一种由Canonical (Ubuntu母公司)开发的Linux软件包管理系统。它提供了一种标准化的软件分发和安装方式，使得开发者能够创建跨不同Linux发行版运行的应用程序。Snap包将应用及其所有依赖项打包在一起，因此可以避免因不同发行版的库版本差异而引起的兼容性问题。Snap包的最大特点之一就是他的容器化特性，使得应用与系统其他部分分隔运行，从而提高安全性

##### Snap的主要特点

1. 跨发行版兼容性
Snap包是跨平台的，可以在不同的Linux发行版上安装和运行（如Ubuntu、Debian、Fedora、Arch Linux等）。这使得开发者只需要维护一个包，而无需为每个发行版分别打包
2. 容器化应用
Snap包通过容器化技术将应用和它的所有依赖一起打包。每个Snap包都在自己的沙盒环境中运行，与其他应用和系统环境相隔离。这增强了系统的安全性，因为即使应用存在漏洞，它也无法轻易访问系统的其他部分
3. 自动更新
Snap包具有自动更新功能，系统会在后台自动下载并安装应用的最新版本。更新是增量的，意味着只有在应用程序或其依赖发生变化时才会下载新内容，从而节省带宽和存储
4. 回滚支持
如果某个更新引入了问题，Snap包允许用户回滚到先前的版本。每次更新都会保存一个备份，用户可以轻松恢复到更稳定的版本
5. 隔离性和沙盒
Snap包在自己的沙盒中运行，因此它不能直接访问系统的其他文件和资源。Snap包和外部资源的访问都可以通过权限系统控制，确保应用程序的安全性
6. 一次构建，多平台支持
与传统的`.deb`或`.rpm`包相比，Snap包让开发者能够只为一次构建提供支持，自动适配不同的Linux发行版。开发者只需要将应用及其所有依赖打包成一个Snap文件，而不必针对不同平台进行多次打包

##### Snap包的组成
一个Snap包通常包含以下几部分

- 应用程序二进制文件：应用程序本身的可执行文件
- 依赖库：Snap包自带的所有库文件和应用所需的其他依赖项
- 配置文件：配置应用程序的文件，允许用户根据需要进行个性化设置
- 元数据：描述Snap包的元数据文件，包括应用的名称、版本、权限、依赖关系等

- 搜索
```bash
snap find <关键词>
```
- 安装
```bash
sudo snap install <包名>
```
- 更新
```bash
sudo snap refresh <包名>
```
- 回滚
```bash
sudo snap revert <包名>
```
- 卸载
```bash
sudo snap remove <包名>
```
- 查看已安装
```bash
snap list
```
- 安装指定版本的Snap包
Snap支持通过指定频道（channels）安装不同版本的应用。例如，某些应用有多个版本的更新渠道（如`stable`, `beta`, `edge`），可以选择安装不同的版本
```bash
sudo snap install <包名> --channel=<channel_name>
```
有些新软件（如`chromium`）只提供snap包，不再提供apt包

##### Snap的优势
1. 跨发行版支持：Snap包可以在不同的Linux发行版上运行，简化了开发者的工作，不需要为每个发行版维护不同的包
2. 自动更新：Snap可以自动更新，确保应用始终是最新版本，减少了手动管理和更新的麻烦
3. 容器化与沙盒：应用被打包称一个独立的单元，具有更好的安全性和隔离性，减少了与系统其他部分的依赖和影响
4. 回滚支持：如果新版本有问题，可以方便地回滚到先前的稳定版本

##### 劣势
1. 较大的磁盘占用：由于Snap包包含应用程序和所有依赖项，安装的Snap包可能会比传统的包占用更多的磁盘空间
2. 启动较慢：Snap包可能启动较慢，因为它们需要在容器中运行，并且可能需要加载更多的依赖项
3. 不完全兼容某些系统资源：虽然Snap旨在提供跨发行版支持，但它并不完美，有些特性可能无法在某些系统中完美运行
4. 权限控制：Snap包的沙河特性要求通过权限管理控制应用与系统资源的交互，有时可能会限制某些功能，导致应用无法执行某些操作

### 总结与工作流程
当执行`sudo apt update`时，APT 工具会：
1. 读取 /etc/apt/sources.list 和 /etc/apt/sources.list.d/* .list 中的所有源地址。
2. 连接到这些地址对应的服务器。
3. 下载服务器上的元数据文件（如 Packages.gz），并存储到本地 /var/lib/apt/lists/ 目录。这些元数据包含了服务器上所有软件包的列表、版本、依赖等信息。
4. 建立本地软件数据库。之后执行 apt search, apt install 等操作时，APT 都是在查询这个本地数据库，而不是上网去搜。
所以，APT 的源就来自这些遍布全球的、由官方、镜像站以及第三方开发者维护的软件仓库服务器。sources.list 文件就是告诉系统该去哪些服务器的清单

## APPImage

## Flatpak
