/* 函数部分 */

function loadFile() {
    bD.sMID("请输入配置文件的绝对路径", SDDir, (input) => {
        if (input) {
            try { // 尝试读取文件
                var content = files.read(input);
            } catch (e) {
                var content = false
            } finally {
                if (!content) {
                    toast("读取失败，请检查路径是否正确");
                    return
                };
            }
            triArray = [];
            let setsArray = content.split("<||>");
            let err = false;
            setsArray.forEach((set) => {
                if (err == true) return;
                let [key, value] = set.split("<|>").map((element) => {
                    return element.trim();
                });
                if (key && value) {
                    oS.oI1(key);
                    if (!oS.cP("i1", "f", triObj, key)) {
                        err = true;
                        return;
                    };
                    let [paramExp, loop] = oS.oI2(value);
                    if (!oS.cP("i2", "f", [paramExp, loop], value)) {
                        err = true;
                        return;
                    };
                    oS.gO(paramExp, loop, true);
                }
            });
            if (!err) {
                writeIn(oS.gXS());
            }
        }
    });
}

function inputObj(reInput, errCode) {
    let attObjArray = Object.entries(attObj);
    let attrStrings = attObjArray.map(attr => attr[0] + ": " + attr[1]).join("\n");
    bD.sMID("输入键值对和变量", reInput ? reInput : attrStrings, (input) => {
        oS.oI1(input);
        log(triObj);
        if (!oS.cP("i1", "d", triObj, input)) {
            return;
        };
        inputOpt();
    }, errCode);
}

function inputOpt(reInput, errCode) {
    bD.sMID("输入循环次数和变量表达式", reInput || "loop: ", (input) => {
        let [paramExp, loop] = oS.oI2(input);
        if (!oS.cP("i2", "d", [paramExp, loop], input)) {
            return;
        };
        oS.gO(paramExp, loop);
        writeIn(oS.gXS());
    }, errCode);
}

function writeIn(content, name, toastText) {
    if (!name) {
        bD.sMID("请输入保存的文件名", "", (input) => {
            var uri = files.join(files.join(SDDir, "Documents/Trigger/"), input);
            files.createWithDirs(uri);
            files.write(uri, content);
            toast("保存成功，请前往对应文件查看");
        });
    } else {
        var uri = files.join(files.join(SDDir, "Documents/Trigger/"), name);
        files.createWithDirs(uri);
        files.write(uri, content);
        toast(toastText);
    }
}

function escapeXML(str) {
    return str.replace(/[<>&'"]/g, function(c) {
        switch (c) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case "'":
                return '&#39;';
            case '"':
                return '&quot;';
        }
    });
}

/* 函数类部分 */ // 使用函数模拟类的行为

// 构建自定义对话框类
function buildDialogs() {
    // showMultilineInputDialog
    this.sMID = function(title, text, callback, errCode) { // 自定义多行输入对话框
        global['propViewText'] = text;
        global["inputView"] = ui.inflate(editPropView);
        errCode ? inputView.input.setError(errCode) : {};
        dialogs.build({
            customView: inputView,
            title: title,
            positive: "确定",
            negative: "取消",
            cancelable: false
        }).on("positive", () => {
            let input = inputView.input.text();
            if (input == "") {
                toast("未输入任何内容");
                return;
            }
            callback(input);
        }).on("negative", () => {}).show();
    }
    // showAboutDialog
    this.sAD = function() {
        dialogs.build({
                title: "关于",
                content: '作者：print("")\n热更新已开启\n版本号：' + verArray[0] + '.' + verArray[1] + '.' + verArray[2] + '.' + verArray[3] + "\n" + "通过推广本工具支持我们",
                positive: "推广",
                neutral: "检测更新"
            })
            .on("positive", () => {
                setClip("https://wwp.lanzoup.com/iF14E25ateub");
                toast("已复制工具的下载链接");
            })
            .on("neutral", () => {
                updateFiles(true);
            })
            .show();
    };
    // showTutorialDialog
    this.sTD = function() {
        dialogs.build({
                title: "教程",
                content: "你难道不准备先学会…\n如何让它听话它吗~",
                positive: "新手教程",
                neutral: "进阶教程"
            })
            .on("positive", () => {
                app.openUrl("https://zhuanlan.zhihu.com/p/710487172?utm_psn=1799135800694292480");
            })
            .on("neutral", () => {
                toast(uDT);
            })
            .show();
    }
}

// 操作字符串类
function operateStrings() {
    // operateinput1
    this.oI1 = function(input) {
        let newItemObj = input.split("\n").reduce((acc, string, index) => {
            if (string.indexOf(":") >= 0) {
                let [name, value] = string.split(":").map(s => s.trim());
                if (acc.lastAttributeName != "height" && acc.lastAttributeName != "prop") {
                    acc[name] = value;
                    acc.lastAttributeName = name;
                } else {
                    acc.prop = acc.prop || [];
                    acc.prop.push({
                        name,
                        value
                    });
                    acc.lastAttributeName = "prop";
                }
            } else {
                if (acc.lastAttributeName != "prop") {
                    acc[acc.lastAttributeName] += "\n" + string;
                } else {
                    acc.prop[acc.prop.length - 1].value += "\n" + string;
                }
            }
            return acc;
        }, {});
        delete newItemObj.lastAttributeName;
        triObj = newItemObj;
    }
    // operateinput2
    this.oI2 = function(input) {
        let inputLines = input.split("\n");
        let paramExp = {};
        let loop = 0;
        inputLines.forEach(line => {
            let [key, value] = line.split(":");
            if (key && value) {
                if (key.trim() === "loop") {
                    loop = parseInt(value.trim());
                } else {
                    paramExp[key.trim()] = value.trim();
                }
            }
        });
        return [paramExp, loop];
    }
    // generateObjects
    this.gO = function(paramExp, loop, bool) {
        bool ? {} : triArray = []; //格式化传递变量
        for (let i = 0; i < loop; i++) {
            let newObject = JSON.parse(JSON.stringify(triObj));
            for (let [key, value] of Object.entries(newObject)) {
                if (typeof value === 'string') {
                    newObject[key] = value.replace(/\$\{(\w+)\}/g, (match, p1) => {
                        if (paramExp[p1]) {
                            let evaluatedValue = eval(paramExp[p1].replace(/\%\{(\i+)\}/g, i.toString()));
                            return evaluatedValue !== undefined ? String(evaluatedValue) : match;
                        } 
                        return match;
                    });
                } else if (Array.isArray(value)) {
                    newObject[key] = value.map(item => {
                        let newItem = JSON.parse(JSON.stringify(item));
                        for (let [k, v] of Object.entries(newItem)) {
                            if (typeof v === 'string') {
                                newItem[k] = v.replace(/\$\{(\w+)\}/g, (match, p1) => {
                                    if (paramExp[p1]) {
                                        let evaluatedValue = eval(paramExp[p1].replace("i", i.toString()));
                                        return evaluatedValue !== undefined ? String(evaluatedValue) : match;
                                    }
                                    return match;
                                });
                            }
                        }
                        return newItem;
                    });
                }
            }
            triArray.push(newObject);
        }
    }
    // generateXMLString
    this.gXS = function() {
        let xmlOutput = '  <objectgroup name="Triggers">\n';
        for (let i = 0; i < triArray.length; i++) {
            let obj = triArray[i];
            xmlOutput += '    <object';
            for (let key of attArray) {
                xmlOutput += ` ${escapeXML(key)}="${escapeXML(obj[key])}"`;
            }
            xmlOutput += '>\n';
            if (obj.prop && obj.prop.length > 0) {
                xmlOutput += '      <properties>\n';
                for (let prop of obj.prop) {
                    xmlOutput += `        <property name="${escapeXML(prop.name)}" value="${escapeXML(prop.value)}" />\n`;
                }
                xmlOutput += '      </properties>\n';
            }
            xmlOutput += '    </object>\n';
        }
        xmlOutput += '  </objectgroup>';
        return xmlOutput;
    }
    // checkParameter
    this.cP = function(mode, _mode, p, input) {
        let error = false;
        if (mode == "i1") {
            if (input.indexOf("\n") == 0) {
                error = "不应出现无意义的空行";
            } else {
                let array = attArray.map((att) => {
                    return att
                });
                for (let key in p) {
                    let i = array.indexOf(key);
                    if (i != -1) {
                        array.splice(i, 1);
                    };
                }
                if (array.length != 0) {
                    error = "缺少必要属性:" + array;
                }
            }
            if (error) {
                if (_mode == "d") {
                    inputObj(input, error);
                } else if (_mode == "f") {
                    writeIn(input + "\n" + error, "error.txt", error.slice(0, 6) + "…，" + "详情请查看error.txt");
                }
                return false;
            };
            return true;
        } else if (mode == "i2") {
            let [paramExp, loop] = p;
            if (input.indexOf("\n\n") != -1 || input.indexOf("\n") == 0 || input.indexOf("\n") == input.length - 1) {
                error = "不应出现无意义的空行";
            } else if (isNaN(loop)) {
                error = "循环次数必须定义";
            } else if (loop <= 0) {
                error = "循环次数必须是大于0的整数";
            }
            if (error) {
                if (_mode == "d") {
                    inputOpt(input, error);
                } else if (_mode == "f") {
                    writeIn(input + "\n" + error, "error.txt", error.slice(0, 6) + "…，" + "详情请查看error.txt");
                }
                return false;
            };
            return true;
        }
    }
}

module.exports = {
    loadFile,
    inputObj,
    inputOpt,
    writeIn,
    escapeXML,
    buildDialogs,
    operateStrings,
}