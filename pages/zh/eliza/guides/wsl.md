# WSL 设置指南

## 概述

在 Windows 计算机上使用 WSL（Windows Subsystem for Linux）运行 Eliza 的步骤。
[AI Dev School 教程](https://www.youtube.com/watch?v=ArptLpQiKfI)

## 安装 WSL

1. 以管理员身份打开 PowerShell 并运行：

```powershell
wsl --install
```

2. 重启计算机。
3. 从开始菜单启动 Ubuntu 并创建你的 Linux 用户名/密码。

## 安装依赖项

1. 更新 Ubuntu 软件包：

```bash
sudo apt update && sudo apt upgrade -y
```

2. 安装系统依赖项：

```bash
sudo apt install -y \
    build-essential \
    python3 \
    python3-pip \
    git \
    curl \
    ffmpeg \
    libtool-bin \
    autoconf \
    automake \
    libopus-dev
```

3. 通过 nvm 安装 Node.js：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 23
nvm use 23
```

4. 安装 pnpm：

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

## 可选：CUDA 支持

如果你有 NVIDIA GPU 并需要 CUDA 支持：

1. 从 [NVIDIA 的网站](https://developer.nvidia.com/cuda-downloads) 在 Windows 上安装 CUDA 工具包。
2. WSL 将自动检测并使用 Windows 的 CUDA 安装。

## 克隆和设置 Eliza

按照 [快速入门指南](../quickstart.md) 从“安装”部分开始。

## 故障排除

- 如果你遇到 `node-gyp` 错误，请确保已安装构建工具：

```bash
sudo apt install -y nodejs-dev node-gyp
```

- 对于音频相关问题，验证 ffmpeg 安装：

```bash
ffmpeg -version
```

- 对于权限问题，确保你的用户拥有项目目录的所有权：

```bash
sudo chown -R $USER:$USER ~/path/to/eliza
```
