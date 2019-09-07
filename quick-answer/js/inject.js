function sendMessageToContentScriptByPostMessage(data) {
  window.postMessage({ cmd: "message", data: data }, "*");
}

// 通过DOM事件发送消息给content-script
(function() {
  var customEvent = document.createEvent("Event");
  customEvent.initEvent("myCustomEvent", true, true);
  // 通过事件发送消息给content-script
  function sendMessageToContentScriptByEvent(data) {
    data = data || "你好，我是injected-script!";
    var hiddenDiv = document.getElementById("myCustomEventDiv");
    hiddenDiv.innerText = data;
    hiddenDiv.dispatchEvent(customEvent);
  }
  window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
})();
