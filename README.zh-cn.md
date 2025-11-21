# Gmero's Blog

简体中文 | [English](README.md)

欢迎！这是我的个人博客仓库，我在这里分享关于编程、软件工具、实用资源以及生活点滴的想法

🌐 访问：[www.gmero.com](https://www.gmero.com) | [cfblog.sxl.cc](https://cfblog.sxl.cc)

## 关于这个网站

使用 [Hugo](https://gohugo.io/)（一个超快的静态网站生成器）构建，并采用我定制的 [Mori 主题](https://github.com/g-mero/hugo-theme-mori)进行样式设计

网站同时支持英文和中文(希望有一天我也能成为不借助翻译工具的双语博主)

## 我是怎么部署的

对于中国大陆以外的区域, 我使用 [cloudflare page](https://pages.cloudflare.com/) 进行部署和托管，它是完全自动的，配置非常简单, cloudflare 的各种免费功能真的超级棒

对于中国大陆区域, 目前我是用腾讯云 LightCos + 多吉云 CDN 的方案部署, 好处是速度超快而且几乎没有成本, 这也就是为什么你能看到我的仓库里会出现 Typescript 脚本了, 这些脚本通过 GitHub Actions 自动运行，实现了上传 + CDN 刷新的功能, 很方便, 或许你可以参考它们实现你的自动化部署方案

## 许可协议

除特别标注外，文章内容默认采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 协议分享 — 欢迎在注明出处的前提下分享和改编
