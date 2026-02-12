---
title: "Serialization and Persistence"
date: 2025-06-01
categories: [Note]
tags: [Unity]
author: "ljf12825"
summary: Data serialization and persistence in Unity, introduction and practice
---
在Unity中，序列化和持久化在游戏数据存储中起到重要的作用

## 序列化（Serialization）
序列化就是把内存中的对象转换成可以存储或传输的格式的过程，比如转换成二进制、JSON、XML、或者Unity自己的资产格式\  
反过来，反序列化（Deserialization）就是把存储或传输的格式转换回程序内存分钟的对象\
序列化的意义
1. 保存数据  
游戏存档就是把游戏状态保存到磁盘上的过程，这个过程就是序列化
2. 编辑器显示与修改数据  
Unity Inspector面板显示脚本里字段的值，需要序列化这些字段才能让编辑器读写它们
3. 网络传输  
多人游戏中，玩家状态需要网络传输，也要序列化成网络能传输的格式

### Unity的序列化系统
Unity有自己的一套序列化规则，决定哪些数据会被序列化（保存、显示在Inspector），核心要点如下：
- 字段必须是公有的或标记为`[SeriializeField]`
只有公有字段或被`[SerializeField]`标记的私有字段才能被Unity序列化和显示在Inspector中
- 支持的类型
Unity支持大部分基础类型的序列化：`int`,`float`,`string`,`bool`,`Vector3`,`Color`等，自定义类型也能被序列化但是要加上`[System.Serializable]`属性，以及`UnityEngine.Object`类型（如`GameObject`,`Transform`,`ScriptableObject`等）
- 不支持的类型
一些类型无法被序列化，比如`Dictionary`,`delegate`,`event`等
- Unity的序列化是深度序列化
Unity会自动处理类的成员变量，递归序列化引用类型（如类的实例）

### 如何序列化
- 基本类型
默认情况下，Unity会序列化所有公有字段和标记为`[SerializeField]`的私有字段
```cs
public class MyComponent : MonoBehaviour
{
    public int score;
    [SerializeField] private string playerName;
}
```
上述代码中`score`和`playerName`会被Unity序列化，可以在Inspector中看到并修改

- 类的序列化
自定义类（结构体、对象等）也可以被序列化，前提是它们符合序列化条件
```cs
[System.Serializable]
public class Player
{
    public string name;
    public int health;
}

public class GameController : MonoBehaviour
{
    public Player player;
}
```
在这种情况下，`Player`类被标记为`[System.Serializable]`，Unity会序列化`GameController`中的`player`字段

在Unity自带的序列化系统中，不能被Unity序列化的字段无法自动保存到Unity的资源文件或场景文件里，在场景保存、Prefab保存、ScriptableObject保存时会被直接忽略，也就是说，下次重新打开场景时，这些字段的值会丢失，但是可以自己保存和传输

1. 手动转换为可序列化格式
- 可以自己把Dictionary、复杂对象转成JSON、XML、二进制等可保存的格式
- 常用工具
  - `JsonUtility`（Unity内置，速度快，但功能简单）
  - `Newtonsoft.Json`（功能强大，支持Dictionary等）
  - 二进制序列化（`BinaryFormatter`/`System.IO`）

```cs
using Newtonsoft.Json;
using System.Collection.Generic;
using UnityEngine;

public class SaveDataExample : MonoBehaviour
{
    public Dictionary<string, int> score = new Dictionary<string, int>();
    {
        { "Alice", 100 },
        { "Bob", 80 }
    };

    void Save()
    {
        string json = JsonConvert.SerializeObject(scores);
        System.IO.File.WriteAllText(Application.persistentDataPath + "/scores.json", json);
    }

    void Load()
    {
        string json = System.IO.File.ReadAllText(Application.persistentDataPath + "/scores.json");
        scores = JsonConvert.DeserializeObject<Dictionary<string, int>>(json);
    }
}
```
这样，即使Dictionary在Unity内置序列化中不支持，也能保存和恢复

2. 用可序列化的中间结构代替
比如把`Dictionary<string, int>`转成两个List
```cs
[System.Serializable]
public class SerializableDict
{
    public List<string> keys;
    public List<int> values;

    public SerializableDict(Dictionary<string, int> dict)
    {
        keys = new List<string>(dict.Keys);
        values = new List<int>(dict.Values);
    }

    public Dictionary<string, int> ToDictionary()
    {
        var dict = new Dictionary<string, int>();
        for (int i = 0; i < keys.Count; ++i)
            dict[keys[i]] = values[i];
        
        return dict;
    }
}
```
这样Unity就能正常序列化这个`SerializableDict`，保存到场景或Prefab中

3. 网络传输
- 如果是网络同步（如多人游戏），完全可以跳过Unity序列化系统，直接把数据用JSON、Protobuf、MessagePack等格式打包，发到另一台机器
- 这些方式不依赖Unity的序列化规则，因此能传几乎所有C#对象

### 序列化到文件
[Data Driven Design](blog/Data-Driven-Design/)

### 常见问题和注意事项
- 引用类型的序列化
如果将一个引用类型（如类实例）赋值给一个字段，Unity会序列化这个引用，而不是值本身。这意味着可以在多个对象中看到相同的实例。如果希望每个实例独立，需要确保它们不共享同一个引用；就是说指针指向同一块内存，要主要意外联动和数据共享
```cs
public MyComponent : MonoBehaviour
{
    public GameObject prefab; // 引用类型
}
```

- `[NonSerialized]`属性
有时可能不想让某个字段被序列化，这时可以使用`[NonSerialized]`属性。这会阻止字段在Inspector中显示并被序列化
```cs
[System.NonSerialized] public int runtimeOnlyValue;
```

- `[HidenInInspector]`属性
如果字段被序列化但不希望再Inspector中显示，可以使用`[HideInInspector]`
```cs
[HideInInspector] public int hiddenValue;
```

### 自定义序列化
- `ISerializationCallbackReceiver`接口
Unity提供了`ISerializationCallbackReceiver`接口，允许再对象序列化和反序列化时进行自定义操作。这个接口有两个方法：`OnBeforeSerialize()`和`OnAfterDeserialize()`，可以在这些方法中编写序列化之前和之后的逻辑
```cs
public class MySerializableClass : ISerializationCallbackReceiver
{
    public int value;
    private string valueString;

    public void OnBeforeSerialize() { }

    public void OnAfterDeserialize() => valueString = value.ToString();
}
```

- 自定义PropertyDrawer
如果希望为自定义类创建一个定制化的Inspector界面，可以使用`PropertyDrawer`类来自定义序列化数据的显示

### 序列化与性能
Unity的序列化系统在加载和保存数据时会比较高效，但是有时深度序列化和复杂的数据结构（尤其是包含大量嵌套的引用类型的结构）可能会影响性能。最好限制序列化的数据量，并在必要时进行优化

能被序列化只是代表Unity知道如何保存/恢复它的格式，是否自动保存取决于它是否在场景、Prefab、ScriptableObject这类持久资源里，运行时数据不会自动保存，而需要手动做持久化

## 持久化（Persistence）
持久化是指将游戏或应用中的数据保存在外部存储设备（如硬盘、云存档中），以便在应用关闭或重新启动时恢复。持久化的目标是使数据在不同的会话之间持久存在

**持久化的目的**
- 保存游戏进度：允许玩家保存当前游戏状态在以后恢复
- 配置存储：保存玩家设置、游戏配置等数据
- 数据共享：在不同设备间共享和恢复游戏数据

### 持久化常见方法
#### PlayerPrefs
`PlayerPrefs`是Unity内置的一个简单持久化存储工具，主要用于保存玩家的偏好设置、游戏进度等轻量级数据（如音量、分数、关卡解锁状态等）。它的特点是键值对存储，数据会保存到磁盘中，即使退出游戏也会保留

##### 基本原理
`PlayerPrefs`本质上是Unity封装的一个跨平台存储接口
- Windows：数据存储在注册表`HKEY_CURRENT_USER\Software\[CompanyName]\[ProductName]`
- macOS：使用`~/Library/Preferences/[CompanyName].[ProductName].plist`
- Android/iOS：使用设备平台提供的`SharedPreferences`/`NSUserDefaults`

> 注意：它不是加密存储，任何人都能轻松修改数据，所以不能用来保存敏感信息（例如账号密码、付费信息等）

##### API

| 方法                                                | 作用                                   |
| ------------------------------------------------- | ------------------------------------ |
| `SetInt(string key, int value)`                   | 保存一个整数                               |
| `SetFloat(string key, float value)`               | 保存一个浮点数                              |
| `SetString(string key, string value)`             | 保存一个字符串                              |
| `GetInt(string key, int defaultValue = 0)`        | 获取整数，支持默认值                           |
| `GetFloat(string key, float defaultValue = 0f)`   | 获取浮点数，支持默认值                          |
| `GetString(string key, string defaultValue = "")` | 获取字符串，支持默认值                          |
| `HasKey(string key)`                              | 检查是否存在指定键                            |
| `DeleteKey(string key)`                           | 删除指定键值                               |
| `DeleteAll()`                                     | 删除所有存储数据                             |
| `Save()`                                          | 手动保存数据到磁盘（通常 Unity 会自动保存，但在退出前调用更安全） |

##### 示例
```cs
using UnityEngine;

public class PlayerPrefsExample : MonoBehaviour
{
    void Start()
    {
        // 存储数据
        PlayerPrefs.SetInt("HighScore", 100);
        PlayerPrefs.SetFloat("Volume", 0.8f);
        PlayerPrefs.SetString("PlayerName", "Jeff");

        // 手动保存（建议重要数据存储后调用一次）
        PlayerPrefs.Save();

        // 读取数据
        int score = PlayerPrefs.GetInt("HighSocre", 0);
        float volume = PlayerPrefs.GetFloat("Volume", 1f);
        string name = PlayerPrefs.GetString("PlayerName", "Unknown");

        Debug.Log($"Score: {score}, Volume: {volume}, Name: {name}");

        // 检查和删除
        if (PlayerPrefs.HasKey("HighScore"))
        {
            PlayerPrefs.DeleteKey("HighScore");
        }
    }
}
```

##### 使用建议
适用场景
- 玩家设置（音量、分辨率、按键映射等）
- 简单进度数据（关卡解锁、最高分）
- 启动次数、首次运行标记

不适用场景
- 大量数据（效率低）
- 复杂结构数据（只支持`int`/`float`/`string`）
- 敏感信息（无加密，易被修改）
- 实时高频写入（可能影响性能）

##### 存储结构拓展
如果想用`PlayerPrefs`存储更复杂的数据（如数组、对象），可以先序列化成JSON
```cs
[System.Serializable]
public class PlayerData
{
    public string name;
    public int level;
    public float health;
}

public class PlayerPrefsJsonExample : MonoBehaviour
{
    void SaveData()
    {
        PlayerData data = new PlayerData
        {
            name = "Jeff",
            level = 10,
            health = 75.5f
        };
        string json = JsonUtility.ToJson(data);
        PlayerPrefs.SetString("PlayerData", json);
        PlayerPrefs.Save();
    }

    void LoadData()
    {
        if (PlayerPrefs.HasKey("PlayerData"))
        {
            string json = PlayerPrefs.GetString("PlayerData");
            PlayerData data = JsonUtility.FromJson<PlayerData>(json);
            Debug.Log($"Name: {data.name}, Level: {data.level}, HP: {data.health}");
        }
    }
}
```
##### 注意事项
1. 自动保存：Unity在退出游戏时会自动保存，但关键点手动调用`Save()`更安全（尤其是移动平台可能被强制杀进程）
2. 数据修改：因为存储在本地，玩家可以通过修改注册表或文件来作弊
3. 性能问题：频繁调用`Save()`会导致性能下降，应当批量保存

#### 文件持久化
可以使用`System.IO`命名空间通过序列化对象的方式将数据保存为文件，常用的格式有JSON、XML和二进制，[见上文](#序列化到文件)

#### [ScriptableObject](blog/ScriptableObject/)
`ScriptableObject`是Unity的一种数据容器，特别适合用于保存游戏配置、关卡数据等。它本质上是一个Unity对象，因此可以被序列化，并且可以保存在项目文件夹中，便于管理

#### 云存储
对于多人在线游戏或跨设备的存档系统，可以使用云存储。Unity提供了多种方式与云存储服务进行集成，如通过Unity的Cloud Save系统、Firebase等

### 文件存储和性能
持久化数据时，如果存储的数据量很大，或者文件结构很复杂，可能会对性能产生影响。因此：
- 使用二进制格式存储数据，比JSON或XML等文本格式效率更高
- 如果数据量较小，使用PlayerPrefs或ScriptableObject也是一个较为简单且高效的方案

在Unity中，序列化和持久化通常是相互结合的，可以使用序列化技术将对象的数据保存到文件中，然后使用文件持久化技术（如JSON、XML、二进制）来存储这些数据，可以实现游戏存档、玩家设置保存等功能
