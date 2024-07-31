"ui";
/*
threads.start(function() {
    console.show();
});*/

/* 初始化部分 */

// 元数据
const GitHubUrl = "https://codeload.github.com/Delta-Water/batchTriggerGenerationTool/zip/refs/heads/main", //GitHub项目压缩包url
    SDDir = files.getSdcardPath() + "/",
    verArray = JSON.parse(files.read("./res/version.json")).va, // 版本序号数组
    attArray = ["name", "type", "id", "x", "y", "width", "height"], // 数组：[必要的7个属性名称]
    attObj = { // 对象：{必要的7个属性名称, ""}
        "name": "",
        "type": "",
        "id": "",
        "x": "",
        "y": "",
        "width": "",
        "height": ""
    },
    { // 函数模块
        loadFile,
        inputObj,
        inputOpt,
        writeIn,
        escapeXML,
        buildDialogs,
        operateStrings
    } = require("mod_function.js"),
    { // 网络模块
        updateFiles
    } = require("mod_net.js");
updateFiles(); // 联网检测并更新

// 普通全局变量
var 主题色 = "#123456",
    triObj = {}, // 用于传递宾语键值对和变量
    triArray = {}, // 用于传递生成的宾语
    // 新建实例
    oS = new operateStrings(),
    bD = new buildDialogs();
main = ( // 定义视图XML
    <frame bg="{{主题色}}">
        <toolbar id="toolbar" title="批量生成宾语" h="auto"/>
        <horizontal gravity="center">
            <button id="button3" text="导入"/>
            <button id="button1" text="开始"/>
            <button id="button2" text="工具"/>
        </horizontal>
    </frame>
);
editPropView = (
    <vertical>
        <input padding="0 8" id="input" text="{{propViewText}}" textColor="#000000"/>
    </vertical>
);

// UI初始化
ui.statusBarColor(主题色);
ui.layout(main); // 显示视图
ui.button1.on("click", () => inputObj()); // 创建按钮监听器
ui.button2.on("click", () => toast("开发中，敬请期待"));
ui.button3.on("click", () => loadFile());
ui.emitter.on("create_options_menu", (menu) => { // 创建右上角控件监听器
    menu.add("设置");
    menu.add("关于");
});
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "设置":
            toast("还没有设置");
            break;
        case "关于":
            bD.sAD();
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);