$.fn.create2048 = function(option) {
    var defaultOption = {
        width: 4,
        height: 4,
        size: 100,
        animateSpeed: 300,
        style: {
            backColor: "#B8AE9E",
            blockColor: "#CCC0B2",
            padding: 20
        },
        blockStyle: {
            'font-Family': 'Arial Black',
            'font-weight': "blod",
            'text-align': "center",
            'line-height': 100
        },
        blocks: [
            { level: 0, value: 2, style: { "background-Color": "#EEE4DA", "Color": "#7C736A", "font-Size": 50 } },
            { level: 1, value: 4, style: { "background-Color": "#ECE0C8", "Color": "#7C736A", "font-Size": 50 } },
            { level: 2, value: 8, style: { "background-Color": "#F2B179", "Color": "#FFF7EB", "font-Size": 50 } },
            { level: 3, value: 16, style: { "background-Color": "#F59563", "Color": "#FFF7EB", "font-Size": 40 } },
            { level: 4, value: 32, style: { "background-Color": "#F57C5F", "Color": "#FFF7EB", "font-Size": 40 } },
            { level: 5, value: 64, style: { "background-Color": "#F65D3B", "Color": "#FFF7EB", "font-Size": 40 } },
            { level: 6, value: 128, style: { "background-Color": "#EDCE71", "Color": "#FFF7EB", "font-Size": 35 } },
            { level: 7, value: 256, style: { "background-Color": "#EDCC61", "Color": "#FFF7EB", "font-Size": 35 } },
            { level: 8, value: 512, style: { "background-Color": "#E9C74F", "Color": "#FFF7EB", "font-Size": 35 } },
            { level: 9, value: 1024, style: { "background-Color": "#ECC53E", "Color": "#FFF7EB", "font-Size": 30 } },
            { level: 10, value: 2048, style: { "background-Color": "#EEC12E", "Color": "#FFF7EB", "font-Size": 30 } },
            { level: 11, value: 4096, style: { "background-Color": "#3D3933", "Color": "#FFF7EB", "font-Size": 30 } },
        ]
    };
    option = $.extend({}, defaultOption, option);
    //判断设备
    var isMobile = function() {
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            //console.log('移动端');
            return true;
        } else {
            //console.log('pc端');
            return false;
        }
    }
    if (isMobile()) {
        option.size = ($(document).width() - option.style.padding * 6) / 4;
    }
    //console.log(option);
    if (this.length > 1) throw "一次只能生成一个游戏界面！";
    if (this.length == 0) throw "缺少游戏界面元素";
    //准备游戏数据容器
    var datas = [];
    //初始化游戏背景
    var $this = $(this[0]);
    $this.css({
        "background-color": option.style.backColor,
        "border-radius": option.style.padding,
        "position": "relative",
        "height": option.style.padding + option.height * (option.size + option.style.padding),
        "width": option.style.padding + option.width * (option.size + option.style.padding),
        "margin": "0 auto"
    });
    $("body").css({ "padding": option.style.padding / 2, "margin": 0 });
    //根据坐标获取定位
    var getPosition = function(x, y) {
        var position = {
            "top": option.style.padding + y * (option.size + option.style.padding),
            "left": option.style.padding + x * (option.size + option.style.padding)
        };
        return position;
    }
    //根据方块索引获取方块坐标
    var getCoordinate = function(index) {
        //0,1,2,3,
        //4,5
        var coordinate = {
            "x": index % option.width,
            "y": Math.floor(index / option.width)
        }
        return coordinate;
    }
    //根据坐标x,y获取index
    var getIndex = function(x, y) {
        return y * option.width + x;
    }
    //根据坐标x,y获取游戏数据块
    var getBlock = function(x, y) {
        return datas[getIndex(x, y)];
    }
    //获取当前游戏画面中所有的空白方格的索引
    var getEmptyBlocks = function() {
        var emptyBlocks = [];
        $(datas).each(function(index, element) {
            if (element == null) emptyBlocks.push(index);
        });
        return emptyBlocks;
    }
    //准备空白方格
    var buildBlankBlocks = function() {
        var blankBlocks = [];
        for (var x = 0; x < option.width; x++) {
            for (var y = 0; y < option.height; y++) {
                //初始化游戏数据
                datas.push(null); //每个方格上的游戏数据默认为null
                var $block = $("<div></div>");
                var position = getPosition(x, y);
                $block.css({
                    "position": 'absolute',
                    "width": option.size,
                    "height": option.size,
                    "background-color": option.style.blockColor,
                    "top": position.top + "px",
                    "left": position.left + "px"
                });
                blankBlocks.push($block);
            }
        }
        $this.append(blankBlocks);
        //移动端添加操作按钮
        if (isMobile()) {
            if ($("#opArea").length == 0) {
                var $opArea = $("<div id='opArea'></div>");
                $opArea.css({
                    "margin": '10px auto',
                    "text-align": 'center'
                });
                var $top = $("<div></div>");
                var $up = $("<span id='up' class='arror'>&uarr;</span>")
                $top.append($up);
                var $middle = $("<div></div>")
                var $left = $("<span id='left' class='arror'>&larr;</span>");
                var $right = $("<span id='right' class='arror'>&rarr;</span>");
                $middle.append($left);
                $middle.append($right);
                var $bottom = $("<div></div>");
                var $down = $("<span id='down' class='arror'>&darr;</span>");
                $bottom.append($down);
                $opArea.append($top);
                $opArea.append($middle);
                $opArea.append($down);

                $this.after($opArea);
                $(".arror").css({
                    "display": 'inline-block',
                    "line-height": "60px",
                    "width": "80px",
                    "padding": "10px 0",
                    "font-size": "40px",
                    "font-weight": "800",
                    "color": "white",
                    "text-align": "center",
                    "cursor": "pointer"
                }).click(function() {
                    move(this.id);
                });;
                $('#up').css({
                    "border-radius": '10px 10px 0 0',
                    "background-color": "#337AB7",
                    "margin-bottom": "5px"
                });
                $('#down').css({
                    "border-radius": '0 0 10px 10px',
                    "background-color": "#337AB7",
                    "margin-top": "5px"
                });
                $('#left').css({
                    "border-radius": '10px 0 0 10px',
                    "background-color": "#5CB85C",
                    "margin-right": "50px"
                });
                $('#right').css({
                    "border-radius": '0 10px 10px 0',
                    "background-color": "#5CB85C",
                    "margin-left": "50px"
                });
            }else{
            	$(".arror").bind('click',  function() {
            		move(this.id);
            	});
            }

        }
    }

    //准备游戏数据块
    var buildDataBlock = function(level, x, y) {
        //首先获取当前游戏界面上的所有空方格
        var emptyBlocks = getEmptyBlocks();
        //如果游戏界面的空方格的数量为 0  ，则返回 false (游戏结束)
        if (emptyBlocks.length == 0) return false;
        //根据传递进来的x,y计算index,或随机从空方格中获取一个
        var putIndex;
        if (x != undefined && y != undefined) {
            putIndex = getIndex(x, y);
        } else {
            //随机生成数据块的索引(随机从空方格中获取一个)
            putIndex = emptyBlocks[Math.floor(Math.random() * emptyBlocks.length)];
        }
        var coordinate = getCoordinate(putIndex);
        //console.log(coordinate);
        var position = getPosition(coordinate.x, coordinate.y);

        //接受传递过来的数据或随机生成
        var blockData;
        if (level != undefined) {
            blockData = option.blocks[level];
        } else {
            //从2和4 中随机挑选一个数据块
            blockData = Math.random() > 0.5 ? option.blocks[0] : option.blocks[1];
        }

        var blockDom = $("<div></div>");
        blockDom.addClass('block_' + coordinate.x + "_" + coordinate.y);
        blockDom.css($.extend(option.blockStyle, {
            "top": position.top + option.size / 2,
            "left": position.left + option.size / 2,
            "position": "absolute",
            "width": 0,
            "height": 0
        }, blockData.style));
        $this.append(blockDom);
        datas[putIndex] = blockData;
        blockDom.animate({
            "width": option.size,
            "height": option.size,
            "line-height": option.size + "px",
            "top": position.top,
            "left": position.left
        }, option.animateSpeed, function(blockDom) {
            return function() {
                blockDom.html(blockData.value);
            }
        }(blockDom));
        if (getEmptyBlocks().length == 0 && !isCanMove()) {
            gameEnd();
        }
        return true;
    }

    var move = function(direction) {
    	if($(":animated").length>0){
    		console.log("上次移动还未完成！本次操作被取消！");
    		return;
    	}
        switch (direction) {
            case "up":
                for (var x = 0; x < option.width; x++) { //从左到右处理
                    for (var y = 1; y < option.height; y++) { //从第二行开始处理，直到最后一行
                        var currBlock = getBlock(x, y);
                        if (currBlock == null) continue;
                        //console.log("currBlockLevel:",currBlock.level);
                        var targetX = x;
                        var targetY = y - 1;
                        var targetBlock = getBlock(targetX, targetY);
                        var moved = 0;
                        while (targetY > 0 && targetBlock == null) {
                            targetY = targetY - 1;
                            targetBlock = getBlock(targetX, targetY);
                            if (++moved > Math.max(option.width, option.height))
                                break;
                        }
                        var currBlockDom = $(".block_" + x + "_" + y);
                        //console.log("currBlockLevel:",currBlock.level);
                        var position = getPosition(targetX, targetY);
                        if (targetBlock == null) { //如果上方方格为空
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else if (targetBlock.value == currBlock.value) {
                            //如果当前方格与目标方格上的数字相同
                            //将目标方格提升级别，并删除当前方格
                            //console.log("currBlockLevel:",currBlock.level);
                            var updateBlock = $.extend({}, option.blocks[currBlock.level + 1]);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = updateBlock;
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed, function(currBlockDom, targetX, targetY, updateBlock) {
                                return function() {
                                    //动画结束后，删除当前方格，并更新目标方格的数字及样式
                                    currBlockDom.remove();
                                    var targetBlockDom = $(".block_" + targetX + "_" + targetY);
                                    targetBlockDom.html(updateBlock.value);
                                    targetBlockDom.css(updateBlock.style);
                                }
                            }(currBlockDom, targetX, targetY, updateBlock))
                        } else if (targetBlock.value != currBlock.value || moved > 1) {
                            //如果当前方格与目标方格上的数字不相同
                            //把当前方格移动到目标方格的下方
                            targetY++;
                            //重新获取目标位置
                            position = getPosition(targetX, targetY);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else {
                            continue;
                        }
                    }
                }
                break;
            case "down":
                for (var x = option.width - 1; x >= 0; x--) { //从右往左处理
                    for (var y = option.height - 2; y >= 0; y--) { //从倒数第二行开始处理，直到第一行
                        var currBlock = getBlock(x, y);
                        if (currBlock == null) continue;
                        //console.log("currBlockLevel:",currBlock.level);
                        var targetX = x;
                        var targetY = y + 1;
                        var targetBlock = getBlock(targetX, targetY);
                        var moved = 0;
                        while (targetY <= option.height - 2 && targetBlock == null) {
                            targetY = targetY + 1;
                            targetBlock = getBlock(targetX, targetY);
                            if (++moved > Math.max(option.width, option.height))
                                break;
                        }
                        var currBlockDom = $(".block_" + x + "_" + y);
                        //console.log("currBlockLevel:",currBlock.level);
                        var position = getPosition(targetX, targetY);
                        if (targetBlock == null) { //如果下方方格为空
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else if (targetBlock.value == currBlock.value) { //如果当前方格与目标方格上的数字相同
                            //将目标方格提升级别，并删除当前方格
                            //console.log("currBlockLevel:",currBlock.level);
                            var updateBlock = $.extend({}, option.blocks[currBlock.level + 1]);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = updateBlock;
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed, function(currBlockDom, targetX, targetY, updateBlock) {
                                return function() {
                                    //动画结束后，删除当前方格，并更新目标方格的数字及样式
                                    currBlockDom.remove();
                                    var targetBlockDom = $(".block_" + targetX + "_" + targetY);
                                    targetBlockDom.html(updateBlock.value);
                                    targetBlockDom.css(updateBlock.style);
                                }
                            }(currBlockDom, targetX, targetY, updateBlock))
                        } else if (targetBlock.value != currBlock.value || moved > 1) { //如果当前方格与目标方格上的数字不相同
                            //把当前方格移动到目标方格的上方
                            targetY--;
                            //重新获取目标位置
                            position = getPosition(targetX, targetY);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else {
                            continue;
                        }
                    }
                }
                break;
            case "left":
                for (var y = 0; y < option.height; y++) { //从上往下处理
                    for (var x = 1; x < option.width; x++) { //从第二列开始处理，直到最后一列
                        var currBlock = getBlock(x, y);
                        if (currBlock == null) continue;
                        //console.log("currBlockLevel:",currBlock.level);
                        var targetX = x - 1;
                        var targetY = y;
                        var targetBlock = getBlock(targetX, targetY);
                        var moved = 0;
                        while (targetX > 0 && targetBlock == null) {
                            targetX = targetX - 1;
                            targetBlock = getBlock(targetX, targetY);
                            if (++moved > Math.max(option.width, option.height))
                                break;
                        }
                        var currBlockDom = $(".block_" + x + "_" + y);
                        //console.log("currBlockLevel:",currBlock.level);
                        var position = getPosition(targetX, targetY);
                        if (targetBlock == null) { //如果上方方格为空
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else if (targetBlock.value == currBlock.value) { //如果当前方格与目标方格上的数字相同
                            //将目标方格提升级别，并删除当前方格
                            //console.log("currBlockLevel:",currBlock.level);
                            var updateBlock = $.extend({}, option.blocks[currBlock.level + 1]);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = updateBlock;
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed, function(currBlockDom, targetX, targetY, updateBlock) {
                                return function() {
                                    //动画结束后，删除当前方格，并更新目标方格的数字及样式
                                    currBlockDom.remove();
                                    var targetBlockDom = $(".block_" + targetX + "_" + targetY);
                                    targetBlockDom.html(updateBlock.value);
                                    targetBlockDom.css(updateBlock.style);
                                }
                            }(currBlockDom, targetX, targetY, updateBlock))
                        } else if (targetBlock.value != currBlock.value || moved > 1) { //如果当前方格与目标方格上的数字不相同
                            //把当前方格移动到目标方格的右边
                            targetX++;
                            //重新获取目标位置
                            position = getPosition(targetX, targetY);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else {
                            continue;
                        }
                    }
                }
                break;
            case "right":
                for (var y = 0; y < option.height; y++) { //从上往下处理
                    for (var x = option.width - 2; x >= 0; x--) { //从倒数第二列开始处理，直到第一列
                        var currBlock = getBlock(x, y);
                        if (currBlock == null) continue;
                        //console.log("currBlockLevel:",currBlock.level);
                        var targetX = x + 1;
                        var targetY = y;
                        var targetBlock = getBlock(targetX, targetY);
                        var moved = 0;
                        while (targetX <= option.width - 2 && targetBlock == null) {
                            targetX = targetX + 1;
                            targetBlock = getBlock(targetX, targetY);
                            if (++moved > Math.max(option.width, option.height))
                                break;
                        }
                        var currBlockDom = $(".block_" + x + "_" + y);
                        //console.log("currBlockLevel:",currBlock.level);
                        var position = getPosition(targetX, targetY);
                        if (targetBlock == null) { //如果上方方格为空
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else if (targetBlock.value == currBlock.value) { //如果当前方格与目标方格上的数字相同
                            //将目标方格提升级别，并删除当前方格
                            //console.log("currBlockLevel:",currBlock.level);
                            var updateBlock = $.extend({}, option.blocks[currBlock.level + 1]);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = updateBlock;
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed, function(currBlockDom, targetX, targetY, updateBlock) {
                                return function() {
                                    //动画结束后，删除当前方格，并更新目标方格的数字及样式
                                    currBlockDom.remove();
                                    var targetBlockDom = $(".block_" + targetX + "_" + targetY);
                                    targetBlockDom.html(updateBlock.value);
                                    targetBlockDom.css(updateBlock.style);
                                }
                            }(currBlockDom, targetX, targetY, updateBlock))
                        } else if (targetBlock.value != currBlock.value || moved > 1) { //如果当前方格与目标方格上的数字不相同
                            //把当前方格移动到目标方格的右边
                            targetX--;
                            //重新获取目标位置
                            position = getPosition(targetX, targetY);
                            //修改游戏数据
                            datas[getIndex(x, y)] = null;
                            datas[getIndex(targetX, targetY)] = currBlock;
                            //修改当前方格的类样式
                            currBlockDom.removeClass();
                            currBlockDom.addClass('block_' + targetX + "_" + targetY);
                            //创建动画
                            currBlockDom.animate({
                                "top": position.top,
                                "left": position.left
                            }, option.animateSpeed);
                        } else {
                            continue;
                        }
                    }
                }
                break;
        }
        if (!buildDataBlock() && !isCanMove()) {
            gameEnd();
        }
    }
    //检查是否还能移动
    var isCanMove = function() {
        for (var x = 0; x < option.width - 1; x++) {
            for (var y = 0; y < option.height - 1; y++) {
                if (x > 0 && datas[getIndex(x - 1, y)].value == datas[getIndex(x, y)].value) {
                    return true;
                }
                if (x < option.width - 1 && datas[getIndex(x + 1, y)].value == datas[getIndex(x, y)].value) {
                    return true;
                }
                if (y > 0 && datas[getIndex(x, y - 1)].value == datas[getIndex(x, y)].value) {
                    return true;
                }
                if (y < option.height - 1 && datas[getIndex(x, y + 1)].value == datas[getIndex(x, y)].value) {
                    return true;
                }
            }
        }
        return false;
    }
    var keyHandler = function(event) {
        switch (event.keyCode) {
            case 38:
                move("up");
                break;
            case 40:
                move("down");
                break;
            case 37:
                move("left");
                break;
            case 39:
                move("right");
                break;
        }
    }

    var gameStart = function() {
        buildBlankBlocks();
        buildDataBlock();
        buildDataBlock();
        /*buildDataBlock(0,0,2);
        buildDataBlock(0,1,0);
        buildDataBlock(0,1,2);
        buildDataBlock(0,2,0);
        buildDataBlock(1,2,2);
        buildDataBlock(1,3,0);
        buildDataBlock(1,3,1);
        buildDataBlock(2,3,2);*/
        $(document).keydown(keyHandler);
    }

    var gameEnd = function() {
        $(document).unbind('keydown', keyHandler);
        if($("#opArea").length>0)
        	$(".arror").unbind('click');
        var score = 0;
        for (var i = 0; i < datas.length; i++) {
            if (datas[i] == null) continue;
            score += Math.pow(2, datas[i].level + 1);
        }
        console.log("游戏结束，您的分数为：", score);
        var $endMask = $("<div></div>");
        var $mask = $("<div></div>");
        $mask.css({
            "background-color": option.style.backColor,
            "border-radius": option.style.padding,
            "position": "absolute",
            "-webkit-user-select": "none",
            "opacity": 0.2,
            "width": $this.width(),
            "height": $this.height()
        });

        var $title = $("<h1>游戏结束</h1>");
        var $result = $("<p>您的分数为：" + score + "</p>");
        var $again = $("<button>再试一次</button>");
        $again.click(function(event) {
            event.preventDefault();
            datas.length = 0;
            $this.empty();
            gameStart();
        }).css({
        	"padding": "10px",
            "font-size": "20px",
            "font-weight": "800",
            "color": "white",
            "text-align": "center",
            "background-color":"#D9534F",
            "border-radius": '10px',
            "cursor": "pointer"
        });
        var $content = $("<div></div>");
        $content.css({
            "width": "80%",
            "text-align": "center",
            "margin": "0 auto",
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%,-50%)",
            "padding": 10,
            "opacity": 0.8,
            "background-color": option.style.blockColor
        });
        $endMask.append($mask);
        $content.append($title);
        $content.append($result);
        $content.append($again);
        $endMask.append($content);
        $this.append($endMask);
    }
    gameStart();
}