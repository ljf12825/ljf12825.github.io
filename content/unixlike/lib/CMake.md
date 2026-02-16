---
title: CMake
date: 2025-12-31
categories: [Linux]
tags: [Toolchains, Build]
author: "ljf12825"
type: blog
summary: Concept, usage of CMake
---

假设有一个C++项目，里面有几十个源文件，依赖好几个外部库。需要在不同的平台上编译它：
- Windows：用Visual Studio
- Linux：用GCC
- macOS：用Clang
- 直接使用编译器命令：`g++ main.cpp file1.cpp ... -o myapp`。对于小项目可以，大项目会变得极其繁琐且难以维护
- 直接写Makefile：在Linux上很常见，但语法晦涩，且不能跨平台。Windows上的Visual Studio不使用Makefile
- 使用IDE的项目文件：比如直接创建一个Visual Studio项目。但如果没有Windows机器，就无法为Linux构建

CMake的解决方案是：
不需要直接写Makefile或`.vcxproj`文件，而是用一个独立于编译器和平台的、更高级的语言（CMake语言）编写一个配置文件，叫做`CMakeLists.txt`

然后，CMake会根据你的平台和你选择的编译器，生成对应的原生构建文件

- 在Linux上 -> 生成`Makefile`
- 在Windows上 -> 生成 Visual Studio 解决方案（`.sln`和`.vcxproj`）
- 在macOS上 -> 生成`Xcode`工程
- 它还可以生成`Ninja`等

CMake是现代C++/C项目中最常见的构建系统生成工具，可以把它理解为**跨平台的项目构建脚本语言** + **构建系统生成器**

所以CMake的好处是：写一份`CMakeLists.txt`，到处都能用

CMake在开发流程中的位置

![流程图](/images/Blog/CMake_1.png)

CMake在工具链中的位置

![工具链中的位置](/images/Blog/CMake_2.png)

跨平台和交叉编译

![跨平台中的位置](/images/Blog/CMake_3.png)

## CMake基本工作流程
1. 配置（Configure）
  - 执行`cmake /path/to/source`
  - CMake读取源代码目录中的`CMakeLists.txt`文件
  - 它检查系统环境：编译器是否存在？依赖库在哪里？等等
  - 它在构建目录（通常是单独的`build`目录，这与“源代码分离构建”的最佳实践有关）中生成一个缓存文件`CMakeCache.txt`，保存了这些配置信息

2. 生成（Generate）
  - 根据上一步的配置，CMake在构建目录中生成所需要的原生构建文件（如`Makefile`）
    - 例如在Linux：
    ```bash
    mkdir build
    cd build
    cmake ..
    ```
    它会在`build`目录下生成`Makefile`

3. 构建（Build）
  - Linux上就是`make`
  - Windows上就是打开生成的`.sln`或者用`msbuild`

## CMake语法
CMake虽不像C++那样复杂，但它其实是一个**声明式** + **脚本式DSL**，有自己的一套规则和陷阱

### 基本特点
1. 大小写不敏感，推荐小写
```cmake
PROJECT(MyProj)
project(MyProj) # 等价
```

2. 逐行解释，顺序敏感
3. 注释：`#`后面的内容是注释
4. 变量引用：用`${var}`
```c
set(MYVAR Hello)
message(${MYVAR}) # 输出 Hello
```

### 变量
- 定义变量
```cmake
set(NAME value) # 普通变量
set(NAME "a;b;c") # 列表（用；分隔）
```

- 环境变量
```cmake
set(ENV{PATH} /usr/local/bin) # 设置环境变量
message($ENV{PATH}) # 读取环境变量
```

### 控制语句
1. if
```cmake
if (VAR STREQUAL "Hello")
    message("Matched")
elseif(VAR MATCHES "He.*")
    message("Regex matched")
else()
    message("No match")
endif()
```
- 常见比较操作：
  - `STREQUAL`：字符串相等
  - `EQUAL`：数字相等
  - `MATCHES`：正则匹配
  - `LESS`, `GREATER`：数值比较
  - `EXISTS path`：文件或目录存在

2. foreach
```cmake
set(NAMES Alice Bob Charlie)
foreach(name ${NAMES})
    message("Name: ${name}")
endforeach()
```
也支持范围
```cmake
foreach(i RANGE 3) # 0 1 2 3
foreach(i RANGE 1 5 2) # 1 3 5 [1, 5]间隔为2
endforeach()
```

3. while
```cmake
set(i 0)
while(i LESS 3)
    message(${i})
    math(EXPR i "${i}+1")
endwhile()
```

### 函数与宏
函数（作用域内变量）
```cmake
funciton(print_message arg1)
    message("Function: ${arg1}")
endfunction()

print_message("Hello")
```

宏(全局变量修改)
```cmake
macro(print_message arg1)
    message("Macro: ${arg1}")
endmacro()
```
区别：`function`内的`set()`默认是局部的，而`macro`会直接修改外部变量

### 列表操作
```cmake
set(LST a b c)
list(APPEND LST d) # a;b;c;d
list(LENGTH LST len) # len=4
list(GET LST 1 second) # second=b
list(REMOVE_ITEM LST b) # LST=a;b;c
```

### 字符串操作
```cmake
string(TOUPPER "abc" OUT) # OUT=ABC
string(REPLACE "a" "X" OUT "abc") # OUT=Xbc
string(REGEX MATCH "[0-9]+" NUM "abc123def) # NUM=123
```

### 文件与路径
```cmake
file(READ my.txt CONTENTS) # 读文件
file(WRITE out.txt "Hello") # 写文件
file(MAKE_DIRECTORY build/include) # 创建目录
file(GLOB SOURCES "*.cpp") # 通配符获取文件
```

### 数学与逻辑
```cmake
math(EXPR result "3 + 7") # result=10
```
逻辑运算在`if`中
```cmake
if(A AND B)
if(NOT C)
```

### 构建命令
```cmake
add_executable(app main.cpp) # 可执行文件
add_library(mylib STATIC a.cpp b.cpp) # 静态库
add_library(mylib SHARED a.cpp b.cpp) # 动态库

target_link_libraries(app PRIVATE mylib) # 链接库
target_include_directories(app PRIVATE inc/) # 添加头文件路径
```

### target属性（现代CMake推荐）
```cmake
# 作用范围
# PRIVATE 仅自己使用
# PUBLIC 自己和依赖者都用
# INTERFACE 仅依赖者使用

target_compile_definitions(app PRIVATE DEBUG_MODE) # 宏定义
target_compile_options(app PRIVATE -Wall -Wextra) # 编译选项
```

### 模块与包
```cmake
find_package(OpenGL REQUIRED) # 查找外部库
target_link_libraries(app PRIVATE OpenGL::GL)
```

### 子目录与安装
```cmake
add_subdirectory(src) # 引入子目录

install(TARGETS app DESTINATION bin) # 安装可执行文件
install(FILES config.h DESTINATION include)
```

### 工具
```bash
cmake .. # 生成构建文件
cmake --build . # 构建（跨平台）
cmake --install . --prefix /usr # 安装
```

### CMake特有命令
- project(name)：定义项目名
- set()：设置变量
- add_executable(target srcs...)：生成可执行文件
- add_library(target srcs...)：生成静态库或动态库
- target_link_libraries(target lib...)：链接库
- include_directories(path)：添加头文件目录
- find_package(pkg REQUIRED)：查找并使用外部库


## CMake功能
### Debug/Release
CMake的Debug和Release模式是构建系统的核心概念，几乎每个实际项目都会用到。它们本质上是构建配置（Build Configuration），控制编译器优化级别、调试符号、宏定义等

CMake通过一个变量`CMAKE_BUILD_TYPE`来控制构建类型（单配置生成器），或者通过生成器本身来切换（多配置生成器）\
常见的配置有：
- Dubug
  - 编译时不优化（或少优化）
  - 保留完整调试信息（符号表）
  - 通常会定义`DEBUG`宏

- Release
  - 编译时进行优化（如`-03`）
  - 去掉调试信息或只保留少量
  - 通常会定义`NDEBUG`宏（禁用断言）

- RelWithDebInfo
  - Release优化 + 调试信息
- MinSizeRel
  - Release优化，目标时最小二进制体积

#### 设置方式
1. 单配置生成器（Makefile、Ninja）
需要手动指定：
```bash
cmake -DCMAKE_BUILD_TYPE=Debug ..
cmake -DCMAKE_BUILD_TYPE=Release ..
make
```

2. 多配置生成器（Visual Studio、XCode）
它们支持多配置，不用再CMake阶段指定，而是在IDE里切换：
- Visual Studio -> 工具栏有Debug/Release下拉框
- Xcode -> scheme里切换

命令行构建方式
```bash
cmake --build . --config Debug
cmake --build . --config Release
```

#### CMake内部变量
当选择不同配置时，CMake会自动设置一些编译器/链接器参数
例如（GCC/Clang下）：
- `CMAKE_CXX_FLAGS_DEBUG` -> `-g -O0`
- `CMAKE_CXX_FLAGS_RELEASE` -> `-03 -DNDEBUG`
- `CMAKE_CXX_FLAGS_RELWITHDEBINFO` -> `-02 -g`
- `CMAKE_CXX_FLAGS_MINSIZEREL` -> `-0s -DNDEBUG`

可以覆盖或追加
```cmake
set(CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG} -Wall")
```

#### 在CMakeLists.txt中使用
可以根据构建类型做条件控制
```cmake
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    message("Building Debug version")
    add_definitions(-DDEBUG_MODE)
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    message("Building Release version")
endif()
```
更推荐现代写法：
```cmake
target_compline_definitions(myapp PRIVATE
    $<$<CONFIG:Debug>:DEBUG_MODE>
    $<$<CONFIG:Release>:NDEBUG_MODE>
)
```
这里用了生成表达式`$<CONFIG:...>`，自动根据配置切换

**实际开发中的使用场景**
1. 调试时 -> 用`Debug`，有完整符号，方便调试器定位问题
2. 发布给用户时 -> 用`Release`，优化过的二进制，运行更快更小
3. 线上诊断 -> 有时会用`RelWithDebInfo`，既有优化，又保留符号文件，便于分析crash
4. 嵌入式/移动平台 -> 有时用`MinSizeRel`，为了减小体积

### 跨平台工具链
CMake默认使用本机编译器（Linux上用GCC/Clang，Windows上用MSVC，macOS上用AppleClang）
但如果要：
- 在 x86 PC上编译ARM代码（交叉编译，给Android、树莓派、嵌入式设备用）
- 在Windows上用MinGW编译Windows程序（而不是MSVC）
- 在Linux上生成Windows可执行文件（跨平台构建）

这时就需要工具链文件（Toolchain File）告诉CMake：要用什么编译器、链接器、sysroot、库路径、平台信息

#### 指定工具链文件
运行cmake时指定
```bash
cmake -DCMAKE_TOOLCHAIN_FILE=path/to/toolchain.cmake ..
```
例如给Android构建：
```bash
cmake -DCMAKE_TOOLCHAIN_FILE=$ANDROID_NDK/build/cmake/android.toolchain.cmake ..
```

#### 工具链文件的内容
一个toolchain.cmake文件本质上就是一份`CMakeLists.txt`片段，里面写编译器和平台信息

示例：交叉编译到ARM Linux
```cmake
# toolchain-arm.cmake
set(CMAKE_SYSTEM_NAME Linux) # 目标平台系统
set(CMAKE_SYSTEM_PROCESSOR arm) # 目标架构

# 指定交叉编译工具链
set(CMAKE_C_COMPILER arm-linux-gnueabihf-gcc)
set(CMAKE_CXX_COMPILER arm-linux-gnueabihf-g++)
set(CMAKE_FIND_ROOT_PATH /usr/arm-linux-gnueabihf)

# 搜索规则
set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER) # 不在目标环境找可执行程序
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY) # 只在目标环境找库
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY) # 只在目标环境找头文件
```
构建：
```bash
cmake -DCMAKE_TOOLCHAIN_FILE=toolchain-arm.cmake ..
make
```

#### 现代CMake更推荐的做法
在CMakePresets.json里定义工具链，更方便管理\
例如
```json
{
    "version": 3,
    "cmakeMinimumRequired": { "major": 3, "minor": 20},
    "configurePresets": [
        {
            "name": "linux-arm",
            "generator": "Ninja",
            "toolchainFile": "cmake/toolchains/toolchain-arm.cmake",
            "cacheVariables": {
                "CMAKE_BUILD_TYPE": "Release"
            }
        }
    ]
}
```
然后就可以
```bash
cmake --preset linux-arm
```

### 安装与导出
#### 安装（install）
目的：把编译好的二进制文件、头文件、配置文件复制到一个标准位置，供其他项目使用\
常见用法
1. 安装可执行文件
```c
add_execetable(myapp main.cpp)
install(TARGETS myapp DESTINATION bin)
```
安装后`myapp`会被放到`<prefix>/bin`

2. 安装库
```cmake
add_library(mylib STATIC foo.cpp)
install(TARGETS mylib DESTINATION lib)
```
安装后`libmylib.a`在`<prefix>/lib`

3. 安装头文件
```cmake
install(FILES foo.h DESTINATION include)
install(DIRECTORY include/ DESTINATION include) # 整个目录
```

4. 安装配置文件、资源文件
```cmake
install(FILES config.json DESTINATION share/myproj)
```

5. 设置安装前缀
```bash
cmake -DCMAKE_INSTALL_PREFIX=/usr/local ..
make install
```
最终文件会安装到`/usr/local/bin`,`/usr/local/lib`,`/usr/local/include`

#### 导出（export）
目的：让别人通过`find_package()`使用你的库

1. 导出目标
```cmake
install(TATGETS mylib
        EXPOrT mylibTargets
        DESTINATION lib)
install(EXPORT mylibTargets
        NAMESPACE MyLib::
        DESTINATION lib/cmake/mylib)
```
这样会生成一个`mylibTargets.cmake`，里面描述了目标 + 依赖
别人`find_package(mylib)`时就能拿到`MyLib::mylib`目标

2. 包配置文件
需要写一个mylibConfig.cmake，让CMake知道如何找到`mylibTargets.cmake`
```cmake
# mylibConfig.cmake
include("${CMAKE_CURRENT_LIST_DIR}/mylibTargets.cmake")
```
然后安装它
```cmake
install(FILES mylibConfig.cmake DESTINATION lib/cmake/mylib)
```

#### 完整工作流
假设写了一个库`mylib`
1. CMakeLists.txt
```cmake
cmake_minimu_required(VERSION 3.15)
project(MyLib)

add_library(mylib foo.cpp)
target_include_directories(mylib PUBLIC include)

install(TARGETS mylib
        EXPORT mylibTargets
        DESTINATION lib)
install(EXPORT mylibTargets
        NAMESPACE MyLib::
        DESTINATION lib/cmake/mylib)
install(DIRECTORY include/ DESTINATION include)

include(CMakePackageConfigHelpers)
write_basic_package_version_file(
    "${CMAKE_CURRENT_BINARY_DIR}/mylibConfigVersion.cmake"
    VERSION 1.0
    COMPATIBILITY AnyNewerVersion
)
install(FILES
    "${CMAKE_CURRENT_BINARY_DIR}/mylibConfigVersion.cmake"
    DESTINATION lib/cmake/mylib)
```

2. 安装
```bash
cmake -DCMAKE_INSTALL_PREFIX=/usr/local ..
make install
```

目录结构
```bash
/usr/local/
  ├── include/
  │     └── foo.h
  ├── lib/
  │     ├── libmylib.a
  │     └── cmake/mylib/
  │           ├── mylibTargets.cmake
  │           ├── mylibConfig.cmake
  │           └── mylibConfigVersion.cmake
```

3. 在另一个项目中使用
```cmake
find_package(mylib REQUIRED)
add_executable(app main.cpp)
target_link_libraries(app PRIVATE MyLib::mylib)
```

## 现代CMake理念
CMake的我发展经历了一个从“命令式”到“声明式”的转变，这就是所谓的现代CMake理念

### 传统CMake（旧写法）
早期的CMake写法往往是命令式、全局变量驱动的
```c
# 旧写法
include_directories(${CMAKE_SOURCE_DIR}/include)
link_directories(${CMAKE_SOURCE_DIR}/lib)

add_executable(app main.cpp)
target_link_libraries(app mylib)
```
缺点：
- 全局污染：`include_directories()`和`link_directories()`影响所有目标，依赖关系不清晰
- 难以维护：大型项目里，谁依赖了什么一目不明
- 模块化差：库的使用方式不清晰，别人引入时需要手动写一堆include和link

### 现代CMake（推荐写法）
现代CMake强调目标导向（Target-based）、声明式、可复用性\
核心理念就是：所有的编译信息都绑定在target上，而不是全局设置

```cmake
add_library(mylib src/mylib.cpp)

# 指定库的头文件（公开接口）
target_include_directories(mylib
    PUBLIC include # 使用该库的人也需要的头文件
    PRIVATE src/internal # 仅库内部需要
)

# 指定库依赖
target_link_libraries(mylib
    PUBLIC otherlib # 链接依赖传播出去
    PRIVATE pthread # 内部使用，外部不需要关心
)

add_executable(app main.cpp)
target_link_libraries(app PRIVATE mylib)
```
这样
- `app`使用`mylib`时，会自动继承它的`include`和`otherlib`，不用手动重复
- 依赖关系清晰：谁需要传播、谁仅内部使用一目了然

### 现代CMake核心理念
1. 目标导向（Target-base）
  - 一切都围绕target（库、可执行文件）来写
  - 避免使用全局指令，如`include_directories()`、`link_directories()`，改用`target_*()`

2. 作用域清晰（PUBLIC/PRIVATE/INTERFACE）
  - PRIVATE：仅自己使用
  - PUBLIC：自己和依赖者都使用
  - INTERFACE：只有依赖者使用，自己不用

3. 导出与安装
  - 库能被别人用，就要写`install()`和`export()`
  - 使用Config Package 模式导出（`MyLibConfig.cmake`），而不是`FindXXX.cmake`

4. 声明式而非命令式
  - 旧CMake：一步步告诉CMake做什么
  - 新CMake：声明依赖关系，CMake自己推导构建流程

5. 跨平台与工具链
  - 不写死编译器参数，使用`target_compile_features()`、`target_compile_options()`
  - 让CMake根据编译器/平台自动决定

现代CMake优点
- 可维护性高：大型工程更易管理
- 依赖自动传播：别人用你的库，不用重复配置
- 跨平台性强：声明式语法让项目更容易迁移
- 兼容包管理：容易与`vcpkg`、`Conan`等工具集成

#### target_*API
1. `target_link_libraries`
声明某个目标依赖哪些库，并指定作用域
```cmake
target_link_libraries(myApp
    PRIVATE myLibA
    PUBLIC myLibB
    INTERFACE myLibC
)
```
- PRIVATE：只在`myApp`内生效，不传播给依赖它的目标
- PUBLIC：在`myApp`内生效，同时传播给依赖`myAPP`的目标
- INTERFACE：不在`myApp`内生效，只传播给依赖它的目标


2. `target_include_directories`
给目标添加头文件路径：
```cmake
target_include_directories(myLib
    PUBLIC include/
    PRIVATE src/
    INTERFACE api/
)
```

3. `target_compile_definitions`
给目标添加预处理宏
```cmake
target_compile_definitions(myApp
    PRIVATE DEBUG_MODE
    PUBLIC USE_LIBX
)
```

4. `target_compile_options`
给目标添加编译器选项
```cmake
target_compile_options(myApp
    PRIVATE -Wall -Wextra
)
```

5. `target_sources`
直接声明目标的源文件（比`add_executable`/`add_library`更灵活）
```cmake
target_sources(myLib
    PRIVATE src/foo.cpp
    PUBLIC include/foo.h
)
```

6. `target_compile_features`
声明目标需要的C++标准
```cmake
target_compile_feature(myApp PUBLIC cxx_std_17)
```
比`set(CMAKE_CXX_STANDARD 17)更推荐

**target API的传播机制**
- 依赖树会自动继承编译信息
```cmake
add_library(libA ...)
target_compile_definitions(libA PUBLIC USE_A)

add_executable(app main.cpp)
target_link_libraries(app PRIVATE libA)
```
`app`会自动拥有`USE_A`宏

## 示例
1. 假设有一个最简单的C++项目
```css
project-root/
  ├── CMakeLists.txt
  └── main.cpp
```
main.cpp
```cpp
# include <iostream>
int main()
{
    std::cout << "Hello, CMake!" << std::endl;

    return 0;
}
```

CMakeLists.txt
```cmake
cmake_minium_required(VERSION 3.10) # 要求的最低CMake版本
project(HelloCMake) # 项目名称
set(CMAKE_CXX_STANDARD 17) # 设置C++标准

add_executable(hello main.cpp) # 生成可执行文件
```

构建：
```bash
mkdir build && cd build
cmake ..
make
./hello
```

2. 稍微复杂的项目
目录结构：
```css
project-root/
  ├── CMakeLists.txt
  ├── src/
  │     ├── CMakeLists.txt
  │     ├── main.cpp
  │     └── foo.cpp
  └── include/
        └── foo.h
```
`project-root/CMakeLists.txt`
```cmake
cmake_minium_required(VERSION 3.10)
project(MyProject)

set(CMAKE_CXX_STANDARD 17)

add_subdirectory(src) # 进入scr/目录继续处理
```
`scr/CMakeLists.txt`
```cmake
add_executable(myapp main.cpp foo.cpp)
target_include_directories(myapp PUBLIC ../include) # 指定头文件目录
```
这样目录更清晰，适合大型项目



