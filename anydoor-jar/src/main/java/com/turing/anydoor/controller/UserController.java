package com.turing.anydoor.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import cn.hutool.core.util.StrUtil;
import com.turing.anydoor.pojp.RoleInfo;
import com.turing.anydoor.pojp.UserInfo;
import com.turing.anydoor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/userManage")
public class UserController {
    @Autowired
    UserService userServiceImpl;

    @GetMapping(value = "/getUserList")
    @SaCheckLogin
    @SaCheckRole("Admin")
    //获取用户列表
    List<UserInfo> getUserList(){
        return userServiceImpl.getUserList();
    }

    @GetMapping(value = "/getRoleList")
    @SaCheckLogin
    @SaCheckRole("Admin")
        //获取用户列表
    List<RoleInfo> getRoleList(){
        return userServiceImpl.getRoleList();
    }

    @PostMapping(value = "/insertOrUpdateUser")
    @SaCheckLogin
    @SaCheckRole("Admin")
    //新增 或 更新用户
    int insertOrUpdateUser(@RequestBody Map<String, String> request){
        String userName = request.get("userName");
        String userPwd = request.get("userPwd");
        String isUse = request.get("isUse");
        String roleId = request.get("roleId");
        if (StrUtil.isEmpty(userName)||StrUtil.isEmpty(userPwd)||StrUtil.isEmpty(roleId)){
            throw new RuntimeException("userName 或 userPwd 或 roleId 不能为空");
        }
        return userServiceImpl.insertOrUpdateUser(userName,userPwd,isUse,roleId);
    }

    //删除用户
    @PostMapping(value = "/deleteUser")
    @SaCheckLogin
    @SaCheckRole("Admin")
    //新增 或 更新用户
    int deleteUser(@RequestBody Map<String, String> request){
        String userName = request.get("userName");
        String userId = request.get("userId");
        if (StrUtil.isEmpty(userName)||StrUtil.isEmpty(userId)){
            throw new RuntimeException("userName 或 userId 不能为空");
        }
        return userServiceImpl.deleteUser(userName,userId);
    }
}
