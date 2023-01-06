# 样式

下面列举 Layout 支持的样式属性。

## 布局
支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`

| 属性名                | 支持的值或类型                                            | 默认值     |
| --------------------- | --------------------------------------------------------- | ---------- |
| width                 | number                                                    | 0          |
| height                | number                                                    | 0          |
| position              | relative, absolute                                        | relative   |
| left                  | number                                                    | 0          |
| top                   | number                                                    | 0          |
| right                 | number                                                    | 0          |
| bottom                | number                                                    | 0          |
| margin                | number                                                    | 0          |
| marginLeft            | number                                                    | 0          |
| marginRight           | number                                                    | 0          |
| marginTop             | number                                                    | 0          |
| marginBottom          | number                                                    | 0          |
| padding               | number                                                    | 0          |
| paddingLeft           | number                                                    | 0          |
| paddingRight          | number                                                    | 0          |
| paddingTop            | number                                                    | 0          |
| paddingBottom         | number                                                    | 0          |
| borderWidth           | number                                                    | 0          |
| borderRadius          | number                                                    | 0          |
| flexDirection         | column, row                                               | row        |
| flexShrink            | number                                                    | 1          |
| flexGrow              | number                                                    |            |
| flexWrap              | wrap, nowrap                                              | nowrap     |
| justifyContent        | flex-start, center, flex-end, space-between, space-around | flex-start |
| alignItems, alignSelf | flex-start, center, flex-end, stretch                     | flex-start |

## 文本
支持的标签：`text`
| 属性名          | 支持的值或类型      | 默认值      |
| --------------- | ------------------- | ----------- |
| fontSize        | number              | 14          |
| lineHeight      | number / string     | '1.4em'     |
| textAlign       | left, center, right | left        |
| verticalAlign   | top, middle, bottom | top         |
| color           | string              | #000000     |
| backgroundColor | string              | transparent |
| textOverflow    | ellipsis, clip       | 默认为空，出于性能考虑，只有显式指定textOverflow属性的时候才会对文字进行截断处理 |
| letterSpacing   | number              | 默认值为0，只对 bitmaptext 标签生效          |

## 容器
支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`
|      属性     |  类型  | 默认值 |           说明           |
|---------------|--------|--------|--------------------------|
| backgroundColor    | string |        | 背景的颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色                   |


## 边框
支持的标签：`view`、`scrollview`、`image`、`text`、`bitmaptext`
| 属性 | 类型 | 默认值 | 说明 |
|---------------|--------|--------|--------------------------|
| borderRadius | number | | 边框圆角 |
| borderColor | string |  | 边框颜色，支持 6 位 16 进制、8 位 16 进制、rgb、rgba 四种格式的颜色 |

