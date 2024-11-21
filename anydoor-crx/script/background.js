// 定义服务器地址
const serverURL = "http://localhost.com";
// 将服务器地址存储到 chrome.storage 中
chrome.storage.local.set({ serverURL: serverURL });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // 登录操作
    if (request.action === "login") {
        login(request, sendResponse);
        return true; // 保持异步消息通道打开
    }
    // 更新操作
    if (request.action === "update") {
        update(request, sendResponse);
        return true; // 保持异步消息通道打开
    }
});

/**
 * 执行登录操作
 * @param {Object} request - 请求对象
 * @param {Function} sendResponse - 发送响应函数
 */
async function login(request, sendResponse) {
    try {
        // 获取服务器地址
        const data = await new Promise((resolve) => {
            chrome.storage.local.get('serverURL', resolve);
        });
        const serverURL = data.serverURL;
        const url = request.url;
        const tabId = request.tabId;

        // Step 1: 从主页面获取目标页面的Url
        const rootDomain = new URL(url).hostname;
        if (!rootDomain) {
            console.log('Failed to extract root domain.');
            sendResponse({ success: false });
            return;
        }
        console.log('当前标签页的URL是: ' + rootDomain);
        const baseRootDomain = getBaseDomain(rootDomain);

        // Step 2: 删除当前域名下的所有 Cookie
        const cookies = await new Promise((resolve) => {
            chrome.cookies.getAll({}, resolve);
        });

        const cookiesToRemove = cookies.filter(cookie => getBaseDomain(cookie.domain) === baseRootDomain);
        await Promise.all(cookiesToRemove.map(cookie => {
            return new Promise((resolve) => {
                chrome.cookies.remove({
                    url: `https://${cookie.domain}${cookie.path}`,
                    name: cookie.name
                }, function (removedCookie) {
                    if (removedCookie) {
                        console.log("Removed cookie:", removedCookie);
                    }
                    resolve();
                });
            });
        }));
        console.log("All relevant cookies have been removed.");

        // Step 3: 远程获取指定页面的数据
        const response = await fetch(serverURL + `/cookieManage/getCookie?domain=${rootDomain}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const dataFetched = await response.json();

        if (!Array.isArray(dataFetched) || dataFetched.length === 0) {
            alert('当前站点不支持一键登录!');
            sendResponse({ success: false });
            return;
        }

        // Step 4: 解析返回的数据并设置 Cookie
        for (let cookie of dataFetched) {
            // 解析 cookie 字符串
            let cookieData;
            try {
                cookieData = JSON.parse(cookie.cookie);
            } catch (e) {
                console.error(`Failed to parse cookie data for ${cookie.domain}:`, e);
                continue; // 跳过解析失败的 cookie
            }

            for (let cookieItem of cookieData) {
                // 检查并确保 expirationDate 的值是合法的
                let expirationDate = cookieItem.expirationDate;
                if (expirationDate) {
                    expirationDate = parseFloat(expirationDate);
                    if (isNaN(expirationDate) || !isFinite(expirationDate)) {
                        expirationDate = undefined; // 如果非法，将其设置为 undefined
                    } else {
                        expirationDate = Math.floor(expirationDate); // 确保是一个整数
                    }
                }

                // 准备 cookie 设置参数
                let cookieDetails = {
                    url: url,
                    name: cookieItem.name,
                    value: cookieItem.value,
                    domain: cookieItem.domain,
                    path: cookieItem.path,
                    secure: cookieItem.secure
                };

                // 仅在 expirationDate 合法时才添加该属性
                if (expirationDate) {
                    cookieDetails.expirationDate = expirationDate;
                }

                // 设置 cookie
                await new Promise((resolve) => {
                    chrome.cookies.set(cookieDetails, (result) => {
                        if (chrome.runtime.lastError) {
                            console.error(`Failed to set cookie: ${cookieItem.name}, Error: ${chrome.runtime.lastError.message}`);
                        } else {
                            console.log(`Successfully set cookie: ${cookieItem.name}`);
                        }
                        resolve();
                    });
                });
            }
        }

        // Step 5: 刷新页面
        if (tabId) {
            chrome.tabs.reload(tabId);
        }
        sendResponse({ success: true });

    } catch (error) {
        console.error('An error occurred:', error);
        sendResponse({ success: false });
    }
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
                    // if (responseData.code !== 200 && responseData.code !== undefined) {
                    //     sendResponse({ success: false });
                    //     return false;
                    // }
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

/**
 * 获取主域名
 * @param {string} domain - 完整域名
 * @returns {string} 主域名
 */
function getBaseDomain(domain) {
    const parts = domain.split('.');
    return parts.slice(-2).join('.');
}
