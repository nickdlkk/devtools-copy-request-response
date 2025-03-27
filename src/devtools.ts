chrome.devtools.panels.create(
  "请求/响应复制工具",  // 面板标题
  "icon.png",      // 图标路径
  "panel.html",    // 面板页面
  (panel: chrome.devtools.panels.ExtensionPanel) => {
    console.log("Panel created");
  }
); 

chrome.devtools.network.onRequestFinished.addListener((request) => {
  // 获取请求内容
  request.getContent((content) => {
    if (content) {
      const requestData = {
        ...request,
        responseContent: content
      };
      console.log('onRequestFinished', requestData);
      // 发送完整的请求数据到Home组件
      chrome.runtime.sendMessage(requestData);
    } else {
      console.error('Failed to get request content');
    }
  });
});
