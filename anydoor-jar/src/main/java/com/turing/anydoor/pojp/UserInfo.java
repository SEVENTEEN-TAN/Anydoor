package com.turing.anydoor.pojp;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("UserInfo")
public class UserInfo {
    @TableId(type = IdType.AUTO)
    private Integer userId;
    private String userName;
    private String userPwd;
    private String isUse;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}