---
title: Git/GitHub
description: 学习 Git 与 GitHub 的基础概念、常用命令和协作流程。
sidebar:
  order: 3
---

> **说明：** 本章只介绍 Git 和 GitHub 最基础的概念。想真正熟练使用 Git，请通关章末的 Learn Git Branching 游戏。

Git 和 GitHub 是参与机器人软件开发几乎每天都会用到的工具：Git 负责记录和管理代码修改，GitHub 负责托管仓库并让多人协作。

## 一. Git 与 GitHub 是什么

### 1.1 Git 是什么

Git 是一个版本控制工具。它会把项目的每一次修改记录成一次“提交”，让你可以随时查看历史、对比差异、回到过去的版本，也能让多人同时开发而不互相覆盖。

一个被 Git 管理的项目目录称为仓库。仓库里通常有一个隐藏的 `.git` 文件夹，用来保存历史记录；正常开发时不需要手动改动它。

### 1.2 GitHub 是什么

GitHub 是一个托管 Git 仓库的网站。把本地仓库推送到 GitHub 后，代码就有了远程备份，其他人也可以克隆、查看和参与修改。

GitHub 上的协作主要围绕 Pull Request（PR）展开：你在自己的分支上完成修改，提交后发起 PR，由负责人审查通过后再合并到主分支。

### 1.3 最基础的概念

| 概念 | 含义 |
| --- | --- |
| 仓库（repository） | 一个被 Git 管理的项目目录 |
| 提交（commit） | 一次保存到历史中的修改快照 |
| 分支（branch） | 从主线上分出来的一条独立开发线 |
| 远程仓库（remote） | 托管在 GitHub 等服务器上的仓库 |
| 暂存区（staging area） | `git add` 之后、`git commit` 之前存放改动的地方 |

## 二. 开始使用 Git

### 2.1 安装与配置

在 Ubuntu 中安装 Git：

```bash
sudo apt install git
```

第一次使用前配置用户名和邮箱，这些信息会记录在每次提交里：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### 2.2 第一次提交

先创建一个专门的练习目录并进入，避免直接在 `~`（家目录）里执行 `git init`。如果在家目录初始化，整个家目录都会变成 Git 仓库，容易把大量无关文件一起提交。

```bash
mkdir git-practice              # 创建练习目录
cd git-practice                 # 进入练习目录
git init                        # 把当前目录变成 Git 仓库
ls -a                           # 查看隐藏文件，找到 .git 文件夹
git add .                       # 把当前目录的改动加入暂存区
git commit -m "第一次提交"       # 保存一次提交
git log                         # 查看提交历史
```

`git init` 之后目录里会出现一个隐藏的 `.git` 文件夹，Git 的历史记录就保存在里面。

> **提示：** 练习时务必先 `mkdir` 建一个新目录再 `git init`，不要在 `~` 或其他已有目录里直接初始化仓库。

## 三. 分支与远程仓库

### 3.1 分支

```bash
git branch 分支名          # 创建分支
git checkout -b 分支名     # 创建并切换到新分支
git switch 分支名          # 切换分支
```

分支会让提交历史像树一样分叉。下面是一张分支与合并的示意图：最上面一排是主分支上的提交，从中间分出的分支经过几次提交后，再合并回主分支。

![分支与合并示意图](../assets/git-branch-merge-diagram.png 'Git 分支与合并示意')

建议新功能或文档修改都在单独的分支上进行，完成后再通过 PR 合并，避免直接改动 `main`。

### 3.2 关联远程仓库

在 GitHub 上新建一个空仓库后，把本地仓库关联上去：

```bash
git remote add origin https://github.com/用户名/仓库名.git
```

### 3.3 git push --set-upstream 是什么

把当前本地分支第一次推送到远程时，需要指定远程分支名，并建立“上游跟踪关系”：

```bash
git push --set-upstream origin docs/add-development-basics
```

各部分的作用：

- `origin`：远程仓库的默认名字。
- `docs/add-development-basics`：要推送到的远程分支名。
- `--set-upstream`（可简写为 `-u`）：记录“当前本地分支跟踪远程的这个分支”。

设置上游后，之后再运行 `git push` 或 `git pull` 就不需要每次写 `origin 分支名`，Git 会自动知道要推送到哪里。

例如我们在本站协作文档时，就是先在本地创建 `docs/add-development-basics` 分支完成修改，再用这条命令推送到 GitHub，最后发起 Pull Request。

## 四. 动手练习：通关 Learn Git Branching

推荐一个交互式 Git 学习网站：

[Learn Git Branching](https://learngitbranching.js.org/)

它把 Git 操作做成了可视化关卡，从最基础的 commit、branch，到 merge、rebase、push、pull 都有对应练习。

![Learn Git Branching 游戏界面](../assets/git-learn-branching-screenshot.png 'Learn Git Branching 游戏界面')

建议按顺序把 Main 和 Remote 两个大模块通关一遍。每关先自己尝试输入命令，再看提示；通关后能解释自己输入的命令做了什么，就说明真正理解了。

通关之后，可以回到本站再回顾一下本章前面提到的命令。这些都是日常开发中最常用的 Git 命令，配合前面的可视化练习一起理解，效果会更好。

学习完成之后，可以自己创建一个 Git 仓库，逐个尝试一下 Git 中的这些操作。重要的是掌握简单的命令操作，以及理解 Git 的设计理念——因为复杂的操作 AI 可以帮你完成，但前提是你知道 Git 能完成哪些操作。

## 参考资料

- [Learn Git Branching](https://learngitbranching.js.org/)
- [Git 官方文档](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
