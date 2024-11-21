package com.turing.anydoor.service.impl;

import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.turing.anydoor.mapper.CookieMapper;
import com.turing.anydoor.pojp.Cookie;
import com.turing.anydoor.service.CookieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
public class CookieServiceImpl implements CookieService {
    @Autowired
    CookieMapper cookieMapper;
    public String getCookie(String domain) {
        QueryWrapper<Cookie> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("domain", domain).eq("is_use", "1");
        List<Cookie> cookies = cookieMapper.selectList(queryWrapper);
        //将cookies转换成字符串
        String akey = "[]";
        if (!cookies.isEmpty()){
            akey = JSONUtil.parseArray(cookies).toString();
        }
        return akey;
    }

    public List<Cookie> getCookieList() {
        List<Cookie> cookies = cookieMapper.selectList(null);
        //将cookies转换成字符串
        String akey = "[]";
        if (!cookies.isEmpty()){
            akey = JSONUtil.parseArray(cookies).toString();
        }
        return cookies;
    }

    public String getDomainList() {
        QueryWrapper<Cookie> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_use", "1").select("domain");
        List<Cookie> cookies = cookieMapper.selectList(queryWrapper);
        //将cookies转换成字符串
        String akey = "[]";
        if (!cookies.isEmpty()){
            akey = JSONUtil.parseArray(cookies).toString();
        }
        return akey;
    }

    public int insertAndUpdateCookie(String projectId, String projectName, String domain, String cookieStr) {
        //尝试获取这个对象
        QueryWrapper<Cookie> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("domain", domain);
        Cookie getCookie = cookieMapper.selectOne(queryWrapper);
        Cookie cookie;
        if (ObjectUtil.isEmpty(getCookie)){
            cookie = new Cookie();
        }else {
            cookie = getCookie;
        }
        cookie.setProjectId(projectId);
        cookie.setProjectName(projectName);
        cookie.setDomain(domain);
        cookie.setCookie(cookieStr);
        cookie.setIsUse("1");
        int row = 0;
        if (ObjectUtil.isEmpty(getCookie)){
            row = cookieMapper.insert(cookie);
        }else{
            row = cookieMapper.update(cookie,queryWrapper);
        }
        return row;
    }

    public int delCookie(String projectId, String domain) {
        QueryWrapper<Cookie> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("project_id", projectId).eq("domain", domain);
        return cookieMapper.delete(queryWrapper);
    }

    @Override
    public int delAllCookies() {
        return cookieMapper.delete(null);
    }
}
