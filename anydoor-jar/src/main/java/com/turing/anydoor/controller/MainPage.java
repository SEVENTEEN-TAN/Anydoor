package com.turing.anydoor.controller;

import cn.dev33.satoken.stp.StpUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainPage {
    @GetMapping("/indexPage")
    public String indexPage(){
        if (StpUtil.isLogin()){
            return "indexPage";
        }
        return "loginPage";
    }

    @GetMapping("/loginPage")
    public String loginPage() {
        if (StpUtil.isLogin()){
            return "indexPage";
        }
        return "loginPage";
    }
}
