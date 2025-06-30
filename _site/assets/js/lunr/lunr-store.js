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
        "excerpt":"在Unity中，Camera是游戏中视角呈现的核心组件，它决定了玩家从哪里、以什么方式看到游戏世界 Projection（投影模式） 模式 用途 特点 透视摄像机（Perspective） 3D 游戏 有近大远小的透视效果，真实 正交摄像机（Orthographic） 2D 游戏、UI 无透视变形，适合像素风或 UI 系统 camera.orthographic = true; //开启正交模式 camera.orthographicSize = 5f; //视野高度一半 Clear Flag（清除模式） ClearFlag 模式 描述 Skybox 使用当前 Skybox 作为背景 Solid Color 使用指定背景颜色 Depth Only 仅清除深度缓冲区（常用于叠加 UI） Nothing 什么都不清除（很少用） 视口渲染（rect） camera.rec = new Rect(x, y, w, h); (x,...","categories": ["笔记"],
        "tags": ["Unity","Unity Component"],
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
        "tags": ["Unity","Unity Component"],
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
        "title": "Import Assets",
        "excerpt":"Unity支持多种格式的资源文件，并能自动识别并进行初步处理 资源导入基本流程 1.将资源文件拖入Assets目录中（Unity会自动导入） 2.在Inspector面板中查看导入设置 3.配置相关参数，比如压缩方式、贴图类型、是否生成碰撞体等 4.使用资源（拖到场景、作为材质贴图、挂到AudioSource等） 模型 支持格式 .fbx推荐 .obj .dae（Collada） .blend（需要Blender） 导入流程 1.拖拽.fbx文件到Assets文件夹 2.选中模型文件，查看Inspector的导入设置 Scale Factor：缩放（一般保持默认） Import Animations：是否导入动画 Import Materials：是否导入材质 Generate Colliders：是否自动生成碰撞体 导入后组成 Model: 3D网格 Rig（如果有骨骼）：用于动画绑定 Animation：包含的动画片段 Materials：自动生成或关联的材质 贴图 支持格式 .png、.jpg、.tga、.psd（支持图层）等 导入流程 1.拖入图片文件 2.在Inspector中设置： sRGB（Color Texture）：颜色贴图用，法线贴图需取消勾选 Alpha Is Transparency：如果使用透明通道 Wrap Mode：Repeat（平铺）或Clamp（拉伸） Filter Mode：Bilinear、Trilinear、Point（像素风） Compression：高压缩（小体积）还是高质量（清晰） Texture Type: Default（通用） Sprite（用于UI） Normal...","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Import-Assets.html",
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
        "url": "/posts/2025-06-02-Rigidbody/",
        "teaser": null
      },{
        "title": "Scripts",
        "excerpt":"Unity脚本就是你编写的C#类，它控制游戏中物体的行为、交互、动画、输入、碰撞、UI等逻辑 脚本类型 Unity中的脚本根据其用途可以分为3类： 特性 MonoBehaviour ScriptableObject 纯 C# 类 是否可挂载 可以挂载到 GameObject 不行 不行 生命周期函数 有 Start、Update 等 没有 没有 是否能序列化 支持 支持 默认不支持 支持协程 StartCoroutine() 不支持 不支持 使用场景 行为脚本，控制对象 数据容器，可复用资源配置 工具类、算法类等逻辑单元 MonoBehaviour的派生类 必须挂载在场景中的GameObject上 用于控制逻辑、角色行为、输入响应等 有生命周期函数 ScriptableObject是数据容器 轻量级对象，不需要挂载，常用于数据复用（如技能表、配置表） 支持序列化，可以做成asset文件 没有生命周期函数，但可以在OnEnable()做初始化 更节省内存，不依赖场景 纯C#类 用于封装工具、算法、模型等逻辑（如A*算法、存档系统） 不支持Unity生命周期和序列化 适合在MonoBehaviour或ScriptableObject中调用 脚本和Inspector的关系 可以使用[SerializeField]、public来让字段在Inspector中显示 public float speed...","categories": ["笔记"],
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
        "title": "Coroutine",
        "excerpt":"Unity Coroutine是一种允许在多帧中分布执行代码的机制，它通常用于处理一些需要在多个帧之间等待的任务，比如延时操作、动画播放、资源加载等 协程本质上是通过一种特殊的方式执行代码，它可以在执行过程中“暂停”并在后续的帧继续执行 基本使用 启动协程 协程是通过StartCoroutine()来启动的。协程通常返回一个IEnumerator类型的方法 using UnityEngine; using System.Collections; public class CoroutineExample : MonoBehaviour { void Start() =&gt; StartCoroutine(MyCoroutine()); IEnumerator MyCoroutine() { //在这里执行某些操作 Debug.Log(\"协程开始\"); // Wait 2 seconds yield return new WaitForSeconds(2); // 等待结束后继续执行 Debug.Log(\"2秒后继续执行\"); // 继续执行其他操作 yield return null; // 等待下一帧 Debug.Log(\"协程执行完毕\"); } } 在这个例子中，MyCoroutine协程将在开始时打印“协程开始”，然后等待2秒后打印“2秒后继续执行”，最后在下一帧打印“协程执行完毕” 协程的暂停与恢复 协程可以通过yield return暂停执行，直到某个条件满足。常见的暂停类型有：...","categories": ["笔记"],
        "tags": ["Unity","Unity Engine"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Coroutine.html",
        "teaser": null
      },{
        "title": "Event Bus",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Event-Bus.html",
        "teaser": null
      },{
        "title": "FSM",
        "excerpt":" ","categories": ["笔记"],
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
        "title": "Unity Build-in Types",
        "excerpt":"Unity内建类型 常见Unity内建类型（按用途分） 1.空间/几何类型（Transform相关） 类型 说明 Vector2, Vector3, Vector4 表示二维/三维/四维向量 Quaternion 四元数，表示旋转 Matrix4x4 4×4 矩阵，常用于转换 Bounds 包围盒（中心+尺寸） Ray, RaycastHit 射线检测相关类型 Plane 表示一个无限平面 Rect 二维矩形区域 Color, Color32 表示颜色（线性空间和 sRGB） Vector2 &amp; Vector3 &amp; Vector4 它们是Unity提供的三个核心向量类型，广泛用于位置、方向、速度、缩放、颜色等各种场景 基本定义 向量类型 维度 作用 Vector2 2D 向量，包含 x, y 用于 2D 空间中的位置、速度等 Vector3 3D 向量，包含 x, y,...","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Unity-Build-in-Types.html",
        "teaser": null
      },{
        "title": "Collider & Trigger",
        "excerpt":"Unity中的碰撞体是物理系统的重要组成部分，负责定义游戏对象的形状以进行碰撞检测。简单来说，Collider是一个无形的边界，用于检测物体是否接触或重叠，从而触发碰撞事件和物理响应 什么是Collider Collider是附加在游戏对象上的组件，用于告诉物理引擎这个对象的碰撞范围。Collider本身不会渲染形状，只是一个隐形的物理边界 常见的Collider类型 BoxCollider 立方体形状的碰撞体，适合方形或长方体物体 SphereCollider 球形碰撞体，适合球形或圆形物体 CapsuleCollider 胶囊碰撞体，适合人物、柱子等 MeshCollider 使用自定义网格模型做碰撞体，适合复杂形状，性能较差，且通常用于静态物体 WheelCollider 专门用于车辆轮胎的碰撞和物理模拟 Collider和Rigidbody的关系 Collider只负责检测碰撞，不会自定产生物理运动 Rigidbody组件负责物理运动和动力学 一个没有Rigidbody的物体的Collider会被当作“静态碰撞体”使用（静态障碍物），不会移动也不响应物理力 一个有Rigidbody的物体可以在物理引擎驱动下移动，Collider会随物体运动 Collider Panel Box Collider IsTrigger 默认false，此时Collider是实体碰撞体，会阻挡其他物体，发生物理碰撞和反弹 勾选时，Collider变成Trigger，不会阻挡其他物体，但会检测进入、离开和停留事件，可以用来做区域检测、事件触发等 Provides Contacts 用于物理引擎的碰撞检测和接触点信息提供 默认false，Collider可能只报告碰撞发生，但不提供详细的接触点信息，这样可以节省一些计算资源 勾选后，Collider会提供详细的碰撞接触点信息，这样物理引擎在碰撞时，可以把碰撞的具体接触点信息暴露出来，供脚本或物理系统使用 using UnityEngine; public class CollisionPointExample : MonoBehaviour { void OnCollisionEnter(Collision collision) { foreach (ContactPoint contact in collision.contacts) { //接触点位置...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-04-Collider-and-Trigger/",
        "teaser": null
      },{
        "title": "Addressables System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-05-Addressables-System/",
        "teaser": null
      },{
        "title": "Object Pooling",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-06-Object-Pooling/",
        "teaser": null
      },{
        "title": "Articulation Body",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Physics System"],
        "url": "/posts/2025-06-07-Articulation-Body/",
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
        "title": "UI System",
        "excerpt":"Unity UI系统是Unity引擎内置的用于构建用户界面的工具集。它基于Canvas（画布）架构，支持制作按钮、文本、图片、滑动条、输入框等各种交互元素 UGUI和NGUI 特性 UGUI（Unity GUI） NGUI（Next-Gen UI） 开发方 Unity 官方 第三方（Tasharen Entertainment） 引入版本 Unity 4.6+ 内置 Unity 3.x 时期的主流 UI 插件 集成性 原生集成，支持 Canvas、EventSystem、Animation 等 插件形式，较早期版本需手动集成 渲染系统 使用 Unity 内部渲染系统（Canvas） 自定义渲染系统，Draw Call 优化依赖面板拆分 编辑器支持 所见即所得，Scene View 拖拽 UI 早期需要反复预览，后期版本改善较多 多分辨率适配 有自动布局系统、Anchor、RectTransform 依赖自定义 Anchor 系统 动画支持 支持 Unity Animation 和...","categories": ["笔记"],
        "tags": ["Unity","Unity System","Render"],
        "url": "/posts/2025-06-07-UI-System/",
        "teaser": null
      },{
        "title": "Scene System",
        "excerpt":"Unity Scene System是Unity中用于组织和管理游戏世界的基础结构，Unity支持多个Scene的加载与卸载，允许构建出大型、分块化的世界   Scene  Scene是Unity游戏项目中的一个基础构建单元，它就像游戏世界中的一个“地图”或“关卡”，一个Scene就是一个逻辑/物理空间的容器，包含了：     GameObject   地形、UI、声音   脚本、组件   光照信息、烘焙数据等   在Unity中，一个Scene对应一个.unity文件   Scene 生命周期  1.创建或打开场景（.unity文件）   2.布置场景内容   3.保存场景   4.构建和加载场景（Build Settings里添加场景）   5.运行时加载和卸载场景   场景最佳实践     保持每个场景的职责单一（比如UI与游戏逻辑分离）   使用Prefab来管理重复对象   使用场景加载器或管理器来控制场景切换和数据传递   合理使用DontDestroyOnLoad来跨场景保存数据或对象   Multi Scene   SceneManager   加载与切换场景   Additive Load   多场景编辑工作流   场景打包与构建设置   场景分块加载   触发器加载机制   Addressable + Scene Loading   性能优化   ","categories": ["笔记"],
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
        "title": "Resources, Serialization and Data Persistence",
        "excerpt":"序列化（Serialization） 什么是序列化 简单来说，序列化就是把内存中的对象转换成可以存储或传输的格式的过程，比如转换成二进制、JSON、XML、或者Unity自己的资产格式 反过来，反序列化（Deserialization）就是把存储或传输的格式转换回程序内存分钟的对象 为什么要序列化 1.保存数据 游戏存档就是把游戏状态保存到磁盘上的过程，这个过程就是序列化 2.编辑器显示与修改数据 Unity Inspector面板显示脚本里字段的值，需要序列化这些字段才能让编辑器读写它们 3.网络传输 多人游戏中，玩家状态需要网络传输，也要序列化成网络能传输的格式 Unity里的序列化 Unity有自己的一套序列化规则，决定哪些数据会被序列化（保存、显示在Inspector）： public字段 默认被序列化 private字段 需要加[SerializeField]才会序列化 Unity只序列化支持的类型，比如基本类型、Unity内置类型、自定义继承自UnityEngine.Object的类，和标记为[Serializable]的自定义类 属性（Property）默认不序列化，必须用字段 示例 using UnityEngine; public class Player : MonoBehaviour { public int health = 100; // 会序列化并显示在 Inspector [SerializeField] private int mana = 50; // 虽然是private，但加了特性会序列化 private int secret = 999;...","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Resources-Serialization-and-Data-Persistance.html",
        "teaser": null
      },{
        "title": "Animation System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System"],
        "url": "/posts/2025-06-11-Animation-System/",
        "teaser": null
      },{
        "title": "Audio System",
        "excerpt":"Audio System 是 Unity中处理游戏所有声音播放、管理和混音的核心模块   主要组件                  Category       Component Name                       Audio       Chorus Filter                         Distortion Filter                         Echo Filter                         High Pass Filter                         Listener                         Low Pass Filter                         Reverv Filter                         Reverv Zone                         Source           组件   结合   脚本   性能  ","categories": ["笔记"],
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
        "title": "Navigation System",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System","AI"],
        "url": "/posts/2025-06-11-Navigation/",
        "teaser": null
      },{
        "title": "Terrain",
        "excerpt":"在Unity中，Terrain是一个专门用于制作大规模、自然风格场景的强大工具 什么是Terrain Terrain是Unity提供的一个内置组件，用于在场景中创建可编辑的地形 它由多个部分组成： 地形本体（高度图控制的网格） 纹理涂层（地表材质贴图） 植被/树木/草 光照支持（光照贴图、探针） LOD和剔除 Terrain的核心结构 模块 功能 高度图（Heightmap） 决定地形的高低起伏 绘制材质（Layers） 地面纹理（如草地、岩石、雪）混合涂刷 细节对象（Details） 草、石头、花等低多边形细节（大量渲染优化） 树木系统（Trees） 批量放置支持 LOD 的树 碰撞体 自动生成地形碰撞 光照支持 支持烘焙光照图、Light Probe、反射探针 Terrain Data Terrain Data是地形的“后端数据容器”，和Terrain组件一起工作，一个Terrain组件绑定一个TerrainData资源 Terrain terrain = GetComponent&lt;Terrain&gt;(); TerrainData data = terrain.terrainData; TerrainData保存的内容 高度图（Heightmap） 用灰度图(float[,])描述地形的高度 控制地形表面的形状 float[,] heights = terrainData.GetHeights(0, 0, width, height);...","categories": ["笔记"],
        "tags": ["Unity","Renderer","Unity System","Unity Component"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Terrain.html",
        "teaser": null
      },{
        "title": "TileMap",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System","Unity Component"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/TileMap.html",
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
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Unity-Profiler.html",
        "teaser": null
      },{
        "title": "Unity Performance Tuning",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity"],
        "url": "/posts/2025-06-13-Unity-Performance-Tuning/",
        "teaser": null
      },{
        "title": "Behaviour Tree",
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity System","AI"],
        "url": "/%E7%AC%94%E8%AE%B0/2025/06/01/Behaviour-Tree.html",
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
        "excerpt":" ","categories": ["笔记"],
        "tags": ["Unity","Unity Component","Render","Graphics"],
        "url": "/posts/2025-06-29-Texture/",
        "teaser": null
      },{
        "title": "UI Event System",
        "excerpt":"Event System Event System是Unity UI System中的核心交互管理器，掌控了所有鼠标点击、键盘输入、触摸事件、UI导航的逻辑 Unity的Event System是一个处理用户输入事件的系统，用于发送“点击了谁”“选中了谁”之类的事件，属于UnityEngine.EventSystems命名空间 组件 用途 EventSystem 整个输入系统的“大脑” Input Module 输入方式模块，比如处理鼠标、键盘、手柄（你可以切换） Raycaster（挂在 Canvas 或 3D 对象上） 实际检测点击了哪个物体，比如：GraphicRaycaster, PhysicsRaycaster EventSystem会追踪以下交互： 类型 描述 接口 点击 Click 鼠标/触摸点击 UI IPointerClickHandler 拖拽 Drag 拖拽 ScrollRect、物品、滑块 IDragHandler, IBeginDragHandler, IEndDragHandler 悬停 Hover 鼠标移动到 UI 上 IPointerEnterHandler, IPointerExitHandler 按钮按下 长按、释放 IPointerDownHandler, IPointerUpHandler 键盘导航...","categories": ["笔记"],
        "tags": ["Unity","Unity Component","UGUI"],
        "url": "/posts/2025-06-29-UI-Event-System/",
        "teaser": null
      },{
        "title": "Unity Projects Examples",
        "excerpt":"项目管理   Quick List                  项目       简介       标签       状态                                                          ","categories": ["笔记"],
        "tags": ["Unity","Project"],
        "url": "/posts/2025-06-29-Unity-Projects-Examples/",
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
