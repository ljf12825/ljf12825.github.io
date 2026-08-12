---
title: Neovim LSP Config
author: ljf12825
date: 2026-08-12
tags: [LSP. Vim/Nvim]
summary: The principle of Neovim LSP Configuration and apply of plugins
---

# Neovim 中 LSP 的核心工作原理

```
Neovim
v
vim.lsp
|   spawn()
v
Language Server
v
clangd / gopls / rust-analyzer / ..
```

比如要配置一个C/C++ 开发环境

```bash
sudo apt install clangd
```

然后

```bash
which clangd
```

得到`/usr/bin/clangd`

在Neovim中

```lua
vim.lsp.start({
    name = 'clangd',
    cmd = { 'clangd' },
    root_dir = vim.fs.root(0, {
        'compile_commands.json',
        'compile_flags.txt',
        '.git',
    }),
})
```

就可以工作

## `vim.lsp`

这是Neovim LSP 的核心，是Neovim自己提供的LSP Client\
它允许Neovim直接与后端的各种语言服务器通信，从而让终端编辑器拥有媲美VS Code, IntelliJ等重型IDE的代码智能化能力\
负责：

```
LSP Client
    |
    |-- initialize
    |-- textDocument/didOpen
    |-- textDocument/completion
    |-- textDocument/hover
    |-- textDocument/definition
    |-- textDocument/publishDiagnostics
    |__ shutdown
```

Neovim 无需依赖外部重型插件

```
[后台语言服务器]  <---(LSP协议)---> [vim.lso (Neovim内置)] <---> [插件生态]
(pyright, gopls)                    (核心客户端/API)             (nvim-lspconfig, mason, nvim-cmp)
```

1. Language Server（语言服务器）:独立于编辑器的后台进程（例如Python的`pyright`，Go的`gopls`，C++的`clangd`）。负责实际代码分析与索引
2. `vim.lsp`（内置模块）：Neovim的原生Lua模块，负责启动语言服务器进程，并处理JSON-RPC协议通信

## `root_dir`

`root_dir`的作用不仅是告诉服务器“项目根在哪里”，更是Neovim决定“是否启动该LSP服务器”的唯一触发点

- 查找逻辑：当你打开一个C++文件时，Neovim会从文件所在目录开始，向上递归寻找包含`compile_commands.json`，`compile_flags.txt`或`.git`的目录
- 找到时：将其设为`root_dir`并启动`clangd`
- 找不到时：`vim.fs.root()`返回`nil`，`vim.lsp.start()`会直接跳过，不启动服务器。文件没有任何LSP功能

## 插件

### Mason

Mason即`mason.nvim`，是一个专为Neovim设计的第三方包管理器\
它不仅可以管理LSP语言服务器，还能管理现代开发所需的各种外部命令行工具

- LSP客户端(Language Server)：如Python的`pyright`, TypeScript的`ts_ls`, Go的`gopls`
- 代码格式化工具(Formatters)：如`prettier`, `black`, `stylua`
- 代码静态检查工具(Linters)：如`eslint`, `ruff`, `flake8`
- 调试器(DAP-Debug Adapters)：如`delve`(Go), `codelldb`(C++/Rust)

在没有Mason时，需要手动在系统终端中用各种包管理器，比如`apt`, `npm`, `brew`, `pip` 把这些工具一个个装到全局环境中；而Mason会将它们独立安装并隔离在Neovim的数据目录里(`~/.local/share/nvim/mason/`)，完全不污染系统环境

有了Mason后，结构会变成

```
                    ┌──────────────┐
                    │    Mason     │
                    │  安装/管理工具 │
                    └──────┬───────┘
                           │
                           v
                    ~/.local/share/
                    nvim/mason/bin
                           │
                           │ PATH
                           v
┌───────────────────────────────────────────┐
│                  Neovim                   │
│                                           │
│  FileType                                 │
│     │                                     │
│     v                                     │
│  你的 lsp_servers                         │
│     │                                     │
│     v                                     │
│  vim.fs.root()                            │
│     │                                     │
│     v                                     │
│  vim.lsp.start()                          │
└──────────────────────┬────────────────────┘
                       │
                       v
                 Language Server
```

### nvim-lspconfig

`nvim-lspconfig`是Neovim官方维护的一个核心配置集合插件

Neovim内置的`vim.lsp`只提供了底层的通信API。如果没有`nvim-lspconfig`，要启动一个语言服务器，需要手写几十行复杂的Lua代码：

- 查找`pyright-langserver`二进制文件的安装路径
- 指定启动参数和通信协议(stdio/pipe)
- 定义那些文件类型(FileType, 如`python`)触发启动
- 指定如何计算项目的根目录(Root Directory, 如寻找`.git`或`pyproject.toml`)

#### 没有nvim-lspconfig手动配置示例

创建LSP客户端配置

```lua
-- 配置 LSP 服务器
local function setup_lsp()
  -- 配置 pyright (Python)
  vim.lsp.start({
    name = 'pyright',
    cmd = { 'pyright-langserver', '--stdio' },
    root_dir = vim.fs.dirname(vim.fs.find({ '.git', 'pyproject.toml', 'setup.py' }, { upward = true })[1]),
    settings = {
      python = {
        analysis = {
          typeCheckingMode = 'basic'
        }
      }
    }
  })

  -- 配置 tsserver (JavaScript/TypeScript)
  vim.lsp.start({
    name = 'tsserver',
    cmd = { 'typescript-language-server', '--stdio' },
    root_dir = vim.fs.dirname(vim.fs.find({ 'package.json', '.git' }, { upward = true })[1]),
  })

  -- 配置 lua_ls (Lua)
  vim.lsp.start({
    name = 'lua_ls',
    cmd = { 'lua-language-server' },
    root_dir = vim.fs.dirname(vim.fs.find({ '.luarc.json', '.git' }, { upward = true })[1]),
    settings = {
      Lua = {
        runtime = { version = 'LuaJIT' },
        diagnostics = { globals = { 'vim' } },
        workspace = { library = vim.api.nvim_get_runtime_file("", true) }
      }
    }
  })
end
```

设置LSP处理器(Handlers)

```lua
-- 自定义 LSP 处理器
vim.lsp.handlers['textDocument/hover'] = vim.lsp.with(
  vim.lsp.handlers.hover,
  { border = 'rounded' }
)

vim.lsp.handlers['textDocument/signatureHelp'] = vim.lsp.with(
  vim.lsp.handlers.signature_help,
  { border = 'rounded' }
)
```

配置自动命令和按键映射

```lua
-- 创建自动命令组
local augroup = vim.api.nvim_create_augroup('LspConfig', { clear = true })

-- LSP 附加时的自动配置
vim.api.nvim_create_autocmd('LspAttach', {
  group = augroup,
  callback = function(args)
    local client = vim.lsp.get_client_by_id(args.data.client_id)
    if not client then return end
    
    -- 设置缓冲区按键映射
    local bufopts = { noremap = true, silent = true, buffer = args.buf }
    
    -- 跳转到定义
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
    -- 跳转到声明
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
    -- 查看引用
    vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
    -- 悬停文档
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
    -- 重命名
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
    -- 代码操作
    vim.keymap.set({ 'n', 'v' }, '<leader>ca', vim.lsp.buf.code_action, bufopts)
    
    -- 如果服务器支持，启用代码高亮
    if client.server_capabilities.semanticTokensProvider then
      vim.lsp.semantic_tokens.start(args.buf, client.id)
    end
    
    -- 启用 inlay hints（如果支持）
    if client.server_capabilities.inlayHintProvider then
      vim.lsp.inlay_hint.enable(true, { bufnr = args.buf })
    end
  end,
})
```

手动启动LSP（可选）

```lua
-- 创建手动启动命令
vim.api.nvim_create_user_command('LspStart', function()
  vim.lsp.start({
    name = 'pyright',
    cmd = { 'pyright-langserver', '--stdio' },
    root_dir = vim.fs.dirname(vim.fs.find({ '.git', 'pyproject.toml' }, { upward = true })[1] or vim.fn.getcwd()),
  })
end, {})
```

初始化配置示例

```lua
-- ~/.config/nvim/init.lua 或 ~/.config/nvim/lua/lsp.lua

-- LSP 诊断配置
vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  underline = true,
  update_in_insert = false,
  severity_sort = true,
  float = {
    border = 'rounded',
    source = 'always',
  },
})

-- 诊断符号
local signs = { Error = '✘', Warn = '⚠', Hint = '⚑', Info = 'ℹ' }
for type, icon in pairs(signs) do
  local hl = 'DiagnosticSign' .. type
  vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = '' })
end

-- 自动补全配置（需要 nvim-cmp 等插件配合）
local capabilities = vim.lsp.protocol.make_client_capabilities()
-- 如果有 nvim-cmp：capabilities = require('cmp_nvim_lsp').default_capabilities()

-- 统一的 LSP 启动函数
function M.launch_lsp(server_config)
  vim.lsp.start(vim.tbl_extend('keep', server_config, {
    capabilities = capabilities,
  }))
end

-- 示例：启动所有配置的服务器
-- M.launch_lsp({ name = 'pyright', cmd = { 'pyright-langserver', '--stdio' }, ... })
```

这种方式虽然繁琐，但是能让你完全控制LSP的配置细节

而`nvim-lspconfig`将社区中数百种常见的语言服务器的上述配置全部预设好了。只需要写一行`setuo()`，就能直接开箱即用

加入`nvim-lspconfig`后

```
Neovim
   │
   v
vim.lsp
   │
   ^
   │
nvim-lspconfig
   │
   ├── clangd 配置
   ├── rust_analyzer 配置
   ├── lua_ls 配置
   ├── gopls 配置
   ├── pylsp 配置
   └── ...
```

#### 加入nvim-lspconfig后的示例

基础配置结构

```lua
-- ~/.config/nvim/lua/lsp.lua 或直接在 init.lua 中

local lspconfig = require('lspconfig')

-- 通用的 on_attach 函数（所有服务器共用）
local on_attach = function(client, bufnr)
  local bufopts = { noremap = true, silent = true, buffer = bufnr }
  
  -- 按键映射
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
  vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, bufopts)
  vim.keymap.set('n', 'gr', vim.lsp.buf.references, bufopts)
  vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, bufopts)
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
  vim.keymap.set('n', '<C-k>', vim.lsp.buf.signature_help, bufopts)
  vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
  vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, bufopts)
  vim.keymap.set('n', '<leader>f', function()
    vim.lsp.buf.format { async = true }
  end, bufopts)
  
  -- 诊断导航
  vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, bufopts)
  vim.keymap.set('n', ']d', vim.diagnostic.goto_next, bufopts)
  vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, bufopts)
  vim.keymap.set('n', '<leader>q', vim.diagnostic.setloclist, bufopts)
end

-- 所有服务器共享的 capabilities
local capabilities = vim.lsp.protocol.make_client_capabilities()
-- 如果使用 nvim-cmp 补全插件，取消下面一行的注释
-- capabilities = require('cmp_nvim_lsp').default_capabilities()
```

配置各个LSP服务器

```lua
-- Python (pyright)
lspconfig.pyright.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    python = {
      analysis = {
        typeCheckingMode = 'basic',
        autoSearchPaths = true,
        diagnosticMode = 'workspace',
      }
    }
  }
})

-- JavaScript/TypeScript (tsserver)
lspconfig.tsserver.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    typescript = {
      inlayHints = {
        includeInlayParameterNameHints = 'all',
        includeInlayFunctionParameterTypeHints = true,
      }
    }
  }
})

-- Lua (lua_ls)
lspconfig.lua_ls.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    Lua = {
      runtime = { version = 'LuaJIT' },
      diagnostics = { globals = { 'vim' } },
      workspace = {
        library = vim.api.nvim_get_runtime_file("", true),
        checkThirdParty = false,
      },
      telemetry = { enable = false },
    }
  }
})

-- Rust (rust_analyzer)
lspconfig.rust_analyzer.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    ['rust-analyzer'] = {
      checkOnSave = {
        command = 'clippy'
      },
      inlayHints = {
        bindingModeHints = { enable = false },
      }
    }
  }
})

-- Go (gopls)
lspconfig.gopls.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = {
    gopls = {
      analyses = {
        unusedparams = true,
      },
      staticcheck = true,
    }
  }
})
```

批量配置

```lua
-- 如果有多个服务器使用相同配置，可以批量设置
local servers = {
  'pyright',
  'tsserver', 
  'lua_ls',
  'rust_analyzer',
  'gopls',
  'clangd',
  'html',
  'cssls',
  'jsonls',
}

for _, server in ipairs(servers) do
  lspconfig[server].setup({
    on_attach = on_attach,
    capabilities = capabilities,
  })
end

-- 需要特殊配置的服务器单独设置
lspconfig.pyright.setup({
  on_attach = on_attach,
  capabilities = capabilities,
  settings = { python = { analysis = { typeCheckingMode = 'strict' } } }
})
```

使用默认配置

```lua
-- 如果不需要特殊配置，直接使用默认值
require('lspconfig').pyright.setup({})
require('lspconfig').tsserver.setup({})
require('lspconfig').lua_ls.setup({})

-- 使用 nvim-lspconfig 的默认 capabilities
local capabilities = require('lspconfig').util.default_capabilities
```

完整配置文件示例

```lua
-- ~/.config/nvim/lua/lsp-config.lua
local M = {}

M.setup = function()
  local lspconfig = require('lspconfig')
  
  -- 诊断配置
  vim.diagnostic.config({
    virtual_text = true,
    signs = true,
    underline = true,
    update_in_insert = false,
    severity_sort = true,
  })
  
  -- 获取补全能力（如果使用 nvim-cmp）
  local capabilities = vim.lsp.protocol.make_client_capabilities()
  local has_cmp, cmp_nvim_lsp = pcall(require, 'cmp_nvim_lsp')
  if has_cmp then
    capabilities = cmp_nvim_lsp.default_capabilities()
  end
  
  -- 通用 on_attach
  local on_attach = function(client, bufnr)
    -- 禁用格式化（如果用其他格式化插件）
    client.server_capabilities.documentFormattingProvider = false
    client.server_capabilities.documentRangeFormattingProvider = false
    
    -- 按键映射...
    -- （同前面的 on_attach 函数）
  end
  
  -- 服务器列表
  local servers = {
    lua_ls = {
      settings = {
        Lua = {
          runtime = { version = 'LuaJIT' },
          diagnostics = { globals = { 'vim' } },
        }
      }
    },
    pyright = {},
    tsserver = {},
    html = {},
    cssls = {},
  }
  
  -- 配置每个服务器
  for server_name, config in pairs(servers) do
    config.on_attach = on_attach
    config.capabilities = capabilities
    lspconfig[server_name].setup(config)
  end
end

return M
```

在 init.lua中调用

```lua
-- ~/.config/nvim/init.lua
require('lsp-config').setup()
```

### mason-lspconfig

`mason-lspconfig`是一个桥接插件，连接了Mason和nvim-lspconfig

没有`mason-lspconfig`时的流程：

1. 手动安装LSP服务器
2. 手动在 nvim-lspconfig中配置

有`mason-lspconfig`后的流程

1. 在Neovim中自动安装LSP服务器
2. 自动配置到 nvim-lspconfig

三层架构关系

```txt
Mason (包管理器)
  v 负责下载、安装、更新 LSP 服务器
mason-lspconfig (桥接层)  
  v 将 Mason 安装的服务器自动映射到
nvim-lspconfig (配置层)
  v 设置 LSP 的行为、按键映射等
```

#### 基本配置示例

```lua
-- 1. 首先配置 mason
require('mason').setup()

-- 2. 配置 mason-lspconfig（桥接）
require('mason-lspconfig').setup({
  -- 自动安装这些 LSP 服务器
  ensure_installed = {
    'pyright',       -- Python
    'tsserver',      -- JavaScript/TypeScript
    'lua_ls',        -- Lua
    'rust_analyzer', -- Rust
    'gopls',         -- Go
    'clangd',        -- C/C++
  },
  
  -- 自动为安装的服务器设置 nvim-lspconfig
  automatic_installation = true,
})

-- 3. 配置 nvim-lspconfig（自动获取 mason 安装的路径）
local lspconfig = require('lspconfig')
local capabilities = require('cmp_nvim_lsp').default_capabilities()

-- 为每个安装的服务器设置处理函数
require('mason-lspconfig').setup_handlers({
  -- 默认处理函数（适用于大部分服务器）
  function(server_name)
    lspconfig[server_name].setup({
      capabilities = capabilities,
    })
  end,
  
  -- 特殊处理（为特定服务器添加额外配置）
  ['lua_ls'] = function()
    lspconfig.lua_ls.setup({
      capabilities = capabilities,
      settings = {
        Lua = {
          runtime = { version = 'LuaJIT' },
          diagnostics = { globals = { 'vim' } },
        }
      }
    })
  end,
})
```

#### 核心功能

自动安装服务器

```lua
require('mason-lspconfig').setup({
  ensure_installed = { 'pyright', 'tsserver' },
  automatic_installation = true, -- 打开文件时自动安装缺失的服务器
})
```

可用服务器列表

```lua
-- 查看所有可用的 LSP 服务器名称
local available_servers = require('mason-lspconfig').get_available_servers()

-- 检查服务器是否已安装
local is_installed = require('mason-lspconfig').get_installed_servers()
```

#### 完整工作流示例

```lua
-- ~/.config/nvim/lua/lsp.lua

-- 安装管理
require('mason').setup({
  ui = {
    border = 'rounded',
    icons = {
      package_installed = '✓',
      package_uninstalled = '✗',
    }
  }
})

-- 桥接配置
require('mason-lspconfig').setup({
  ensure_installed = {
    'pyright',
    'tsserver', 
    'lua_ls',
    'html',
    'cssls',
    'jsonls',
  },
  automatic_installation = true,
})

-- 获取补全能力
local capabilities = vim.lsp.protocol.make_client_capabilities()
local has_cmp, cmp_nvim_lsp = pcall(require, 'cmp_nvim_lsp')
if has_cmp then
  capabilities = cmp_nvim_lsp.default_capabilities()
end

-- 通用 on_attach
local on_attach = function(client, bufnr)
  local bufopts = { noremap = true, silent = true, buffer = bufnr }
  vim.keymap.set('n', 'gd', vim.lsp.buf.definition, bufopts)
  vim.keymap.set('n', 'K', vim.lsp.buf.hover, bufopts)
  vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, bufopts)
  -- ... 其他按键映射
end

-- 设置处理函数
require('mason-lspconfig').setup_handlers({
  function(server_name)
    require('lspconfig')[server_name].setup({
      on_attach = on_attach,
      capabilities = capabilities,
    })
  end,
  
  -- 特殊服务器配置
  ['pyright'] = function()
    require('lspconfig').pyright.setup({
      on_attach = on_attach,
      capabilities = capabilities,
      settings = {
        python = { analysis = { typeCheckingMode = 'basic' } }
      }
    })
  end,
})
```

### `cmp-nvim-lsp`

`vim.lsp`作为Neovim的内置LSP客户端，它能向语言服务器请求补全数据，但它完全不负责UI，不会在打字时弹出补全菜单。它只是一个搬运工，把数据从服务器搬到Neovim内部

`nvim-cmp` 是一个独立的、强大的补全插件，专门负责：

- 展示补全菜单
- 排序来自不同来源的补全项
- 处理交互

它们之间的鸿沟是：`nvim-cmp`并不知道如何从`vim.lsp`这个数据源里取数据。因为`vim.lsp`的数据格式、请求方式都是LSP协议所特有的。`cmp-nvim-lsp`就是填平这道鸿沟的桥梁

#### `cmp-nvim-lsp`的行为

它的核心工作就两个：

1. 充当数据源适配器：它把自己注册为`nvim-cmp`的一个源。当`nvim-cmp`需要补全数据时，它会调用`cmp-nvim-lsp`，这个插件就代表`nvim-cmp`去调用Neovim内置的`vim.lsp.buf.completion`函数来向服务器请求数据，拿到数据后，再转换成`nvim-cmp`能理解的格式
2. 增强客户端能力(`capabilities`)

#### `capabilities`的作用

这是一个在LSP初始化握手阶段，由客户端发送给服务器的一个能力清单

基本流程

```txt
Neovim (Client)          Language Server
      |                         |
      |-- initialize(params) -->|
      |   params.capabilities   |
      |   = {                   |
      |     textDocument: {     |
      |       completion: { ... } |
      |     }                   |
      |   }                     |
      |                         |
      |<-- initialize(result)--|
      |   result.capabilities   |
      |   (服务器告诉客户端它能做什么) |
```

```lua
-- 方式1: 只使用 Neovim 原生的能力
local capabilities = vim.lsp.protocol.make_client_capabilities()

-- 方式2: 使用 cmp-nvim-lsp 增强后的能力
local capabilities = require('cmp_nvim_lsp').default_capabilities()
```

`cmp-nvim-lsp`增强的`capabilities`主要在`capabilities.textDocument.completion`这个对象里，添加了更丰富的信息，尤其是对代码片段(Snippets)的支持

当配置了`lspconfig.lua_ls.setup({ capabilities = capabilities })`时

当没有`cmp-nvim-lsp`的增强，`vim.lsp.protocol.make_client_capabilities()`默认报告的`snippetSupport`是`false`。Lua语言服务器看到这个，会降级返回补全项。当输入`if`时，可能只得到`if then end`这样的纯文本，光标停留在最后

当有`cmp-nvim-lsp`的增强，`require('cmp_nvim_lsp').default_capabilities()`会将`snippetSupport`设为`true`，并附加详细的语法说明\
Lua语言服务此时会返回一个带占位符的代码片段：`if ${1:condition} then ${0:body} end`\
`nvim-cmp`配合一个代码片段引擎（如`LuaSnip`），就会在插入后，先高亮选中`condition`让你输入条件，按`Tab`后，再跳转到`body`位置。这才是完整的、类IDE的补全体验

### 完整配置解构

一个典型的、完整的配置通常是这样的

```lua
-- 1. 先配置代码片段引擎 (这是另一个话题，但必不可少)
local luasnip = require('luasnip')

-- 2. 配置补全引擎 nvim-cmp
local cmp = require('cmp')

cmp.setup({
  -- 指定代码片段引擎
  snippet = {
    expand = function(args)
      luasnip.lsp_expand(args.body)
    end,
  },

  -- 配置补全数据来源
  sources = cmp.config.sources({
    -- 这就是 cmp-nvim-lsp 作为源被注册进来的地方
    { name = 'nvim_lsp' }, -- 对应 require('cmp_nvim_lsp') 暴露的源
    { name = 'luasnip' },  -- 代码片段源
    -- 其他源, 如 { name = 'buffer' }, { name = 'path' }
  }),

  -- 按键映射 (Tab, Enter等)
  mapping = cmp.mapping.preset.insert({
    ['<C-n>'] = cmp.mapping.select_next_item(),
    ['<C-p>'] = cmp.mapping.select_prev_item(),
    ['<Tab>'] = cmp.mapping.confirm({ select = true }),
    ['<C-Space>'] = cmp.mapping.complete(),
  }),
})

-- 3. 在配置 LSP 服务器时，传入增强后的 capabilities
local lspconfig = require('lspconfig')
-- 这里获取到增强版的能力清单
local capabilities = require('cmp_nvim_lsp').default_capabilities()

-- 配置每个服务器时必须传入
lspconfig.pyright.setup({ capabilities = capabilities })
lspconfig.lua_ls.setup({ capabilities = capabilities })
lspconfig.clangd.setup({ capabilities = capabilities })
```

数据流动：

1. 用户打了一个字母`i`
2. `nvim-cmp`被触发，向所有注册的源请求数据
3. 源`nvim_lsp`（即`cmp-nvim-lsp`插件）收到请求，调用`vim.lsp.buf.completion`
4. `vim.lsp`向Lua语言服务器发送`textDocument/completion`请求
5. 服务器根据初始化时确认的、支持Snippet的capabilities，返回`if ${1:condition} then ${0:body} end`
6. 数据通过`vim.lsp` -> `cmp-nvim-lsp` -> `nvim-cmp`流回
7. `nvim-cmp`在补全菜单中显示`if`这一项
8. 用户按`Tab`确认
9. `nvim-cmp`调用`LuaSnip`的`expand`函数，将代码片段完整展开并激活第一个占位符
10. 用户就可以在`condition`处输入，按`Tab`跳到`body`处

## 代码片段

`LuaSnip`

## diagnostic
