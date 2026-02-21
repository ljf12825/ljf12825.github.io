---
title: IO Stream
date: 2025-06-01
categories: [C#]
tags: [Syntax]
author: "ljf12825"
type: log
summary: C# io stream
---

I/O(Input/Output)流是C#中处理数据输入输出的核心机制，它提供了一种统一的方式来处理不同类型的数据源和目标（如文件、内存、网络等）

## I/O流的概念
在C#中，流（Stream）是一个抽象概念，表示一系列连续的字节数据。所有流都继承自`System.IO.Stream`抽象类，它定义了流的基本操作：
- 读取（Read）
- 写入（Write）
- 定位（Seek）
- 关闭（Close）

在C#中，I/O流分为两种：
- 字节流（Byte Streams）：用于处理原始二进制数据，通常用于图片、音频、视频等文件。字节流的基类是`Stream`，常用的字节流包括:
  - `FileStream`：用于文件的读取和写入，既可以以字节为单位，也可以通过缓冲区进行处理
  - `MemoryStream`：用于内存中的数据流，可以临时存储数据，类似于一个内存中的文件
  - `BufferedStream`：通过缓冲区对其他流（如文件流）进行优化，提高读取/写入性能
  - `NetworkStream`：用于通过网络进行数据传输的流
- 字符流（Character Streams）：用于处理文本数据，它是基于字符的编码和解码方式的。字符流的基类是基类为`TextReader`和`TextWriter`字符流通过读取和写入字符而非字节来工作，适合处理文本文件。常用的字符流包括：
  - `StreamReader`：用于读取字符数据，通常用于读取文本文件
  - `StreamWriter`：用于写入字符数据，通常用于向文件写入文本
  - `StringReader` 和 `StringWriter`：用于在内存中操作字符串

## 字节流（Byte Streams）操作
### `FileStream`
`FileStream`是.NET中用于读取和写入文件的类。它提供了对文件的字节级别的访问，可以处理较大的文件并允许逐字节地操作文件内容，适用于需要直接操作文件内容的场景

#### 基本概念
`FileStream`类位于`System.IO`命名空间中，支持异步和同步操作，通常用于文件的读取、写入以及定位。它可以处理任意类型的文件，不仅仅是文本文件，还可以处理二进制文件

#### 常见用法
**构造函数**\
`FileStream`有多个构造函数，每个构造函数都可以根据不同的需求来打开或创建文件
1. 基本构造函数
```cs
public FileStream(string path, FileMode mode);
```
- `path`：文件的路径（包括文件名）
- `mode`：指定文件操作的模式，决定了如何打开文件

2. 指定文件访问权限
```cs
public FileStream(string path, FileMode mode, FileAccess access)
```
- `access`：文件访问权限，指定对文件的读取、写入或读写权限

3. 指定文件访问权限和共享模式
```cs
public FileStream(string path, FileMode mode, FileAccess access, FileShare share);
```
- `share`：指定文件共享选项，控制其他进程如何访问该文件

4. 指定缓冲区大小
```cs
public FileStream(string path, FileMode mode, FileAccess access, FileShare share, int bufferSize);
```
- `bufferSize`：指定缓冲区的大小。缓冲区越大，读取和写入速度通常会更快

5. 指定文件路径和流的创建方式
```cs
public FileStream(string path, FileMode mode, FileAccess access, FileShare share, int bufferSize, FileOptions options);
```
- `options`：文件的其他选项


**文件模式（FileMode）**
- FileMode.Create：创建一个新文件。如果文件已经存在，会覆盖
- FileMode.Open：打开现有文件。如果文件不存在，抛出异常
- FileMode.OpenOrCreate：打开文件，如果文件不存在，则创建
- FileMode.Append：打开文件并将数据追加到文件末尾。如果文件不存在，则创建文件
- FileMode.Truncate：打开文件并清空内容（文件长度设为零）

**文件访问权限（FileAccess）**
- FileAccess.Read：只读访问
- FileAccess.Write：只写访问
- FileAccess.ReadWrite：可读写访问

**文件共享（FileShare）**\
控制其他进程对文件的访问权限。常用的选项有
- FileShare.None：不允许其他程序访问
- FileShare.Read：允许其他程序读取文件
- FileShare.Write：允许其他程序写入文件

**文件的其他选项（FileOptions）**
- `Asynchronous`：文件流支持异步操作
- `DeleteOnClose`：文件在流关闭时自动删除


**文件位置操作**\
`FileStream`支持文件中的位置操作，允许控制当前读取或写入的位置。可以通过`Position`属性来获取或设置当前的文件指针位置
```cs
fs.Position = 0; // 设置文件指针到文件开头
```

**读取和写入数据**
`FileStream`提供了字节级别的操作方法，例如：
- `Read`：读取字节流到缓冲区
  - 方法签名
  ```cs
  public override int Read(byte[] array, int offset, int count);
  ```
    - `array`：要存储读取数据的字节数组
    - `offset`：字节数组中从哪个位置开始存储数据
    - `count`：要读取的字节数
  - 返回值
  `Raed`方法韩慧实际读取的字节数。它可能少于请求的字节数，尤其是在文件末尾时。如果读取的字节数为0，且没有更多数据可读，则表示文件结束
  - 注意事项
    - `Read`方法会从文件流中读取数据，直到达到指定的字节数`count`或者文件末尾
    - 在读取时，如果文件数据不够`count`字节，`Read`会尽可能读取到剩余的数据
    - 如果多次调用`Read`，它会从文件流中继续读取剩余内容
- `Write`：将字节流写入文件
  - 方法签名
  ```cs
  public override void Write(byte[] array, int offset, int count);
  ```
  - 无返回值，它将指定字节数组中的数据写入到文件中，直到达到指定的字节数
  - 注意事项
    - `Write`方法会覆盖当前文件的位置指针所在的内容。如果打开的是一个已存在的文件并且使用了`FileMode.Create`或者`FileMode.Truncate`，它会覆盖文件内容
    - 如果使用`FileMode.Append`，写入的数据会追加到文件末尾
    - `Write`会阻塞执行，直到写入操作完成，因此如果需要高效的文件写入，可以考虑异步写入

```cs
// 写入文件
byte[] data = Encoding.UTF8.GetBytes("Hello, World!");
fs.Write(data, 0, data.Length);

// 读取文件
byte[] buffer = new byte[fs.Length];
fs.Read(buffer, 0, buffer.Length);
Console.WriteLine(Encoding.UTF8.GetString(buffer));
```

**异步操作**
`FileStream`还支持异步操作，尤其适用于需要处理大量数据或在UI应用中避免阻塞主线程的场景
```cs
await fs.WriteAsync(data, 0, data.Length);
byte[] buffer = new byte[fs.Length];
await fs.ReadAsync(buffer, 0, buffer.Length);
```

**适用场景**
- 大文件的分块读取：可以利用`FileStream`来按块读取大文件，逐渐加载文件内容，而不必一次性将所有文件加载到内存中
- 日志文件操作：用于实时写入日志文件，不会占用过多内存
- 图像和音频文件处理：在处理二进制文件（如图片、音频、视频）时，`FileStream`是一个常见的选择

**使用完`FileStream`后的清理**\
通常，当操作文件流时，需要及时释放资源。最安全的方式是使用`using`语句，它确保即使发生异常，文件流也会正常关闭
```cs
using (FileStream fs = new FileStream("example.txt", FileMode.OpenOrCreate))
{
    // file ops
}// stream close
```

### `MemoryStream`
`MemoryStream`允许在内存中读写数据，而不是像`FileStream`那样操作磁盘文件。它的底层是一个字节数组`byte[]`，所以读写速度非常快，但数据是非持久化的，程序结束或对象被回收后数据就消失了

#### 核心特点

| 特性     | 说明                     |
| ------ | ---------------------- |
| 数据存储   | 内存中（`byte[]`）          |
| 可读写    | 可以读、写，支持随机访问（Seek）     |
| 性能     | 高速，因为不涉及磁盘 I/O         |
| 数据长度可变 | 内部缓冲区会自动扩容             |
| 可转字节数组 | 可通过 `ToArray()` 获取整个内容 |

> 注意：如果使用`MemoryStream`构造函数时传入一个固定的`byte[]`，默认不可扩展，写入过多数据会抛异常

#### 常用构造函数
```cs
MemoryStream() // 空的内存流
MemoryStream(byte[] buffer) // 用已有字节数组初始化
MemoryStream(byte[] buffer, bool writable) // 指定是否可写
MemoryStream(int capacity) // 指定初始容量
```

#### 核心方法和属性

| 方法 / 属性                                       | 用法      | 说明                     |
| --------------------------------------------- | ------- | ---------------------- |
| `Write(byte[] buffer, int offset, int count)` | 写入字节    | 向流写入数据                 |
| `Read(byte[] buffer, int offset, int count)`  | 读取字节    | 从流读取数据                 |
| `Seek(long offset, SeekOrigin origin)`        | 定位      | 设置读写指针位置               |
| `ToArray()`                                   | 获取字节数组  | 返回内存流中所有数据的副本          |
| `GetBuffer()`                                 | 获取内部缓冲区 | 注意：可能比实际数据长            |
| `Length`                                      | 流长度     | 已写入的数据长度               |
| `Position`                                    | 读写位置    | 当前指针位置                 |
| `SetLength(long value)`                       | 设置长度    | 可以截断或扩展流               |
| `Flush()`                                     | 刷新流     | 对 `MemoryStream` 通常无操作 |

#### 示例
写入数据
```cs
using System;
using System.IO;
using System.Text;

class Program
{
  staitc void Main()
  {
    using (MemoryStream ms = new MemoryStream())
    {
      string text = "Hello MemoryStream!";
      byte[] bytes = Encoding.UTF8.GetBytes(text);
      ms.Write(bytes, 0, bytes.Length);

      Console.WriteLine("Length: " + ms.Length); // 输出长度
      Condole.WriteLine("Position: " + ms.Position); // 输出当前位置

      // 重置位置以便读取
      ms.Position = 0;

      byte[] buffer = new byte[ms.Length];
      ms.Read(buffer, 0, buffer.Length);
      string result = Encoding.UTF8.GetString(buffer);
      Console.WriteLine(result); // 输出 Hello MemoryStream
    }
  }
}
```

从字节数组创建并读取
```cs
byte[] data = {10, 20, 30, 40};
using (MemoryStream ms = new MemoryStream(data))
{
  for (int i = 0; i < ms.Length; ++i)
  {
    int value = ms.ReadByte(); // 单字节读取
    Console.WriteLine(value);
  }
}
```

#### 使用场景
1. 临时数据缓存
比如读取文件后先在内存处理，然后再写回磁盘或发送网络

2. 网络数据处理
和`BinaryReader/BinaryWriter`配合，序列化/反序列化数据

3. 图片/音频处理
在内存中编辑或转换图像，再通过`Image.FromStream(ms)`使用

4. 避免频繁磁盘操作
流程中大量临时数据操作时，用`MemoryStream`会快很多

#### 注意事项
- 内存流不是持久化流，如果数据需要保存，要写回文件或数据库
- `GetBuffer()`返回内部数组，长度可能大于实际数据，使用时要注意`Length`
- 当数据量很大时（几十MB甚至上百MB），内存占用可能成为瓶颈
- `MemoryStream`实现了`IDisposable`，要用`using`或手动`Dispose()`

### `BufferedStream`
`BufferedStream`是.NET提供的一个带缓冲的流包装器。它本身不直接读写文件或内存，而是包装另一个流（如`FileStream`或`NetworkStream`），在读写时增加一个内存缓冲区来提升性能

#### 工作原理
- 读操作
当调用`Read`时，`BufferedStream`会一次性从底层流读一大块数据到内存缓冲区。之后的读操作如果能在缓冲区中找到数据，就直接返回，而不是每次都触发磁盘/网络/IO

- 写操作
当调用`Write`时，数据会先写入缓冲区。只有当缓冲区满了、显式调用`Flush()`、或关闭流时，才会一次性写入底层流

这种机制大大减少了I/O的调用次数，提高了性能

#### 构造函数
```cs
BufferedStream(Stream stream)
BufferedStream(Stream stream, int bufferSize)
```
- `stream`：底层流（必须是可读/可写的，如`FileStream`）
- `bufferSize`：缓冲区大小（默认4096Byte）

```cs
using (FileStream fs = new FileStream("test.txt", FileMode.OpenOrCreate))
using (BufferedStream bs = new BufferedStream(fs, 8192))
{
  // bs.Read / bs.Write
}
```

#### 常用方法和属性

| 方法 / 属性                                       | 说明                |
| --------------------------------------------- | ----------------- |
| `Read(byte[] buffer, int offset, int count)`  | 从缓冲区或底层流读取数据      |
| `Write(byte[] buffer, int offset, int count)` | 写入数据到缓冲区          |
| `Flush()`                                     | 把缓冲区数据写入底层流       |
| `Seek(long offset, SeekOrigin origin)`        | 改变读写位置（影响底层流和缓冲区） |
| `Length`                                      | 底层流的长度            |
| `Position`                                    | 当前读写位置            |

#### 示例
写文件（带缓冲）
```cs
using System;
using System.IO;
using System.Text;

class Program
{
  static void Main()
  {
    using (FileStream fs = new FileStream("data.txt", FileMode.Create, FileAccess.Write))
    using (BufferedStream bs = new BufferedStream(fs, 8192)) // 8KB缓冲区
    using (StreamWriter sw = new StreamWriter(bs, Encoding.UTF8))
    {
      for (int i = 0; i < 1000; ++i)
        sw.WriteLine("Line " + i);
    } // 这里会自动 Flush + Dispose
  }
}
```

读文件（带缓冲）
```cs
using (FileStream fs = new FileStream("data.txt", FileMode.Open, FileAccess.Read))
using (BufferedStream bs = new BufferedStream(fs, 8192))
using (StreamReader sr = new StreamReader(bs, Encoding.UTF8))
{
  string line;
  while ((line = sr.ReadLine()) != null)
    Console.WriteLine(line);
}
```

#### 使用场景
- 大文件读写
避免频繁触发磁盘I/O，比如日志写入、批量导出
- 网络流
对`NetworkStream`包一层，减少网络API调用次数，提升吞吐量
- 组合模式
常见模式是：`FileStream -> BufferedStream -> StreamReader/StreamWriter`

#### 注意事项
- 小数据写入时更高效
如果一次性写大块数据（比如一次写10MB），用不用`BufferedStream`差别不大，因为底层API已经优化过了\
但如果是频繁小块写入（比如循环中写几百字节），`BufferedStream`会显著提升性能

- 记得Flush()
如果写入的数据没有及时Flush，可能还在缓冲区里没写到文件。关闭/释放流时会自动Flush，但在关键时机要手动调用

- 缓冲区大小
默认4KB，很多时候可以根据场景调整。过大浪费内存，过小性能不明显

#### `BufferedStream` vs `MemoryStream`

| 特点      | `MemoryStream` | `BufferedStream`      |
| ------- | -------------- | --------------------- |
| 存储位置    | 内存（字节数组）       | 内存缓冲区 + 底层流           |
| 是否依赖底层流 | 否              | 是（必须包装其他流）            |
| 数据是否持久化 | 否              | 取决于底层流（比如 FileStream） |
| 适用场景    | 临时数据处理         | 减少 I/O 调用次数           |

- `MemoryStream`数据完全在内存中
- `BufferedStream`在内存中加一层缓存，优化对磁盘/网络的访问

### `NetworkStream`
`NetworkStream`是.NET中用于网络数据传输的流类型，它直接封装了底层`Socket`对象，可以用流的方式来读写网络数据。因为它继承自`Stream`，所以可以和`StreamReader`、`StreamWriter`、`BinaryReader`、`BinaryWriter`等搭配使用，方便进行文本/二进制通信

#### 工作方式
`NetworkStream`基于TCP套接字（`Socket`/`TcpClinet`/`TcpListener`）\
它不自己管理连接，而是依赖外部的`Socket`
- 服务端：用`TcpListener.AcceptTcpClient()`得到`TcpClient`，再取`NetworkStream`
- 客户端：用`TcpClient.Connect()`连接服务器，再取`NetworkStream`

数据走向
```rust
程序 <-> NetworkStream <-> Socket <-> TCP/IP协议栈 <-> 网络
```

#### 构造函数
通常不会手动`new NetworkStream(Socket)`，而是通过`TcpClient.GetStream()`获取
```cs
TcpClient client = new TcpClient("127.0.0.1", 8080);
NetworkStream ns = client.GetStream();
```
如果真的要自己构造，可以传入一个已连接的`Socket`
```cs
Socket socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
socket.Connect("127.0.0.1", 8080);
NetworkStream ns = new NetworkStream(socket ownsSocket: true);
```
- `ownsSocket: true`表示关闭流时自动关闭底层Socket

#### 常用方法

| 方法/属性                                        | 说明                     |
| -------------------------------------------- | ---------------------- |
| `Read(byte[] buffer, int offset, int size)`  | 从网络中读取数据（阻塞）           |
| `Write(byte[] buffer, int offset, int size)` | 向网络写数据                 |
| `Flush()`                                    | TCP 流不需要手动 Flush，调用没效果 |
| `CanRead`/`CanWrite`                         | 是否可读写                  |
| `DataAvailable`                              | 是否有可读数据（非阻塞检查）         |
| `ReadAsync`/`WriteAsync`                     | 异步读写（推荐）               |

#### 示例
简单客户端
```cs
using System;
using System.IO;
using System.Net.Scokets;
using System.Text;

class Client
{
  static void Main()
  {
    using (TcpClient client = new TcpClient("127.0.0.1", 8080))
    using (NetworkStream ns = client.GetStream())
    using (StreamWriter writer = new StreamWriter(ns, Encoding.UTF8) { AutoFlush = true })
    using (StreamReader reader = new StreamReader(ns, Encoding.UTF8))
    {
      writer.WriteLine("Hello Server!");
      string response = reader.ReadLine();
      Console.WriteLine("Server says: " + response);
    }
  }
}
```

简单服务器端
```cs
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;

class Server
{
  staitc void Main()
  {
    TcpListener listener = new TcpListener(IPAddress.Any, 8080);
    listener.Start();
    Console.WriteLine("Server started...");

    while (true)
    {
      TcpClient client = listener.AcceptTcpClient();
      Console.WriteLine("Client connected.");

      using (NerworkStream ns = client.GetStream())
      using (StreamReader reader = new StreamReader(ns, Encoding.UTF8))
      using (StreamWriter writer = new StreamWriter(ns, Encoding.UTF8) { AutoFlush = ture })
      {
        string msg = reader.ReadLine();
        Console.WriteLine("Client says: " + msg);
        writer.WriteLine("Hello Client!");
      }
    }
  }
}
```

#### 使用场景
- 即时通讯（聊天软件、游戏大厅、匹配系统）
- 游戏网络同步（Unity/UE中TCP/UDP风暴处理，TCP通常用于可靠消息）
- 远程调用（RPC、Socket服务）
- 协议实现（自己写应用层协议，比如简单的JSON协议）

#### 注意事项
1. 阻塞问题
  - `Read()`默认是阻塞的，没有数据时会卡住
  - 建议使用`ReadAsync`或`DataAvailiable`做非阻塞检查

2. TCP是流式协议
  - 没有“消息边界”，一次`Write`的数据，可能需要多次`Read`才能收完
  - 实际开发中要自己设计报文头（长度字段）来分包

3. 生命周期
  - `NetworkStream.Dispose()`会影响底层Socket
  - 一般和`TcpClient`一起管理

4. 性能优化
  - 小数据包建议配合`BufferedStream`
  - 大数据包要考虑分包/粘包问题

## 字符流（Character Streams）操作

### `StreamReader` & `StreamWriter`
- `StreamReader`：从一个字节流中读取字符（解码），通常用于读取文本文件或网络文本数据
- `StreamWriter`：向一个字节流中写入字符（编码），会根据编码（如UTF-8）转换成字节

`Stream`本身只处理字节`byte[]`，但经常处理文本（比如日志、配置文件、JSON、XML、网络消息）\
所以：
- `StreamReader/Writer`提供了编码解码功能，自动把字节和字符串相互转换
- 内部还带有缓冲，提高效率
- 是处理文本的首选工具

#### 构造函数
`StreamReader`
```cs
StreamReader(Stream stream)
StreamReader(Stream stream, Encoding encoding)
StreamReader(string path)
StreamReader(string path, Encoding encoding)
```

`StreamWriter`
```cs
StreamWriter(Stream stream)
StreamWriter(Stream stream, Encodign encoding)
StreamWriter(string path)
StringWriter(string path, bool append)
StreamWriter(string path, bool append, Encoding encoding)
```

#### 常用方法
StreamReader

| 方法 / 属性       | 说明                       |
| ------------- | ------------------------ |
| `Read()`      | 读取一个字符（返回 `int`，-1 表示结束） |
| `ReadLine()`  | 读取一行文本                   |
| `ReadToEnd()` | 读取整个流的剩余内容               |
| `Peek()`      | 查看下一个字符但不移动指针            |
| `EndOfStream` | 是否读到结尾                   |

StreamWriter

| 方法 / 属性             | 说明            |
| ------------------- | ------------- |
| `Write(string)`     | 写文本（不换行）      |
| `WriteLine(string)` | 写文本并换行        |
| `Flush()`           | 把缓冲区内容写入底层流   |
| `AutoFlush`         | 设置是否每次写入后自动刷新 |

#### 示例
写入文本文件
```cs
using System;
using System.IO;
using System.Text;

class Program
{
  static void Main()
  {
    using (StreamWriter writer = new StreamWriter("log.txt", false, Encoding.UTF8))
    {
      writer.WriteLine("Hello World!");
      writer.WriteLine("时间：" + DateTime.Now);
    }
    Console.WriteLine("写入完成");
  }
}
```

读取文本文件
```cs
using (StreamReader reader = new StreamReader("log.txt", Encoding.UTF8))
{
  string line;
  while ((line = reader.ReadLine()) != null)
    Console.WriteLine(line);
}
```

结合`NetworkStream`
```cs
using (StreamReader reader = new StreamReader(networkStream, Encoding.UTF8))
using (StreamWriter writer = new StreamWriter(networkStream, Encoding.UTF8) { AutoFlush = ture })
{
  writer.WriteLine("Hello Server");
  string response = reader.ReadLine();
  Console.WriteLine("Server: " + response);
}
```

#### 使用场景
- 文件操作：读写日志、配置、脚本、JSON文件等
- 网络通信：和`NetworkStream`配合，处理基于文本的协议（HTTP、聊天消息）
- 内存操作：配合`MemoryStream`，在内存中读写字符串

#### 注意事项
1. 编码问题
  - 默认编码依赖平台，推荐显式指定`Encoding.UTF8`，避免乱码
  - 特别是跨平台/跨语言通信时，一定要统一编码

2. 缓冲区
  - `StreamWriter`默认有缓冲，数据可能没立即写道文件/网络
  - 关键时刻要`Flush()`或设置`AutoFlush = true`

3. 换行符
  - `WriteLine`使用系统默认换行符：Windows是`\r\n`，Linux是`\n`
  - 如果写跨平台文本文件，最好统一约定

4. 文件占用
  - `StreamReader/Writer`默认独占文件，不能同时被其他进程访问
  - 如果需要共享，可以在`FileStream`里设置`FileShare`

### `StringReader` & `StringWriter`
这两个类专门用来在内存里处理字符串，不依赖文件或网络，完全运行在内存中，非常轻量
- `StringReader`：继承自`TextReader`，在内存中，把一个字符串当作“数据源”，按字符或行来读取，就像从文件读文本一样
- `StringWriter`：继承自`TextWriter`，在内存中，向一个字符串“写入”，最后可以得到完整的字符串

#### 构造函数
`StringReader`
```cs
StringReader(string s)
```
- 参数是一个字符串，后续就可以像读文件一样从中逐字符/逐行读取

`StringWriter`
```cs
StringWriter()
StringWriter(StringBuilder sb)
StringWriter(IFormatProvider formatProvider)
StringWriter(StringBuilder sb, IFormatProvider formatProvider)
```
- 内部其实是写入到一个`StringBuilder`
- 可以自己传入`StringBuilder`，或者让它默认帮你创建

#### 常用方法
StringReader

| 方法 / 属性       | 说明                        |
| ------------- | ------------------------- |
| `Read()`      | 读一个字符（返回 `int`，-1 表示结束）   |
| `ReadLine()`  | 读一行（遇到 `\r\n` / `\n` 就结束） |
| `ReadToEnd()` | 读完剩余的所有文本                 |
| `Peek()`      | 看下一个字符但不移动位置              |

StringWriter

| 方法 / 属性              | 说明                    |
| -------------------- | --------------------- |
| `Write(string)`      | 写字符串                  |
| `WriteLine(string)`  | 写一行（带换行符）             |
| `ToString()`         | 返回最终拼接好的字符串           |
| `GetStringBuilder()` | 返回内部的 `StringBuilder` |

#### 示例
使用StringReader
```cs
using System;
using System.IO;

class Program
{
  static void Main()
  {
    string text = "Hello\nWrold\nC#";

    using (StringReader reader = new StringReader(text))
    {
      string? line;
      while((line = reader.ReadLine()) != null)
        Console.WriteLine("Line: " + line);
    }
  }
}
```

使用StringWriter
```cs
using System;
using System.IO;

class Program
{
  static void Main()
  {
    using (StringWriter writer = new StringWriter())
    {
      writer.WriteLine("Hello");
      writer.WriteLine("World");
      writer.WriteLine("C#");

      string result = writer.ToString();
      Console.WriteLine(result);
    }
  }
}
```

联合使用
```cs
string original = "Line1\nLine3\nLine3";
string transformed;

using (StringReader reader = new StringReader(original));
using (StringWriter writer = new StringWriter());
{
  string? line;
  while ((line = reader.ReadLine()) != null)
    writer.WriteLine(line.ToUpper()); // 转大写再写入
  
  transformed = writer.ToString();
}

Console.WriteLine(transformed);
```

#### 使用场景
- 文本处理：在内存中解析、修改文本（配置、脚本、模板）
- 调试/测试：替代文件读写，快速模拟输入输出
- 中间结果缓存：先用`StringWriter`拼接复杂文本，再一次性获取
- 和API集成：很多需要`TextReader`/`TextWriter`参数的方法，可以直接传`StringReader/StringWriter`

## 异步I/O和缓冲流

## I/O流异常处理

## 常见I/O操作
### 文件操作
### 目录操作

## I/O流优化

## `File`
`File`类是.NET中`System.IO`命名空间下提供的一个静态类，封装了与我呢见操作相关的常见方法。它提供了许多用于创建、删除、赋值、读取和写入文件的方法，简化了文件操作的过程，尤其是在不需要处理流(`Stream`)或文件的高级特性时，使用`File`类会非常方便

### `File`类的常见用途
`File`类本身是一个静态类，因此它不需要实例化。它提供了一些静态方法，适用于文件的常见操作。`File`类比`FileStream`类更为简化和高层，适合于文件的常规操作

### 常用方法
1. 创建文件
```cs
File.Create(string path);
```
- `path`：要创建的文件的路径
- 返回值：返回一个`FileStream`对象，用于操作创建的文件

2. 复制文件
```cs
File.Copy(string sourceFileName, string destFileName);
File.Copy(string sourceFileName, string destFileName, bool overwrite);
```
- `sourceFileName`：源文件的路径
- `destFileName`：目标文件的路径
- `overwrite`：是否覆盖目标文件，如果目标文件存在

3. 删除文件
```cs
File.Delete(string path)
```

4. 检查文件是否存在
```cs
File.Exists(string path);
```
- 返回值：如果文件存在，返回`true`；否则返回`false`

5. 移动文件
```cs
File.Move(string sourceFileName, string destFileName);
```

6. 读取文件内容
```cs
File.ReadAllText(string path);
File.ReadAllLines(string path);
```
- 返回值
  - `ReadAllText`：返回文件的全部内容作为一个字符串
  - `ReadAllLines`：返回文件中每一行内容的字符串数组

7. 写入内容到文件
```cs
File.WriteAllText(string path, string contents);
File.WriteAllLines(string path, string[] contents);
```
- `WriteAllText`：写全部
- `WriteAllLines`：按行写

8. 追加内容到文件
```cs
File.AppendAllText(string path, string contents);
File.AppendAllLines(string path, string[] contents);
```

9. 获取文件信息
```cs
File.GetCreationTime(string path);
File.GetLastAccessTime(string path);
File.GetLastWriteTime(string path);
```
- 返回值：返回一个`DateTime`对象，表示文件的创建、访问或修改时间

### 总结
- `File`类是`System.IO`命名空间中的一个静态类，用于执行常见的文件操作
- 它提供了简便的方法来创建、删除、复制、移动文件，并支持读取、写入和修改文件
- 相比于`FileStream`类，`File`类是更高层次的文件操作API，适合用于常规文件处理操作，不需要处理流和字节级别的文件读写

## Binary Stream
二进制流是以二进制数据序列（0和1的字节序列）的方式在存储设备或网络中传输/存储信息的一种形式\
相比于文本流（Text Stream，通常是以字符编码形式的字节流），二进制流更原始，它不依赖编码，而是直接操作原始字节

### 二进制流的作用
如果只用文本流，没法高效处理非文本数据比如：
- 图片、视频、音频文件
- 压缩包、可执行程序
- 数据库文件、内存镜像

这些文件都不能简单地用字符集去解释，只能用二进制流来表示

### 二进制流特点
1. 原始性：直接操作字节，不依赖字符编码
2. 通用性：任何文件最终都可以用二进制流表示
3. 高效性：避免字符转换，更接近底层存储
4. 不可读性：无法直接阅读，必须通过解析器或协议还原
// TODO: