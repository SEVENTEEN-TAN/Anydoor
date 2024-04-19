package com.turing.anydoor.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaIgnore;
import cn.dev33.satoken.stp.StpUtil;
import cn.dev33.satoken.util.SaResult;
import cn.hutool.core.util.ObjectUtil;
import com.turing.anydoor.pojp.UserInfo;
import com.turing.anydoor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
public class LoginController {
    @Autowired
    UserService userServiceImpl;

    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录成功返回成功信息，失败返回错误信息
     */
    @RequestMapping("/doLogin")
    @SaIgnore
    public SaResult doLogin(String username, String password) {
        UserInfo userInfo = userServiceImpl.doLogin(username, password);
        if(ObjectUtil.isNotNull(userInfo)) {
            // 登录成功，设置用户会话
            StpUtil.login(userInfo.getUserId());
            return SaResult.ok("登录成功");
        }
        return SaResult.error("登录失败");
    }

    /**
     * 检查用户是否登录
     * @return 登录状态及信息
     */
    @RequestMapping("/isLogin")
    @SaCheckLogin
    public SaResult isLogin() {
        // 返回用户是否登录的状态
        return SaResult.ok("是否登录：" + StpUtil.isLogin());
    }

    /**
     * 获取 Token 相关信息
     * @return Token信息
     */
    @RequestMapping("/tokenInfo")
    @SaCheckLogin
    public SaResult tokenInfo() {
        // 返回当前登录用户的Token信息
        return SaResult.data(StpUtil.getTokenInfo());
    }

    /**
     * 用户注销
     * @return 注销操作的结果信息
     */
    @RequestMapping("/logout")
    @SaCheckLogin
    public SaResult logout() {
        // 注销用户会话
        StpUtil.logout();
        return SaResult.ok();
    }

    @RequestMapping("/getRoleList")
    @SaCheckLogin
    public List<String> getRoleList() {
        return StpUtil.getRoleList();
    }
}
