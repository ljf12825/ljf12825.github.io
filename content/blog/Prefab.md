---
title: "Prefab System"
date: 2025-05-31
categories: [笔记]
tags: [Unity, Unity System]
author: "ljf12825"
summary: Prefab's introduction and using in Unity
---
Unity提供Prefab这种非常强大的机制，用来复用游戏对象，让开发更高效、项目更模块化  
Prefab就是一个可以重复使用的GameObject模板

## 什么是Prefab
Prefab是你在场景里创建好的GameObject（可以包含模型、脚本、组件、子物体等），然后把它拖到项目窗口中生成的资源文件。  
之后就可以随时从Project中把这个模板拖入场景，生成和原始一样的对象

## Prefab特点

| 特性   | 描述                           |
| ---- | ---------------------------- |
| 模板复用 | 一次创建，多次使用                    |
| 改动同步 | 修改 Prefab，会自动同步所有实例          |
| 支持嵌套 | Prefab 可以包含另一个 Prefab        |
| 可分离  | Prefab 实例可以局部修改，不影响原始 Prefab |

## Prefab实例与原型的关系
当你把Prefab拖入场景，它会成为Prefab实例，你可以
- 完全跟随原始Prefab
- 局部Override某些属性
- 解除连接（Unpack）

| 图标颜色  | 状态               |
| ----- | ---------------- |
| 蓝色立方体 | 与原 Prefab 保持连接   |
| 灰色立方体 | 已经解除连接（Unpacked） |

## Prefab编辑方式
1.Open Prefab：双击或点击小蓝箭头进入Prefab编辑模式  
2.Override面板：查看并应用或还原你对实例的修改
3.Apply to Prefab：将实例的更改写入原始Prefab

## Prefab的创建和使用
**创建**
1.在`Hierarchy`中创建好一个GameObject及其组件和子对象  
2.拖拽到`Project`视图中，Unity自动保存为`.prefab`
3.你可以删除场景中的对象，只保留Project中的预制体

**使用**
- 直接拖到场景中
- `Instantiate()`动态生成

```csharp
void Shoot() => Instantiate(bulletPrefab, transform.position, transform.rotation);
```
## Apply / Revert操作
### Apply
把场景中的某个Prefab示例上做的修改，应用回Prefab Asset，让所有示例都得到这个更新  
在 Hierarchy 选中一个修改过的 Prefab 实例 →
在 Inspector 顶部看到蓝色小条（表示有修改）→
点击右上角小菜单 ≡ → 选择：  
Apply All：把所有改动应用回 Prefab。  
Apply to Prefab Name：只应用当前对象。  
Apply to Root：应用根 Prefab（对于嵌套 Prefab 情况）。

### Revert
同样的位置点击：  
Revert All:撤销所有更改  
Revert Component：仅撤销某个组件的改动

## 实例化Prefab
在运行时通过代码动态创建一个GameObject的副本  
```cs
GameObject obj = Instantiate(prefab)
```

**完整示例**
```cs
using UnityEngine;

public class Spawner : MonoBehaviour
{
    public GameObject prefab;

    void Start()
    {
        Instantiate(prefab, transform.position, transform.rotation);
    }
}
```
**Instantiate几种重载**

| 用法                                                | 说明                      |
| ------------------------------------------------- | ----------------------- |
| `Instantiate(prefab)`                             | 在默认位置 `(0,0,0)` 实例化，没旋转 |
| `Instantiate(prefab, position, rotation)`         | 指定位置和旋转                 |
| `Instantiate(prefab, parent)`                     | 设置父物体                   |
| `Instantiate(prefab, position, rotation, parent)` | 完整版本，常用                 |

**管理多个实例：比如使用List存储**
```cs
List<GameObject> enemies = new List<GameObject>();

void SpawnEnemy()
{
    GameObject enemy = Instantiate(enemyPrefab, RandomPos(), Quaternion.identity);
    enemies.Add(enemy);
}
```

**实例化后销毁**
```cs
Destroy(gameObject); //下一帧销毁
Destroy(gameObject, 2f); //2秒后销毁
```

## 嵌套Prefab
Nested Prefab是指：一个Prefab内部再包含其他Prefab实例，这样可以构建更加复杂、模块化、易维护的结构

### 嵌套Prefab的优点
- 结构清晰
  拆分功能模块（如武器、UI、特效）
- 复用性强
  一个组件，可以被多个角色共用
- 易于维护
  只需要更新嵌套Prefab，所有用到它的地方都会同步
- 可组合性高
  像搭积木一样组合出复杂对象

## Prefab Variant
Prefab Variant（预制体变体）是一种现有Prefab派生出来的子类Prefab，它继承原始Prefab的结构和属性，但又可以进行自定义修改而不影响原始Prefab   

在Project面板中选中一个Prefab，右键-Create-Prefabvariant  

在Variant中，可以添加新组建，修改属性；但是不可以删除原有组件，并且最好不要修改结构（层级、命名），容易破坏继承结构

## 动态加载Prefab（Resources / Addressables）
在运行时从资源中加载一个Prefab并实例化它，常用于：  
- 场景中初始不包含目标物体
- 按需加载节省内存
- 动态UI/子弹/特效等

### Resources.Load
基本语法  
```cs
GameObject prefab = Resource.Loda<GameObject>("/path")
Instantiate(prefab, pos, roa);
```

#### 使用流程
1.将Prefab放入`Assets/Resources`文件夹  
2.加载并实例化

**动态加载常用于需要灵活性、不是频繁生成的物体，运行时加载不如静态引用快**  
**动态加载无法自动释放内存，建议手动`Resources.UnloadUnusedAssets()`**  

### Addressables
如果项目大，Prefab多，建议使用Unity的[Addressables System]({{site.baseurl}}/posts/2025-06-05-Addressables-System/)，支持：  
- 异步加载
- 更灵活的资源管理
- 内存更易控制

## Prefab和对象池的结合使用
将Prefab与Object Pooling结合使用，是Unity中非常高效的优化手段，特别适合用于：
- 大量反复生成/销毁的物体（如子弹、特效、敌人）
- 需要高性能的游戏场景（如射击、塔防、弹幕）

### Prefab + Object Pooling的基本原理
1.提前加载Prefab  
2.批量生成一定数量的实例  
3.禁用它们，加入池中  
4.每次需要物体时，从池中取出并启用  
5.用完后，返回池中而不是销毁  

详见：[Object Pooling]({{site.baseurl}}/posts/2025-06-06-Object-Pooling/)
## Prefab实战用法

| 场景    | Prefab 应用                         |
| ----- | --------------------------------- |
| UI 系统 | 每个按钮、弹窗都是一个 Prefab                |
| 关卡组件  | 场景中的房子、门、陷阱都可以做成 Prefab           |
| 敌人生成  | 动态从代码中 `Instantiate(enemyPrefab)` |
| 粒子特效  | 爆炸、烟雾、光环 Prefab 可复用               |

