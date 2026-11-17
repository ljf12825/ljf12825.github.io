document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('div.highlight').forEach(function (block) {
        // 如果已经有 data-lang 就跳过
        if (block.hasAttribute('data-lang')) return;

        // 从 code 标签的 class 中提取语言
        var code = block.querySelector('code[class*="language-"]');
        if (code) {
            var match = code.className.match(/language-(\w+)/);
            if (match) {
                block.setAttribute('data-lang', match[1].toUpperCase());
                return;
            }
        }

        // 从 pre 标签的 class 中提取
        var pre = block.querySelector('pre[class*="language-"]');
        if (pre) {
            var match = pre.className.match(/language-(\w+)/);
            if (match) {
                block.setAttribute('data-lang', match[1].toUpperCase());
                return;
            }
        }

        // 如果都没找到，设置默认值
        block.setAttribute('data-lang', 'CODE');
    });
});