---
title: "强化学习(11)：策略梯度方法——从价值学习到直接优化策略"
description: "当动作空间变成连续形式"
lastUpdated: 2026-06-15
draft: false
sidebar:
  label: "策略梯度"
  order: 12
---

> **来源与同步说明：** 本文同步自作者个人博客[“秦时月”](https://www.qinshiyue.icu/)。个人博客与本网站将并行维护，后续更新会继续同步到本文档中心。

## 从价值学习到策略学习

前面几篇文章一直围绕价值学习展开。从 Q-learning 到深度 Q 网络（Deep Q-Network, DQN），再到双重 DQN（Double DQN）和对偶 DQN（Dueling DQN），它们虽然在表示方式、目标构造和网络结构上有所不同，但基本思路是一致的：先学习动作价值函数，再根据动作价值函数选择动作。

在表格型 Q-learning 中，算法直接维护动作价值表 $Q(s,a)$。每个状态—动作对 $(s,a)$ 对应一个价值估计。智能体在状态 $s$ 下选择动作时，可以比较不同动作的 $Q(s,a)$，再选择当前估计价值最大的动作：
$$
a=\arg\max_a Q(s,a)
$$


到了 DQN，这个思路没有改变，只是动作价值函数的表示方式发生了变化。DQN 不再维护一张表，而是用神经网络表示动作价值函数：
$$
Q(s,a;\mathbf{w})
$$
其中，$\mathbf{w}$ 是价值网络的参数。对于离散动作空间，网络通常输入状态 $s$，输出每个离散动作对应的 Q 值。随后，智能体仍然可以通过
$$
a=\arg\max_a Q(s,a;\mathbf{w})
$$
选择当前估计最优的动作。

Double DQN 和 Dueling DQN 也仍然属于这一条主线。Double DQN 主要修改目标值的构造方式，用动作选择和动作评估的分离来缓解 Q 值高估；Dueling DQN 主要修改网络结构，把状态价值和动作优势分开建模，以提高动作价值估计的效率。尽管它们解决的问题不同，但最终学习对象依然是动作价值函数 $Q(s,a;\mathbf{w})$，策略仍然通常由 Q 值最大化间接得到。

因此，可以把前面这些方法统一理解为：

先估计每个动作的长期价值，再通过价值比较得到策略。

这种方法在离散动作空间中很自然。因为动作数量有限，智能体可以枚举所有候选动作，并计算每个动作对应的 Q 值。例如在悬崖漫步、冰湖、Atari 游戏这类任务中，动作通常是有限集合，取最大值并不困难。

但是，当动作空间（Action Space）变成连续形式时，事情会变得复杂。机器人控制就是典型例子。机械臂关节力矩、四足机器人关节目标位置、无人车转向角和油门大小，往往都是连续变量。在这种情况下，动作 $a$ 不再只是有限集合中的某个编号，而可能是一个连续向量。此时，要直接计算
$$
\arg\max_a Q(s,a;\mathbf{w})
$$
就不再简单。因为这相当于在一个连续空间中寻找使 Q 值最大的动作，本身又变成了一个新的优化问题。

除了连续动作空间之外，策略本身是否需要保持随机性，也会影响价值学习方法的适用性。在许多任务中，随机策略（Stochastic Policy）很有意义。它可以帮助智能体持续探索，也可以在环境具有随机性或多种合理动作并存时，保留更灵活的行为模式。可是基于 $\arg\max_a Q(s,a)$ 的动作选择天然偏向确定性选择：在给定状态下，总是选择当前 Q 值最大的动作。虽然可以通过 $\epsilon$-贪心策略等方式加入探索，但这种随机性通常是外加的，而不是策略函数本身直接学习出来的。

于是，强化学习中自然引出了另一类方法：策略梯度方法（Policy Gradient Method）。

策略梯度方法的基本思想是直接学习策略本身。也就是说，不再先学习一个动作价值函数，然后通过最大化 Q 值间接得到动作，而是直接把策略写成一个带参数的函数：
$$
\pi(a\mid s;\boldsymbol{\theta})
$$
其中，$\boldsymbol{\theta}$ 表示策略参数。这个策略函数描述的是：在状态 $s$ 下，智能体采取动作 $a$ 的概率。

这样一来，学习对象就从动作价值函数转向了策略函数本身。对于离散动作空间，$\pi(a\mid s;\boldsymbol{\theta})$ 可以输出不同动作的概率分布；对于连续动作空间，它也可以输出某个连续概率分布的参数，例如高斯分布的均值和方差。智能体随后从这个分布中采样动作，并与环境交互。

这个转变非常重要。价值学习的核心是“评价动作有多好”，策略学习的核心是“调整动作被选择的概率”。在策略梯度方法中，算法直接关心怎样修改 $\boldsymbol{\theta}$，才能让更有利于长期回报的动作更容易被选择。

接下来要讨论的问题就是：既然策略已经被参数化为 $\pi(a\mid s;\boldsymbol{\theta})$，那么应该用什么目标函数来评价这组参数的好坏，以及怎样沿着这个目标函数的梯度方向更新策略。

## 策略函数与优化目标

在价值学习方法中，策略通常由动作价值函数间接得到。也就是说，算法先估计 $Q(s,a)$ 或 $Q(s,a;\mathbf{w})$，再通过比较不同动作的价值来选择动作。而在策略梯度方法中，学习对象直接变成了策略本身。

这里把策略写成参数化形式：
$$
\pi(a\mid s;\boldsymbol{\theta})
$$
其中，$s$ 表示当前状态，$a$ 表示动作，$\boldsymbol{\theta}$ 表示策略参数。这个函数的含义是：在状态 $s$ 下，智能体以多大概率选择动作 $a$。

如果动作空间是离散的，那么 $\pi(a\mid s;\boldsymbol{\theta})$ 可以输出一个概率分布。例如，某个状态下有三个可选动作 $a_1,a_2,a_3$，策略网络可能输出：
$$
\pi(a_1\mid s;\boldsymbol{\theta})=0.2,\quad
\pi(a_2\mid s;\boldsymbol{\theta})=0.5,\quad
\pi(a_3\mid s;\boldsymbol{\theta})=0.3
$$
这表示智能体在当前状态下更倾向于选择 $a_2$，但仍然保留选择其他动作的可能性。动作不再由一个简单的最大值操作决定，而是从策略给出的概率分布中采样得到。

如果动作空间是连续的，策略也可以表示为一个连续概率分布。例如，在机器人控制中，动作可能是关节目标位置、关节速度或力矩。此时，策略网络可以输出高斯分布（Gaussian Distribution）的参数，再从这个分布中采样连续动作。这样就避免了在连续动作空间中显式求解
$$
\arg\max_a Q(s,a;\mathbf{w})
$$
所带来的困难。

因此，策略函数 $\pi(a\mid s;\boldsymbol{\theta})$ 与动作价值函数 $Q(s,a;\mathbf{w})$ 的角色并不相同。动作价值函数回答的是“在状态 $s$ 下执行动作 $a$ 的长期价值是多少”；策略函数回答的是“在状态 $s$ 下应该以多大概率执行动作 $a$”。前者偏向评价，后者直接给出行为分布。

有了参数化策略之后，接下来就需要定义学习目标。强化学习的目标仍然是最大化长期回报，只是现在要直接通过调整策略参数 $\boldsymbol{\theta}$ 来实现这一点。

一种常见写法是：
$$
J(\boldsymbol{\theta})=\mathbb{E}_{\pi_{\boldsymbol{\theta}}}[G_0]
$$
其中，$J(\boldsymbol{\theta})$ 表示策略参数 $\boldsymbol{\theta}$ 对应的目标函数，$G_0$ 表示从初始时刻开始得到的回报，$\mathbb{E}*{\pi*{\boldsymbol{\theta}}}$ 表示期望是在当前策略 $\pi(a\mid s;\boldsymbol{\theta})$ 诱导的数据分布下计算的。

这个式子表达的意思很直接：如果智能体按照当前参数 $\boldsymbol{\theta}$ 对应的策略行动，那么它会在环境中产生一批轨迹；这些轨迹会对应不同的回报；策略学习的目标就是让这些回报的期望尽可能大。

这里需要注意，$J(\boldsymbol{\theta})$ 之所以依赖于 $\boldsymbol{\theta}$，不只是因为动作概率本身由 $\boldsymbol{\theta}$ 决定，更因为策略参数改变后，智能体与环境交互产生的轨迹分布也会改变。

具体来说，当 $\boldsymbol{\theta}$ 发生变化时，状态 $s$ 下不同动作被选择的概率会发生变化。动作选择改变以后，环境后续转移到哪些状态、得到哪些奖励，也会随之改变。于是，从初始状态出发，智能体实际访问到的状态序列、动作序列和奖励序列都会受到策略参数影响。

可以把一条轨迹写成：
$$
\tau=(s_0,a_0,r_0,s_1,a_1,r_1,\dots)
$$
在策略 $\pi(a\mid s;\boldsymbol{\theta})$ 下，不同轨迹 $\tau$ 出现的概率由两部分共同决定：一部分来自策略对动作的选择概率，另一部分来自环境的状态转移规律。虽然环境规律本身不由 $\boldsymbol{\theta}$ 控制，但动作选择概率由 $\boldsymbol{\theta}$ 决定，因此轨迹分布整体仍然会随着 $\boldsymbol{\theta}$ 改变。

这就是策略学习和普通监督学习优化之间的一个重要差别。在监督学习中，训练数据通常被看作固定数据集，优化参数主要改变模型输出；而在强化学习中，策略参数不仅改变当前动作输出，还会改变后续采样到的数据分布。也就是说，策略参数影响的不只是“当前怎么选动作”，还包括“之后会经历什么”。

因此，策略梯度方法要解决的核心问题可以表述为：

既然策略学习的目标是最大化
$$
J(\boldsymbol{\theta})
$$
那么能否直接计算或估计它关于策略参数的梯度
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})
$$
并沿着这个方向更新策略。

如果这个思路成立，策略参数就可以按梯度上升（Gradient Ascent）的方式更新：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha \nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})
$$
其中，$\alpha$ 是学习率（Learning Rate），控制每次参数更新的步长。

这个更新形式与前面价值函数近似中的梯度下降很相似，但方向相反。价值函数近似中常常最小化预测误差，因此沿负梯度方向下降；这里的目标是最大化期望回报，因此沿正梯度方向上升。

到这里，策略梯度方法的整体轮廓已经清楚：先用 $\boldsymbol{\theta}$ 参数化策略，再定义期望回报目标 $J(\boldsymbol{\theta})$，最后尝试根据 $\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})$ 更新策略参数。后面真正关键的问题，就是这个梯度应该怎样理解、怎样估计，以及它为什么能够指导策略改进。

## 策略梯度的基本思路

有了策略学习的目标函数
$$
J(\boldsymbol{\theta})=\mathbb{E}_{\pi_{\boldsymbol{\theta}}}[G_0]
$$
之后，下一步自然就是考虑如何优化它。这里的 $J(\boldsymbol{\theta})$ 表示策略参数 $\boldsymbol{\theta}$ 对应的期望回报，因此策略学习的目标可以写成：
$$
\max_{\boldsymbol{\theta}} J(\boldsymbol{\theta})
$$
如果能够得到 $J(\boldsymbol{\theta})$ 关于策略参数的梯度
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})
$$
那么就可以沿着这个方向调整 $\boldsymbol{\theta}$，使期望回报增大。这里使用的是梯度上升（Gradient Ascent），因为目标是最大化回报。

对应的参数更新形式为：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha \nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})
$$
其中，$\alpha$ 是学习率（Learning Rate），控制每次更新的幅度。

这个式子表达的含义是：如果某个参数方向能够让 $J(\boldsymbol{\theta})$ 增大，就沿着这个方向对策略参数做小幅调整。经过多次更新后，策略会逐渐倾向于产生更高回报的行为。

不过，在强化学习中，计算这个梯度并不简单。原因在于，$J(\boldsymbol{\theta})$ 不是固定数据集上的普通损失函数。它的期望建立在策略 $\pi_{\boldsymbol{\theta}}$ 产生的轨迹分布上。也就是说，$\boldsymbol{\theta}$ 改变以后，不仅动作选择概率会改变，后续访问到的状态、获得的奖励，以及整条轨迹出现的概率都会随之改变。

因此，策略梯度方法真正要解决的是：如何在轨迹分布也依赖 $\boldsymbol{\theta}$ 的情况下，得到一个可以用采样估计的梯度表达式。

这正是策略梯度定理要回答的问题。它的核心结论可以直观理解为：策略参数的更新方向由两个因素共同决定。

第一，当前动作的选择概率会怎样随着参数变化而变化。也就是说，如果希望某个动作在状态 $s_t$ 下更容易被选中，参数应该朝哪个方向调整。

第二，当前动作带来的长期效果如何。也就是说，这个动作之后获得的回报或价值是否足够高，是否值得提高它的选择概率。

把这两个因素合在一起，就得到策略梯度方法的基本思想：如果某个动作在某个状态下带来了较高的长期回报，就提高策略在类似状态下选择这个动作的概率；如果某个动作带来的长期回报较低，就减少它对策略更新的正向影响，后面引入基线之后，还可以进一步降低这类动作的选择概率。

常见的策略梯度表达式为：
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta}) =
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}
\left[
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
Q_{\pi}(s_t,a_t)
\right]
$$
这个公式看起来比前面的价值更新更抽象，但结构并不复杂。期望符号
$$
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}
$$
表示样本来自当前策略 $\pi_{\boldsymbol{\theta}}$ 与环境交互产生的数据分布。括号内部有两部分。

第一部分是
$$
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
它表示：怎样调整策略参数，才能提高当前状态 $s_t$ 下当前动作 $a_t$ 被选中的概率。这里使用对数概率 $\log \pi(a_t\mid s_t;\boldsymbol{\theta})$，是因为它可以把“概率变化”转化成更方便求梯度的形式。

第二部分是
$$
Q_{\pi}(s_t,a_t)
$$
它表示：在当前策略 $\pi$ 下，状态 $s_t$ 中执行动作 $a_t$ 之后的长期价值。这个值越大，说明当前动作越值得被鼓励；这个值越小，说明当前动作对策略改进的贡献越有限。

因此，这个策略梯度公式可以理解为：
$$
\text{更新方向} =
\text{提高当前动作概率的方向}
\times
\text{当前动作的长期价值}
$$
也就是说，$\nabla_{\boldsymbol{\theta}}\log \pi(a_t\mid s_t;\boldsymbol{\theta})$ 给出参数应该怎样变化，$Q_{\pi}(s_t,a_t)$ 决定这次变化应该有多强。二者共同决定了策略参数的更新方向。

这一点体现了策略梯度方法和价值学习方法的区别。价值学习先估计动作价值，再通过最大化动作价值选择动作；策略梯度方法直接调整动作概率，使高长期回报的动作更容易被采样到。下一步就可以进一步讨论：在实际算法中，$Q_{\pi}(s_t,a_t)$​ 往往未知，应该怎样用采样得到的回报来近似它。

## REINFORCE 算法

上一节已经给出了策略梯度的一般形式：
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})=
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}
\left[
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
Q_{\pi}(s_t,a_t)
\right]
$$
这个公式说明，策略参数的更新可以由两部分共同决定：一部分是当前动作概率对参数的梯度，另一部分是当前动作在当前策略下的长期价值。

但在实际问题中，$Q_{\pi}(s_t,a_t)$ 通常是未知的。因为它本身就是一个期望：
$$
Q_{\pi}(s_t,a_t) =
\mathbb{E}_{\pi}
\left[
G_t \mid s_t,a_t
\right]
$$
也就是说，它表示在状态 $s_t$ 下执行动作 $a_t$ 之后，继续按照策略 $\pi$ 行动所能获得的期望回报。既然这个期望无法直接得到，那么一个自然的想法是：用实际采样得到的回报 $G_t$ 来近似它。

这就得到 REINFORCE 算法。

REINFORCE 是一种最基础的蒙特卡洛式策略梯度方法（Monte Carlo Policy Gradient Method）。它不单独学习动作价值函数，而是让智能体按照当前策略完整地采样一个回合，然后根据这个回合中每个时间步之后实际获得的回报来更新策略参数。

设智能体按照当前策略 $\pi(a\mid s;\boldsymbol{\theta})$ 采样得到一条回合轨迹：
$$
s_0,a_0,r_0,s_1,a_1,r_1,\dots,s_T
$$
对于其中任意时间步 $t$，可以计算从该时刻开始的折扣回报：
$$
G_t =
r_t+\gamma r_{t+1}+\gamma^2 r_{t+2}+\cdots+\gamma^{T-t-1}r_{T-1}
$$
然后用 $G_t$ 近似 $Q_{\pi}(s_t,a_t)$，得到更新形式：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
G_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个式子可以直接对应上一节的策略梯度公式。原来公式中的 $Q_{\pi}(s_t,a_t)$ 是理论上的动作价值，现在用一次采样得到的实际回报 $G_t$ 替代。这样虽然会带来随机误差，但可以在不知道真实动作价值函数的情况下完成策略更新。

如果对一个完整回合中的所有时间步统一更新，也可以写成：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\sum_{t=0}^{T-1}
G_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个公式表示：一个回合结束后，算法回看这个回合中每个时间步采取过的动作。如果某个动作之后得到的回报 $G_t$ 较大，就沿着提高该动作概率的方向更新参数；如果 $G_t$ 较小，则这一步对策略的正向推动较弱。

这里需要注意，REINFORCE 使用的是完整回合后的实际回报，因此它和前面讲过的蒙特卡洛方法在思想上是一致的。蒙特卡洛方法用完整回报 $G_t$ 估计状态价值或动作价值；REINFORCE 则用完整回报 $G_t$ 估计策略梯度中的动作价值项。

因此，REINFORCE 的基本流程可以概括为：

按照当前策略采样一个完整回合；

计算每个时间步对应的回报 $G_t$；

用 $G_t\nabla_{\boldsymbol{\theta}}\log \pi(a_t\mid s_t;\boldsymbol{\theta})$ 估计策略梯度；

沿梯度上升方向更新策略参数 $\boldsymbol{\theta}$。

从形式上看，REINFORCE 非常直接。它不需要显式求解
$$
\arg\max_a Q(s,a)
$$
也不需要为每个动作先估计一个 Q 值。策略本身就是学习对象，参数更新直接作用在动作概率上。这使它能够自然表示随机策略，也为后续连续动作控制方法打下基础。

不过，REINFORCE 也有明显局限。由于它使用完整回报 $G_t$ 作为更新信号，而完整回报会受到整个后续轨迹随机性的影响，所以估计方差通常较大。即使在相同状态下采取相同动作，后续轨迹不同，最终得到的 $G_t$ 也可能差异明显。这会导致每次策略更新方向波动较大，训练过程不够稳定。

另外，REINFORCE 通常需要等到一个回合结束后才能计算完整回报并更新策略。这使它在长回合任务中更新不够及时，样本效率也往往不高。

因此，REINFORCE 的意义更多在于给出了策略梯度方法最基础、最清晰的形式：用采样回报估计动作价值，再直接更新策略参数。后续更复杂的方法，通常会围绕两个方向改进它：一是降低回报估计的方差，二是让策略更新更加稳定和高效。

## 基线与方差降低

上一节已经看到，REINFORCE 使用采样回报 $G_t$ 来近似动作价值 $Q_\pi(s_t,a_t)$，从而得到更新公式：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
G_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个形式很直接，但它也带来了一个重要问题：$G_t$ 的方差通常较大。

原因在于，$G_t$ 是从时刻 $t$ 开始直到回合结束的完整回报。它不仅受到当前动作 $a_t$ 的影响，还会受到后续动作选择、环境随机性以及较远未来奖励的影响。因此，即使在同一个状态 $s_t$ 下采取同一个动作 $a_t$，不同轨迹上得到的 $G_t$ 也可能差异很大。

这会使策略更新方向产生较强波动。某一次轨迹中，一个动作可能只是因为后续随机结果较好而得到较大 $G_t$；另一次轨迹中，同样的动作也可能因为后续结果较差而得到较小 $G_t$。如果直接用这些回报作为更新权重，策略参数每次更新都会带有较强噪声，训练过程就可能不稳定。

为了缓解这个问题，可以引入基线（Baseline）。

基线的基本思想是：在不改变策略梯度期望方向的前提下，从回报中减去一个与动作无关的参考值。常见写法为：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\big(G_t-b(s_t)\big)
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
其中，$b(s_t)$ 是状态 $s_t$ 下的基线函数。它可以理解为在状态 $s_t$ 下的一个平均水平参考值。

最常见的选择是使用状态价值函数：
$$
b(s_t)=V_\pi(s_t)
$$
这样，更新公式就变成：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\big(G_t-V_\pi(s_t)\big)
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个式子的含义比原来的 REINFORCE 更新更精细。原始更新中，$G_t$ 只表示“这个动作之后得到了多少回报”；而减去 $V_\pi(s_t)$ 之后，括号中的量表示“这个动作之后得到的回报，比当前状态下的平均水平高多少”。

也就是说，更新依据不再只是回报的绝对大小，而是回报相对于当前状态平均水平的优势。

如果
$$
G_t - V_\pi(s_t) > 0
$$
说明在状态 $s_t$ 下采取动作 $a_t$ 后得到的回报高于当前状态的平均水平，因此应该提高该动作被选择的概率。

如果
$$
G_t - V_\pi(s_t) < 0
$$
说明这个动作对应的结果低于当前状态的平均水平，因此更新会降低该动作在类似状态下被选择的概率。

如果
$$
G_t - V_\pi(s_t) \approx 0
$$
说明这个动作的结果接近平均水平，对策略参数的影响就较小。

这里的
$$
G_t - V_\pi(s_t)
$$
可以看作优势函数（Advantage Function）的采样估计。优势函数通常写作：
$$
A_\pi(s_t,a_t)=Q_\pi(s_t,a_t)-V_\pi(s_t)
$$
它衡量的是：在状态 $s_t$ 下选择动作 $a_t$，相比于当前策略在该状态下的平均表现，究竟好多少。

从这个角度看，带基线的策略梯度可以写成更一般的形式：
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta}) =
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}
\left[
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
A_\pi(s_t,a_t)
\right]
$$
这个形式非常重要。它说明策略更新真正应该关注的，不只是某个动作的价值高不高，而是这个动作是否比当前状态下的平均动作更好。

基线为什么不能依赖动作，也需要说明清楚。策略梯度中的更新对象是动作概率。如果减去的基线 $b(s_t)$ 只依赖状态，而不依赖动作，那么它只是在当前状态下提供一个统一的参考水平，不会偏向某个具体动作。这样做可以降低估计方差，同时不改变策略梯度的期望方向。

如果基线依赖动作，例如写成 $b(s_t,a_t)$，那么它就可能改变不同动作之间的相对更新权重，从而引入偏差。因此，作为基线使用的函数通常要求与当前采样动作无关。

引入基线之后，REINFORCE 可以得到一个更稳定的版本：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\sum_{t=0}^{T-1}
\big(G_t-V_\pi(s_t)\big)
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个公式仍然使用完整回合后的回报 $G_t$，因此它仍然保留蒙特卡洛式策略梯度的特点。但由于减去了状态价值基线，更新信号从“绝对回报”变成了“相对优势”，方差通常会降低，训练也会更稳定。

当然，这里又产生了一个新的问题：$V_\pi(s_t)$ 本身通常也是未知的。如果要使用状态价值函数作为基线，就需要再学习一个价值函数近似器。这样，策略梯度方法就会从单纯的策略网络，逐渐走向同时学习策略和价值函数的结构。

这正是后续行动器—评判器方法（Actor-Critic Method）的基本出发点。其中，行动器（Actor）负责表示和更新策略，评判器（Critic）负责估计价值函数，并为策略更新提供更稳定的评价信号。

到这里，本文已经从价值学习过渡到了策略梯度方法：先直接参数化策略，再用期望回报定义目标，通过策略梯度更新参数；REINFORCE 给出了最基础的蒙特卡洛式实现，而基线进一步说明了如何降低策略梯度估计的方差。后续更复杂的策略优化方法，基本都可以看作在这一框架上的改进。

## 从 REINFORCE 到 Actor-Critic

引入基线之后，策略梯度方法已经从原始的 REINFORCE 形式向更稳定的方向推进了一步。原始 REINFORCE 直接使用完整回报 $G_t$ 作为更新权重：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
G_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
带基线之后，更新变为：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\big(G_t - V_\pi(s_t)\big)
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这一步的核心变化在于，更新信号从“回报本身”变成了“相对于当前状态平均水平的回报差异”。也就是说，策略不再简单鼓励所有高回报动作，而是鼓励那些比当前状态平均表现更好的动作。

但是，这里还有一个没有解决的问题：$V_\pi(s_t)$ 通常并不是已知量。

如果希望使用 $V_\pi(s_t)$ 作为基线，就需要额外估计状态价值函数。最直接的做法是再引入一个参数化函数：
$$
V(s;\mathbf{w})
$$
其中，$\mathbf{w}$ 是价值函数参数。这个函数用于近似当前策略下的状态价值函数 $V_\pi(s)$。于是，策略更新中的基线可以写成：
$$
V(s_t;\mathbf{w})
$$
对应的策略更新为：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\big(G_t - V(s_t;\mathbf{w})\big)
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这样，算法中就同时出现了两个需要学习的对象：

策略函数：
$$
\pi(a\mid s;\boldsymbol{\theta})
$$
价值函数：
$$
V(s;\mathbf{w})
$$
前者负责产生动作，后者负责评价状态。这个结构已经接近行动器—评判器方法（Actor-Critic Method）的基本形式。

在 Actor-Critic 中，行动器（Actor）指的是策略函数 $\pi(a\mid s;\boldsymbol{\theta})$。它决定智能体在状态 $s$ 下采取什么动作，并通过策略梯度进行更新。评判器（Critic）指的是价值函数，例如 $V(s;\mathbf{w})$ 或 $Q(s,a;\mathbf{w})$。它不直接决定动作，而是负责估计当前状态或动作的价值，为策略更新提供评价信号。

从这个角度看，REINFORCE 和 Actor-Critic 的区别可以先这样理解：

REINFORCE 使用完整回报 $G_t$ 估计策略梯度中的价值项，因此它是蒙特卡洛式的策略梯度方法。Actor-Critic 则引入一个学习得到的价值函数，用它来提供更及时、更稳定的评价信号。

例如，在一步 Actor-Critic 中，可以用时序差分误差
$$
\delta_t = r_t+\gamma V(s_{t+1};\mathbf{w})-V(s_t;\mathbf{w})
$$
近似优势函数。于是策略更新可以写成：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\delta_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
这个式子和带基线的 REINFORCE 很相似，只是把
$$
G_t - V(s_t;\mathbf{w})
$$
替换成了
$$
\delta_t = r_t+\gamma V(s_{t+1};\mathbf{w})-V(s_t;\mathbf{w})
$$
这样做的好处是更新可以更加及时。REINFORCE 需要等到一个完整回合结束后才能计算 $G_t$，而 Actor-Critic 可以在每一步交互后利用 TD 误差更新策略。这使它更适合长回合任务和持续性任务。

不过，这里暂时不展开 Actor-Critic 的完整算法。本文的重点是策略梯度方法的基本思想：从直接参数化策略开始，定义期望回报目标，再通过策略梯度更新策略参数。Actor-Critic 可以看作是这一思想的进一步发展，它把策略学习和价值估计结合起来，为后续 PPO、DDPG、SAC 等深度强化学习算法提供了基础结构。

## 小结

本文从价值学习方法出发，引出了策略梯度方法。

前面几篇讨论的 Q-learning、DQN、Double DQN 和 Dueling DQN，都可以归入价值学习主线。它们的共同点是先学习动作价值函数 $Q(s,a)$ 或 $Q(s,a;\mathbf{w})$，再通过
$$
\arg\max_a Q(s,a)
$$
间接得到动作选择。这种方法在离散动作空间中很自然，但在连续动作空间中，显式求解最大 Q 值动作会变得困难。同时，如果希望策略本身保持随机性，单纯依靠 $\arg\max$ 也不够直接。

策略梯度方法提供了另一条思路：直接把策略参数化为
$$
\pi(a\mid s;\boldsymbol{\theta})
$$
并把策略学习写成最大化期望回报的问题：
$$
J(\boldsymbol{\theta}) =
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}[G_0]
$$
在这个目标下，策略参数可以沿梯度上升方向更新：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta})
$$
策略梯度定理给出了一个可采样估计的梯度形式：
$$
\nabla_{\boldsymbol{\theta}}J(\boldsymbol{\theta}) =
\mathbb{E}_{\pi_{\boldsymbol{\theta}}}
\left[
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
Q_{\pi}(s_t,a_t)
\right]
$$
其中，$\nabla_{\boldsymbol{\theta}}\log \pi(a_t\mid s_t;\boldsymbol{\theta})$ 表示提高当前动作概率的参数方向，$Q_\pi(s_t,a_t)$ 表示当前动作的长期价值。二者相乘，表示如果某个动作带来了更高长期回报，就提高它在类似状态下被选择的概率。

REINFORCE 是最基础的策略梯度算法。它使用采样得到的完整回报 $G_t$ 近似 $Q_\pi(s_t,a_t)$，对应更新形式为：
$$
\boldsymbol{\theta}
\leftarrow
\boldsymbol{\theta}
+
\alpha
G_t
\nabla_{\boldsymbol{\theta}}
\log \pi(a_t\mid s_t;\boldsymbol{\theta})
$$
REINFORCE 的优点是形式清晰，可以直接优化随机策略，也不需要对动作空间执行 $\arg\max$。它的局限也很明显：由于使用完整回报 $G_t$，梯度估计方差较大，训练过程可能不稳定，样本效率通常不高。

为了降低方差，可以引入基线。最常见的基线是状态价值函数 $V_\pi(s_t)$，此时更新信号变为：
$$
G_t - V_\pi(s_t)
$$
它可以看作优势函数 $A_\pi(s_t,a_t)$ 的采样估计，表示当前动作相对于当前状态平均水平的好坏。进一步，如果用参数化价值函数 $V(s;\mathbf{w})$ 估计这个基线，就自然过渡到 Actor-Critic 方法。

至此，强化学习的学习对象已经从动作价值函数扩展到了策略函数本身。后续很多深度强化学习算法，如 PPO、DDPG、SAC 等，都可以在策略梯度和 Actor-Critic 结构的基础上继续理解。
