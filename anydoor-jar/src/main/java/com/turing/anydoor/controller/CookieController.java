package com.turing.anydoor.controller;

import cn.dev33.satoken.annotation.SaCheckLogin;
import cn.dev33.satoken.annotation.SaCheckRole;
import cn.dev33.satoken.annotation.SaMode;
import cn.hutool.core.util.StrUtil;
import com.turing.anydoor.pojp.Cookie;
import com.turing.anydoor.service.CookieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/cookieManage")
public class CookieController {

    @Autowired
    CookieService cookieServiceImpl;

    //获取指定域名的Cookie
    @GetMapping(value = "/getCookie")
    @CrossOrigin(origins = "*")
    @SaCheckLogin
    public String getCookie(String domain) {
        return cookieServiceImpl.getCookie(domain) ;
    }

    //获取CookieList
    @GetMapping(value = "/getCookieList")
    @CrossOrigin(origins = "*")
    @SaCheckLogin
    @SaCheckRole("Admin")
    public List<Cookie> getCookieList() {
        return cookieServiceImpl.getCookieList() ;
    }

    //获取域名列表
    @GetMapping(value = "/getDomainList")
    @CrossOrigin(origins = "*")
    @SaCheckLogin
    @SaCheckRole("Admin")
    public String getDomainList() {
        return cookieServiceImpl.getDomainList() ;
    }

    //插入或更新一条域名
    @PostMapping(value = "/insertAndUpdateCookie")
    @CrossOrigin(origins = "*")
    @SaCheckLogin
    @SaCheckRole(value = {"Admin","User"},mode = SaMode.OR)
    public int insertAndUpdateCookie(@RequestBody Map<String, String> request) {
        String projectId = request.get("projectId");
        String projectName = request.get("projectName");
        String domain = request.get("domain");
        String cookieStr = request.get("cookieStr");
        if (StrUtil.isEmpty(projectId)||StrUtil.isEmpty(domain)){
            throw new RuntimeException("projectId 或 domain 不能为空");
        }
        return cookieServiceImpl.insertAndUpdateCookie(projectId,projectName,domain,cookieStr) ;
    }

    //删除Cookie
    @PostMapping(value = "/delCookie")
    @CrossOrigin(origins = "*")
    @SaCheckLogin
    @SaCheckRole(value = {"Admin"})
    public int delCookie(@RequestBody Map<String, String> request) {
        String projectId = request.get("projectId");
        String domain = request.get("domain");
        if (StrUtil.isEmpty(projectId)||StrUtil.isEmpty(domain)){
            throw new RuntimeException("projectId 或 domain 不能为空");
        }
        return cookieServiceImpl.delCookie(projectId,domain) ;
    }

}
