import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import navigationStore from '../stores/NavigationStore';
import { withPermissionsCheck } from '../utils/permissions';
import * as clipboard from 'clipboard-polyfill';

const Home = () => {
    const [requests, setRequests] = useState<chrome.devtools.network.Request[]>([]);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [responseBodies, setResponseBodies] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const messageListener = (message: any) => {
            console.log('message', message);

            // 确保message是Request对象并且有request和response属性
            if (message && message.request && message.response) {
                // 如果有responseContent，则存储响应体内容
                if (message.responseContent) {
                    setResponseBodies(prev => ({ ...prev, [message.request.url]: message.responseContent }));
                }

                setRequests(prev => [...prev, message]);
            } else {
                console.error('Invalid message object:', message);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    const getResponseBody = (request: chrome.devtools.network.Request) => {
        return responseBodies[request.request.url] || '加载中...';
    };

    const handleCopy = withPermissionsCheck(
        { permissions: ['clipboardWrite'] },
        async (htmlContent: string, plainContent: string) => {
            try {
                const item = new clipboard.ClipboardItem({
                    "text/html": new Blob([htmlContent], { type: "text/html" }),
                    "text/plain": new Blob([plainContent], { type: "text/plain" })
                });
                await clipboard.write([item]);
            } catch (error) {
                throw new Error('copy error');
            }
        }
    );

    // 显示提示消息并自动消失
    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 2000); // 2秒后自动消失
    };

    const handleCopyClick = async (request: chrome.devtools.network.Request) => {
        try {
            const htmlContent = `
<div>
  <strong>URL:</strong> ${request.request.url}<br>
  <strong>Cookies:</strong> ${request.request.cookies ? JSON.stringify(request.request.cookies) : 'N/A'}<br>
  <strong>Request Type:</strong> ${request.request.postData?.mimeType || 'N/A'}<br>
  <strong>Request Data:</strong> ${request.request.postData?.text ? JSON.stringify(JSON.parse(request.request.postData.text), null, 2) : 'N/A'}<br>
  <strong>Response Status:</strong> ${request.response.status} ${request.response.statusText}<br>
  <strong>Response Content:</strong> ${getResponseBody(request)}<br>
  <strong>Response Cookies:</strong> ${JSON.stringify(request.response.cookies, null, 2)}
</div>
            `.trim();

            const plainContent = `
URL: ${request.request.url}
Cookies: ${request.request.cookies ? JSON.stringify(request.request.cookies) : 'N/A'}
Request Type: ${request.request.postData?.mimeType || 'N/A'}
Request Data: ${request.request.postData?.text ? JSON.stringify(JSON.parse(request.request.postData.text), null, 2) : 'N/A'}
Response Status: ${request.response.status} ${request.response.statusText}
Response Content: ${getResponseBody(request)}
Response Cookies: ${JSON.stringify(request.response.cookies, null, 2)}
            `.trim();

            await handleCopy(htmlContent, plainContent);
            showToast('复制成功！');
        } catch (error) {
            console.error('复制失败:', error);
            showToast('复制失败');
        }
    };

    return (
        <div>
            <h1>请求列表</h1>
            {/* <button onClick={() => navigationStore.navigateTo('detail')}>
                Go to Detail Page
            </button> */}
            {/* 提示消息 */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '12px 24px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}>
                    {toastMessage}
                </div>
            )}

            <h2>Network Requests</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {requests.map((request, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <details>
                            <summary style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px',
                                borderRadius: '4px',
                                backgroundColor: '#f5f5f5'
                            }}>
                                <span style={{ flex: 1 }}>{request.request.url}</span>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: '#e0e0e0'
                                }}>{request.request.method}</span>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: request.response.status >= 400 ? '#ffebee' :
                                        request.response.status >= 300 ? '#fff3e0' : '#e8f5e9',
                                    color: request.response.status >= 400 ? '#c62828' :
                                        request.response.status >= 300 ? '#f57c00' : '#2e7d32'
                                }}>{request.response.status}</span>
                            </summary>
                            <div style={{
                                marginLeft: '20px',
                                marginTop: '10px',
                                padding: '12px',
                                backgroundColor: '#fafafa',
                                borderRadius: '4px',
                                position: 'relative'
                            }}>
                                <button
                                    onClick={() => handleCopyClick(request)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '10px',
                                        padding: '4px 8px',
                                        backgroundColor: '#2196F3',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    复制
                                </button>
                                <strong>URL:</strong> {request.request.url} <br />
                                <strong>Cookies:</strong> {request.request.cookies ? JSON.stringify(request.request.cookies) : 'N/A'} <br />
                                <strong>Request Type:</strong> {request.request.postData?.mimeType || 'N/A'} <br />
                                <strong>Request Data:</strong> {request.request.postData?.text ? JSON.stringify(JSON.parse(request.request.postData.text), null, 2) : 'N/A'} <br />
                                <strong>Response Status:</strong> {request.response.status} {request.response.statusText} <br />
                                <strong>Response Content:</strong> {getResponseBody(request)} <br />
                                <strong>Response Cookies:</strong> {JSON.stringify(request.response.cookies, null, 2)} <br />
                            </div>
                        </details>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default observer(Home); 