package com.turing.anydoor.pojp;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@TableName("CookiesInfo")
public class Cookie {
    @TableId(type = IdType.AUTO)
    private Integer serialNo;
    private String projectId;
    private String projectName;
    private String domain;
    private String cookie;
    private String isUse;
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Date updateTime;
}