// 定义服务器地址
const serverURL = "http://anydoor.sqtan.com";
// 将服务器地址存储到 chrome.storage 中
chrome.storage.local.set({ serverURL: serverURL });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 登录操作
    if (request.action === "login") {
        return login(request, sendResponse);
    }
    //更新操作
    if (request.action === "update") {
        return update(request, sendResponse);
    }
});

/**
 * 执行登录操作
 * @param {Object} request - 请求对象
 * @param {Function} sendResponse - 发送响应函数
 */
function login(request, sendResponse) {
    // 获取服务器地址
    chrome.storage.local.get('serverURL', function (data) {
        var serverURL = data.serverURL;
        var url = request.url;
        var tabId = request.tabId; // 获取标签页 ID

        // Step 1: 从主页面获取目标页面的Url
        const rootDomain = new URL(url).hostname;
        console.log('当前标签页的URL是: ' + rootDomain);

        if (!rootDomain) {
            console.log('Failed to extract root domain.');
            sendResponse({ success: false });
            return;
        }

        debugger
        // 在 Step 2 之前，删除当前域名下的所有 Cookie
        const baseRootDomain = getBaseDomain(rootDomain);

        chrome.cookies.getAll({}, function (cookies) {
            cookies.forEach(function (cookie) {
                const baseCookieDomain = getBaseDomain(cookie.domain);
                // 使用endsWith判断是否属于同一分组
                if (baseCookieDomain === baseRootDomain) {
                    console.log('Found cookie from the same group:', cookie);
                    // 删除当前cookie
                    chrome.cookies.remove({
                        url: `https://${cookie.domain}${cookie.path}`, // 使用cookie的域和路径
                        name: cookie.name
                    }, function (removedCookie) {
                        console.log("Removed cookie:", removedCookie);
                    });
                }
            });


            // Step 3: 远程获取指定页面的数据
            fetch(serverURL + `/cookieManage/getCookie?domain=${rootDomain}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const cookies = data;
                if (data.code !== 200 && data.code !== undefined) {
                    sendResponse({ success: false });
                    return false;
                }
                // Step 4: 检查当前页面的网站
                if (!Array.isArray(cookies) || cookies.length === 0) {
                    alert('当前站点不支持一键登录!');
                    sendResponse({ success: false });
                    return;
                }
                // Step 5: 解析返回的数据
                cookies.forEach(function (cookie) {
                    // Step 6: 过滤掉其他的异常Cookie
                    // if (cookie.domain === rootDomain) {
                        const cookieData = JSON.parse(cookie.cookie);
                        cookieData.forEach(function (cookieItem) {
                            // Step 7: 设置页面中的Cookie
                            chrome.cookies.set({
                                url: url,
                                name: cookieItem.name,
                                value: cookieItem.value,
                                domain: cookieItem.domain,
                                path: cookieItem.path,
                                secure: cookieItem.secure,
                                expirationDate: Math.floor(cookieItem.expirationDate) // 转换为整数
                            }, (result) => {
                                if (chrome.runtime.lastError) {
                                    console.error(`Failed to set cookie: ${cookieItem.name}, Error: ${chrome.runtime.lastError.message}`);
                                } else {
                                    console.log(`Successfully set cookie: ${cookieItem.name}`);
                                }
                            });
                        });
                    // }
                });
                // Step 8: 刷新页面
                if (tabId) {
                    chrome.tabs.reload(tabId); // 仅当 tabId 有效时才刷新页面
                }
                sendResponse({ success: true }); // 在这里设置完成后，记得发送响应给 popup.js，指示登录是否成功
            })
            .catch(error => {
                console.log('An error occurred while fetching the cookie information:', error);
                sendResponse({ success: false });
            });
        }); 
    });
    return true; // 需要返回 true 来指示异步消息处理
}

/**
 * 执行更新操作
 * @param {Object} request - 请求对象
 * @param {Function} sendResponse - 发送响应函数
 */
function update(request, sendResponse) {
    // 获取服务器地址
    chrome.storage.local.get('serverURL', function (data) {
        var serverURL = data.serverURL;
        var url = request.url;
        var tabId = request.tabId; // 获取标签页 ID
        var title = request.tabTitle; // 获取标签页 ID
        // Step 1: 从主页面获取目标页面的Url
        const rootDomain = new URL(url).hostname;
        console.log('当前标签页的URL是: ' + rootDomain);
        if (!rootDomain) {
            console.log('Failed to extract root domain.');
            sendResponse({ success: false });
            return;
        }
        // 在 Step 2 之前，获取当前域名下的所有 Cookie
        chrome.cookies.getAll({}, function (cookies) {
            var cookieJson = [];
            const baseRootDomain = getBaseDomain(rootDomain);
            cookies.forEach(function (cookie) {
                const baseCookieDomain = getBaseDomain(cookie.domain);
                // 使用endsWith判断是否属于同一分组
                if (baseRootDomain===baseCookieDomain) {
                    console.log('Found cookie from the same group:', cookie);
                    cookieJson.push({
                        name: cookie.name,
                        value: cookie.value,
                        domain: cookie.domain,
                        path: cookie.path,
                        secure: cookie.secure,
                        httpOnly: cookie.httpOnly,
                        expirationDate: cookie.expirationDate
                    });
                }
            });
            debugger
            var cookieStr = JSON.stringify(cookieJson);

            // 发送CookieJson字符串到指定接口
            var projectId = rootDomain.split('.').slice(-2)[0]; // 从rootDomain中获取projectId
            var projectName = title; // 使用tabId作为projectName
            var data = {
                projectId: projectId,
                projectName: projectName,
                domain: rootDomain,
                cookieStr: cookieStr
            };
            fetch(serverURL + '/cookieManage/insertAndUpdateCookie', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(responseData => {
                    if (responseData.code !== 200 && responseData.code !== undefined) {
                        sendResponse({ success: false });
                        return false;
                    }
                    if (responseData !== 0) {
                        console.log('Cookie插入和更新成功！');
                        sendResponse({ success: true });
                    } else {
                        console.log('Cookie插入和更新失败！');
                        sendResponse({ success: false });
                    }
                })
                .catch(error => {
                    console.log('An error occurred while inserting and updating the cookie:', error);
                    sendResponse({ success: false });
                });
        });
    });
    return true; // 需要返回 true 来指示异步消息处理
}


function getBaseDomain(domain) {
    // 分割域名
    const parts = domain.split('.');
    // 如果域名部分大于2，返回最后两部分，表示主域名
    return parts.slice(-2).join('.');
}
