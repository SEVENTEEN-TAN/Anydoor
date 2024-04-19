package com.turing.anydoor.service;

import com.turing.anydoor.pojp.RoleInfo;
import com.turing.anydoor.pojp.UserInfo;

import java.util.List;

public interface UserService {
    UserInfo doLogin(String username, String password);

    List<String> getUserRole(String string);

    List<UserInfo> getUserList();

    int insertOrUpdateUser(String userName, String userPwd, String isUse,String roleId);

    int deleteUser(String userName, String userId);

    List<RoleInfo> getRoleList();
}
