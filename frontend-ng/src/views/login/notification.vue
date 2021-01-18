<template>
    <div class="login-notification">
        <el-alert
        title="恭喜你发现了试验功能"
        type="warning"
        show-icon
      >
        <template>
          <p>注意事项</p>
          <ul style="text-align: left;">
            <li>这是一个预览版，暂时仅限 META 代币持有者参与</li>
            <li>需要把 MetaMask 钱包切换到BSC网络</li>
            <li>需要你把 META 提现到 BSC 主网的私人钱包，并在下方参与 META 抵押锁仓30天，以获得30天的访问权限</li>
            <li>社区教程：👉 <a href="https://matataki.io/p/5834" target="_blank" style="color: #0088ff;">如何将FAN票提现到BSC？ ↗️</a> 👈 </li>
            <li>META 抵押锁仓有效期30天，到期可以解押提现离场，或手动申请延长锁仓30天</li>
            <li>治理委员会仍在开发中，未来可能会增删部分功能</li>
          </ul>
        </template>
      </el-alert>
    </div>
</template>
