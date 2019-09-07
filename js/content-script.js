document.addEventListener("DOMContentLoaded", function() {
  injectCustomJs();
  // initCustomPanel();
});

// 向页面注入JS
function injectCustomJs(jsPath)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	temp.src = chrome.extension.getURL(jsPath);
	temp.onload = function()
	{
		// 放在页面不好看，执行完后移除掉
		this.parentNode.removeChild(this);
	};
	document.body.appendChild(temp);
}

function initCustomPanel() {
  var panel = document.createElement("div");
  panel.className = "shuati";
  panel.innerHTML = `
        <div onclick="sendMessageToContentScriptByPostMessage('next')" class="shuati-btn">下一题</div>
		<div onclick="sendMessageToContentScriptByPostMessage('report')" class="shuati-btn">纠 错</div>
        
	`;
  document.body.appendChild(panel);
}
var shuati_flag = false
window.addEventListener(
  "message",
  function(e) {
    if (window.location.href.indexOf('https://newton.meishakeji.com/game/coin/earn/knowledge/klques') == -1) return
    if (shuati_flag) return
    if (!e.data) return
    shuati_flag = true
    Array.from(document.querySelectorAll(".shuati-btn")).forEach(item => (item.style.opacity = 0.5))
    setTimeout(() => {
      shuati_flag = false
      Array.from(document.querySelectorAll(".shuati-btn")).forEach(item => (item.style.opacity = 1))
    }, 2000)
    if (e.data.data == "next") {
      [...document.querySelectorAll(".options button")].forEach(item => item.click())
      setTimeout(() =>
        [...document.querySelectorAll("button")]
          .find(item => item.innerText == "提交答案")
          .click()
      );
      new MutationObserver(() =>
        [...document.querySelectorAll("button")]
          .find(item => item.innerText == "下一题")
          .click()
      ).observe(document.querySelector(".options"), {
        childList: true
      });
      tip('下一题')
    } else if (e.data.data == "report") {
        document.querySelector(".correction-icon").click()
        tip('已提交纠错')
    }
  },
  false
);

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
		// tip(JSON.stringify(request));
    // sendResponse('我收到你的消息了：'+JSON.stringify(request));
  if (window.location.href.indexOf('https://newton.meishakeji.com/game/coin/earn/knowledge/klques') == -1) {
    // tip(JSON.stringify('请在正确页面打开'));
    window.location.href = "https://newton.meishakeji.com/game/coin/earn/knowledge/townList"
    window.open('https://docs.qq.com/sheet/DV2dEV0ZlcnBuTGty?preview_token=&t=1565750121485&coord=I22A0A0&tab=BB08J2&c=C6A0D0', '_blank')
  } else {
    if (document.querySelector('.shuati')) {
      document.querySelector('.shuati').style.display = 'none'
    } else {
      initCustomPanel();
    }
  }
});

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
  ele.innerHTML = `<div>${info}</div>`;
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(() => {
		ele.style.top = '-100px';
		setTimeout(() => {
			ele.remove();
			tipCount--;
		}, 400);
	}, 600);
}