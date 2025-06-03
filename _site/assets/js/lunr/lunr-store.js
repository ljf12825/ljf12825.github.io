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
        "excerpt":"在 Unity 中，GameObject 是游戏中所有对象的基础实体。可以理解为 Unity 世界中一切可见或不可见物体的“容器”，它本身没有实际行为或外观，而是通过添加各种组件（Component）来赋予其功能。 一、GameObject的核心概念 它是Unity中一切实体的基础类 没有组件的GameObject是一个空物体 所有可见（如角色、道具、地形）或不可见（如相机、灯光、空容器）的对象，都是GameObject或其派生 二、GameObject的结构与组成 一个GameObject至少包含一个组件：Transform 1.必备组件：Transform 控制GameObject的位置、旋转、缩放 组成了Unity的场景层级结构（父子关系） 所有GameObject都必须有Transform，不能移除 transform.position = new Vector3(0, 1, 0); transform.Rotate(Vector3.up, 90); 2.常见组件 组件 作用 MeshRenderer 渲染模型表面 Collider 物理碰撞检测 Rigidbody 让 GameObject 参与物理计算 Animator 控制动画状态机 AudioSource 播放声音 Camera 摄像头视角 Light 光源 自定义脚本 实现逻辑行为（继承自 MonoBehaviour） 3.添加组件方式 在Inspector面板中点击”Add Component” 代码中：...","categories": ["笔记"],
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
        "title": "Light",
        "excerpt":"Unity中的Light是照亮场景和物体的核心组件，也是实现逼真视觉效果的关键之一。合理使用光源可以极大提升游戏画面质量，同时也对性能有重要影响 Light决定了场景中物体如何被照亮、阴影如何生成、氛围如何表现 Light的类型（Type） Unity中有4种主要光源类型： 类型 描述 用途示例 Directional Light 没有位置，只有方向，光线平行 太阳光、月光 Point Light 从一点向所有方向发散 灯泡、火把 Spot Light 从一点向特定方向的锥体发散 手电筒、聚光灯 Area Light（仅用于烘焙） 从一个平面区域发光 霓虹灯、窗户光线（仅用于静态对象） 光照模式（Mode） Unity光源有三种模式，关系到实时性和性能： 模式 描述 用途 Realtime 每帧计算光照，支持动态物体 动态灯光，如手电筒、角色法术 Mixed 静态对象使用烘焙，动态对象使用实时光 综合表现和性能 Baked 所有光照预先烘焙，不支持动态阴影 静态场景，如建筑、地形 Light属性 在Unity中，使用UnityEngine.Light类可以动态修改光源的各种属性，实现如灯光变化、闪烁、开关、颜色变化等效果 Light light = GetComponent&lt;Light&gt;(); namespace:UnityEngine Behaviour -&gt; Componenet -&gt; Object 常用字段与属性...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Light","Render","Graphics"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/29/Light.html",
        "teaser": null
      },{
        "title": "Prefab System",
        "excerpt":"Unity提供Prefab这种非常强大的机制，用来复用游戏对象，让开发更高效、项目更模块化 Prefab就是一个可以重复使用的GameObject模板 什么是Prefab Prefab是你在场景里创建好的GameObject（可以包含模型、脚本、组件、子物体等），然后把它拖到项目窗口中生成的资源文件。 之后就可以随时从Project中把这个模板拖入场景，生成和原始一样的对象 Prefab的创建和使用 创建 1.在Hierarchy中创建好一个GameObject及其组件和子对象 2.拖拽到Project视图中，Unity自动保存为.prefab 3.你可以删除场景中的对象，只保留Project中的预制体 使用 直接拖到场景中 Instantiate()动态生成 void Shoot() =&gt; Instantiate(bulletPrefab, transform.position, transform.rotation); Prefab特点 特性 描述 模板复用 一次创建，多次使用 改动同步 修改 Prefab，会自动同步所有实例 支持嵌套 Prefab 可以包含另一个 Prefab 可分离 Prefab 实例可以局部修改，不影响原始 Prefab Prefab实例与原型的关系 当你把Prefab拖入场景，它会成为Prefab实例，你可以 完全跟随原始Prefab 局部Override某些属性 解除连接（Unpack） 图标颜色 状态 蓝色立方体 与原 Prefab 保持连接 灰色立方体 已经解除连接（Unpacked） Prefab编辑方式 1.Open...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/31/Prefab.html",
        "teaser": null
      },{
        "title": "Material",
        "excerpt":"Unity中的Material是用来定义一个物体外观的核心组件，它将Shader与各种Texture和属性值绑定到一起，决定了一个对象在场景中如何表现 Material的基本构成 Material包括： 1.Shader 决定了材质的渲染方式和它所支持的属性 常用Shader有： Standard：支持金属、粗糙度工作流 URP/Lit(Universal Render Pipeline)专用 HDRP/Lit(High Definition Render Pipeline)专用 Unlit：不受光照影响，用于UI、特效等 自定义Shader 2.Texture 常见类型： Albedo（基础颜色贴图） Normal Map（法线贴图，增加表面细节） Metallic Map / Roughness Map（金属度/粗糙度贴图） Emission Map（自发光贴图） Occlusion Map（遮蔽贴图） 3.属性值 颜色、金属度、粗糙度、透明度 创建和使用Material 创建材质 右键 -&gt; Create -&gt; Material 然后可以给材质命名，设置颜色、贴图等属性 应用材质 方式1：拖动到物体上 方式2：通过代码赋值 Renderer renderer = GetComponent&lt;Renderer&gt;(); renderer.material = myMaterial;...","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/05/31/Material.html",
        "teaser": null
      },{
        "title": "Import Assets",
        "excerpt":"Unity支持多种格式的资源文件，并能自动识别并进行初步处理 资源导入基本流程 1.将资源文件拖入Assets目录中（Unity会自动导入） 2.在Inspector面板中查看导入设置 3.配置相关参数，比如压缩方式、贴图类型、是否生成碰撞体等 4.使用资源（拖到场景、作为材质贴图、挂到AudioSource等） 模型 支持格式 .fbx推荐 .obj .dae（Collada） .blend（需要Blender） 导入流程 1.拖拽.fbx文件到Assets文件夹 2.选中模型文件，查看Inspector的导入设置 Scale Factor：缩放（一般保持默认） Import Animations：是否导入动画 Import Materials：是否导入材质 Generate Colliders：是否自动生成碰撞体 导入后组成 Model: 3D网格 Rig（如果有骨骼）：用于动画绑定 Animation：包含的动画片段 Materials：自动生成或关联的材质 贴图 支持格式 .png、.jpg、.tga、.psd（支持图层）等 导入流程 1.拖入图片文件 2.在Inspector中设置： sRGB（Color Texture）：颜色贴图用，法线贴图需取消勾选 Alpha Is Transparency：如果使用透明通道 Wrap Mode：Repeat（平铺）或Clamp（拉伸） Filter Mode：Bilinear、Trilinear、Point（像素风） Compression：高压缩（小体积）还是高质量（清晰） Texture Type: Default（通用） Sprite（用于UI） Normal...","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Import-assets.html",
        "teaser": null
      },{
        "title": "Layer",
        "excerpt":"在Unity中，Layer是要给非常重要的系统 它主要用于： 控制物体的渲染与相机的可见性 控制物理碰撞（配合Layer Collision Matrix） 通过脚本进行物体分类和筛选 什么是Layer Layer是给GameObject打的“标签”，但它和Tag不一样，Layer是用于功能性控制的，特别在： 摄像机的Culling Mask 光照影响（Light Culling） 物理碰撞（Physics Layer） 射线检测（Raycast Layer） Layer的使用场景 1.摄像机视野控制（Culling Mask） 在Camera组件中，你可以设置 Culling Mask -&gt; 选择哪些Layer可以被该相机看到 用途： UI相机只看UI层 小地图相机只看敌人层 分屏镜头每个只看自己的部分 2.物理碰撞控制（Layer Collision Matrix） 在菜单中： Edit -&gt; Project Settings -&gt; Physics 你可以看到Layer Collision Matrix，它控制： 哪些Layer和哪些Layer能发生物理碰撞 用途： 玩家层与敌人层可以碰撞，但不和自身碰撞 子弹不撞自己 角色不被UI的Collider打断 3.射线检测 可以通过Layer来控制射线是否命中某个对象 int...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Layer.html",
        "teaser": null
      },{
        "title": "Tag",
        "excerpt":"在Unity中，Tag是用来标记和分类GameObject的一种轻量级方法，主要用于在代码中查找和判断物体的类型或身份 Tag的核心作用 功能 示例 分类物体 Player、Enemy、Item、UI 等 逻辑判断 判断一个物体是不是玩家 查找特定对象 GameObject.FindWithTag() 触发器/碰撞器逻辑判断 if (other.CompareTag(\"Enemy\")) Tag的使用方法 1.设置Tag 1.选中一个 GameObject 2.Inspector 面板 → 上方的 “Tag” 下拉菜单 3.如果没有想要的标签 → 点击 Add Tag… → 添加一个新的字符串 4.回到物体，设置为刚才新建的 Tag 注意： Tag是字符串类型，但Unity会为你管理列表，不用硬编码 2.使用Tag查找对象 GameObjec player = GameObject.FindWithTag(\"Player\"); 或者查找多个对象： GameObject[] enemies = GameObejct.FindGameObjectsWithTag(\"Enemy\"); 3.在触发器或碰撞中判断Tag void OnTriggerEnter(Collider other) =&gt;...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Tag.html",
        "teaser": null
      },{
        "title": "Component",
        "excerpt":"Component是附加在GameObject上的功能模块，每个组件都提供了某种行为或属性，组成了游戏对象的功能 组件的特性 特性 描述 附加性 可以给 GameObject 添加多个组件。 组合式设计 Unity 的架构是组合优于继承，一个 GameObject 的行为是由多个组件组合而成的。 可视化编辑 在 Unity Inspector 面板中可以直接添加、删除或修改组件。 脚本组件 你写的 C# 脚本，本质上也是组件，继承自 MonoBehaviour。 在代码中使用组件 //获取组件 Rigidbody rb = GetComponenet&lt;Rigidbody&gt;(); //添加组件 gameObject.AddComponenet&lt;AudioSource&gt;(); 在Unity中，组件之所以能起作用，是因为Unity引擎在运行时会自动调度和执行组件的逻辑，这个背后是Unity引擎的核心“组件驱动”架构 简单理解：Unity的工作循环 + 组件系统 1.GameObject只是容器 2.组件发挥功能 3.Unity引擎每一帧都会遍历所有激活的GameObject，调度它们的组件做该做的事 Unity组件驱动架构 Unity组件 Category Component Name Audio Chorus Filter   Distortion Filter  ...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Component.html",
        "teaser": null
      },{
        "title": "Rigibody",
        "excerpt":"在Unity中，Rigidbody是一个用于实现物理行为的组件，它允许你的游戏对象受力、重力、碰撞等真实世界的物理规则影响 Rigidbody的基本功能 当你给一个GameObject添加Rigibody后，它具备以下能力： 功能 描述 重力 会受到 Unity 世界的重力影响。 力作用 可通过 AddForce() 施加力。 碰撞 可与带有 Collider 的物体发生物理碰撞。 移动 可通过物理方式（而不是直接修改 transform）移动。 RigidbodyPanel 基础物理参数 参数名 作用 默认值 建议用法 Mass（质量） 控制惯性、碰撞反应 1 设为真实世界比例（如车 1000、人 70） Drag（线性阻力） 模拟空气/水的阻力（减速） 0 移动物体逐渐停止，可设为 1~5 Angular Drag（角阻力） 减缓旋转速度 0.05 防止物体无限旋转，常设为 0.1~0.5 Automatic Center Of Mass（自动质心，默认为true） Unity会根据物体的形状（Collider）和质量分布，自动计算Rigidbody的中心点 通常质心在物体的几何中心，但加多个Collider后可能偏移 这是大多数情况下推荐的方式，因为它物理上是合理的...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Rigidbody.html",
        "teaser": null
      },{
        "title": "Scripts",
        "excerpt":"Unity脚本就是你编写的C#类，它控制游戏中物体的行为、交互、动画、输入、碰撞、UI等逻辑 脚本类型 Unity中的脚本根据其用途可以分为3类： 特性 MonoBehaviour ScriptableObject 纯 C# 类 是否可挂载 ✅ 可以挂载到 GameObject ❌ 不行 ❌ 不行 生命周期函数 ✅ 有 Start、Update 等 ❌ 没有 ❌ 没有 是否能序列化 ✅ 支持 ✅ 支持 ❌ 默认不支持 支持协程 ✅ StartCoroutine() ❌ 不支持 ❌ 不支持 使用场景 行为脚本，控制对象 数据容器，可复用资源配置 工具类、算法类等逻辑单元 MonoBehaviour的派生类 必须挂载在场景中的GameObject上 用于控制逻辑、角色行为、输入响应等 有生命周期函数 ScriptableObject是数据容器 轻量级对象，不需要挂载，常用于数据复用（如技能表、配置表）...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Scripts.html",
        "teaser": null
      },{
        "title": "Unity Componenet-Driven Architecture",
        "excerpt":"Unity是如何驱动组件系统的 从运行架构、组件调度机制、底层实现三个方面来深度剖析 Unity的运行架构（经典GameObject-Component模型） Unity引擎的架构是 “组合优于继承” 的典范： GameObject：游戏世界中所有对象的容器 Component：挂在GameObject上的功能模块 MonoBehaviour：Unity脚本组件的基类，支持生命周期函数 //伪代码结构 class GameObject { List&lt;Component&gt; components; } class Component { GameObject gameObject; } Unity是如何调度组件的生命周期的 Unity在每一帧都会按以下顺序做一次组件调度遍历： For ever active GameObject: For every enable Component: If first frame: Call Awake() Call Start() Run physics: Call FixedUpdate() Handle rendering: Transform -&gt; Camera -&gt; Renderer...","categories": ["笔记"],
        "tags": ["Unity","Unity Engine"],
        "url": "/posts/2025-06-02-Unity-Architecture/",
        "teaser": null
      },{
        "title": "Coroutine",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Engine"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Coroutine.html",
        "teaser": null
      },{
        "title": "Event System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Event-System.html",
        "teaser": null
      },{
        "title": "FSM",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/FSM.html",
        "teaser": null
      },{
        "title": "Gizmos",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Gizmos.html",
        "teaser": null
      },{
        "title": "Input System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Input-System.html",
        "teaser": null
      },{
        "title": "Multithread",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Multithread.html",
        "teaser": null
      },{
        "title": "Physics System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-03-Physics-System/",
        "teaser": null
      },{
        "title": "Unity Build-in Types",
        "excerpt":"常见Unity内建类型（按用途分） 1.空间/几何类型（Transform相关） 类型 说明 Vector2, Vector3, Vector4 表示二维/三维/四维向量 Quaternion 四元数，表示旋转 Matrix4x4 4×4 矩阵，常用于转换 Bounds 包围盒（中心+尺寸） Ray, RaycastHit 射线检测相关类型 Plane 表示一个无限平面 Rect 二维矩形区域 Color, Color32 表示颜色（线性空间和 sRGB） Vector2 3 4 类型 维度 常见用途 Vector2 2D 向量 (x, y) UI 坐标、2D 游戏、纹理坐标 Vector3 3D 向量 (x, y, z) 位置、速度、方向、缩放 Vector4 4D 向量...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Unity-Build-in-Types.html",
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
