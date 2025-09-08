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

<div class="mermaid">
flowchart LR
markdown --> newLines
</div>

## KaTeX使用
<div class="math">
  $$
    O(n_2)
  $$
</div>