'use strict';

export function onInstalled() {
  // 安装逻辑
}

export function onMessage(message: any, sender: any, sendResponse: (arg0: { success: boolean; }) => void) {
  console.log('Received message:', message);
  // 处理消息并发送响应
  sendResponse({ success: true });
}

chrome.runtime.onMessage.addListener(
  (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    console.log('Message received:', message);
    // 处理消息逻辑
  }
); 