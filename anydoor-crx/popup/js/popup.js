document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.getElementById('loginButton');
    var updateButton = document.getElementById('updateButton');
    //登录按钮被点击
    loginButton.addEventListener('click', function() {
        // 获取当前标签页的 URL
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var currentTab = tabs[0];
            // 发送消息到后台脚本，并传递当前标签页的 URL
            chrome.runtime.sendMessage({ action: "login", url: currentTab.url, tabId: currentTab.id }, function(response) {
                if (response && response.success) {
                    // alert('登录成功！');
                     // 创建浏览器通知，显示登录成功消息
                     chrome.notifications.create('', {
                        type: 'basic',
                        iconUrl: '../img/icon48.png', // 替换为你的图标路径
                        title: '登录成功！',
                        message: '您已成功登录。',
                    });
                } else {
                    // alert('登录失败，请稍后重试！');
                    // 创建浏览器通知，显示登录失败消息
                    chrome.notifications.create('', {
                        type: 'basic',
                        iconUrl: '../img/icon48.png', // 替换为你的图标路径
                        title: '登录失败',
                        message: '登录失败，请稍后重试。',
                    });
                }
            });
        });
    });

    //更新按钮被点击
    updateButton.addEventListener('click', function() {
        // 页面已登录，弹出确认框
        var confirmMessage = '请确认当前页面已经登录,否则会导致令牌重置为未登录!!!';
        if (confirm(confirmMessage)) {
            // 获取当前标签页的 URL
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                var currentTab = tabs[0];
                // 发送消息到后台脚本，并传递当前标签页的 URL
                chrome.runtime.sendMessage({ action: "update", url: currentTab.url, tabId: currentTab.id,tabTitle: currentTab.title }, function(response) {
                    if (response && response.success) {
                        // 创建浏览器通知，显示登录成功消息
                        chrome.notifications.create('', {
                            type: 'basic',
                            iconUrl: '../img/icon48.png',
                            title: '更新成功！',
                            message: '已成功更新最新令牌',
                        });
                    } else {
                        // 创建浏览器通知，显示登录失败消息
                        chrome.notifications.create('', {
                            type: 'basic',
                            iconUrl: '../img/icon48.png', 
                            title: '更新失败',
                            message: '更新令牌失败，请稍后重试。',
                        });
                    }
                });
            });
        }else {
            // 用户取消更新，不执行任何操作
            console.log('用户取消更新');
        }
    });

    // 点击"退出登录"触发弹窗
    document.getElementById('logout').addEventListener('click', function() {
        chrome.storage.local.get('serverURL', function (data) {
            var serverURL = data.serverURL;
            // Step 3: 远程获取指定页面的数据
            fetch(serverURL + `/user/logout`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.code !== 200 && data.code !== undefined) {
                    sendResponse({ success: false });
                    return false;
                }
                window.location.href = "index.html";
            })
            .catch(error => {
                console.log('An error occurred while fetching the cookie information:', error);
                sendResponse({ success: false });
            });
        });
    });
});

