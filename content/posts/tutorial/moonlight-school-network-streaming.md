---
date: "2025-11-19T14:10:29+08:00"
lastmod: "2025-11-21T15:05:29+08:00"
draft: false
title: MoonLight校园网串流教程
url: /p/13
---

## 说在前面

> ! 由于，各个学校的网络环境不同，可能存在内网隔离，宿舍与校内网络结构不互通等情况

### MoonLight 简介

[MoonLight](https://github.com/moonlight-stream) 是一款开源的软件，可以利用 NVIDIA 的 GameStream 技术进行远程串流游戏。它可以让你在几乎任何设备上玩你的 PC 游戏，无论你是在另一个房间还是离你的游戏机很远。MOONLIGHT 最初是 NVIDIA Shield 的一个第三方客户端，但现在也支持其他平台，如 Android，iOS，Apple TV，PC，Mac 等。MOONLIGHT 还可以让你以高达 4K 分辨率和 HDR 支持来串流你的 PC 桌面。

### 我们需要什么

1. 一台电脑作为串流的目标（Nvdia 显卡并开启 SHIELD，AMD 需要下载 sunshine）
2. 一台手机或者其他设备作为我们在外使用 Moonlight 时的临时控制端（因为需要输入密码）

## MoonLight 使用教程

### PC 端设置

1. **打开`GeForce Experience`, `设置`→`SHIELD`→`打开GAMESTREAM`**

   我们还需要在`GAMESTREAM`中添加`C:\Windows\System32\mstsc.exe`，让我们能直接串流到桌面

   > 有人反馈说最新版本没有 SHIELD，但我是最新驱动，在 3070 与 4060ti 显卡上都能够开启该功能，猜想可能是网络环境等原因导致无法开启

   ![添加mstsc](https://s2.loli.net/2023/06/09/UdBHc9vsf8MizEL.png "1192/692")

2. **防火墙端口放行，校园网虽然是个大内网，但不是透明的，还是需要通过防火墙的**

   管理员运行 PowerShell 分别输入以下命令放行 moonlight 所需要的端口

   ```shell
   netsh advfirewall firewall add rule name="GameStream UDP" dir=in protocol=udp localport=5353,47998-48010 action=allow
   netsh advfirewall firewall add rule name="GameStream TCP" dir=in protocol=tcp localport=47984,47989,48010 action=allow
   ```

   如果你想删除这两个规则请分别输入以下命令

   ```shell
   netsh advfirewall firewall delete rule name="GameStream UDP"
   netsh advfirewall firewall delete rule name="GameStream TCP"
   ```

3. **路由器进行端口转发（如果你安装了路由器那么就需要这一步）**

   其实就是对以上放行的端口进行转发，将 wan 口这些端口都转发到我们 pc 的端口上，不同路由器的转发设置可能有所不同，注意要将以下端口都设置转发

   - **TCP** 47984, 47989, 48010

   - **UDP** 5353, 47998, 47999, 48000, 48002, 48010

### 临时控制端设置

1. **下载 moonlight 软件，这里以安卓手机为例**

   在 github 下载安卓平台的软件并安装**→**[Moonlight Game Streaming Project (github.com)](https://github.com/moonlight-stream)

2. **打开软件完成配对**

   确保手机与 pc 在都连接校园网，点击右上角的加号再输入 pc 的校园网 ip（一般是 10 开头的）

   找到 pc 后，点击进行配对，会提示在 pc 端输入 pin 码，我们按照要求输入之后就可以看到，软件里图标上的锁消失了，我们点进去再选择 mstsc 就能够串流到桌面了

### 机房串流设置

> 学校机房的电脑，每回重启之后都会被重置，所以我们最好带个 u 盘拷好 moonlight 的软件或者上传到学习通网盘之类的地方（注意要下载 portable 版本的）[Releases · moonlight-stream/moonlight-qt (github.com)](https://github.com/moonlight-stream/moonlight-qt/releases)

在机房电脑上打开软件后，同样的按加号输入我们的校园网 ip 来添加 pc，配对就比较麻烦了，因为我们不再宿舍输入不了 pin 码，这时候我们的临时控制端就登场了，因为手机上我们是配对过了的，不需要再次配对，再手机上串流我们的 pc 然后输入 pin 码就可以了，注意输入完手机端还要退出串流，不然机房电脑是串流不了的。
