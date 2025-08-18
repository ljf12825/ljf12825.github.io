var store = [{
        "title": "About",
        "excerpt":"Do not define me, that is UB!   博客内容仅用于学习，如有侵权，请联系删除  ","categories": [],
        "tags": [],
        "url": "/about/",
        "teaser": null
      },{
        "title": "Blog",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/blog/",
        "teaser": null
      },{
        "title": "Categories",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/categories/",
        "teaser": null
      },{
        "title": "Tags",
        "excerpt":" ","categories": [],
        "tags": [],
        "url": "/tags/",
        "teaser": null
      },{
        "title": "first post",
        "excerpt":"Hello Minimal Mistakes!  Hello Blog!  ","categories": ["another"],
        "tags": ["GitHub","GitHub Pages"],
        "url": "/another/2025/05/27/first-post.html",
        "teaser": null
      },{
        "title": "Camera",
        "excerpt":"在Unity中，Camera是游戏中视角呈现的核心组件，它决定了玩家从哪里、以什么方式看到游戏世界。 可以将它理解为游戏世界的“观察者”，通过相机的视角来渲染和展示游戏世界的内容 Camera的核心概念 视野（Field of View, FOV） 视野决定了相机的可见范围，单位通常是角度。FOV越大，显示的范围越广；FOV越小，显示的范围越窄。常见的游戏视角有第一人称（FOV通常较小）和第三人称（FOV较大） 对于透视相机，FOV越大，物体看起来就越远，越小则物体看起来越近 对于正交相机，FOV不影响物体的大小，物体的大小保持不变 摄像机类型 透视摄像机（Perspective）：像人眼一样 透视摄像机FOV = 60 透视摄像机FOV = 20 透视摄像机FOV = 80 正交摄像机（Orthographic）：精确而非真实 正交摄像机 消除透视畸变 正交摄像机的最大特点是不考虑透视，即： 远处的物体不会变小 近处的物体不会变大 这在某些场景下非常有用，比如： 工程图、建筑图、UI界面、2D游戏等 便于精确计算与对齐 因为所有对象的投影都是平行的，没有缩放失真，所以： 对象之间的相对位置更容易计算 适合用于网格对齐（Grid Snap）和像素精确的渲染 适用于2D游戏开发 大多数2D游戏使用正交摄像机，这样才能保持像素美术不被拉伸或缩放失真 例如：平台跳跃、塔防、策略类游戏 用于UI和HUD绘制 UI元素通常使用正交摄像机绘制，以确保在不同屏幕分辨率下保持相同的外观 技术与设计简化 对于一些需要标准比例的场景（如棋盘游戏、等距地图编辑器），正交摄像机可以让开发者更轻松地布局和设计 裁剪平面（Clipping Planes） 每个相机有一个近裁剪面和远裁剪面，这些平面决定了相机能够渲染的场景区域。任何在近裁剪面之前或远裁剪面之后的物体都会被剔除，无法渲染 这两个值非常重要，过小的近裁剪面可能导致深度精度问题，过大的远裁剪面可能会降低性能 深度（Depth） 深度是多个相机渲染顺序的控制参数。较大的深度值表示该相机会在渲染顺序中排在较后，优先渲染的相机会覆盖深度较小的相机。可以使用深度来控制不同相机的渲染顺序 例如，第一人称相机的深度应该大于第三人称相机的深度，这样在同一场景中，第一人称相机的渲染会覆盖第三人称相机 渲染目标（Render Target）...","categories": ["笔记"],
        "tags": ["Unity","Unity Component"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/Camera.html",
        "teaser": null
      },{
        "title": "GameObject",
        "excerpt":"GameObject继承自Object，是所有可以存在于场景中的物体的基类 可以理解为 Unity 世界中一切可见或不可见物体的“容器”，它本身没有实际行为或外观，而是通过添加各种组件（Component）来赋予其功能。 一、GameObject的核心概念 它是Unity中一切实体的基础类 没有组件的GameObject是一个空物体 所有可见（如角色、道具、地形）或不可见（如相机、灯光、空容器）的对象，都是GameObject或其派生 Active status 默认是激活状态，可以手动设置为非激活状态，在非激活状态下，GameObject会变得不可见，不会接收任何的回调或事件 可以通过GameObject.SetActive设置 Static status Unity的某些系统（例如全局照明、遮挡、批处理、导航和反射探针）依赖于GameObject的静态状态，可以使用GameObjectUtility.SetStaticEditorFlags来控制Unity的哪些系统将GameObject视为静态的 Tag and Layer Tag Layer 二、GameObject的结构与组成 一个GameObject至少包含一个组件：Transform 1.必备组件：Transform 控制GameObject的位置、旋转、缩放 组成了Unity的场景层级结构（父子关系） 所有GameObject都必须有Transform，不能移除 transform.position = new Vector3(0, 1, 0); transform.Rotate(Vector3.up, 90); 2.常见组件 组件 作用 MeshRenderer 渲染模型表面 Collider 物理碰撞检测 Rigidbody 让 GameObject 参与物理计算 Animator 控制动画状态机 AudioSource 播放声音 Camera...","categories": ["笔记"],
        "tags": ["Unity","GameObject"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/GameObject.html",
        "teaser": null
      },{
        "title": "Transform",
        "excerpt":"Transform是Unity中控制物体位置、旋转、缩放和父子层级关系的核心组件 一、什么是Transform Transfrom是每个GameObject都自带的核心组件，主要负责： 位置（Position） 旋转（Rotation） 缩放（Scale） 父子关系（Hierarchy） 可以理解为每个物体在三维世界中的“坐标轴和局部空间信息”。 二、Transform的重要属性和区别 **1.position和localPosition 属性名 含义 示例用途 position 世界坐标（绝对位置） 物体在整个场景中的位置 localPosition 本地坐标（相对于父物体的位置） 子物体相对于父物体的偏移 **2.rotation和localRotation 属性名 含义 类型 rotation 世界旋转 Quaternion localRotation 相对父物体的旋转 Quaternion transform.rotation = Quaternion.Euler(0, 90, 0); //世界旋转 transform.localRotation = Quaternion.idetity; //本地旋转重置 3.localScale 表示对象自身的缩放 注意：缩放不会自动传递到position，但会影响渲染尺寸和碰撞盒 transform.localScale = new Vector3(2, 2, 2); //放大两倍 三、父子层级结构*...","categories": ["笔记"],
        "tags": ["Unity","Unity Component"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/Transform.html",
        "teaser": null
      },{
        "title": "Unity Editor Window",
        "excerpt":"关于Unity编辑器窗口的概览      A:Toolbar工具栏，用于访问Unity账户和云服务。它还包括播放模式、撤销历史记录、Unity搜索、图层可见性菜单和编译器布局菜单等控件。   B:Hierarchy层级窗口，以层级形式呈现场景中每个游戏对象。场景中的每个item在hierarchy中都有一个entry，所以这两个窗口本质上是相互关联的。层级结构揭示了各个GameObject之间的连接结构。   C:Game游戏视图，通过场景中的摄像机模拟最终渲染游戏的外观效果。   D:Scene场景视图，可视化编辑和导航，可以显示3D或2D。   E:Overly叠加层包含用于操作场景视图及其中的游戏对象的基本工具。可以添加自定义叠加层来改进工作流程。   F:Inspector检查器，查看和编辑当前选定的GameObject的所有属性。   G:Project项目窗口，可以显示在项目中使用的资源库。   H:Statusbar状态栏提供有关Unity进程的通知，以及快速访问相关工具和设置。  ","categories": ["笔记"],
        "tags": ["Unity","Unity Editor"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/UnityEditorWindow.html",
        "teaser": null
      },{
        "title": "Light",
        "excerpt":"Unity中的Light是照亮场景和物体的核心组件，也是实现逼真视觉效果的关键之一。合理使用光源可以极大提升游戏画面质量，同时也对性能有重要影响 Light决定了场景中物体如何被照亮、阴影如何生成、氛围如何表现 Light的类型（Type） Unity中有4种主要光源类型： 类型 描述 用途示例 Directional Light 没有位置，只有方向，光线平行 太阳光、月光 Point Light 从一点向所有方向发散 灯泡、火把 Spot Light 从一点向特定方向的锥体发散 手电筒、聚光灯 Area Light（仅用于烘焙） 从一个平面区域发光 霓虹灯、窗户光线（仅用于静态对象） 光照模式（Mode） Unity光源有三种模式，关系到实时性和性能： 模式 描述 用途 Realtime 每帧计算光照，支持动态物体 动态灯光，如手电筒、角色法术 Mixed 静态对象使用烘焙，动态对象使用实时光 综合表现和性能 Baked 所有光照预先烘焙，不支持动态阴影 静态场景，如建筑、地形 Light属性 在Unity中，使用UnityEngine.Light类可以动态修改光源的各种属性，实现如灯光变化、闪烁、开关、颜色变化等效果 Light light = GetComponent&lt;Light&gt;(); namespace:UnityEngine Behaviour -&gt; Componenet -&gt; Object 常用字段与属性...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Light","Render","Graphics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/29/Light.html",
        "teaser": null
      },{
        "title": "Prefab System",
        "excerpt":"Unity提供Prefab这种非常强大的机制，用来复用游戏对象，让开发更高效、项目更模块化 Prefab就是一个可以重复使用的GameObject模板 什么是Prefab Prefab是你在场景里创建好的GameObject（可以包含模型、脚本、组件、子物体等），然后把它拖到项目窗口中生成的资源文件。 之后就可以随时从Project中把这个模板拖入场景，生成和原始一样的对象 Prefab特点 特性 描述 模板复用 一次创建，多次使用 改动同步 修改 Prefab，会自动同步所有实例 支持嵌套 Prefab 可以包含另一个 Prefab 可分离 Prefab 实例可以局部修改，不影响原始 Prefab Prefab实例与原型的关系 当你把Prefab拖入场景，它会成为Prefab实例，你可以 完全跟随原始Prefab 局部Override某些属性 解除连接（Unpack） 图标颜色 状态 蓝色立方体 与原 Prefab 保持连接 灰色立方体 已经解除连接（Unpacked） Prefab编辑方式 1.Open Prefab：双击或点击小蓝箭头进入Prefab编辑模式 2.Override面板：查看并应用或还原你对实例的修改 3.Apply to Prefab：将实例的更改写入原始Prefab Prefab的创建和使用 创建 1.在Hierarchy中创建好一个GameObject及其组件和子对象 2.拖拽到Project视图中，Unity自动保存为.prefab 3.你可以删除场景中的对象，只保留Project中的预制体 使用 直接拖到场景中 Instantiate()动态生成 void...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/31/Prefab.html",
        "teaser": null
      },{
        "title": "Material",
        "excerpt":"Unity中的Material是用来定义一个物体外观的核心组件，它将Shader与各种Texture和属性值绑定到一起，决定了一个对象在场景中如何表现 Material的基本构成 Material包括： 1.Shader 决定了材质的渲染方式和它所支持的属性 常用Shader有： Standard：支持金属、粗糙度工作流 URP/Lit(Universal Render Pipeline)专用 HDRP/Lit(High Definition Render Pipeline)专用 Unlit：不受光照影响，用于UI、特效等 自定义Shader 2.Texture 常见类型： Albedo（基础颜色贴图） Normal Map（法线贴图，增加表面细节） Metallic Map / Roughness Map（金属度/粗糙度贴图） Emission Map（自发光贴图） Occlusion Map（遮蔽贴图） 3.属性值 颜色、金属度、粗糙度、透明度 创建和使用Material 创建材质 右键 -&gt; Create -&gt; Material 然后可以给材质命名，设置颜色、贴图等属性 应用材质 方式1：拖动到物体上 方式2：通过代码赋值 Renderer renderer = GetComponent&lt;Renderer&gt;(); renderer.material = myMaterial;...","categories": ["笔记"],
        "tags": ["Unity","Material","Graphic"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/31/Material.html",
        "teaser": null
      },{
        "title": "Layer",
        "excerpt":"在Unity中，Layer是要给非常重要的系统 它主要用于： 控制物体的渲染与相机的可见性 控制物理碰撞（配合Layer Collision Matrix） 通过脚本进行物体分类和筛选 什么是Layer Layer是给GameObject打的“标签”，但它和Tag不一样，Layer是用于功能性控制的，特别在： 摄像机的Culling Mask 光照影响（Light Culling） 物理碰撞（Physics Layer） 射线检测（Raycast Layer） Layer的使用场景 1.摄像机视野控制（Culling Mask） 在Camera组件中，你可以设置 Culling Mask -&gt; 选择哪些Layer可以被该相机看到 用途： UI相机只看UI层 小地图相机只看敌人层 分屏镜头每个只看自己的部分 Layer不仅能控制每个物体是否被摄像机看到，还能与多个摄像机协作实现更加复杂的视图效果 例如，在多人游戏中，你可以为每个玩家设置独立的摄像机，每个摄像机通过不同的Culling Mask来渲染不同的场景部分 示例：多摄像头分屏控制 在分屏游戏中，可以设置多个摄像机，每个摄像机只渲染属于特定玩家的物体 camera1.cullingMask = 1 &lt;&lt; LayerMask.NameToLayer(\"Player1\"); camera2.cullingMask = 1 &lt;&lt; LaeryMask.NameToLayer(\"Player2\"); 通过这种方式，你能够在同一个场景中显示不同的物体，仅限于特定玩家的视野 2.物理碰撞控制（Layer Collision Matrix） 在菜单中： Edit...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-01-Layer/",
        "teaser": null
      },{
        "title": "Tag",
        "excerpt":"在Unity中，Tag是用来标记和分类GameObject的一种轻量级方法，主要用于在代码中查找和判断物体的类型或身份 Tag的核心作用 功能 示例 分类物体 Player、Enemy、Item、UI 等 逻辑判断 判断一个物体是不是玩家 查找特定对象 GameObject.FindWithTag() 触发器/碰撞器逻辑判断 if (other.CompareTag(\"Enemy\")) Tag的使用方法 1.设置Tag 1.选中一个 GameObject 2.Inspector 面板 → 上方的 “Tag” 下拉菜单 3.如果没有想要的标签 → 点击 Add Tag… → 添加一个新的字符串 4.回到物体，设置为刚才新建的 Tag 注意： Tag是字符串类型，但Unity会为你管理列表，不用硬编码 2.使用Tag查找对象 GameObject player = GameObject.FindWithTag(\"Player\"); 或者查找多个对象： GameObject[] enemies = GameObject.FindGameObjectsWithTag(\"Enemy\"); 3.在触发器或碰撞中判断Tag void OnTriggerEnter(Collider other) =&gt;...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-01-Tag/",
        "teaser": null
      },{
        "title": "Component",
        "excerpt":"Component是附加在GameObject上的功能模块，每个组件都提供了某种行为或属性，组成了游戏对象的功能 class Component继承自Object，在UnityEngine.CoreModule中实现 class Component 是所有可依附在GameObject上的类的基类 不可以直接创建Component API Properties Property Description gameObject component附加的GameObject tag gameObject的tag transform gameObject的Transform Public Methods 方法 描述 BroadcastMessage 调用当前 GameObject 或其所有子对象的指定方法。 CompareTag 比较 GameObject 的标签（tag）与给定标签。 GetComponent 获取当前 GameObject 上的指定类型的组件。 GetComponentInChildren 获取当前 GameObject 或其子对象上的指定类型的组件。 GetComponentIndex 获取组件在其父对象中的索引。 GetComponentInParent 获取当前 GameObject 或其父对象上的指定类型的组件。 GetComponents 获取当前 GameObject 上的所有指定类型的组件。 GetComponentsInChildren 获取当前 GameObject...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Component.html",
        "teaser": null
      },{
        "title": "Rigibody",
        "excerpt":"在Unity中，Rigidbody是一个用于实现物理行为的组件，它允许你的游戏对象受力、重力、碰撞等真实世界的物理规则影响 Rigidbody的基本功能 当你给一个GameObject添加Rigibody后，它具备以下能力： 功能 描述 重力 会受到 Unity 世界的重力影响。 力作用 可通过 AddForce() 施加力。 碰撞 可与带有 Collider 的物体发生物理碰撞。 移动 可通过物理方式（而不是直接修改 transform）移动。 RigidbodyPanel 基础物理参数 参数名 作用 默认值 建议用法 Mass（质量） 控制惯性、碰撞反应 1 设为真实世界比例（如车 1000、人 70） Drag（线性阻力） 模拟空气/水的阻力（减速） 0 移动物体逐渐停止，可设为 1~5 Angular Drag（角阻力） 减缓旋转速度 0.05 防止物体无限旋转，常设为 0.1~0.5 Automatic Center Of Mass（自动质心，默认为true） Unity会根据物体的形状（Collider）和质量分布，自动计算Rigidbody的中心点 通常质心在物体的几何中心，但加多个Collider后可能偏移 这是大多数情况下推荐的方式，因为它物理上是合理的...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-02-Rigidbody/",
        "teaser": null
      },{
        "title": "Scripts",
        "excerpt":"Unity脚本就是你编写的C#类，它控制游戏中物体的行为、交互、动画、输入、碰撞、UI等逻辑 脚本类型 Unity中的脚本根据其用途可以分为3类： 特性 MonoBehaviour ScriptableObject 纯 C# 类 是否可挂载 可以挂载到 GameObject 不行 不行 生命周期函数 有 Start、Update 等 没有 没有 是否能序列化 支持 支持 默认不支持 支持协程 StartCoroutine() 不支持 不支持 使用场景 行为脚本，控制对象 数据容器，可复用资源配置 工具类、算法类等逻辑单元 MonoBehaviour（行为脚本） 必须挂载在场景中的GameObject上 用于控制逻辑、角色行为、输入响应等 有生命周期函数 支持协程 适用场景 角色控制器（移动、跳跃、攻击） UI交互逻辑 游戏状态管理 物理交互处理 动画状态控制 ScriptableObject（数据容器） 轻量级对象，不需要挂载，常用于数据复用（如技能表、配置表） 支持序列化，可以做成asset文件 没有生命周期函数，但可以在OnEnable()做初始化 更节省内存，场景切换时不会被销毁 核心优势 内存高效：不依赖场景、按需加载...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-02-Scripts/",
        "teaser": null
      },{
        "title": "Unity Componenet-Driven Architecture",
        "excerpt":"Unity是如何驱动组件系统的 从运行架构、组件调度机制、底层实现三个方面来深度剖析 Unity的运行架构（经典GameObject-Component模型） Unity引擎的架构是 “组合优于继承” 的典范： GameObject：游戏世界中所有对象的容器 Component：挂在GameObject上的功能模块 MonoBehaviour：Unity脚本组件的基类，支持生命周期函数 //伪代码结构 class GameObject { List&lt;Component&gt; components; } class Component { GameObject gameObject; } Unity是如何调度组件的生命周期的 Unity在每一帧都会按以下顺序做一次组件调度遍历： For ever active GameObject: For every enable Component: If first frame: Call Awake() Call Start() Run physics: Call FixedUpdate() Handle rendering: Transform -&gt; Camera -&gt; Renderer...","categories": ["笔记"],
        "tags": ["Unity","Unity Engine"],
        "url": "/posts/2025-06-02-Unity-Architecture/",
        "teaser": null
      },{
        "title": "Event-Driven Architecture",
        "excerpt":"委托与事件 Unity中的事件和委托机制是基于C#的语言特性实现的，用于对象之间的解耦通信。它们是实现观察者模式的核心方式，常用于UI更新、角色状态变化、触发器反应等场景 委托（Delegate） 委托是对函数的引用，可以把方法当作变量一样传递，就是C++中的函数指针 public delegate void MyDelegate(string message); // 声明一个委托类型 public class Test { public static void PrintMessage(string msg) =&gt; Debug.Log(msg); public void UseDelegate() { MyDelegate del = PrintMessage; // 赋值 dle(\"Hello Delegate!\"); // 调用 } } 相当于 // 函数指针 void (*func)(string) = &amp;PrintMessage; 事件（Event） 事件基于委托，是一种特殊的委托类型，但添加了访问限制，只能在声明它的类内部调用，允许其他对象订阅并响应某个特定的行为或状态变化 通常用于对象之间的通信，避免了直接调用，使代码更具解耦性 基本使用 在Unity中，可以使用C#的event关键字来声明一个事件。事件的订阅和触发通常会在组件之间完成...","categories": ["笔记"],
        "tags": ["Unity","Unity Syntax","Architecture"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Event-Driven-Architecture.html",
        "teaser": null
      },{
        "title": "FSM",
        "excerpt":"FSM(Finite State Machine，有限状态机)是一种常用的编程模型，广泛应用于游戏开发中，尤其是在行为控制、游戏角色AI、UI系统、动画控制方面 它的核心就是在一组有限的状态中进行切换，且每次状态转移都遵循一定的规则 基本概念 FSM由以下几个基本元素构成： 状态（State）：系统当前的状态，表示系统的一种具体行为或情境 状态转移（Transition）：从一个状态到另一个状态的路径，通常基于某种条件或事件触发 事件（Event）：触发状态转移的条件或输入，通常由外部世界的变化或内部系统的某些操作引起 动作（Action）：状态进入、退出或在某个状态时发生的具体行为 FSM的组成部分 状态：状态机的每个状态都表示某一特定的系统情境。每个状态可能有自己的内部逻辑和行为。 状态转移：从一个状态到另一个状态的过渡。转移通常由条件（如事件、输入、计时等）触发，状态机的核心就是处理这些条件，并做出相应的状态转换。 事件与触发器：状态转移的条件。通常是由外部输入（如玩家输入、定时器超时、游戏中的其他事件）来触发。 动作：当状态转移时会执行某些动作。比如，进入某个状态时播放动画，退出某个状态时停止某个动作等。 FSM的工作流程 FSM的工作过程可以概括为：每个时刻系统处于某个状态，系统等待某个事件的发生，一旦事件发生，就会根据事件的定义从当前状态转移到下一个状态，并可能触发某些动作。这个过程是循环的，状态机一直在不断地检查事件、进行状态转移。 FSM示例：AI行为 假设开发一个游戏中的敌人AI，敌人的行为可以通过FSM来管理，比如敌人有以下几个行为状态： 巡逻（Patrolling）：敌人沿着一个固定路径来回走 追击（Chasing）：敌人发现玩家并开始追逐 攻击（Attacking）：敌人接近玩家并进行攻击 待机（Idle）：敌人没有做任何事情，处于等待状态 状态转移图： 如果敌人没有发现玩家，状态保持在巡逻 如果敌人发现玩家并进入追击状态，当玩家进入攻击范围时，切换到攻击状态 如果玩家离开视野，回到巡逻状态 如果敌人不再追击或攻击，返回待机状态 每当敌人状态发生变化时，会有相应的动作，比如进入追击时播放追击动画，攻击时播放攻击动画 FSM在Unity中的实现 在Unity中，FSM通常通过脚本来实现。可以使用enum来定义状态，if条件判断或switch语句来管理状态转移，甚至用状态机设计模式来封装整个逻辑 一个简单FSM实现 public enum EnemyState { Patrolling, Chasing, Attacking, Idle } public class EnemyAI : MonoBehaviour { public EnemyState currentState;...","categories": ["笔记"],
        "tags": ["Unity","Unity System","AI"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/FSM.html",
        "teaser": null
      },{
        "title": "Gizmos",
        "excerpt":"Gizmos是一种用于在Scene视图中可视化调试信息的工具，常用于开发阶段来辅助设计和调试，但不会在游戏运行时显示在Game视图中 Gizmos的作用 Gizmos主要用于以下目的： 可视化对象的范围（如碰撞体、攻击范围、视野等） 表示路径、方向、目标点等 调试数据结构（如八叉树、导航网格等） 可视化音效区或光源影响范围 使用方式 可以在脚本中通过OnDrawGizmos()或OnDrawGizmosSelected()函数来自定义Gizmo的绘制 1.OnDrawGizmos() 无论是否选中物体，都会绘制 void OnDrawGizmos() { Gizmos.color = Color.yellow; Gizmos.DrawWireSphere(transform.position, 1f)l } 2.OnDrawGizmosSelected() 只有在选中该GameObject时才会绘制 void OnDrawGizmosSelected() { Gizmos.color = Color.red; Gizmos.DrawWireCube(transform.position, Vector3.one * 2); } Tips Gizmos只在Scene视图中起作用，不会影响实际游戏运行逻辑 可以使用Handles绘制更高级的Gizmos 复杂场景可封装Gizmo可视化模块，提升调试效率 Gizmos API Static Properties 属性名 类型 说明 color Color 设置下一个 Gizmo 图形的颜色 matrix...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Gizmos.html",
        "teaser": null
      },{
        "title": "Input System",
        "excerpt":"Unity目前存在新旧两个输入系统，旧输入系统（Input类）和新输入系统（Input System包） Unity旧输入系统（UnityEngine.Input） 这是Unity默认内建的输入方式，无配置即可用，使用非常直观，主要通过静态类Input获取各种输入信息 适合快速开发与小型项目 不支持热插拔和玩家映射 键盘/鼠标输入最简单最稳定 建议仅在不考虑复杂输入要求的项目中使用 键盘输入 基本方法： Input.GetKey(KeyCode.X); //判断某键是否按住 Input.GetKeyDown(KeyCode.X); // 是否按下（只触发一帧） Input.GetKeyUp(KeyCode.X)l // 是否刚抬起 KeyCode是一个枚举，表示各种键盘和鼠标按键 鼠标输入 鼠标按钮 Input.GetMouseButton(int button); // 0左键，1右键，2中键 Input.GetMouseButtonDown(int button); Input.GetMouseButtonUp(int button); 鼠标位置和滚轮 Vector3 mousePos = Input.mousePosition; // 屏幕坐标 float scrollDelta = Input.mouseScrollDelta.y; // 滚轮滑动 触摸屏输入（Touch） 移动端专用，支持多点触控 int count = Input.touchCount; if (count...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-03-Input-System/",
        "teaser": null
      },{
        "title": "Physics System",
        "excerpt":"Unity实际上提供了两个物理系统：3D物理（基于PhysX）和2D物理（基于Box2D），它们是独立的 物理系统的核心职责 分类 内容 示例 1. 碰撞检测 检测物体之间是否发生接触（重叠、触发、碰撞） 玩家与墙体碰撞、子弹击中敌人 2. 碰撞响应 根据碰撞产生反作用力、反弹、停止等 小球碰撞墙壁后弹开 3. 力与运动 模拟重力、加速度、摩擦力、空气阻力等 角色掉落、物体滚动、滑动 4. 刚体动力学 使用 Rigidbody 模拟真实世界中的质量、惯性、力矩等 推箱子、砸东西、车子加速转弯 5. 关节系统 使用 Joint 或 ArticulationBody 模拟多刚体之间的约束连接 吊桥、机器人手臂、门铰链 6. 触发器检测 使用 isTrigger 实现非物理交互 进入危险区域触发警报、检测拾取道具 7. 布料、软体、车辆 特定模拟，如布料系统、软体物理、车轮碰撞和悬挂 Unity 的 WheelCollider, Cloth 8. 碰撞信息收集 获取碰撞点、法线、力大小、接触信息等 用于播放音效、粒子、震动反馈等 9.射线检测 用于看到什么，而非物理互动...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-03-Physics-System/",
        "teaser": null
      },{
        "title": "Thread",
        "excerpt":"Unity中的线程机制和使用方式，包括： Unity的线程模型概览 Unity API与线程限制 在Unity中使用线程的四种方式（Thread/Task/Job System/DOTS） 回到主线程的方法 Unity线程模型概览 Unity整个运行环境围绕主线程组织，它的执行流程大致如下： 主线程（Unity Loop）： ├─ Start() ├─ Update() ├─ 渲染提交 ├─ 动画更新 ├─ 物理处理（同步 PhysX） └─ LateUpdate() 主线程的作用： 唯一能安全访问大多数Unity API的线程 游戏逻辑、生命周期函数、事件处理等全部在主线程中执行 Unity API的线程限制 Unity引擎的绝大多数API不是线程安全的，只能在主线程中访问 常见不可在子线程中调用的内容： 类型 示例 场景对象 transform.position、gameObject.SetActive() UI 操作 Text.text、Image.sprite、CanvasGroup.alpha 加载资源 Resources.Load、AssetBundle.LoadAsset UnityEvent Invoke()、AddListener() 摄像机/渲染设置 Camera.fieldOfView、RenderSettings.ambientLight 为什么大多数Unity API不是线程安全的 线程安全是指多个线程同时访问某个资源时，不会出现数据竞争、资源冲突或者状态不一致； 换句话说，线程安全的代码能保证即使多个线程同时调用，也不会导致程序崩溃或出现错误 1.引擎设计的历史和架构...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Thread.html",
        "teaser": null
      },{
        "title": "Unity Asynchronous and Coroutine",
        "excerpt":"在Unity中，异步编程主要应用于长时间运行的操作或I/O操作，例如加载场景、资源（如纹理、音频文件）、进行网络请求或其他非阻塞操作。Unity提供了几种常见的方式来实现异步操作，通常通过协程和异步编程API（如async/await）来实现 Asynchronous Unity 从 2017 版本开始支持 async/await 异步编程方式，它是 C# 的一部分，适用于处理 耗时的异步操作，如网络请求、文件操作等。通过 async 标记方法，并在需要等待的地方使用 await，可以简化代码并使其更加可读 示例：异步加载资源（UnityWebRequest） 假设你要从网络上下载文件，可以使用async/await来实现非阻塞的异步操作： using UnityEngine; using UnityEngine.Networking; using System.Threading.Task; public class AsyncExample : MonoBehaviour { async void Start() { string url = \"https://example.com/resource\"; string result = await DownloadDataAsync(url); Debug.Log(\"下载完成：\" + result); } // 异步下载数据 private async Task&lt;string&gt;...","categories": ["笔记"],
        "tags": ["Unity","Unity Async"],
        "url": "/posts/2025-06-03-Unity-Asynchronous-and-Coroutine/",
        "teaser": null
      },{
        "title": "Unity Build-in Types",
        "excerpt":"Unity内建类型 1.空间/几何类型（Transform相关） 类型 说明 Vector2, Vector3, Vector4 表示二维/三维/四维向量 Quaternion 四元数，表示旋转 Matrix4x4 4×4 矩阵，常用于转换 Bounds 包围盒（中心+尺寸） Ray, RaycastHit 射线检测相关类型 Plane 表示一个无限平面 Rect 二维矩形区域 Color, Color32 表示颜色（线性空间和 sRGB） Vector Vector2、Vector3、Vector4 它们是Unity提供的三个核心向量类型，广泛用于位置、方向、速度、缩放、颜色等各种场景 向量类型 维度 作用 Vector2 2D 向量，包含 x, y 用于 2D 空间中的位置、速度等 Vector3 3D 向量，包含 x, y, z 用于 3D 空间中的大多数情况 Vector4...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-03-Unity-Build-in-Types/",
        "teaser": null
      },{
        "title": "Collider & Trigger",
        "excerpt":"Unity中的碰撞体是物理系统的重要组成部分，负责定义游戏对象的形状以进行碰撞检测。简单来说，Collider是一个无形的边界，用于检测物体是否接触或重叠，从而触发碰撞事件和物理响应 什么是Collider Collider是附加在游戏对象上的组件，用于告诉物理引擎这个对象的碰撞范围。Collider本身不会渲染形状，只是一个隐形的物理边界 常见的Collider类型 BoxCollider 立方体形状的碰撞体，适合方形或长方体物体 SphereCollider 球形碰撞体，适合球形或圆形物体 CapsuleCollider 胶囊碰撞体，适合人物、柱子等 MeshCollider 使用自定义网格模型做碰撞体，适合复杂形状，性能较差，且通常用于静态物体 WheelCollider 专门用于车辆轮胎的碰撞和物理模拟 Collider和Rigidbody的关系 Collider只负责检测碰撞，不会自定产生物理运动 Rigidbody组件负责物理运动和动力学 一个没有Rigidbody的物体的Collider会被当作“静态碰撞体”使用（静态障碍物），不会移动也不响应物理力 一个有Rigidbody的物体可以在物理引擎驱动下移动，Collider会随物体运动 Collider Panel Box Collider IsTrigger 默认false，此时Collider是实体碰撞体，会阻挡其他物体，发生物理碰撞和反弹 勾选时，Collider变成Trigger，不会阻挡其他物体，但会检测进入、离开和停留事件，可以用来做区域检测、事件触发等 Provides Contacts 用于物理引擎的碰撞检测和接触点信息提供 默认false，Collider可能只报告碰撞发生，但不提供详细的接触点信息，这样可以节省一些计算资源 勾选后，Collider会提供详细的碰撞接触点信息，这样物理引擎在碰撞时，可以把碰撞的具体接触点信息暴露出来，供脚本或物理系统使用 using UnityEngine; public class CollisionPointExample : MonoBehaviour { void OnCollisionEnter(Collision collision) { foreach (ContactPoint contact in collision.contacts) { //接触点位置...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-04-Collider-and-Trigger/",
        "teaser": null
      },{
        "title": "Addressables",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Package"],
        "url": "/posts/2025-06-05-Addressables/",
        "teaser": null
      },{
        "title": "Object Pooling",
        "excerpt":"对象池是一种优化性能和内存分配的设计模式，尤其常用于游戏开发和高频率实例化的场景中 概念 对象池是一个事先创建好的一组可复用对象的容器，避免频繁地创建和销毁对象。在需要时，从池中取一个对象；使用完毕后，不销毁，而是回收进池中待复用 适用场景 需要频繁创建/销毁的对象（子弹、特效、敌人） 性能敏感场景（高帧率要求） GC带来的性能抖动要避免的场合 工作流程 1.初始化：创建一定量的对象并放入池中，默认设置为非激活状态 2.取出对象（Spawn/Get）： 如果池中有可用对象，返回它并激活 如果池为空，可选是否创建新对象 3.回收对象（Recycle/Release）： 使用完后，将对象设为非激活并放回池中 4.自动扩展或缩减池大小（可选） 简单实现 public class ObjectPool&lt;T&gt; where T : Component { private Queue&lt;T&gt; pool = new Queue&lt;T&gt;(); private T prefab; public ObjectPool(T prefab, int initialSize) { this.prefab = prefab; for (int i = 0; i &lt; initialSize;...","categories": ["笔记"],
        "tags": ["Unity","Design Pattern"],
        "url": "/posts/2025-06-06-Object-Pooling/",
        "teaser": null
      },{
        "title": "Character Controller",
        "excerpt":"Character Controller是专为角色移动设计的物理组件，适合用于第一人称、第三人称角色控制，尤其适合需要“脚贴地”“走坡不滑”的场景 它和Rigidbody不同，不依赖物理引擎施加力，而是手动控制角色移动的逻辑，更稳定、精准、游戏性更强 Character Controller组件概览 它本质是一个内置Capsule Collider + 内部碰撞处理器，支持走地、上坡、碰撞、阻挡等功能 主要属性 属性 描述 Center 控制胶囊体中心位置 Radius 胶囊体的半径 Height 胶囊体高度 Slope Limit 可行走的最大坡度角（超过会滑下来） Step Offset 可“跨越”的台阶高度 Skin Width 贴地/贴墙容差，过小会穿透，过大会卡住 Min Move Distance 小于这个值的移动会被忽略 UnityManual CharacterController 常用方法 Move(Vector3 motion) 移动角色，内部会自动处理碰撞，返回碰撞信息 controller.Move(Vector3 motion * Time.deltaTime); 支持斜坡、台阶检测、滑动、墙体推开等逻辑 SimpleMobe(Vector3 motion) 简化版移动，自动应用重力，不需要乘以Time.deltaTime controller.SimpleMove(new Vector3(x, 0, z)); 适合简单控制，不建议用于精细角色控制...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-07-Character-Controller/",
        "teaser": null
      },{
        "title": "Joint",
        "excerpt":"Joint（关节）系统是物理系统的一部分，用于将两个Rigidbody通过某种方式连接起来，从而形成如机械臂、门铰链、车轮悬挂等复杂的物理结构 常见Joint组件（3D） Joint 类型 功能简介 应用场景 Fixed Joint 固定连接两个刚体（类似粘在一起） 粘接物体，如断裂木桥 Hinge Joint 限制物体绕一个轴旋转 门铰链、车轮 Spring Joint 使用弹簧连接两个物体 弹簧、吊绳 Character Joint 模拟生物骨骼的铰接关节 角色 ragdoll 系统 Configurable Joint 高级自定义关节，可设置自由度 自定义复杂机械结构 使用Joint基本原则 Joint总是连接两个Rigidbody：当前GameObject上的Rigidbody与Connected Body 如果Connected Body为空，则连接的是世界坐标系 添加Joint后，Unity会自动处理物理约束和力反馈 示例：Hinge Joint（门铰链） HingeJoint joint = gameObject.AddComponent&lt;HingeJoint&gt;(); joint.connectedBody = otherRigidbody; joint.useLimits = true; JointLimits limits = joint.limits;...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-07-Joint/",
        "teaser": null
      },{
        "title": "Model",
        "excerpt":"Articulation Body Mixamo 免费的Adobe平台，用于下载各种模型和动画 下载设置 Animator Controller Avatar：动画重定向使用 Apply Root Motion：角色的运动基于动画而不是脚本，当基于动画时，运动状态根据动画的播放进行；当基于脚本时，动画只是动画，运动状态由脚本决定 Update Mode Normal：根据当前时间刻度改变角色动画的播放速度 Fixed：将动画逻辑转移到FixUpdate()中 Unscaled Time：动画器和动画独立运行于时间刻度 Culling Mode Always Animate：即使不在摄像机范围内也始终执行动画并进行计算 Cull Update Transforms：当不在摄像机范围内时，Unity会继续计算动画中的后续帧 Cull Completely：离开后暂停，返回后继续 Format: 格式名称 扩展名 说明 是否推荐用于 Unity FBX Binary .fbx 二进制格式，体积小，加载快，是主流标准格式 强烈推荐 FBX ASCII .fbx 文本格式，方便查看内容，但体积大、加载慢 不推荐 FBX for Unity .fbx 专门为 Unity 设置的导出选项，自动匹配 Unity...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-07-Model/",
        "teaser": null
      },{
        "title": "UI System",
        "excerpt":"Unity UI系统是Unity引擎内置的用于构建用户界面的工具集。它基于Canvas（画布）架构，支持制作按钮、文本、图片、滑动条、输入框等各种交互元素 UGUI和NGUI 特性 UGUI（Unity GUI） NGUI（Next-Gen UI） 开发方 Unity 官方 第三方（Tasharen Entertainment） 引入版本 Unity 4.6+ 内置 Unity 3.x 时期的主流 UI 插件 集成性 原生集成，支持 Canvas、EventSystem、Animation 等 插件形式，较早期版本需手动集成 渲染系统 使用 Unity 内部渲染系统（Canvas） 自定义渲染系统，Draw Call 优化依赖面板拆分 编辑器支持 所见即所得，Scene View 拖拽 UI 早期需要反复预览，后期版本改善较多 多分辨率适配 有自动布局系统、Anchor、RectTransform 依赖自定义 Anchor 系统 动画支持 支持 Unity Animation 和...","categories": ["笔记"],
        "tags": ["Unity","Unity System","Render"],
        "url": "/posts/2025-06-07-UI-System/",
        "teaser": null
      },{
        "title": "Scene System",
        "excerpt":"Unity Scene System是Unity中用于组织和管理游戏世界的基础结构，Unity支持多个Scene的加载与卸载，允许构建出大型、分块化的世界 Scene Scene是Unity游戏项目中的一个基础构建单元，它就像游戏世界中的一个“地图”或“关卡”，一个Scene就是一个逻辑/物理空间的容器，包含了： GameObject 地形、UI、声音 脚本、组件 光照信息、烘焙数据等 在Unity中，一个Scene对应一个.unity文件 Scene 生命周期 1.创建或打开场景（.unity文件） 2.布置场景内容 3.保存场景 4.构建和加载场景（Build Settings里添加场景） 5.运行时加载和卸载场景 场景最佳实践 保持每个场景的职责单一（比如UI与游戏逻辑分离） 使用Prefab来管理重复对象 使用场景加载器或管理器来控制场景切换和数据传递 合理使用DontDestroyOnLoad来跨场景保存数据或对象 Multi Scene 多场景允许你同时加载和管理多个场景，不同场景可以同时存在并且运行在游戏中，允许你灵活地处理加载、切换和卸载场景的需求 加载和卸载场景 Additive加载：可以在现有场景的基础上加载新的场景，这种方式不会卸载当前场景，而是将多个场景叠加在一起 Single加载：可以将一个场景替换当前场景，这种方式会卸载当前场景并加载新的场景 常见的多场景应用场景 主菜单 + 游戏场景：主菜单和游戏场景可以同时加载，用户操作菜单时，游戏场景依然在后台运行 动态加载关卡：可以根据游戏的进度或玩家行为动态加载或卸载不同的场景，比如一个大世界分为多个小场景，按需加载 UI和游戏场景分离：UI可以独立于游戏场景加载，确保UI始终可用，而不受游戏场景加载状态的影响 加载场景（Additive 和 Single） Additive加载：将新场景加载到现有场景中，保持当前场景不变 Additive加载意味着将一个新场景加载到现有场景的基础上，当前场景不会被卸载，而是与新场景一起共存。使用这种方式可以让多个场景并行运行，从而实现一些复杂的场景管理，例如分割大型场景，或者在后台加载新的场景内容 使用场景： 动态加载关卡：例如一个开放世界游戏，场景可以按需加载。加载一个新的区域时，现有区域不会被卸载 UI 和游戏分离：UI 可以作为一个单独的场景加载并保持活跃，而游戏逻辑场景则可以独立运行 多人游戏：在多人游戏中，玩家可能在多个子场景中互动，Additive 加载可以实现多个玩家在多个区域间的无缝切换 // Additive SceneManager.LoadScene(\"NewScene\",...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-08-Scene-System/",
        "teaser": null
      },{
        "title": "Time System",
        "excerpt":"Unity的时间系统管理游戏中的时间流逝，包括帧率、时间步长、暂停和加速等 几个核心概念 1.Time.deltaTime 这是Unity时间系统中最常用的属性之一，它表示上一帧和当前帧之间的时间（单位为秒），通常用于实现与帧率无关的平滑运动和动画 float speed = 5f; void Update() =&gt; transform.Translate(Vector3.forward * speed * Time.deltaTime); Time.deltaTime确保无论游戏的帧率是多少，物体的移动速度始终相同 2.Time.time 表示自游戏开始以来经过的时间（单位为秒） 3.Time.timeScale timeScale是Unity时间系统中一个非常重要的属性。它控制整个游戏的时间流速。默认值是1，表示正常速度。如果将其设置为0，游戏将暂停。如果设置为大于1的值，时间将加速。 4.Time.fixedDeltaTime 与Time.deltaTime类似，fixedDeltaTime是每个固定时间步长的时间（单位为秒）。它用于FixedUpdate()方法，确保物理计算在所有帧率下都是一致的，默认值为0.02s，表示每秒更新50次 void FixedUpdate() =&gt; transform.Translate(Vector3.forward * speed * Time.fixedDeltaTime); 5.Time.unscaledDeltaTime 类似于Time.deltaTime，但unscaledDeltaTime不会受到Time.timeScale的影响。用于不受时间缩放影响的功能（如UI动画、计时器等） void Update() { float countdown = 10f; countdown -= Time.unscaledDeltaTime; } 6.Time.realtimeSinceStartup 返回自游戏启动以来的实际时间（单位为秒），不受timeScale影响 7.Time.smoothDeltaTime 类似于Time.deltaTime，但它提供了更平滑的值，适用于需要更平滑的插值计算的场景。通常在帧率不稳定时，可以使用它来减少跳动 8.Time.captureDeltaTime captureDeltaTime提供的是实时的时间间隔，而不受Unity内部时间优化的影响。用于精确时间测量...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-09-Time-System/",
        "teaser": null
      },{
        "title": "Frame",
        "excerpt":"在Unity中，Frame（帧）是游戏运行的基本时间单位 什么是Frame Frame：指游戏每渲染并更新一次画面所经历的完整周期 一个Frame包含了物理模拟、逻辑更新、渲染提交等多个阶段 游戏每秒运行多个帧，成为FPS（Frame Per Second），帧率越高越流畅 如果帧率是60FPS，表示每秒执行60次完整的Frame逻辑 Frame的生命周期 [Input] -&gt; [Physics] -&gt; [Update] -&gt; [AI/Animator] -&gt; [LateUpdate] -&gt; [Rendering] -&gt; [Present] 详见Scripts 不同帧的分类 帧类型 描述 逻辑帧（Update 帧） 每帧都会执行的脚本逻辑 物理帧（FixedUpdate） 固定时间调用一次，与帧率无关 渲染帧 Unity 渲染一次画面 Frame与多线程 Unity中每一帧可以大致分为如下几个阶段： Frame 开始 │ ├─ Script Update（MonoBehaviour Update） ├─ FixedUpdate（每 N 帧触发） ├─ Animation Update...","categories": ["笔记"],
        "tags": ["Unity","Renderer","Graphic"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Frame.html",
        "teaser": null
      },{
        "title": "Serialization and Persistence",
        "excerpt":"在Unity中，序列化和持久化在游戏数据存储中起到重要的作用 序列化（Serialization） 序列化就是把内存中的对象转换成可以存储或传输的格式的过程，比如转换成二进制、JSON、XML、或者Unity自己的资产格式\\ 反过来，反序列化（Deserialization）就是把存储或传输的格式转换回程序内存分钟的对象 序列化的意义 保存数据 游戏存档就是把游戏状态保存到磁盘上的过程，这个过程就是序列化 编辑器显示与修改数据 Unity Inspector面板显示脚本里字段的值，需要序列化这些字段才能让编辑器读写它们 网络传输 多人游戏中，玩家状态需要网络传输，也要序列化成网络能传输的格式 Unity的序列化系统 Unity有自己的一套序列化规则，决定哪些数据会被序列化（保存、显示在Inspector），核心要点如下： 字段必须是公有的或标记为[SeriializeField] 只有公有字段或被[SerializeField]标记的私有字段才能被Unity序列化和显示在Inspector中 支持的类型 Unity支持大部分基础类型的序列化：int,float,string,bool,Vector3,Color等，自定义类型也能被序列化但是要加上[System.Serializable]属性，以及UnityEngine.Object类型（如GameObject,Transform,ScriptableObject等） 不支持的类型 一些类型无法被序列化，比如Dictionary,delegate,event等 Unity的序列化是深度序列化 Unity会自动处理类的成员变量，递归序列化引用类型（如类的实例） 如何序列化 基本类型 默认情况下，Unity会序列化所有公有字段和标记为[SerializeField]的私有字段 public class MyComponent : MonoBehaviour { public int score; [SerializeField] private string playerName; } 上述代码中score和playerName会被Unity序列化，可以在Inspector中看到并修改 类的序列化 自定义类（结构体、对象等）也可以被序列化，前提是它们符合序列化条件 ```cs [System.Serializable] public class Player { public string...","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/2025-06-10-Serialization-and-Persistance/",
        "teaser": null
      },{
        "title": "Animation System",
        "excerpt":"Unity现存两套动画系统，较早的是Legacy Animation，现代的是Mecanim；它们的设计理念、功能和灵活性由很大的不同 Legacy Animation（传统动画系统） Legacy Animation是Unity最初的动画系统，主要用于较为简单的动画控制，依赖于直接在物体上设置Animation Clips和控制这些片段的播放 核心特性 基本动画控制：传统的Legacy Animation主要通过Animation Component来控制动画。直接把也给Animation Clip分配到Animation组件上，然后通过脚本控制动画的播放（Play()）或停止（Stop()） 关键帧动画：它依赖于关键帧（Keyframe），逐帧设置物体的状态变化，如位置、选择、缩放等。这个系统比较适合控制小范围、简单的动画（比如对象的旋转、位移） 动画重叠和层次控制较弱：Legacy Animation没有多层次控制的功能，所以不同动画之间的重叠（例如角色走路和挥剑）难以高效地管理 使用方式 直接绑定：将动画片段直接附加到Animation组件上，通常是按顺序播放 脚本控制：通过脚本控制动画的播放，例如： Animation anim = GetComponent&lt;Animation&gt;(); anim.Play(\"Run\"); 局限性： 不支持复杂的状态机：Legacy系统不支持复杂的动画状态机和动画切换。虽然可以控制动画的播放顺序，但没有明确的状态机来管理多个动画状态之间的切换 缺乏灵活性：对于需要多层次动画混合、状态管理或者需要处理复杂过渡的游戏项目，Legacy Animation显得过于简单，不能满足这些需求 适用场景： 适合简单的、无复杂逻辑的动画。比如： 小物件的动画（例如按钮点击时的缩放动画） 简单的角色动画（例如走路、跳跃） 短小的过渡动画 Mecanim（现代动画系统） Mecanim 是 Unity 后期引入的动画系统，极大地增强了动画的控制和灵活性。它提供了丰富的功能，特别是 动画状态机 和 层（Layer），适合处理复杂的动画逻辑，特别是对角色动画和多动画重叠有较高要求的项目 核心特性 动画状态机（Animator Controller）：Mecanim 引入了 Animator Controller，它是一个图形化的界面，允许开发者通过状态机（State Machine）管理多个动画片段之间的过渡。状态机允许动画状态之间按条件平滑过渡，支持更复杂的动画逻辑。 参数控制：Mecanim 引入了 Animator...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-11-Animation-System/",
        "teaser": null
      },{
        "title": "Audio System",
        "excerpt":"Audio System 是 Unity中处理游戏所有声音播放、管理和混音的核心模块 Audio Clip 在Unity中，AudioClip是表示音频资源的核心类，用于播放、管理和处理音频数据（如音乐、音效、语音等） public class AudioCilp : Object 它存储音频数据，可以被AudioSource组件播放 通常通过将音频文件（如.wav、.mp3、.ogg）导入到Unity项目中生成AudioClip 可用来播放背景音乐（BGM）、音效（SFX）、语音（VO）等 AudioClip的常见使用方式 1.在Inspector中拖入音频文件 拖一个音频文件到Assets文件夹 Unity自动将其导入为AudioClip 拖到AudioSource.clip上即可播放 2.通过代码播放AudioClip public AudioSource audioSource; public AudioClip clip; void Start() { autioSource.clip = clip; audioSource.Play(); } AudioClip的导入设置 属性 说明 Force To Mono 强制单声道 Normalize 自动将音频的音量标准化到一个统一的最大音量水平，避免音量过低或过高 Ambisonic 沉浸式3D空间音频，启用后Unity会使用Ambisonic解码器处理音频方向，需安装第三方插件使用 Load Type Streaming（长音频），Decompress on...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-11-Audio-System/",
        "teaser": null
      },{
        "title": "Layout",
        "excerpt":"Layout System Layout Group Layout Group是Unity UI自动布局系统的核心组件之一，用于在UI Canvas下自动排列其他子物体。它极大地简化了UI元素的排列和适配逻辑，让UI开发变得更结构化、响应式、更易维护 Layout Group是一类MonoBehaviour脚本，用于自动排列RectTransform子物体的位置与尺寸，不需要你手动拖动它们 类型 说明 用途示例 HorizontalLayoutGroup 子物体沿 水平方向排列 菜单栏、工具条、横向列表 VerticalLayoutGroup 子物体沿 垂直方向排列 聊天记录、竖向按钮组 GridLayoutGroup 子物体按 网格排列（行列） 背包格子、关卡选择界面 LayoutGroup 抽象基类 不直接使用 Horizontal / Vertical Layout Group 属性 说明 Padding 容器四周的边距 Spacing 子物体之间的间隔 Child Alignment 子物体在主轴上的对齐方式（左/中/右） Reverse Arrangement 排列方向反转：从上到下 → 从下到上 Control Child Size...","categories": ["笔记"],
        "tags": ["Unity","Unity System","UGUI"],
        "url": "/posts/2025-06-11-Layout/",
        "teaser": null
      },{
        "title": "Mesh",
        "excerpt":"Unity中的Mesh（网格）是一切3D模型、地形、角色、道具、甚至某些UI元素的几何基础，是“物体的骨架” 包含顶点、面、法线、UV、颜色等数据，是3D图形渲染的核心单位 Mesh的构成 数据 作用 顶点（Vertices） 网格的点，构成形状的基础 三角形（Triangles） 每三个顶点组成一个三角面，是渲染最小单元 法线（Normals） 每个顶点的方向，用于光照计算 UV 坐标（UVs） 纹理坐标，用来决定贴图怎么铺在模型上 顶点色（Colors） 每个顶点的颜色，用于特效、调色 切线（Tangents） 用于法线贴图的方向辅助向量 这些数据最终会交给GPU，进行渲染 Mesh在Unity中的用途 用途 举例 渲染模型 静态模型、角色模型、环境场景 自定义几何体 Procedural Mesh（如地形、波浪、水面） 碰撞体数据 Mesh Collider 也使用 Mesh 特效/轨迹 线性 Mesh（如剑气轨迹、能量波） 角色换装 动态换装系统中组合不同 Mesh 如何创建、操作Mesh Unity提供Mesh类，支持自定义几何体 示例：创建一个简单三角形Mesh Mesh mesh = new Mesh(); Vector3[] vertices = new...","categories": ["笔记"],
        "tags": ["Unity","Renderer","Graphic"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Mesh.html",
        "teaser": null
      },{
        "title": "Navigation",
        "excerpt":"constructing Navigation in 3D Unity的默认NavMesh系统是为3D场景涉及的 Unity中的Navigation主要涉及路径寻找（Pathfinding）和导航网格（NavMesh）两大核心内容，广泛应用于AI和角色移动的场景中，特别是用于控制NPC的行动 NavMesh（导航网格） NavMesh是一个为AI角色提供导航支持的系统。在一个3D场景中，NavMesh是通过对地面等可行走区域的“网格化”，让AI角色能在场景中找到通行路径 NavMesh的基本概念 可行走区域：NavMesh会自动计算哪些地方是可供角色行走的，哪些地方是不可行走的。不可行走区域可以通过物理层（Layer）或直接标记为不可行走区域来实现 障碍物避让：NavMehs会避开障碍物，因此角色在移动时不会穿越墙壁、岩石等不可行走区域 NavMesh代理（NavMesh Agent）：用于控制角色在NavMesh上的运动，它会根据目标点、路径规划和障碍物自动调整角色的路径 NavMesh生成 在Unity中，我们通过以下几个步骤来创建NavMesh： 导航面（NavMesh Surface）：这是Unity中生成NavMesh的工具。通过在地面上添加一个NavMeshSurface组件来定义NavMesh的生成区域。 烘焙NavMesh：一旦设置好NavMeshSurface，就可以通过点击“Bake”按钮来生成NavMesh，这时可行走的区域会被标记出来，Unity会在该区域内生成一个路径网格。 设置不可行走区域：可以通过NavMesh Obstacle组件来定义障碍物，标记出不可走的区域，生成的NavMesh会自动避开这些区域。 NavMesh Surface NavMesh Agent（导航代理） NavMeshAgent 是挂载在角色上的组件，负责根据计算出的路径自动引导角色移动。它依赖于NavMesh来判断路径和避开障碍物。NavMeshAgent 会计算从当前位置到目标点的路径，并使角色沿路径移动 属性 Speed：设置角色的移动速度 Angular Speed：设置角色旋转的速度 Acceleration：角色的加速速度 Stopping Distance：目标点与角色之间的最小距离，当距离小于该值时，角色会停止移动 Auto-Breaking：是否在停止时自动刹车 Avoidance Priority：设置代理的优先级，用于多个角色避免碰撞 移动方法 可以通过代码控制角色的移动 NavMeshAgent agent = GetComponent&lt;NavMeshAgent&gt;(); agent.SetDestination(targetPosition); 这个方法会让角色自动计算到targetPosition的最短路径，并开始沿着路径移动 NavMesh Path（导航路径） NavMeshPath是一个可以通过代码访问的类，它保存了计算出的路径的所有信息，包括路径的各个节点（Waypoints），可以使用它来获取更详细的路径信息 NavMeshPath path...","categories": ["笔记"],
        "tags": ["Unity","Unity System","AI"],
        "url": "/posts/2025-06-11-Animation-System/",
        "teaser": null
      },{
        "title": "Terrain",
        "excerpt":"在Unity中，Terrain是一个专门用于制作大规模、自然风格场景的强大工具 什么是Terrain Terrain是Unity提供的一个内置组件，用于在场景中创建可编辑的地形 它由多个部分组成： 地形本体（高度图控制的网格） 纹理涂层（地表材质贴图） 植被/树木/草 光照支持（光照贴图、探针） LOD和剔除 Terrain的核心结构 模块 功能 高度图（Heightmap） 决定地形的高低起伏 绘制材质（Layers） 地面纹理（如草地、岩石、雪）混合涂刷 细节对象（Details） 草、石头、花等低多边形细节（大量渲染优化） 树木系统（Trees） 批量放置支持 LOD 的树 碰撞体 自动生成地形碰撞 光照支持 支持烘焙光照图、Light Probe、反射探针 Terrain Data Terrain Data是地形的“后端数据容器”，和Terrain组件一起工作，一个Terrain组件绑定一个TerrainData资源 Terrain terrain = GetComponent&lt;Terrain&gt;(); TerrainData data = terrain.terrainData; TerrainData保存的内容 高度图（Heightmap） 用灰度图(float[,])描述地形的高度 控制地形表面的形状 float[,] heights = terrainData.GetHeights(0, 0, width, height);...","categories": ["笔记"],
        "tags": ["Unity","Renderer","Unity System","Unity Component"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Terrain.html",
        "teaser": null
      },{
        "title": "Tilemap",
        "excerpt":"在Unity中，Tilemap是一个强大的工具，专为2D游戏开发中的网格地图（Tile-based maps）设计 它允许开发者通过将单独的图块（Tiles）布置在网格中，构建复杂的2D游戏世界，如平台游戏、回合制策略游戏等 Tilemap可以用于处理游戏世界的地形、背景、障碍物、关卡设计等 Tilemap的组成和工作原理 Tilemap的工作原理是基于网格（Grid）的，将单个的图块（Tile）放置在网格的各个单元格中，从而构建出复杂的2D地图。Unity提供了一个强大的Tilemap系统，使得开发者能够快速而高效地创建这些地图 组成部分 Grid：Grid是Tilemap的基础结构，它为所有Tile提供一个坐标系统，可以设置不同类型的Grid，如矩形网格、六边形网格等，以适应不同的地图需求 Tilemap：Tilemap组件是核心，负责管理Tiles在Grid上的位置和现实。每个Tilemap会有自己的Tile图层，用于绘制和管理不同的地形或装饰层 Tile：Tile是Tilemap的基本单位，通常是一个Sprite。每个Tile都代表地图上的一个单元格，可以是地面、障碍物、装饰物等。Unity允许开发者为Tile设置各种属性，如动画、规则等 Tilemap的创建与设置 Step1: 创建一个Tilemap 创建Grid 在Unity的场景中，通过GameObject -&gt; 2D Object -&gt; Tilemap -&gt; Rectangular来创建一个带有Grid的Tilemap，Grid会自动创建，Tilemap会作为Grid的子对象 也可以选择Hexagonal或Isometric等不同类型的网格，具体取决于游戏需求 创建Tilemap 在Unity中，Tilemap是由一个Tilemap组件和一个Tilemap Renderer组件组成的 Tilemap组件负责存储地图的Tile，而Tilemap Renderer负责绘制这些Tile Step2：创建Tile Palette Tile Palette是一个管理所有Tiles的工具，它允许将Tile组织在一个面板中，方便在Tilemap中绘制和修改 打开Tile Palette 在Unity菜单栏中，选择Window -&gt; 2D -&gt; Tile Palette，打开Tile Palette窗口 创建Tile Palette 在Tile Palette窗口中，点击“Create New Palette”创建一个新的Tile Palette。可以将其命名并选择合适的Tilemap图层（比如地面、背景等） 添加Tiles到Palette 将Sprites（或其他图像资源）拖到Tile...","categories": ["笔记"],
        "tags": ["Unity","Unity System","Unity Package"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Tilemap.html",
        "teaser": null
      },{
        "title": "Unity NetWork",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity NetWork"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Unity-NetWork.html",
        "teaser": null
      },{
        "title": "Unity Profiler",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Tool"],
        "url": "/posts/2025-06-11-Unity-Profiler/",
        "teaser": null
      },{
        "title": "Unity Performance Tuning",
        "excerpt":"DrawCall  ","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/posts/2025-06-13-Unity-Performance-Tuning/",
        "teaser": null
      },{
        "title": "Behaviour Tree",
        "excerpt":"Unity的行为树是一种常用于AI决策的结构，它在游戏开发中用于描述AI的行为和决策逻辑。它通过阻止一系列的节点来表示各种行为，树形结构的设计让它可以清晰地展示AI决策过程 基本概念 行为树的每个节点都有一个功能，它们通常分为以下几种类型 根节点（Root Node）：行为树的起始点 选择节点（Selector Node）：类似于“或”运算，选择一个成功的子节点。如果一个子节点失败，则选择下一个子节点，直到找到成功的节点或者没有子节点可选 序列节点（Sequence Node）：类似于“与”运算，执行所有子节点，直到一个子节点失败。如果任何一个子节点失败，序列节点就会失败 动作节点（Action Node）：表示具体的行为或操作，例如移动、攻击、闲逛等 条件节点（Condition Node）：检查是否满足某个条件，如果条件成立则返回成功，否则返回失败 行为树的执行过程 行为树的执行是从根节点开始，逐层向下执行。它通常会根据子节点的状态（成功、失败或运行中）来决定接下来的执行路径 成功：当某个节点成功完成时，它会返回“成功”状态，行为树会继续向下执行 失败：当某个节点失败时，行为树会返回“失败”状态，选择其他路径或回溯 运行中：有些节点会持续执行，并且需要多个帧来完成，比如“寻找敌人”或“等待某个事件发生” 行为树的优势 可扩展性：行为树非常适合处理复杂的AI逻辑，可以轻松地将新的行为和决策加入树中，而不需要修改现有代码 模块化和可维护性：由于行为树的结构类似于树形，它更容易进行维护和扩展。每个节点都是独立的，只有一个明确的职责 清晰的决策过程：行为树通过层级结构表达决策逻辑，使得复杂的AI决策变得清晰易懂 Unity中行为树的实现 Unity中没有内建的行为树系统，但是可以使用一些现有的库来实现行为树，例如： Unity ML-Agents：这个包包含了一些用于训练和开发AI代理的工具，但它的行为树实现较为基础 Behaviour Designer：这是一个非常流行的Unity插件，它提供了一个图形化界面，便于设计和实现行为树 NodeCanvas：另一个插件，支持行为树、状态机等多种AI决策系统，可以很方便地设计复杂的行为树 Unity Behavior：2024年底Unity发布的免费行为树包，可视化 Unity ML-Agents GitHub ML-Agents ML-Agents (Machine Learning Agents)是由Unity官方提供的一款工具包，旨在帮助开发者在Unity中实现和训练智能体（Agents）使用机器学习算法。它为游戏和仿真环境中的AI提供了一种灵活的方式，利用强化学习、监督学习等技术来训练代理学习从环境中获得经验并做出决策 ML-Agents提供了基于PyTorch的算法实现，可以方便地使用其提供的Python API，通过强化学习、模仿学习、神经进化或任何其他方法训练智能代理 核心组件 ML-Agents的工作主要依赖于以下几个核心组件 Agent：在Unity环境中，Agent是一个学习者，它与环境进行交互并根据所接收到的奖励（reward）和惩罚（penalty）来调整其行为策略。Agent可以是游戏中的一个角色或物体（如玩家、敌人、NPC等） Environment：环境是Agent交互的地方，包含了物理世界、场景中的其他对象等。它为Agent提供观测数据并接收来自Agent的动作。一个Unity场景通常包含多个对象，例如地面、障碍物、NPC、敌人等 Brain：Brain负责决策，它是机器学习模型的实现，可以是一个简单的规则引擎或一个复杂的神经网络。以前，Brain在Unity中是一个单独的组件，现在已经被改进为训练代理的策略。ML-Agents通过Python脚本和Unity连接，进行训练和推理 Academy：Academy是整个学习过程的核心管理者，它负责协调环境的重置、训练的初始化、代理的奖励以及多个Agent之间的同步 机器学习的训练过程 ML-Agents的训练过程包括以下几个主要步骤： 设置环境：需要在Unity中创建一个合适的场景，设置Agent，并为Agent提供可观测的信息（如位置、速度、目标位置等）以及奖励机制（如击中目标、避开障碍物等）...","categories": ["笔记"],
        "tags": ["Unity","Unity System","AI"],
        "url": "/posts/2025-06-14-Behaviour-Tree/",
        "teaser": null
      },{
        "title": "Skybox",
        "excerpt":"Skybox是一种渲染技术，用于在3D场景中创建远景背景，例如天空、宇宙、城市天际线等 它本质上是一种把纹理图贴在一个立方体（或球体）内侧的技巧，玩家看不到边界，只能看到包裹在四周的“天空” Skybox的类型 Unity中支持几种常见类型的Skybox材质（Shader）： Shader 类型 描述 6 Sided 使用六张图片分别贴在立方体六个面上（一般来自 HDRI 贴图拆分） Cubemap 使用一个立方体贴图（.cubemap）进行渲染 Procedural 程序化天空（可设置太阳、云层、颜色渐变） HDRI Skybox (PBR) 用于高清真实感环境的 HDR 渲染，常用于 Unity HDRP 设置Skybox的方法 1.通过Lighting设置全局Skybox 1.创建一个Skybox材质： Assets-&gt;右键-&gt;Create &gt; Material Shader选择为Skybox/6 Sided或Skybox/Cubemap或Skybox/Procedural 2.在材质中设置贴图（textures）或参数 3.打开Window &gt; Rendering &gt; Lighting面板 4.在Environment &gt; Skybox Material中拖入刚刚的材质 这会将该Skybox应用于整个场景 2.通过摄像机设置局部Skybox（高级） RenderSettings.skybox = mySkyboxMaterial; 或为相机设置Skybox组件并赋值 Skybox与Lighting的关系 Skybox不只是视觉上的背景，它还影响了：...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Light","Render","Graphics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Skybox.html",
        "teaser": null
      },{
        "title": "Unity Invisible Trap",
        "excerpt":"Unity实际开发中，有很多“看起来正常、实则容易出错”的奇怪问题（或称为隐形陷阱） Quick List Class1 交互相关 现象 原因 解决方式 标签 按下交互键时多个箱子同时打开 范围内存在多个交互体，未判断距离 使用 OverlapSphere + 计算最近距离 输入、交互 鼠标点击物体无反应 被 UI 或透明物体挡住，Raycast 被拦截 检查 UI 的 Raycast Target 设置 输入、射线 射线打不中目标 射线层级错误或未设置 LayerMask 使用正确 Layer 和 LayerMask 输入、射线 玩家进入 Trigger 区域被触发两次 存在多个 Collider 重叠，重复触发 判断 other.gameObject 是否重复 触发器、碰撞 Class2 动画控制 现象 原因...","categories": ["Debug"],
        "tags": ["Unity","Debug Log"],
        "url": "/debug/2025/06/01/Unity-Invisible-Trap.html",
        "teaser": null
      },{
        "title": "Mask",
        "excerpt":"遮罩，用于实现遮挡效果，控制子物体的显示区域 Mask Mask用于裁剪UI子元素的显示区域，通常搭配图片、Scroll View、头像裁剪等使用 核心功能和行为 特点 说明 子物体只在 Mask 图像区域内显示 超出部分不可见（不销毁，只裁剪） 遮罩区域基于 Image 的透明度 非透明部分就是显示区域 不支持软遮罩（软边缘） 默认是硬裁剪，想要软遮罩需用 Shader 或 UIEffect 等插件 使用方法 MaskParent(Image + Mask) |___Content(Text / Image /等UI) 父物体挂Image + Mask，并设置图片为遮罩区域 子物体放置UI内容，超出遮罩图形范围会被裁剪 常见用途 场景 使用方式 ScrollView 滚动列表 Viewport 挂 Image + Mask，内容只显示在视窗中 圆形头像裁剪 使用圆形 Image + Mask 裁剪方形头像图片 进度条遮罩...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Render","Graphics","UGUI"],
        "url": "/posts/2025-06-29-Mask/",
        "teaser": null
      },{
        "title": "Texture",
        "excerpt":"Texture是图形学开发中的一个核心概念，用于在3D模型、UI、地形等物体表面显示图像或图案 它不仅包含颜色信息，还可能包含法线、位移、金属度、粗糙度等各种数据，用于实现丰富的视觉效果 基本概念 Texture本质上是一张图片，用于“贴”在模型表面，使其看起来更真实 在GPU层面，是一个二维数组，存储颜色或其他类型的数据 Texture类型 类型 描述 常见用途 Texture2D 最常见的二维纹理 UI、模型贴图、Sprite Texture3D 三维纹理 体积渲染、噪声函数 Texture2DArray 一组相同大小的2D纹理 批量渲染、材质变体 Cubemap 六面贴图的立方体 天空盒、反射 RenderTexture 可以被摄像机写入的纹理 后处理、实时渲染结果 MovieTexture（已废弃） 视频纹理 使用 VideoPlayer 替代 导入 在Unity中，图片导入后会成为Texture，可以通过Inspector查看其属性 1.Texture Type（纹理类型） Default：普通模型贴图 Normal Map：法线贴图，用于模拟表面细节 Sprite（2D and UI）：用于2D项目和UI Cursor：用于鼠标指针 Lightmap：烘焙光照图 Single Channel：单通道纹理，如Mask 2.Alpha Source 从图片的Alpha通道提取透明度信息 3.Wrap Mode（包裹模式） Repeat：超出部分重复 Clamp：超出部分拉伸边缘...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Render","Graphics"],
        "url": "/posts/2025-06-29-Texture/",
        "teaser": null
      },{
        "title": "UI Event System",
        "excerpt":"Event System是Unity UI System中的核心交互管理器，掌控了所有鼠标点击、键盘输入、触摸事件、UI导航的逻辑 Unity的Event System是一个处理用户输入事件的系统，用于发送“点击了谁”“选中了谁”之类的事件，属于UnityEngine.EventSystems命名空间 组件 用途 Event System 整个输入系统的“大脑” Input Module 输入方式模块，比如处理鼠标、键盘、手柄（你可以切换） Raycaster（挂在 Canvas 或 3D 对象上） 实际检测点击了哪个物体，比如：GraphicRaycaster, PhysicsRaycaster Event Trigger 通过Inspector可视化配置多种事件响应 Touch Input Module 输入方式模块，专门负责处理触摸输入事件，适用于手机、平板等触控设备 EventSystem会追踪以下交互： 类型 描述 接口 点击 Click 鼠标/触摸点击 UI IPointerClickHandler 拖拽 Drag 拖拽 ScrollRect、物品、滑块 IDragHandler, IBeginDragHandler, IEndDragHandler 悬停 Hover 鼠标移动到 UI 上 IPointerEnterHandler,...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","UGUI"],
        "url": "/posts/2025-06-29-UI-Event-System/",
        "teaser": null
      },{
        "title": "Unity Projects Examples",
        "excerpt":"项目管理 Quick List 状态说明： Planning：规划中，生成需求和说明文档 TODO：已立项，未开始 In Progress：开发中 Code Review：审查 Testing：测试 Bugfixing：缺陷修复 Paused：暂停 Cancelled：已取消 Archived : 已归档 标签说明： Unity GamePlay：Unity游戏逻辑实现 Unity Graph：Unity图形学实现 Primary：初级 Intermediate：中级 Advanced：进阶 High Rank：高级 项目 简介 要点 标签 状态 滚动球 BallRoll WASD控制球滚动，捡起金币 物理系统、Rigidbody、输入系统 Unity GamePlay Primary In Progress 打砖块 Breakout 实现经典打砖块玩法 2D物理、碰撞、射线检测、UI Unity GamePlay Primary Planning Flappy...","categories": ["笔记"],
        "tags": ["Unity","Project"],
        "url": "/posts/2025-06-29-Unity-Projects-Examples/",
        "teaser": null
      },{
        "title": "Engineering Mathematics",
        "excerpt":"图形开发中的常用数学 向量 定义 向量有方向和大小，比如(1, 2)、(3, 5, -1)是二维和三维向量 基本操作 加减法 向量的加减法在图形学中非常常见，它们的“意义”主要体现在空间位置变换、方向差异、运动计算等方面 几何意义 向量加法：位移的累加，从A点触发，走A向量，然后接着走B向量，到达的位置 图形学应用： 连续移动（多帧叠加移动） 合成多个力、速度方向 路径规划（导航中） 例如： Vector3 newPosition = transform.position + movementDirection * speed * Time.deltaTime; 表示当前位置 + 方向 * 速度 -&gt; 下一帧位置 向量减法：表示从一个点到另一个点的方向 向量A - B就是从点B指向点A的向量 图形学应用： 求物体之间的方向向量（例如：敌人朝玩家方向攻击） 摄像机朝向目标：target.position - camera.position 计算法线、插值、射线方向等 例如： Vector3 dir = target.position -...","categories": ["笔记"],
        "tags": ["Graphics","Mathematics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Engineering-Mathematics.html",
        "teaser": null
      },{
        "title": "Particle System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Render","Graphics"],
        "url": "/posts/2025-07-02-Particle-System/",
        "teaser": null
      },{
        "title": "Shader",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Render","Graphics"],
        "url": "/posts/2025-07-02-Shader/",
        "teaser": null
      },{
        "title": "Unity Rendering Principle",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Render","Graphics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Unity-Rendering-Principle.html",
        "teaser": null
      },{
        "title": "Attribute in Unity",
        "excerpt":"Unity中的特性用于控制Unity编译器的行为，或者用于运行时特定的逻辑 Unity中常见特性 Unity为许多常见的操作都提供了特性 SerializeField 作用：使私有字段在Unity的Inspector面板中可见。通常用于控制字段访问性，但仍希望它出现在Inspector中进行编辑 [SerializeField] private int playerHealth; HideInInspector 作用：标记字段不显示在Inspector中，但它仍然是类的成员，仍然可以在代码中使用 [HideInInspector] public int secretValur; Range 作用：为字段设置一个值的范围，通常用于浮动值或整数值。Range会在Inspector中为字段添加一个滑块 [Range(0, 100)] public int speed; Head 作用：在Inspector中为字段添加一个标题或标签，通常用于分组和提高可读性 [Header(\"Player Settings\")] public float speed; public int health; Tooltip 作用：在Inspector中为字段提供一个悬浮提示文本，鼠标悬停在字段上时显示该提示 [Tooltip(\"Player's health value\")] public float health; ExecuteInEditMode 作用：使脚本在编辑模式下运行，而不仅仅是在播放模式下运行。这对于需要在编辑模式下进行自定义操作的脚本（如编辑器扩展）非常有用 [ExecuteInEditMode] public class CustomEditorScript : MonoBehaviour { void...","categories": ["笔记"],
        "tags": ["Unity","Syntax"],
        "url": "/posts/2025-07-10-Attribute-in-Unity/",
        "teaser": null
      },{
        "title": "MonoBehaviour",
        "excerpt":"MonoBehaviour是Unity中最重要的基类之一，它是所有挂载到GameObject上的脚本的基础。每当在Unity编译器中创建也给C#脚本，并将其附加到一个GameObject时，这个脚本默认会继承MonoBehaviour MonoBehaviour提供了一些非常强大的功能，尤其是在场景生命周期和事件处理方面 MonoBehaviour继承自Behaviour Behaviour Behaviour继承自Component，是MonoBehaviour、Renderer、Collider等类的基类，它为所有脚本提供了一些通用的启用/禁用功能和调度机制 API Properties 属性 类型 描述 enabled bool 决定了当前Behaviour是否启用，当启用时，该组件会响应更新（如Update()等声明周期方法），禁用则不会 isActiveAndEnable bool 是一个只读属性，返回当前组件是否被启用并且它的GameObject也启用 示例 enable用法 void Start() { // 禁用这个脚本 this.enabled = false; } void Update() { if (this.enabled) { // 如果脚本启用，这部分代码才会执行 Debug.Log(\"Script is enabled.\"); } } enable在继承时的行为 如果你继承自Behaviour，并且禁用该组件，那么Unity会停止调用该组件的方法。但是，如果Behaviour的父类被禁用，你仍然可以控制enable属性来启用或禁用某些组件行为 启用和禁用的实际应用 控制游戏对象的行为 动态启用/禁用：你可以根据游戏的状态动态启用或禁用脚本、组件或整个GameObject 例如在游戏中按下按钮时禁用某些功能或暂停某些操作 public class GameController :...","categories": ["笔记"],
        "tags": ["Unity","Syntax","Unity Class"],
        "url": "/posts/2025-07-11-MonoBehaviour/",
        "teaser": null
      },{
        "title": "ScriptableObject",
        "excerpt":"ScriptableObject 是 Unity 中的一种特殊类型的对象，它是用于存储数据的，类似于普通的 C# 类，但它不需要与游戏对象（GameObject）关联 ScriptableObject 主要用于节省内存、提高性能和简化数据的管理。它通常用来存储可重用的数据，如配置、设置、状态信息等 基本概念 ScriptableObject 是 Unity 提供的一种特殊对象类型，允许你将数据持久化到磁盘上，并能够在编辑器中方便地进行编辑和管理。这与普通的 MonoBehaviour 类（需要附加到 GameObject 上）不同，ScriptableObject 并不依赖于场景中的任何对象 主要特点 独立于GameObject：ScriptableObject并不需要绑定到一个GameObject上，因此它可以轻松地存储全局数据 可在编辑器中编辑：可以在Unity编辑器中查看、编辑和保存ScriptableObject实例 性能优化：ScriptableObject实例是共享的，因此多个对象可以引用同一个ScriptableObject实例，这有助于减少内存消耗 数据持久化：ScriptableObject支持数据持久化，可以将其作为资源保存在磁盘上，便于管理和编辑 创建和使用 创建ScriptableObject类 要创建 ScriptableObject，首先需要继承 ScriptableObject 基类，并为它定义一个静态方法来实例化对象 ```cs using UnityEngine; [CreateAssetMenu(fileName = “NewCharacterData”, menuName = “ScriptableObjects/CharacterData”)] public class CharacterData : ScriptableObject { public string characterName; public int health;...","categories": ["笔记"],
        "tags": ["Unity","Syntax"],
        "url": "/posts/2025-07-11-ScriptableObject/",
        "teaser": null
      },{
        "title": "ScriptedImporter",
        "excerpt":"在Unity中，ScriptedImporter是一个非常强大的特性，它允许开发者自定义资源的导入流程。与默认的资源导入器（如图片、模型、音频等）不同，ScriptedImporter使开发者可以创建自己的资源类型，并通过代码控制它们在Unity中的导入方式 这个功能对于： 自定义数据格式（例如：JSON、YAML、XML、CSV、自定义二进制格式） 外部工具导出的数据（如Tiled、Spine、自定义关卡编辑器） 自定义配置文件（技能表、怪物表、剧情脚本等） 非常有用 ScriptedImporter概述 ScriptedImporter是Unity提供的一个可扩展导入器基类，可以通过继承它来实现一个支持自定义文件格式的资源导入器，所有继承自ScriptedImporter的类都能在Unity导入资源时自动调用对应的逻辑 使用方法 创建一个自定义类继承ScriptedImporter 使用[ScriptedImporter(version, extension)]注册扩展名 重写OnImportAsset方法。处理文件内容 使用AssetImporterContext注册生成的对象（如ScriptableObject） 将.youformat文件放入Assets文件夹，Unity自动导入 实例：导入.myjson格式为ScriptableObject 假设有一个JSON文件，路径Assets/Data/monster.myjson { \"name\": \"Goblin\", \"hp\": 100, \"atk\": 25 } 创建数据容器类 using UnityEngine; [CreateAssetMenu(fileName = \"MonsterData\", menuName = \"MyGame/Monster\")] public class MonsterData : ScriptableObject { public string monsterName; public int hp; public int atk; }...","categories": ["笔记"],
        "tags": ["Unity","Syntax"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/ScriptedImporter.html",
        "teaser": null
      },{
        "title": "Unity Debug",
        "excerpt":"Unity调试时游戏开发中非常重要的一环，能够帮助开发者快速定位和解决问题。Unity提供了多种调试工具和方法，主要包括日志输出、断点调试、内存和性能分析等 日志输出（Logging） 在Unity中，最常用的调试方法时通过输入日志，查看游戏运行时的状态。这些日志通常包括错误、警告和信息 class Debug Debug类是Unity中的一个非常重要的工具类，用于在开发过程中输出调试信息、记录错误、警告以及其他状态信息。它位于UnityEngine命名空间下，提供了几个常用的方法，帮助开发者在运行时查看日志、跟踪错误以及确保游戏的逻辑正确性 API Static Properties Property Description developerConsoleEnabled 允许启用或禁用开发者控制台。 developerConsoleVisible 控制开发者控制台是否可见。 isDebugBuild 检查当前是否为开发构建（Development Build）。 unityLogger 获取默认的调试日志记录器。 Static Methods Method Description Assert() 断言条件，如果条件为假，记录错误信息。 AssertFormat() 断言条件并记录格式化的错误信息。 Break() 暂停编辑器的执行，通常用于调试时暂停游戏。 CheckIntegrity() 执行当前进程的完整性检查并返回发现的错误。 ClearDeveloperConsole() 清除开发者控制台中的所有日志。 DrawLine() 在场景中绘制一条线段。 DrawRay() 在场景中绘制一条射线。 ExtractStackTraceNoAlloc() 提取当前调用栈并将其填充到未管理的缓冲区中，不会分配GC内存。 IsValidationLevelEnabled() 返回指定的验证级别是否已启用。 Log() 记录常规日志消息到控制台。 LogAssertion() 记录断言日志消息到控制台。 LogAssertionFormat() 记录格式化的断言日志消息到控制台。 LogError() 记录错误日志消息到控制台。...","categories": ["笔记"],
        "tags": ["Unity","UnityTool"],
        "url": "/posts/2025-07-12-Debug/",
        "teaser": null
      },{
        "title": "Unity Memory Profiler",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Tool"],
        "url": "/posts/2025-07-12-Unity-Memory-Profiler/",
        "teaser": null
      },{
        "title": "Unity Test Runner",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Tool"],
        "url": "/posts/2025-07-12-Unity-Test-Runner/",
        "teaser": null
      },{
        "title": "Data Driven Design",
        "excerpt":"Data-Driven Design（数据驱动设计）在Unity和游戏开发中是一种将逻辑与数据分离的编程范式，它强调用数据来控制行为和流程，而不是把所有逻辑写死在代码中 尤其在Unity这样一个组件化的引擎中，数据驱动设计可以提高灵活性、可扩展性、可复用性、可配置性，广泛用于角色配置、关卡编辑、AI行为、技能系统、特效系统、任务系统等 核心思想 传统方式 void Attack() { if (type == \"Fire\") DoFireAttack(); else if (type == \"Ice\") DoIceAttack(); } 上面是硬编码方式，未来加新类型必须改代码 数据驱动方式 { \"attackType\": \"Fire\", \"damage\": 10, \"cooldown\": 2.5 } 在代码中只需要 AttackConfig config = LoadAttackConfig(\"Fire\"); Execute(config); 在Unity中的实践方式 层级 方法 描述 数据定义 ScriptableObject / JSON / XML / Excel / CSV...","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-07-15-Data-Driven-Design/",
        "teaser": null
      },{
        "title": "Design Patterns in Game Development",
        "excerpt":"游戏开发中，设计模式是组织代码、提升可维护性、扩展性和复用性的基础工具。尤其是大型游戏项目或使用Unity、Unreal等引擎开发时，恰当使用设计模式能显著提高架构质量 基于Gof23种设计模式，常用于游戏开发的设计模式有以下几种： 分类 模式 用途 创建型 Singleton（单例） 管理全局状态（如 GameManager、AudioManager）   Factory Method（工厂方法） 创建敌人、道具、技能等实例   Prototype（原型） 克隆预制体、生成技能副本等   Object Pool（对象池） 管理大量频繁生成/销毁的对象（子弹、特效） 结构型 Component（组件） Unity核心模式（基于组合而非继承）   Decorator（装饰器） 给技能、Buff添加额外效果   Flyweight（享元） 减少内存（如重复使用同一 Mesh、材质） 行为型 State（状态机） 角色状态切换（Idle、Run、Jump、Attack）   Observer（观察者） UI监听角色属性变化、事件派发系统   Command（命令） 实现撤销/重做、输入缓存、动作序列   Strategy（策略） 多种AI行为切换，技能释放策略等   EventBus（事件总线） 解耦不同系统的事件通信（如成就、音效）   Mediator（中介者） 管理复杂交互系统（UI面板交互）   Visitor（访问者）...","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-07-15-Design-Patterns-in-Game-Development/",
        "teaser": null
      },{
        "title": "Game Architecture",
        "excerpt":"架构是一种系统级别的设计思想，决定了整个软件的结构、模块划分、通信机制、扩展性、可维护性等核心特性 架构不仅仅是技术的堆砌，更是游戏项目能否长期维护、扩展和协作的核心保障；掌握架构是从”写功能“进阶到”构建系统“的关键 为什么要关注架构： 明确模块职责：分清业务、逻辑、表现层，避免混乱代码 方便团队协作：多人开发时架构是协作的基石 提升可维护性与扩展性：功能复用、快速迭代、支持热更新 应对大型项目复杂度：系统复杂度一旦上升，架构是唯一出路 架构关注的是： 模块如何组织 模块之间怎么通信 如何扩展、复用、部署 常见游戏架构模式 MVC / MVVM / MVP 用于界面层逻辑分离 Clinet-Server 客户端与服务器通过网络通信 常用于联网对战、账号系统、排行榜等 通常配合协议层使用 EventBus 模块间解耦，低耦合通信方式 避免了直接依赖 如Unity的CSharpMessenger或自定义事件中心 ECS 数据驱动的架构模式 解耦GameObject行为逻辑 提高运行时性能，适合海量单位（如RTS游戏） 进阶架构方案 架构模式类 Layered Architecture UI层、逻辑层、数据层、网络层分离 每一层只与其相邻层通信，便于解耦 控制依赖方向，避免依赖反转 Hexagonal Architecture 核心业务逻辑与输入输出彻底解耦 适合构建高度可测试、可复用的系统（比如跨平台逻辑） Clean Architecture 将项目分为：Entities（核心）、UseCases（应用）、InterfaceAdapters（接口适配）、Framework &amp; Drivers 保持核心业务逻辑独立，UI、数据库、网络都是插件式的外围 在Unity中可以用Scriptable + 接口注入等方式实现...","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-07-15-Game-Architecture/",
        "teaser": null
      },{
        "title": "Interface Oriented Design",
        "excerpt":"“Interface Oriented Design”面向接口设计，是软件架构中的一种重要思想，它强调通过接口而非具体实现进行编程 在Unity中，面向接口设计不仅有助于降低耦合、增强可测试性，还在组件化开发、热更架构、解耦系统中发挥了非常关键的作用 定义行为接口，让对象只依赖接口而不是具体实现，从而实现解耦、扩展与测试的灵活性 Unity中的典型应用场景 控制系统分离：IInputHandler抽象输入，无论是键盘、手柄还是虚拟按钮都统一处理 热更系统对接：ILRuntime、HybridCLR下通过接口对热更代码调用，避免直接依赖反射 AI行为系统：IState、ITask、ICondition组合行为树模块 资源加载系统：IAssetLoader抽象出不同加载器(Resources、Addressables、AB) 游戏流程系统：IGameState,IFlowNode构建状态流、任务流 特效触发系统：ITrigger,IEffectReceiver解耦触发与响应 Interface的几个核心特性 明确定义“行为契约” 不依赖具体类，从而实现松耦合 便于单元测试（可用mock实现） 可实现多态性与模块化组合 更适合插件式、模块式开发 示例：输入控制器的面向接口设计 定义接口 public interface IInputHandler { Vector2 GetMoveInput(); bool IsJumpPressed(); } 两种实现方式 public class KeyboardInput : IInputHandler { public Vector2 GetMoveInput() =&gt; new Vector2(Input.GetAxis(\"Horizontal\"), Input.GetAxis(\"Vertical\")); public bool IsJumpPressed() =&gt; Input.GetKeyDown(KeyCode.Space); } public...","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-07-15-Interface-Oriented-Design/",
        "teaser": null
      },{
        "title": "Loose Coupling",
        "excerpt":"松耦合（Loose Coupling）是构建可维护、可扩展的关键原则之一，尤其在多人协作、项目复杂度高、后期需要频繁迭代更新的场景中尤为重要 定义\\ 松耦合意味着模块/组件之间尽可能少的依赖关系，彼此互不知晓或只了解对方的接口或行为 相对的，紧耦合指的是模块之间依赖彼此的具体实现或生命周期，改一个就可能影响其他多个 常见术语\\ 松耦合（Loose Coupling）：模块间依赖最小化，只通过接口/事件通信 紧耦合（Tight Coupling）：模块间强依赖，变动风险高 事件聚合器（Event Aggregator）：集中管理事件订阅/分发的工具 Service Locator：通过统一容器提供服务（注意与DI的区别） 优势\\ 优势 说明 可维护性高 修改一个模块时，不会影响其他模块 可测试性强 可以独立单元测试 可扩展性好 可以方便地添加、替换模块 降低耦合风险 避免“牵一发而动全身” Unity中常见的松耦合方式 事件/委托机制 让监听者注册感兴趣的事件，而不是让对象彼此直接调用 优点：发送者不知道接收者是谁，实现解耦 Event and Callback 接口与抽象 编程时面向接口，而不是具体类 Interface Oriented Design ScriptableObject作为配置 &amp; 消息中介 public class GameEvent : ScriptableObject { private event Action listeners;...","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-07-15-Loose-Coupling/",
        "teaser": null
      },{
        "title": "Native Layer to Script Layer",
        "excerpt":"The Bridge between Native Layer and Script Layer Unity引擎运行时，本质上是一个C++引擎内核 + C#脚本层的结构 所写的MonoBehaviour只是在C#中的一个代理对象，真正控制游戏运行的逻辑、渲染、物理等是C++层在执行 所以从UnityEngine.Object开始，Unity构建了一个“双向映射体系” C++对象（native） &lt;--- instance ID --- UnityEngine.Object（C#托管对象） ↑ ↑ 内存资源 脚本代理 从Object到MonoBehaviour的完整继承链 System.Object （纯托管） └── UnityEngine.Object （托管对象，桥梁类） ├── GameObject（托管对象） └── Component ├── Transform / Renderer / Collider...（托管对象） └── MonoBehaviour （托管行为对象，支持生命周期方法） 它们都不是普通的C#对象，它们都与C++侧的“实体”挂钩，甚至生命周期也是引擎控制的 native layer 与 script layer的绑定方式 Unity会通过一套机制将C++层对象暴露给C#层，这其中最关键的桥梁是：instance ID...","categories": ["笔记"],
        "tags": ["Unity","Underlying Principle"],
        "url": "/posts/2025-07-15-Native-Layer-to-Script-Layer/",
        "teaser": null
      },{
        "title": "Object",
        "excerpt":"Object是Unity中所有内建物体的基类，实现在UnityEngine.CoreModule中，不同于C#中的System.Object，它是托管层（C#）和原生引擎层（C++）之间的桥梁，背后绑定着Unity C++引擎层的资源句柄 Object的特点（Unity的特有行为） 引擎资源的绑定 每个UnityEngine.Object对象都对应一个C++层对象，它们通过一个instance 2D来关联，且资源的生命周期不由GC管理 比如： GameObject go = new GameObject(); Object.Destroy(go); Debug.Log(go == null); // true 这就是Object的“鬼行为”，此处的go == null并非等价于object is null Unity的“fake null”机制 fake null是Unity中一个特有的概念，通常用来描述已经销毁的对象或者已经不再有效的对象的引用。尽管对象被销毁了，但它仍然存在一个“假”引用，这个引用就像是一个假的null，它指向的对象实际上已经不再有效，但在代码层面看起来却任然是一个对象。具体来说，fake null让你能够获得一个对象引用，但该对象的属性和方法无法被正常访问，或者会返回默认值，或者不会产生期望的结果 Unity重写了==操作符 如果一个Object对象在引擎层已经被销毁（Destroy过），但C#还保有托管引用，这时候： Debug.Log(go == null); // true Debug.Log(go.Equals(null)); // false Debug.Log(ReferenceEquals(go, null)); // false 为什么需要fake null 避免NullReferenceException 在传统的编程中，如果一个对象被销毁或设为null，而你还试图访问它的属性或方法，就会引发NullReferenceException错误。在Unity中，许多对象的销毁并不立即释放内存，尤其是当销毁了一个游戏对象或组件时。为了避免频繁的null检查和避免程序崩溃，Unity引入了fake null 内存管理的优化 Unity并不是立即销毁对象，而是将其“标记”为无效，保持它的引用存在，但无法访问。这使得Unity可以更高效地管理内存。内存的实际释放通常依赖于垃圾回收器，而不是对象销毁后立即释放内存，从而避免频繁的内存分配和释放造成的性能瓶颈 fake...","categories": ["笔记"],
        "tags": ["Unity","Syntax","Unity Class"],
        "url": "/posts/2025-07-11-Object/",
        "teaser": null
      },{
        "title": "Unity Component Communication",
        "excerpt":"在Unity中，组件之间的通信是非常重要的，因为它决定了不同模块如何相互交互和协作 正确的组件通信方式可以帮助实现松耦合、易于维护和扩展的架构 GetComponent&lt;T&gt;()直接调用（显示调用） 这是Unity中最常见的方式之一，直接通过GetComponent&lt;T&gt;()获取组件实例，然后调用它的函数 它是显式的、直接的调用，没有任何抽象或间接层 由于它是强类型的，编译时可以检查类型错误，因此推荐使用 Health health = target.GetComponent&lt;Health&gt;(); if (health != null) health.TakeDamage(10); 这个例子中，GetComponent&lt;Health&gt;()获取到目标GameObject上的Health组件，并调用其TakeDamage()方法 使用方式 获取组件 GetComponent&lt;T&gt;()可以用于任何附加到GameObject上的组件。只要该组件存在，就可以通过该方法获取 var palyer = gameObject.GetComponet&lt;Player&gt;(); 调用方法 获取到组件后，直接调用该组件暴露的方法 player.TakeDamage(10); 示例 假设有一个Player组件和一个Enemy组件，Enemy需要让Player受到伤害 ```cs //在敌人脚本中 public class Enemy : MonoBehaviour { public void AttackPlayer(GameObject palyer) { // 获取Player组件 var palyerHealth = player.GetComponent(); if (pllayerHealth !=...","categories": ["笔记"],
        "tags": ["Unity","Syntax","Unity Class"],
        "url": "/posts/2025-07-15-Unity-Component-Communication/",
        "teaser": null
      },{
        "title": "Assets Import and Load",
        "excerpt":"如何将外部资源导入到Unity中并在运行时使用 资源导入 资源导入是指Unity将外部资源文件（如.fbx、.png、.mp3等）转换为引擎可以使用的内部格式。导入过程不仅包括将资源放入Unity项目中，还涉及到Unity如何优化、压缩、管理这些资源 资源导入的关键步骤 文件放置：在资源文件中放入Unity项目的Assets文件中。Unity会自动检测到这些文件，并开始导入流程 导入设置：在Inspector面板中，选中资源文件后，可以看到不同类型资源的导入设置（如Texture Type、Model Import Settings等）。不同的资源类型有不同的设置，影响最终的导入结果 对于纹理，可以设置纹理的类型（如2D或Sprite），以及压缩选项（如DXT1、DXT5等） 对于模型，可以设置模型的网格、骨骼、动画等导入选项 对于音频，可以设置压缩类型、采样率等 资源优化：Unity会根据导入设置自动处理资源，可能会进行压缩、网格简化、生成多种LOD等优化操作 Meta文件：Unity会为每个导入的资源创建一个.meta文件，用于保存资源的设置、ID等信息。这个文件对资源管理非常重要，尤其是在团队协作时，避免丢失资源链接 常见的资源类型导入 纹理（Texture）：Unity会自动识别常见的纹理文件类型，并提供压缩、过滤等选项 详见Texture 导入 模型（Models）：Unity支持多种3D模型格式，尤其是.fbx，并支持自动生成碰撞体、网格和骨骼动画 详见Model 音频（Audio）：音频文件支持不同的压缩格式，可以设置为单声道、立体声等 详见Audio System 动画（Animations）：可以通过Animator系统来管理和播放 详见Animation System 资源加载 在游戏运行时，如何高效地加载和管理这些已经导入的资源至关重要，尤其是在需要加载大量资源时。Unity提供了多种加载资源的方式，以便优化性能和内存使用 class Resources Resources类在Unity中提供了一种动态加载资产的方式，允许你访问存储在特定文件夹中的对象，如Texture，Prefab，Audio Clips等。这些文件必须存放在项目中名为“Resources”的文件夹内 存放资产到Resources文件夹 希望在运行时动态加载的所有资产必须存放在名为“Resources”的文件夹中。你可以在Assets目录下创建多个“Resources”文件夹 存放在这些文件夹中的资产不会通过Inspector自动引用，因此Unity无法对它们进行优化，直接包含在最终构建中 加载方式 Resources.Load()和Resources.FindObjectsOfTypeAll()函数可以用来加载和访问资产 Resouces.Load()：按路径加载单个资产 Resouces.FindObjectsOfTypeAll()：用于查找并访问场景中或Resources文件夹下的所有对象 使用路径加载资产时，所有存放在Resources文件夹中的资产会被纳入构建中，这可能导致构建大小增加 构建优化问题 通常，Unity 会通过 Inspector 曝露对资产的引用，这样在构建时它可以自动计算出哪些资产是实际使用的，从而避免不必要的资源被包含在最终构建中。但如果使用 Resources 文件夹，Unity 无法做到这一点，因此所有资产都会被包含在构建中，即使你没有使用它们 不推荐过度使用路径加载 使用路径名来加载资产会导致代码不那么可复用，因为脚本会硬编码依赖于资产存放的位置。这不如通过Inspector暴露的引用直观和易于维护...","categories": ["笔记"],
        "tags": ["Unity","Asset"],
        "url": "/posts/2025-07-18-Assets-Import-and-Load/",
        "teaser": null
      },{
        "title": "Unity Packaging and Building",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Build"],
        "url": "/posts/2025-07-18-Unity-Packaging-and-Building/",
        "teaser": null
      },{
        "title": "Probability and Randomness in Games",
        "excerpt":"概率和随机是紧密相关的概念，它们常用于决定事件的发生与结果；在大多数游戏中，概率和随机数的使用涉及到随机事件的模拟，例如： 伤害计算 随机事件发生 物品掉落 Rouge Like 抽牌，掷骰子 AI决策和行为树 Slots 装备合成或转化 Mystery Box Like 物理模拟和碰撞检测 它们的发生的概率是相等或不等的，数值是随机的或伪随机的 随机和概率在非强竞技场景下的应用非常广泛，或增加了游戏性、或提高了游戏性能、或旨在提升玩家游戏时长、或旨在增加游戏营收，由此产生的效益和收益无疑是巨大的 从游戏实现到数值设计，从具体实现到哲学抽象 概率与随机的定义 概率是一种数学概念，指的是某件事情发生的可能性，通常用0到1之间的数字表示 P = 0：事件不可能发生 P = 1：事件一定会发生 P = 0.5：事件发生和不发生的概率相同 随机是指一种无法确定的行为或过程，结果是不可预测的，但概率可以帮助对其结果进行量化和描述 具体实现 游戏中概率的实现方式通常取决于具体需求，以下是常见的几种实现 随机数生成器（Random Number Generator, RNG） 这是最常见的做法，通过随机数来模拟概率事件，可以用来生成各种各样的结果，如掉落物品、敌人AI行为、事件触发等 均匀分布（Uniform Distribution） 对于简单的概率，可以通过生成一个范围内的随机数，判断其是否满足概率条件 例如，假设在0~1之间生成一个随机数r，并且下那个要这个事件发生的概率为P，则 float r = Random.Range(0f, 1f); float P = 0.7f; if...","categories": ["Game Principle"],
        "tags": ["Game","Random"],
        "url": "/posts/2025-07-21-Probability-and-Randomness-in-Games/",
        "teaser": null
      },{
        "title": "Unity Editor Extensions",
        "excerpt":"Unity编辑器扩展就是用C#编写一些工具或界面，去增强Unity自带的编辑器功能，从而让开发流程更高效、更可控 它的本质是：利用UnityEditor API在编辑模式下定制Inspector、菜单、窗口、场景视图、资源导入等功能 基础概念 运行时脚本 vs 编辑器脚本 运行时脚本：放在普通文件夹，打包后在游戏里运行 编辑器脚本：放在Editor文件夹下，只在编辑器运行，不会打包进游戏 编辑器脚本需要引用UnityEditor命名空间（注意它在运行时不可用） 目的 节省重复操作时间（比如批量设置材质、自动生成Prefab） 提供更直观的可视化编辑界面 增强调试能力（自定义日志、场景可视化） 常见扩展方式 自定义Inspector 让某个组件在Inspector面板中显示定制的界面 using UnityEditor; using UnityEngine; [CustomEditor(typeof(MyComponent))] public class MyComponentEditor : Editor { public override void OnInspectorGUI() { var myComp = (MyComponent)target; EditorGUILayout.LabelField(\"自定义字段\"); myComp.health = EditorGUILayout.IntSlider(\"生命值\", myComp.health, 0, 100); if (GUILayout.Button(\"重置生命值\")) myComp.health = 100; //...","categories": ["笔记"],
        "tags": ["Unity","Editor","Tool"],
        "url": "/posts/2025-07-22-Unity-Editor-Extensions/",
        "teaser": null
      },{
        "title": "Burst Complier",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Complie","High Performance"],
        "url": "/posts/2025-08-02-Burst-Complier/",
        "teaser": null
      },{
        "title": "DOTS",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Technology Stack","High Performance"],
        "url": "/posts/2025-08-02-DOTS/",
        "teaser": null
      },{
        "title": "Dependency Injection",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-08-02-Dependency-Injection/",
        "teaser": null
      },{
        "title": "ECS",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-08-02-ECS/",
        "teaser": null
      },{
        "title": "Event Bus/Aggregator",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-08-02-Event-Bus-Event-Aggregator/",
        "teaser": null
      },{
        "title": "Hot Update",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Hot Update"],
        "url": "/posts/2025-08-02-Hot-Update/",
        "teaser": null
      },{
        "title": "Job System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","MultiThreading","High Performance"],
        "url": "/posts/2025-08-02-Job-System/",
        "teaser": null
      },{
        "title": "Mono and IL2CPP",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Complie"],
        "url": "/posts/2025-08-02-Mono-and-IL2CPP/",
        "teaser": null
      },{
        "title": "Service Locator",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Architecture"],
        "url": "/posts/2025-08-02-Service-Locator/",
        "teaser": null
      },{
        "title": "Algorithms in Unity GameDevelopment",
        "excerpt":"        寻路算法（Pathfinding Algorithms）            碰撞检测和物理算法            AI行为            图形学相关算法            动画算法            图像和纹理算法            排序与搜索算法            资源管理与优化            摄像机控制            多线程与异步处理      ","categories": ["笔记"],
        "tags": ["Unity","GameDevelop","Algorithm"],
        "url": "/posts/2025-08-03-Algorithms-in-Unity-Game-Dev/",
        "teaser": null
      },{
        "title": "Unity Programming Model and Technology Stack",
        "excerpt":"传统编程模型和技术栈 Unity的传统编程模型和技术栈主要依赖于面向对象编程（OOP），并结合了事件驱动和组件化编程模型 组件化编程模型（Component-based Programming） Unity最核心的编程模型是组件化（Component-based）设计，它来源于“实体-组件-系统（ECS）”思想。Unity中的每个游戏对象（GameObject）是一个容器，能够附加多个组件（Component）。这些组件决定了该游戏对象的行为和属性 GameObject：是Unity中的基础对象，它通常代表场景中的一个物体或实体 Component：附加在GameObject上的功能块，通常负责管理物体的某一方面的行为，比如渲染、物理、输入处理等 这种设计模式强调解耦，每个功能都被划分为一个独立的组件，增加了代码的复用性和可维护性 MonoBehaviour 类 MonoBehaviour 在Unity中，所有游戏逻辑通常都是继承MonoBehaviour类来实现的。MonoBehaviour提供了一些生命周期函数，用于管理游戏对象的行为。这些函数包括 Start()：初始化，游戏对象激活时调用一次 Update()：每帧调用，用于执行逻辑更新 FixedUpdate()：每个物理模拟步长调用，适合用于物理计算 OnCollisionEnter()：物理碰撞使用 OnDestroy()：对象销毁时调用 这些生命周期函数是Unity编程模型的核心，开发者通过重写这些函数来实现游戏对象的行为 事件驱动编程 Unity传统编程中有大量事件驱动机制，尤其是在用户输入和UI交互方面 UI系统：Unity提供了自己的UI系统，最常见的是UI.Button和UI.Slider等UI组件，它们通过事件监听和回调处理用户输入 C#事件和委托：Unity的编程中也广泛使用C#的事件和委托来实现对象间的通信，例如当一个玩家触发某个动作时，其他对象可能需要响应这个事件。Event、Action和UnityEvent是最常用的方式 协程（Coroutines） Unity提供了协程来简化时间和异步操作的管理。协程可以在多个帧之间执行，允许开发者编写类似于阻塞的代码，但是不会阻塞主线程 例如，等待一段时间再执行某个操作，或逐步改变某个属性 IEnumerator ChangeColorOverTime() { float duration = 2f; float timeElapsed = 0f; Color startColor = myObjectRenderer.material.color; Color targetColor = Color.red; while (timeElapsed &lt; duration) { myObjectRenderer.material.color...","categories": ["笔记"],
        "tags": ["Unity","GameDevelop","Algorithm"],
        "url": "/posts/2025-08-11-Unity-Programming-Model-and-Technology-Stack/",
        "teaser": null
      },{
        "title": "Behaviour Designer",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Packages","AI"],
        "url": "/posts/2025-08-12-Behaviour-Designer/",
        "teaser": null
      },{
        "title": "ML Agents",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Packages","AI"],
        "url": "/posts/2025-08-12-ML-Agents/",
        "teaser": null
      },{
        "title": "Unity Behavior",
        "excerpt":"Manual Behavior  ","categories": ["笔记"],
        "tags": ["Unity","Unity Packages","AI"],
        "url": "/posts/2025-08-12-Unity-Behavior/",
        "teaser": null
      },{
    "title": "About",
    "excerpt":"Do not define me, that is UB!   博客内容仅用于学习，如有侵权，请联系删除  ","url": "http://localhost:4000/about/"
  },{
    "title": "Blog",
    "excerpt":" ","url": "http://localhost:4000/blog/"
  },{
    "title": "Categories",
    "excerpt":" ","url": "http://localhost:4000/categories/"
  },{
    "title": "Tags",
    "excerpt":" ","url": "http://localhost:4000/tags/"
  }]
