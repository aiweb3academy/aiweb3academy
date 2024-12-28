# [Eliza](https://github.com/ai16z/eliza) Chatbot Docker 设置指南

## 概述

本指南提供了使用 Docker 或直接在服务器上安装和运行 Eliza 聊天机器人的说明。

## 先决条件

- 基于 Linux 的服务器（推荐使用 Ubuntu/Debian）
- 已安装 Git
- Docker（可选，用于容器化部署）

1. **安装 NVM**：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install v23.3.0
```

2. **安装构建工具**（可选）：

```bash
apt install -y build-essential
```

3. **安装 PNPM**：

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
source /root/.bashrc
```

## Docker 安装

1. **安装 Docker**：

```bash
# 添加 Docker 的官方 GPG 密钥
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 添加 Docker 仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker 包
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

2. **克隆存储库**：

```bash
git clone https://github.com/YOUR_USERNAME/eliza.git
cd eliza
```

3. **配置环境**：

```bash
cp.env.example.env
```

4. **修复 Unix 脚本问题**（如果需要）：

```bash
apt install dos2unix
dos2unix./scripts/*
```

5. **使用 Docker 运行**：

```bash
pnpm docker
```

## Docker 管理命令

- 检查正在运行的容器：

```bash
docker ps
```

- 删除 Eliza 容器：

```bash
docker rm /eliza
```

- 使用不同的角色重启：

```bash
pnpm start --character="characters/YOUR_CHARACTER.character.json"
```

## 自定义

- 修改 `.env` 文件以自定义机器人的设置。
- 角色文件位于 `characters/` 目录中。
- 通过复制和修改现有文件来创建新的角色文件。

## 故障排除

- 如果 Docker 容器无法启动，请检查日志：

```bash
docker logs eliza
```

- 对于权限问题，确保文件的正确所有权和权限。
- 对于脚本格式问题，对有问题的文件运行 `dos2unix`。

- 删除所有 Docker 镜像
  - 运行以下命令删除所有镜像：

```bash
docker rmi -f $(docker images -aq)
```

- 清除所有构建缓存
  - 要完全清除构建缓存，请使用：

```bash
docker builder prune -a -f
```

- 验证清理
  - 再次检查 Docker 磁盘使用情况以确保一切已删除：

```bash
docker system df
```
