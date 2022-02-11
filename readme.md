# Azure Static Web Apps遇上Azure Bot，快速部署巴士到站時間Chatbot

搭巴士都是大家日常，看巴士到站時間已經是日常習慣。唔知大家有無遇過。。。報站系統顯示器太遠，或者位置被遮住看唔到；但是看手機又要花時間找。所以設計一個Chatbot訪問巴士公司巴士到站時間。當然，Chatbot都要部署上Azure先可以是街上使用，所以Azure Static Web Apps被用作放置Azure Bot。最後，再部署Azure Static Web Apps上Azure。


## 設計
---
Chatbot完整設計如下：
![Idea](/img/Idea.001.jpeg "Project Idea")

透過Bot Framework Composer可以用即見即所得（What You See Is What You Get）介面快速設計Chatbot。最後透過部署上Azure取得Web Chat 介面 HTML code再放入Web Page上Server（Azure Static Web Apps）。

設計Chatbot之前，就要開始準備設計Azure Static Web Apps。Azure Static Web Apps需要提供三個功能，訪問巴士公司取得路線資訊及到站時間；轉換時間成指定格式；儲放Web Page。

訪問巴士公司取得路線資訊及到站時間，它是一個GraphQL Server。因為它不是今日題目既討論範圍，所以詳細原理請參考本blog source code。

轉換時間成指定格式，因為到站時間是W3C格式，所以Azure Static Web Apps需要提供API轉換成指定格式方便用家閱讀。它正好被示範如何使用Azure Static Web Apps。

儲放Web Page，利用Azure Static Web Apps本身已提供既Web Page顯示Web Chat介面。

## Part 1 : 設計Azure Static Web Apps
---
整個項目使用VS Code開發。請先建立一個Empty Folder再用VS Code打開。
### Step 1 : 安裝 VS Code Extension：Azure Static Web Apps
![VS Code Extension：Azure Static Web Apps](/img/VSCodeExt.png "VS Code Extension：Azure Static Web Apps")

### Step 2 : 建立Azure Static Web Apps
<table>
<tr>
<td>

先登入Azure Portal，在VS Code打開Azure頁面登入Azure。
![Azure Sign in](/img/AzureLogin.png "Azure Sign in")
</td>
<td>

成功登入會變成如下頁面：
![Azure Sign in After](/img/AzureLoginAfter.png "Azure Sign in After")
</td>
</tr>
</table>

建立Azure Static Web Apps項目
![建立Azure Static Web Apps項目](/img/CreateAppsProject.png "建立Azure Static Web Apps項目")

選擇Typescript
![選擇Typescript](/img/typescript.png "選擇Typescript")

建立"換時間成指定格式"服務 (Web Service)
![建立"換時間成指定格式"服務](/img/datetime-api.png "建立換時間成指定格式服務")

源碼會被自動建立，index.ts是執行換時間成指定格式"服務既地方。
![源碼會被自動建立](/img/code.png "源碼會被自動建立")

在index.ts加入"換時間成指定格式"服務源碼。請安裝以下libraries。該服務原理是利用moment轉換DateTime W3C格式成 "日/月/年 時：分：秒"。最後經過context.res返回結果結客戶端。
```
yarn add azure-functions-core-tools@3 --unsafe-perm true
yarn add moment-timezone @types/moment-timezone
```
![換時間成指定格式服務源碼](/img/finished.png "換時間成指定格式服務源碼")


## 部署Azure Static Web Apps

## 設計Chatbot

## 部署Chatbot

## 測試

## 參考
https://medium.com/@bjohnson.io/add-a-serverless-graphql-api-to-your-azure-static-web-app-ed8c085044e8
