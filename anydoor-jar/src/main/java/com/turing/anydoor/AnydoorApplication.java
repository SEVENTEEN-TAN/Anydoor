package com.turing.anydoor;

import cn.dev33.satoken.SaManager;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@MapperScan("com.turing.anydoor")
public class AnydoorApplication {
    public static void main(String[] args) {
        SpringApplication.run(AnydoorApplication.class, args);
        System.out.println("启动成功，Sa-Token 配置如下：" + SaManager.getConfig());
    }

}
