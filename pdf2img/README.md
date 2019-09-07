# 需求以及插件实现的功能
- [x]把PDF转换成图片，支持转换成jpg和png格式
- [x]进度可视
- [] 支持预览
- [] 支持自己要选择转换的图片

## 实现的思路
- 通过`pdf.js`来获取和转换成`canvas`
- `pdf.js`无法直接打开本地文件,利用FileReader转换
- 通过`canvas.toDataURL`来转换成`jpg`或者`png`类型的`base64`
- `base64`转换成`blob`对象，然后通过`jszip`来压缩

## prefect
- [] 使用`background`实现常驻后台或者通过新开一个`tap`，而不是使用`popup`





