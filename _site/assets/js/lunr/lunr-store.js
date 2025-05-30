var store = [{
        "title": "About",
        "excerpt":"        You want to know who I am?  It’s UB.            博客内容仅用于学习，如有侵权，请联系删除       &lt;-  &lt;-  &lt;-  ","categories": [],
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
        "excerpt":"在Unity中，Camera是游戏中视角呈现的核心组件，它决定了玩家从哪里、以什么方式看到游戏世界 Projection（投影模式） 模式 用途 特点 透视摄像机（Perspective） 3D 游戏 有近大远小的透视效果，真实 正交摄像机（Orthographic） 2D 游戏、UI 无透视变形，适合像素风或 UI 系统 camera.orthographic = true; //开启正交模式 camera.orthographicSize = 5f; //视野高度一半 Clear Flag（清除模式） ClearFlag 模式 描述 Skybox 使用当前 Skybox 作为背景 Solid Color 使用指定背景颜色 Depth Only 仅清除深度缓冲区（常用于叠加 UI） Nothing 什么都不清除（很少用） 视口渲染（rect） camera.rec = new Rect(x, y, w, h); (x,...","categories": ["笔记"],
        "tags": ["Unity","Unity Componenet"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/Camera.html",
        "teaser": null
      },{
        "title": "GameObject",
        "excerpt":"GameObject 在 Unity 中，GameObject 是游戏中所有对象的基础实体。可以理解为 Unity 世界中一切可见或不可见物体的“容器”，它本身没有实际行为或外观，而是通过添加各种组件（Component）来赋予其功能。 一、GameObject的核心概念 它是Unity中一切实体的基础类 没有组件的GameObject是一个空物体 所有可见（如角色、道具、地形）或不可见（如相机、灯光、空容器）的对象，都是GameObject或其派生 二、GameObject的结构与组成 一个GameObject至少包含一个组件：Transform 1.必备组件：Transform 控制GameObject的位置、旋转、缩放 组成了Unity的场景层级结构（父子关系） 所有GameObject都必须有Transform，不能移除 transform.position = new Vector3(0, 1, 0); transform.Rotate(Vector3.up, 90); 2.常见组件 组件 作用 MeshRenderer 渲染模型表面 Collider 物理碰撞检测 Rigidbody 让 GameObject 参与物理计算 Animator 控制动画状态机 AudioSource 播放声音 Camera 摄像头视角 Light 光源 自定义脚本 实现逻辑行为（继承自 MonoBehaviour） 3.添加组件方式 在Inspector面板中点击”Add Component”...","categories": ["笔记"],
        "tags": ["Unity","GameObject"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/GameObject.html",
        "teaser": null
      },{
        "title": "Transform",
        "excerpt":"Transform是Unity中控制物体位置、旋转、缩放和父子层级关系的核心组件 一、什么是Transform Transfrom是每个GameObject都自带的核心组件，主要负责： 位置（Position） 旋转（Rotation） 缩放（Scale） 父子关系（Hierarchy） 可以理解为每个物体在三维世界中的“坐标轴和局部空间信息”。 二、Transform的重要属性和区别 **1.position和localPosition 属性名 含义 示例用途 position 世界坐标（绝对位置） 物体在整个场景中的位置 localPosition 本地坐标（相对于父物体的位置） 子物体相对于父物体的偏移 **2.rotation和localRotation 属性名 含义 类型 rotation 世界旋转 Quaternion localRotation 相对父物体的旋转 Quaternion transform.rotation = Quaternion.Euler(0, 90, 0); //世界旋转 transform.localRotation = Quaternion.idetity; //本地旋转重置 3.localScale 表示对象自身的缩放 注意：缩放不会自动传递到position，但会影响渲染尺寸和碰撞盒 transform.localScale = new Vector3(2, 2, 2); //放大两倍 三、父子层级结构*...","categories": ["笔记"],
        "tags": ["Unity","Unity Componenet"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/Transform.html",
        "teaser": null
      },{
        "title": "Unity编辑器窗口",
        "excerpt":"   A:Toolbar工具栏，用于访问Unity账户和云服务。它还包括播放模式、撤销历史记录、Unity搜索、图层可见性菜单和编译器布局菜单等控件。   B:Hierarchy层级窗口，以层级形式呈现场景中每个游戏对象。场景中的每个item在hierarchy中都有一个entry，所以这两个窗口本质上是相互关联的。层级结构揭示了各个GameObject之间的连接结构。   C:Game游戏视图，通过场景中的摄像机模拟最终渲染游戏的外观效果。   D:Scene场景视图，可视化编辑和导航，可以显示3D或2D。   E:Overly叠加层包含用于操作场景视图及其中的游戏对象的基本工具。可以添加自定义叠加层来改进工作流程。   F:Inspector检查器，查看和编辑当前选定的GameObject的所有属性。   G:Project项目窗口，可以显示在项目中使用的资源库。   H:Statusbar状态栏提供有关Unity进程的通知，以及快速访问相关工具和设置。  ","categories": ["笔记"],
        "tags": ["Unity","Unity Editor"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/UnityEditorWindow.html",
        "teaser": null
      },{
        "title": "Prefab System",
        "excerpt":"Unity提供Prefab这种非常强大的机制，用来复用游戏对象，让开发更高效、项目更模块化  Prefab就是一个可以重复使用的GameObject模板  ","categories": ["笔记"],
        "tags": ["Unity，Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/28/Prefab.html",
        "teaser": null
      },{
        "title": "Light",
        "excerpt":"Unity中的Light是照亮场景和物体的核心组件，也是实现逼真视觉效果的关键之一。合理使用光源可以极大提升游戏画面质量，同时也对性能有重要影响 Light决定了场景中物体如何被照亮、阴影如何生成、氛围如何表现 Light的类型（Type） Unity中有4种主要光源类型： 类型 描述 用途示例 Directional Light 没有位置，只有方向，光线平行 太阳光、月光 Point Light 从一点向所有方向发散 灯泡、火把 Spot Light 从一点向特定方向的锥体发散 手电筒、聚光灯 Area Light（仅用于烘焙） 从一个平面区域发光 霓虹灯、窗户光线（仅用于静态对象） 光照模式（Mode） Unity光源有三种模式，关系到实时性和性能： 模式 描述 用途 Realtime 每帧计算光照，支持动态物体 动态灯光，如手电筒、角色法术 Mixed 静态对象使用烘焙，动态对象使用实时光 综合表现和性能 Baked 所有光照预先烘焙，不支持动态阴影 静态场景，如建筑、地形 Light属性 在Unity中，使用UnityEngine.Light类可以动态修改光源的各种属性，实现如灯光变化、闪烁、开关、颜色变化等效果 Light light = GetComponent&lt;Light&gt;(); namespace:UnityEngine Behaviour -&gt; Componenet -&gt; Object 常用字段与属性...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Light","Render","Graphics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/29/Light.html",
        "teaser": null
      },{
    "title": "About",
    "excerpt":"        You want to know who I am?  It’s UB.            博客内容仅用于学习，如有侵权，请联系删除       &lt;-  &lt;-  &lt;-  ","url": "http://localhost:4000/about/"
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
