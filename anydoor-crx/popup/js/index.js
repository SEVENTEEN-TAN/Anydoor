document.addEventListener('DOMContentLoaded', function () {
    var submitButton = document.getElementById('submitButton');
    chrome.storage.local.get('serverURL', function (data) {
        var serverURL = data.serverURL;
        // 发送GET请求检查用户是否已登录
        fetch(serverURL + "/user/isLogin")
            .then(function (response) {
                // 解析响应中的JSON数据
                return response.json();
            })
            .then(function (data) {
                // 根据后端返回的数据判断用户是否已登录
                if (data.code === 200) {
                    // 如果已登录，则直接跳转到popup.html
                    window.location.href = "popup.html";
                }
            })
            .catch(function (error) {
                console.log("检查登录状态失败:", error);
            });

        //登录按钮被点击
        submitButton.addEventListener('click', function () {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            // 构造请求URL，并将参数拼接在URL中
            var url = serverURL + "/user/doLogin?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

            // 发送POST请求
            fetch(url, {
                method: "POST",
                body: "" // 请求体为空字符串
            })
                .then(function (response) {
                    // 解析响应中的JSON数据
                    return response.json();
                })
                .then(function (data) {
                    // 根据后端返回的数据判断登录是否成功
                    if (data.code === 200) {
                        window.location.href = "popup.html";
                        chrome.notifications.create('', {
                            type: 'basic',
                            iconUrl: '../img/icon48.png',
                            title: '登录成功！',
                            message: '欢迎: ' + username + ' 登录',
                        });
                    } else {
                        chrome.notifications.create('', {
                            type: 'basic',
                            iconUrl: '../img/icon48.png',
                            title: '登录失败！',
                            message: '请检查用户名或密码',
                        });
                    }
                })
                .catch(function (error) {
                    console.log("登录失败:", error);
                });
        });
    })
});