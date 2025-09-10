## Chroma（Hugo内置语法高亮引擎）
Chroma支持200+种样式\
在`config.toml`里设置：
```toml
[markup.highlight]
  style = " " # 主题
  noClasses = false # 用class（可以自己写CSS）
  lineNos = true # 显示行号
```

自定义样式

- `.k` → keyword（关键字）
- `.nc` → class name / 类型名
- `.nf` → function name（函数名）
- `.s` → string（字符串）
- `.c` → comment（注释）
- `.m` → number（数字）
- `.o` → operator（操作符）
- `.p` → punctuation（标点）

## Mermaid使用
```text
<div class="mermaid">
flowchart LR
markdown --> newLines
</div>
```

## KaTeX使用
```text
<div class="math">
  $$
    O(n_2)
  $$
</div>
```

## Hugo 内建 Front Matter

### 1. 基本元信息

| 字段            | 作用                      |
| ------------- | ----------------------- |
| `title`       | 页面标题                    |
| `date`        | 发布时间（通常取文件创建日期）         |
| `lastmod`     | 最后修改时间                  |
| `publishDate` | 正式发布的时间（用于定时发布）         |
| `expiryDate`  | 过期时间，过期后页面不会生成          |
| `type`        | 内容类型（决定布局 template 的选择） |
| `layout`      | 指定使用的布局（覆盖默认）           |
| `draft`       | 是否为草稿，`true` 时不会生成      |

### 2. URL/路径控制

| 字段                  | 作用                        |
| ------------------- | ------------------------- |
| `slug`              | URL 的最后一段（`/post/:slug/`） |
| `url` / `permalink` | 直接指定完整 URL                |
| `aliases`           | 旧 URL 的别名（跳转用）            |

### 3. SEO/展示相关

| 字段            | 作用                               |
| ------------- | -------------------------------- |
| `description` | 页面描述（常用于 `<meta>`）               |
| `summary`     | 手动指定摘要                           |
| `keywords`    | 页面关键词（用于 SEO）                    |
| `images`      | 页面预览图（OpenGraph / Twitter Cards） |

### 4. 分类与标签

| 字段           | 作用               |
| ------------ | ---------------- |
| `categories` | 分类（数组）           |
| `tags`       | 标签（数组）           |
| `series`     | 系列（Hugo 推荐的分组方式） |

### 5. 权限与状态

| 字段        | 作用            |
| --------- | ------------- |
| `draft`   | 是否草稿          |
| `private` | 是否不公开（部分主题支持） |
| `weight`  | 排序权重（数值越小越靠前） |

### 6. 自定义参数

| 字段       | 作用                            |
| -------- | ----------------------------- |
| `params` | 任意自定义参数（模板里 `.Params.xxx` 调用） |

### 7. 多语言支持

| 字段               | 作用                |
| ---------------- | ----------------- |
| `translationKey` | 标识同一篇文章的不同语言版本    |
| `aliases`        | 可以给不同语言的 URL 设置跳转 |
