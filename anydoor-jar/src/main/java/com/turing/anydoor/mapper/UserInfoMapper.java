package com.turing.anydoor.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.turing.anydoor.pojp.UserInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserInfoMapper extends BaseMapper<UserInfo> {

    @Select("select ri.role_name from UserRole ur join RoleInfo ri on ri.role_id = ur.role_id where user_id =#{userID}")
    List<String> getUserRoles(String userID);
}
