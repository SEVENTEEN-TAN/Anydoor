function getCookie() {
    var domain = document.getElementById('getCookieFormDomainInput').value;
    fetch('/cookieManage/getCookie?domain=' + domain)
        .then(response => response.text())
        .then(data => {
            document.getElementById('cookieResult').innerHTML = displayCookie(JSON.parse(data));
        });
}

function getCookieList() {
    fetch('/cookieManage/getCookieList')
        .then(response => response.text())
        .then(data => {
            document.getElementById('cookieListResult').innerHTML = displayCookie(JSON.parse(data));
        });
}

function getDomainList() {
    fetch('/cookieManage/getDomainList')
        .then(response => response.text())
        .then(data => {
            document.getElementById('domainListResult').innerHTML = displayCookie(JSON.parse(data));
        });
}

function insertCookie() {
    var projectId = document.getElementById('projectIdInput').value;
    var projectName = document.getElementById('projectNameInput').value;
    var domain = document.getElementById('domainInput').value;
    var cookieStr = document.getElementById('cookieStrInput').value;

    fetch('/cookieManage/insertAndUpdateCookie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectId: projectId,
            projectName: projectName,
            domain: domain,
            cookieStr: cookieStr
        })
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
        });
}

function delCookie() {
    var delProjectIdInput = document.getElementById('delProjectIdInput').value;
    var delDomainInput = document.getElementById('delDomainInput').value;

    fetch('/cookieManage/delCookie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectId: delProjectIdInput,
            domain: delDomainInput
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
}

function getUserList() {
    fetch('/userManage/getUserList')
        .then(response => response.text())
        .then(data => {
            document.getElementById('getUserList').innerHTML = displayCookie(JSON.parse(data));
        });
}

function getRoleList() {
    fetch('/userManage/getRoleList')
    .then(response => response.text())
    .then(data => {
        document.getElementById('getRoleList').innerHTML = displayCookie(JSON.parse(data));
    });
}

function insertOrUpdateUser() {
    var insertOrUpdateUserName = document.getElementById('insertOrUpdateUserName').value;
    var insertOrUpdateUserPwd = document.getElementById('insertOrUpdateUserPwd').value;
    var insertOrUpdateUserIsUse = document.getElementById('insertOrUpdateUserIsUse').value;
    var insertOrUpdateUserRoleId = document.getElementById('insertOrUpdateUserRoleId').value;

    fetch('/userManage/insertOrUpdateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: insertOrUpdateUserName,
            userPwd: insertOrUpdateUserPwd,
            isUse: insertOrUpdateUserIsUse,
            roleId: insertOrUpdateUserRoleId,
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
}

function deleteUser() {
    var deleteUserId = document.getElementById('deleteUserId').value;
    var deleteUserName = document.getElementById('deleteUserName').value;

    fetch('/userManage/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: deleteUserId,
            userName: deleteUserName
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
    });
}

function displayCookie(data) {
    var table = '<table border="1"><tr>';
    for (var key in data[0]) {
        table += '<th>' + key + '</th>';
    }
    table += '</tr>';
    data.forEach(function (item) {
        table += '<tr>';
        for (var key in item) {
            var value = item[key] === undefined ? "N/A" : item[key];
            table += '<td>' + value + '</td>';
        }
        table += '</tr>';
    });
    table += '</table>';
    return table;
}

document.addEventListener('DOMContentLoaded', function() {
    fetch("/user/isLogin")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.code !== 200 ) {
            window.location.href = "loginPage";
        }
    })
    .catch(function(error) {
        console.error("检查登录状态失败:", error);
    });
});

function delAllCookies() {
    if (confirm("您确定要删除所有 Cookie 吗？此操作无法撤销。")) {
        fetch('/cookieManage/delAllCookies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('delAllResult').innerHTML = data; // 显示结果
        })
        .catch(error => {
            console.error("删除全部 Cookie 失败:", error);
        });
    } else {
        alert("操作已取消。");
    }
}
