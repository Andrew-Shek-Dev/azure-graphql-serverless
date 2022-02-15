# Azure Static Web Apps遇上Azure Bot，快速部署巴士到站時間Chatbot

搭巴士都是大家日常，看巴士到站時間已經是日常習慣。唔知大家有無遇過。。。報站系統顯示器太遠，或者位置被遮住看唔到；但是看手機又要花時間找。所以設計一個Chatbot訪問巴士公司巴士到站時間。當然，Chatbot都要部署上Azure先可以是街上使用，所以Azure Static Web Apps被用作放置Azure Bot。最後，再部署Azure Static Web Apps上Azure。


## 設計
---
Chatbot完整設計如下：
![Idea](/img/Idea.001.jpeg "Project Idea")

透過Bot Framework Composer可以用即見即所得（What You See Is What You Get）介面快速設計Chatbot。最後透過部署上Azure取得Web Chat 介面 HTML code再放入Web Page上Server（Azure Static Web Apps）。

設計Chatbot之前，就要開始準備設計Azure Static Web Apps。Azure Static Web Apps需要提供三個功能，訪問巴士公司取得路線資訊及到站時間；轉換時間成指定格式API；儲放Web Page。

訪問巴士公司取得路線資訊及到站時間，它是一個GraphQL Server。因為它不是今日題目既討論範圍，所以詳細原理請參考本blog source code。

轉換時間成指定格式API，因為到站時間是W3C格式，所以Azure Static Web Apps需要提供API轉換成指定格式方便用家閱讀。它正好被示範如何使用Azure Static Web Apps。

儲放Web Page，利用Azure Static Web Apps本身已提供既Web Page顯示Web Chat介面。

## Part 1 : 設計Azure Static Web Apps
---
整個項目使用VS Code開發。請先建立一個Empty Folder再用VS Code打開。

> Azure知識分享： Azure Static Web Apps
> ---
> Azure Static Web Apps聽上去好似是Apps，其實它是一個Azure服務。它提供自動化既平台幫開發者建立和部署Web Apps（GitHub加上CI/CD)。Azure Static Web Apps當中可以包含多個靜態內容及Azure Function。例如，訪問巴士公司取得路線資訊及到站時間,轉換時間成指定格式API,儲放Web Page。
>
>[詳細說明在此](https://docs.microsoft.com/en-us/azure/static-web-apps/overview)

### Step 1 : 安裝 VS Code Extension：Azure Static Web Apps
![VS Code Extension：Azure Static Web Apps](/img/VSCodeExt.png "VS Code Extension：Azure Static Web Apps")

### Step 2 : 透過GitHub Template建立Azure Static Web Apps Project
打開以下[網站](https://github.com/staticwebdev/vanilla-basic/generate)輸入項目名稱，例如，bus-azure-bot，點擊"Create repository from template"

![GitHub Template](/img/github.png "GitHub Template")

Git Clone 以上建立既項目。
```
git clone https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/bus-azure-bot.git
```

Create Git Branch
```
git branch development
git checkout development
```

### Step 3 : 打開Azure Static Web Apps Project連結至Azure
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

點擊"＋"新增Azure Static Web Apps，輸入Azure Static Web Apps名字，例如，bus-bot-app。
![1](/img/1.png "1")

選擇地區
![2](/img/2.png "2")

選擇Custom，因為今次不會用任何Frontend Framework。
![3](/img/3.png "3")

用src folder做網站根目錄，因為有其他Backend功能需要放是項目根目錄。
![4](/img/4.png "4")

無Frontend Framework，所以無需build folder。請留空。
![5](/img/5.png "5")


如果成功會出現。。。

![7](/img/7.png "7")

<table>
<tr>
<td>

新Project會出現是Static Web Apps Panel：
![6](/img/6.png "6")
</td>
<td>

剛剛建立的項目檔案結構
![8](/img/8.png "8")
</td>
</tr>
</table>

建立Azure Function
![建立Azure Static Web Apps項目](/img/CreateAppsProject.png "建立Azure Static Web Apps項目")

選擇Typescript
![選擇Typescript](/img/typescript.png "選擇Typescript")

建立"轉換時間成指定格式"API (Web API)
![建立"換時間成指定格式"服務](/img/datetime-api.png "建立換時間成指定格式服務")

源碼會被自動建立，index.ts是執行"轉換時間成指定格式"服務既地方。
![源碼會被自動建立](/img/code.png "源碼會被自動建立")

在index.ts加入"轉換時間成指定格式"服務源碼。請安裝以下libraries。該服務原理是透過req.body接收DateTime，再利用moment轉換DateTime W3C格式成 "日/月/年 時：分：秒"。最後經過context.res返回結果結客戶端。
```
yarn add azure-functions-core-tools@3 --unsafe-perm true
yarn add moment-timezone @types/moment-timezone
```
![換時間成指定格式服務源碼](/img/finished.png "換時間成指定格式服務源碼")


> Azure知識分享： Azure Function
> ---
> 透過Azure平台部署Azure Function可以自已無須新署維護伺服器，而使用> 者可透過Azure平台使用到Azure Function。一方面可以做到快速開發，而且可以降低成本。
>
> Azure提供不同種類的Azure Function幫我們應對不同處景，大家可以參考相關[文件](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview)。
>
> 今次例子是"轉換時間成指定格式" Web API，所有HTTP Trigger被選用。


> Azure知識分享： Trigger and bindings
> ---
> 是Azure Function當中兩個好重要概念。
>
> Trigger是指發動Azure Function方式，例如，HTTP。Trigger提供的參數直接以Function Parameter既形式供Azure Function使用。
>
> Binding是指Azure Function連接各類Azure資源（例如：Blob Storage）的連結。Binding有3種類型，分別是input bindings, output bindings, or both。Binding透過function.json定義之後是Azure Function中使用。
>
> 想了解更多請看[詳細文件](https://docs.microsoft.com/en-us/azure/azure-functions/functions-triggers-bindings?tabs=csharp)
>
> 用圖解說Azure Function,Trigger and Bindings關係如下：
>
> ![ Trigger and bindings](/img/AzureFunc.jpeg "Trigger and bindings")

最終成品如下：

!["Project Structure"](/img/project_structure.png "Project Structure")

## 測試Azure Static Web Apps
### Step 1：安裝azure-functions-core-tools
```
yarn add -D azure-functions-core-tools@3 --unsafe-perm true
```
**注意： azure-functions-core-tools必需安裝成Development Tools，否則檔案過大可能造成部署失敗。**
### Step 2：執行Azure Static Web Apps
```
yarn start
```
### Step 3：使用Insomnia測試"轉換時間成指定格式"API
![Testing Result"](/img/Testing.png "Testing Result")

## 部署Azure Static Web Apps
因為GitHub Project（Azure Static Web Apps）已經連結至Azure，所以只要git push就可以自動部署上Azure。步驟如下：

請執行以下commands完成push project上GitHub，指令包括建立新Branch，development（故名思義，development用作開發，原有的Branch，main，用作Production）；checkout 新branch；更新頁面後push project上GitHub。
![Git Project](/img/git.png "Git Project")

在GitHub Project上進行Pull Request。GitHub自動提醒有update需要pull過去main branch。按"Compare & pull request" ＋ "Create Pull Request"。
![Git Pull Request](/img/git_pull.png "Git Pull Request")
![Git Pull Request](/img/git_pull_part_2.png "Git Pull Request")

當所有Test無問題，請點擊 "Merge pull request" （目前仍是staging，同時Azure會deploy上一個測試場供大家測試。點擊 "Merge pull request"後就會merge過去main branch，同時Azure會deploy上production）。
![Testing](/img/trigger_deploy.png "Testing")

等。。。完成！

打開Azure Portal找URL。Login Azure Portal > ?? > ?? 

## 設計Chatbot
今次選用Bot Framework Composer設計Chatbot，因為使用簡單直接，唔需要太多編程技巧。請到[官方網站](https://github.com/microsoft/BotFramework-Composer)下載Bot Framework Composer先。

安裝完成後，進入以介面：
![UI](/img/ui.png "UI")

建立新Chatbot項目，選擇C#，Empty Bot。
![Create Project](/img/chatbot_project.png "Create Project")

輸入Chatbot項目名稱：
![Create Project Name](/img/name.png "Create Project Name")

成功後，進入建立Chatbot介面：
![Design UI](/img/design_ui.png "Design UI")

> Azure知識分享：Dialog，Trigger and Recognizer
> ---
> Dialog是泛指對話中「一組」有「次序」、「連續」動作，包括，回應使用者、執行Web API、執行運算、儲存資料等。。。。最終可以完成一個目的，例如，得到一個資料，該資料會交俾下一個Dialog。一個Dialog接另一個Dialog，直至對話終結。
>
> 此Trigger不同Azure Function Trigger。要做到Dialog接Dialog，式者去邊個Dialog，需要發動條件，而發動條件就是Trigger，例如，Intent recognized，Trigger會看使用者回應內容(一律稱為Intent)決定去邊一個Dialog。詳細請參閱此[文件](https://docs.microsoft.com/en-us/composer/concept-events-and-triggers?tabs=v2x)。
>
> 但是，各位都會問一個問題。因為每次都要看使用者回應決定下一個Dialog，所以developers需要寫好多可能組合。語言博大精深，千變萬化。Developers逐個Case處理會比較低效率。Recognizer是幫我地解決問題。
>
> Recognizer是會使用不同方法「解讀」使用者回應，再根據分析結果決定下一個Dialog，例如，利用Regular Expression/[LUIS](https://www.luis.ai/) 抽出關鍵詞。今次Regular Expression Recognizer會被使用做例子。

### **介面介紹**：

![Left Panel](/img/left_panel.png "Left Panel")

Greeting是一個Dialog其中一個Action，佢會主動同使用者打招呼。Unknown intent是處理Chatbot未能理解的內容，例如，回應"Sorry, I didn't get that."。

### **深入了解Action，Greeting**
![Greeting](/img/greeting.png "Greeting")

簡單說就是同現時所有登入的使用者打招呼。
每一個Box有不同既功能。

笫一個，是一個Loop Box，取得所有現時新登入的使用者。

笫二個，是一個if...else... Box, 核查下是唔是新使用者登入，是就同使用者打招呼。

笫三個，回應使用者一個Message俾使用者。

大家可以點擊＋加入不同Action入整個流程任何位置。使用方法會在以下部分慢慢介紹。

![Add Action](/img/add_action.png "Add Action")

### **Bus Bot完整流程**
![Chat Flow](/img/chat_flow.jpeg "ChatFlow")

Step 1: 打招呼，要求輸入巴士路線。更改Greeting Action的Response Message（Bus Bot完整中的Box 1）。

![Step 1](/img/bot_step1.png "Step 1")

Step 2: 設定Dialog使用Regular Expression Recognizer

![Step 2](/img/bot_step2.png "Step 2")

Step 3:建立新Dialog, get_arrival_time ,處理Bus Bot完整中的Box 3，4，5及6 。

![Add Dialog](/img/add_dialog.png "Add Dialog")

<table align="center">
<tr>
<td  align="center">

![Flow 1](/img/flow_step1.png "Flow 1")

</td>
</tr>
<tr>
<td  align="center">

![Flow 2](/img/flow_step2.png "Flow 2")

</td>
</tr>
</table>

大家可以點擊＋加入不同Action，順序加入以下Action：

1. 問使用者取得巴士站名。

![S3](/img/s3.png "S3")

2. 問GraphQL Server取得巴士到站時間。

![S4](/img/s4.png "S4")

3. 暫時儲存到站時間入Properties，用以下一步轉換時間/回應使用者。

![S5](/img/s5.png "S5")

4. 回應使用者

![S6](/img/s6.png "S6")

5. 最後，如何由bus_bot trigger get_arrival_time?

![Add Trigger](/img/add_trigger.png "Add Trigger")


"\d+\w*"是Regular Expression，意思是數字開頭（1個或以上），後面是字母（0個或以上）。只要符合該條件就可以執行下一個dialog，get_arrival_time。

![Add Trigger 2](/img/add_trigger_2.png "Add Trigger 2")

下一步，設定打開get_arrival_time dialog

![Add Trigger 3](/img/add_trigger_3.png "Add Trigger 3")

![Add Trigger 4](/img/add_trigger_4.png "Add Trigger 4")

完整得Trigger成品(user.route儲存使用者提供的巴士路線備用):

![Final Trigger](/img/final_trigger.png "Final Trigger")

## 測試Chatbot

下戴及安裝[Bot Framework Emulator](https://github.com/microsoft/BotFramework-Emulator)進行本地測試。執行Bot Framework Emulator。

是Bot Framework Composer點擊右上角的"Start Bot"，開始進行測試。

![Test 1](/img/test_1.png "Test 1")

點擊"Test in Emulator", 打開Chat room。
![Test 2](/img/test_2.png "Test 2")

盡情測試吧！
![Test 3](/img/test_3.png "Test 3")

## 部署Chatbot
測試成功之後就部署上Azure，同人開心分享！由於編幅有限，而且過程簡單，所以用圖表達完整流程。

![P1](/img/p_1.png "P1")
![P2](/img/p_2.png "P2")
![P3](/img/p_3.png "P3")
![P4](/img/p_4.png "P4")
![P5](/img/p_5.png "P5")

**注意！必須uncheck所有optional resources，否則檔案過大可能造成部署失敗。**
![P6](/img/p_6.png "P6")
![P7](/img/p_7.png "P7")
![P8](/img/p_8.png "P8")
![P9](/img/p_9.png "P9")
![P10](/img/p_10.png "P10")
![P11](/img/p_11.png "P11")

等待完成就可以了。

## 完成！
![Production](/img/production_test.png "Production")