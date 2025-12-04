---
date: "2025-12-04T14:00:00+08:00"
draft: false
title: Is Free EdgeOne Really That Good?
categories:
  - Tinker
tags:
  - CDN
  - Experience
---

Recently, while migrating my blog to Hugo, I discovered that Tencent Cloud's EdgeOne (hereinafter referred to as EO) domestic version had also been launched, and they're running a [promotion](https://cloud.tencent.com/act/pro/eo-freeplan). I scanned the lottery QR code and immediately won long-term free access to EO. Looking at it, it's similar to Cloudflare's (hereinafter referred to as CF) free CDN - unlimited traffic, but many advanced features are removed (like the Header-based CacheKey customization I wanted most), plus there's the Pages service currently in public beta (supposedly will be free forever)

## Pages Usage Experience

EO Pages is similar to CF Pages. After linking your GitHub repository, it can deploy automatically. However, many features are still missing - for instance, it doesn't support Hugo's automatic deployment. I used the traditional method: using Actions to compile and output to a specific branch, then deploying Pages to that branch. Migrating from CF Pages was quite simple. EO Pages uses edgeone.json for redirects, response header settings, and other configurations

My original blog deployment solution was Doge CDN + Tencent Cloud Lighthouse Object Storage for domestic, and CF Pages for international. The speed was decent, but Doge only has 20GB of traffic, and the deployment process was quite cumbersome (requiring Actions to compile, upload to the bucket, then refresh CDN). After migrating to EO, I only need to write an Action for compilation and pushing to a specific branch. Here's a comparison of access speeds between the two solutions:

1. Doge + CF, domestic average 0.37s, international 0.65s

   ![doge1](https://as.gmero.com/pic/2025/12/04/1764833143.png "Doge - Domestic Speed Test")

   ![doge2](https://as.gmero.com/pic/2025/12/04/1764833164.png "CF - International Speed Test")

2. EO Pages, domestic average 0.18s, international 0.49s

   ![eo1](https://as.gmero.com/pic/2025/12/04/1764833298.png "EO - Domestic Speed Test")

   ![eo2](https://as.gmero.com/pic/2025/12/04/1764833297.png "EO - International Speed Test")

As you can see, EO's domestic access speed is excellent. I ended up using the EO + CF solution

## Image Hosting/Website Acceleration

Besides migrating the blog, since Upyun doesn't support origin servers on foreign servers very well, my image hosting server was running bare for a while. I took this opportunity to try accelerating with EO. EO's website acceleration page looks much more professional compared to Pages, with various features. However, for the free tier, we only need to set up the acceleration domain, origin method, and auto certificates - quite easy to complete. The speed is relatively slower than Pages (possibly because the origin server is overseas), with some light green areas on the map, but the average is still around 0.6s

Note that if your origin server doesn't provide cache-setting response headers like Cache-Control, EO won't cache by default. In this case, you need to configure **forced caching**, otherwise it will keep going back to the origin

![Forced Cache](https://as.gmero.com/pic/2025/12/04/1764834299.png "Image Forced Cache")

By the way, EO's cache rule configuration page is quite nice - it supports multiple branches

## Summary

Overall, the EdgeOne experience is pretty good. Finally, there's an unlimited traffic free CDN with domestic acceleration nodes. Of course, we'll have to see how EdgeOne develops in the future - whether there will be more critical limitations remains to be seen
