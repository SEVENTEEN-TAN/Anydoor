package com.turing.anydoor.service;

import com.turing.anydoor.pojp.Cookie;

import java.util.List;

public interface CookieService {

    String getCookie(String domain);

    List<Cookie> getCookieList();

    String getDomainList();

    int insertAndUpdateCookie(String projectId, String projectName, String domain, String cookieStr);

    int delCookie(String projectId, String domain);

}
