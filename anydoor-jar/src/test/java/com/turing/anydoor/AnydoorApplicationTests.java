package com.turing.anydoor;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONUtil;
import com.turing.anydoor.mapper.CookieMapper;
import com.turing.anydoor.pojp.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class AnydoorApplicationTests {
    @Autowired
    CookieMapper cookieMapper;

    @Test
    void contextLoads() {
        List<Cookie> cookie = cookieMapper.selectList(null);
        cookie.forEach(Cookie::toString);
    }
}
