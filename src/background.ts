// 使用import语法
import { onInstalled, onMessage } from './backgroundUtils';

// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// 监听消息事件
chrome.runtime.onMessage.addListener(onMessage);

// 示例：监听浏览器动作点击
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked', tab);
});

// 使用chrome API时添加类型声明
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  console.log('Tab updated:', tabId);
});