package com.turing.anydoor.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.turing.anydoor.mapper.RoleInfoMapper;
import com.turing.anydoor.mapper.UserInfoMapper;
import com.turing.anydoor.mapper.UserRoleMapper;
import com.turing.anydoor.pojp.RoleInfo;
import com.turing.anydoor.pojp.UserInfo;
import com.turing.anydoor.pojp.UserRole;
import com.turing.anydoor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    UserInfoMapper userInfoMapper;
    @Autowired
    UserRoleMapper userRoleMapper;
    @Autowired
    RoleInfoMapper roleInfoMapper;

    public UserInfo doLogin(String username, String password) {
        //password 需要转换成MD5
        String passwordMD5 = DigestUtil.md5Hex(password);
        QueryWrapper<UserInfo> query = new QueryWrapper<>();
        query.eq("user_name", username).eq("user_pwd",passwordMD5).eq("is_use", "1");
        UserInfo userInfo = userInfoMapper.selectOne(query);
        return userInfo;
    }

    @Override
    public List<String> getUserRole(String userID) {
        return userInfoMapper.getUserRoles(userID);
    }

    @Override
    public List<UserInfo> getUserList() {
        QueryWrapper<UserInfo> query = new QueryWrapper<>();
        query.select("user_id","user_name","is_use","create_time","update_time");
        List<UserInfo> userInfos = userInfoMapper.selectList(query);
        userInfos.stream().forEach(s->s.setUserPwd("Masking"));
        return userInfos;
    }

    @Override
    public int insertOrUpdateUser(String userName, String userPwd,String isUse, String roleId) {
        //先获取当前的userName是否存在
        QueryWrapper<UserInfo> query = new QueryWrapper<>();
        query.eq("user_name",userName);
        UserInfo getUserInfo = userInfoMapper.selectOne(query);
        UserInfo userInfo;
        if (ObjectUtil.isEmpty(getUserInfo)){
            userInfo = new UserInfo();
        }else {
            userInfo = getUserInfo;
        }
        userInfo.setUserName(userName);
        userInfo.setUserPwd(DigestUtil.md5Hex(userPwd));
        if (StrUtil.isBlankIfStr(isUse)){
            isUse = "1";
        }
        userInfo.setIsUse(isUse);

        int row = 0;
        if (ObjectUtil.isEmpty(getUserInfo)){
            row = userInfoMapper.insert(userInfo);
        }else{
            row = userInfoMapper.update(userInfo,query);
        }
        //开始处理Role
        QueryWrapper<UserRole> userRoleQueryWrapper = new QueryWrapper<>();
        userRoleQueryWrapper.eq("user_id", userInfo.getUserId());
        row += userRoleMapper.delete(userRoleQueryWrapper);
        String[] split = roleId.split(",");
        UserRole userRole = new UserRole();
        for (int i = 0; i < split.length; i++) {
            userRole.setUserId(userInfo.getUserId());
            userRole.setRoleId(Integer.valueOf(split[i]));
            row += userRoleMapper.insert(userRole);
        }
        return row;
    }

    @Override
    public int deleteUser(String userName, String userId) {
        int count = 0;
        //优先删除权限表
        QueryWrapper<UserRole> userRoleQueryWrapper = new QueryWrapper<>();
        userRoleQueryWrapper.eq("user_id", userId);
        count += userRoleMapper.delete(userRoleQueryWrapper);
        //删除用户表
        count += userInfoMapper.deleteById(userId);
        return count;
    }

    @Override
    public List<RoleInfo> getRoleList() {
        return roleInfoMapper.selectList(null);
    }
}
