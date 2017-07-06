/**
 * Created by Administrator on 2016/7/25 0025.
 */
var date = [[1,2,3],[4,5,6],[7,8,0]];
//值为0的位置date[nullX][nullY];
var nullX = 2;
var nullY = 2;
var isStart = false;
var fixedBoxs;
var movePic;
var moveToX;
var moveToY;
var userScore;
var openBgm = true;
var bgm;
var isOkMic;
var isWinMic;
window.onload = function(){
    fixedBoxs = document.getElementsByClassName("fixedBox");
    var checkerboard = document.getElementById("checkerboard");
    var startGameButton = document.getElementById("startGame");
    var isOpenButton = document.getElementById("isOpen");
    bgm = document.getElementById("bgm");
    isOkMic = document.getElementById("isOk");
    isWinMic = document.getElementById("isWin");
    startGameButton.addEventListener("touchend",startGame);
    isOpenButton.addEventListener("touchend",changOpenBgm);
    ts_addTouchslide(checkerboard);
};
function startGame(){
    isStart = false;
    document.getElementById("startGame").innerHTML = "再来一局";
    for(var i = 0; i < date.length ; i ++) {
        for (var j = 0; j < date[i].length; j++) {
            date[i][j] = i * 3 + j + 1;
            var img = document.getElementById("img" + date[i][j]);
            img.style.visibility = "hidden";
        }
    }
    date[2][2] = 0;
    changeDate(15);
    makePic();
    //初始化
    movePic = document.getElementById("img1");
    moveToX = movePic.offsetLeft;
    moveToY = movePic.offsetTop;

    isStart = true;
    userScore = 102;
    changeScore();
    playBgm();
}
//根据难度初始化游戏
function changeDate(hard){
    var total = 0;
    var laseDir = 6;
    while (true){
        var randomDir = Math.floor(Math.random() * 5);
        if(randomDir == 2 || Math.abs(laseDir - randomDir) == 1)
            continue;
        switch (randomDir){
            case 0:if(moveToUp()) total ++;laseDir = 0;break;
            case 1:if(moveToDown()) total ++;laseDir = 1;break;
            case 3:if(moveToLeft()) total ++;laseDir = 3;break;
            case 4:if(moveToRight()) total ++;laseDir = 4;break;
        }
        if(total == hard)
            break;
    }
}
//显示图片
function makePic(){
    for(var i = 0; i < date.length ; i ++){
        for(var j = 0 ; j < date[i].length ; j ++){
            var fixedBoxNum = i * 3 + j;
            if(date[i][j] == 0)
                continue;
            var thisPic = document.getElementById("img" + date[i][j]);
            var thisfixedBox = fixedBoxs[fixedBoxNum];
            var imgLeft = thisfixedBox.offsetLeft + 1;
            var imgTop = thisfixedBox.offsetTop + 1;
            thisPic.style.left = imgLeft + "px";
            thisPic.style.top = imgTop + "px";
            thisPic.style.visibility = "visible";
        }
    }
}
//寻找null
function findNull(){
    for(var i = 0; i < date.length ; i ++){
        for(var j = 0 ; j < date[i].length ; j ++){
            if(date[i][j] == 0){
                nullX = i;
                nullY = j;
            }
        }
    }
}
//图片动画
function movePicture(imgNum){
    if(!isStart)
        return false;
    else{
        var nullFixedBox = fixedBoxs[nullX * 3 + nullY];
        movePic = document.getElementById("img" + imgNum);
        moveToX = nullFixedBox.offsetLeft + 1;
        moveToY = nullFixedBox.offsetTop + 1;
        anim_changeXY(movePic,moveToX,moveToY,10,null);
    }
}
//改变成绩
function changeScore(){
    if(isStart){
        if(userScore <= 0){
            alert("兄弟，你挂了！");
            window.location.reload();
            return false;
        }
        else{
            userScore -= 2;
            document.getElementById("scoreNum").innerHTML = userScore;
            if(userScore!=100)
                playIsOkMic();
        }


    }
}
//游戏完成动画
function showWin(){
    if(!isStart)
        return;
    isStart = false;
    var img9 = document.getElementById("img9");
    var fixedBox9 = fixedBoxs[8];
    var fixedBox9Left = fixedBox9.offsetLeft + 1 ;
    var fixedBox9Top = fixedBox9.offsetTop + 1;
    img9.style.left = fixedBox9Left + "px";
    img9.style.top = fixedBox9Top + "px";
    anim_changeSize(img9,0.5,0.5,0.5,5,null);
    var timer = setInterval(function(){
        img9.style.visibility = "visible";
        anim_changeSize(img9,2,0.5,0.5,10,null);
        playWinMic();
        clearInterval(timer);
    },400);
}
//向上滑动
function moveToUp(){
    findNull();
    if(nullX == date.length - 1)
        return false;
    else {
        movePicture(date[nullX + 1][nullY]);
        //交换数字
        date[nullX][nullY] = date[nullX + 1][nullY];
        date[nullX + 1][nullY] = 0;
        changeScore();
        return true;
    }
}
//向下滑动
function moveToDown(){
    findNull();
    if(nullX == 0)
        return false;
    else {
        movePicture(date[nullX - 1][nullY]);
        //交换数字
        date[nullX][nullY] = date[nullX - 1][nullY];
        date[nullX - 1][nullY] = 0;
        changeScore();
        return true;
    }
}
//向右滑动
function moveToRight(){
    findNull();
    if(nullY == 0)
        return false;
    else {
        movePicture(date[nullX][nullY - 1]);
        //交换数字
        date[nullX][nullY] = date[nullX][nullY - 1];
        date[nullX][nullY - 1] = 0;
        changeScore();
        return true;
    }
}
//向左滑动
function moveToLeft(){
    findNull();
    if(nullY == date.length - 1)
        return false;
    else {
        movePicture(date[nullX][nullY + 1]);
        //交换数字
        date[nullX][nullY] = date[nullX][nullY + 1];
        date[nullX][nullY + 1] = 0;
        changeScore();
        return true;
    }
}
function isMovingOver(){
    if(!isStart)
        return;
    if(movePic.offsetLeft != moveToX || movePic.offsetTop != moveToY)
        return false;
    else
        return true;
}
//向上滑了
function ts_touchToUp(){
    if(isMovingOver()) {
        moveToUp();
        isWin();
    }
}
//向下滑了
function ts_touchToDown(){
    if(isMovingOver()){
        moveToDown();
        isWin();
    }
}
//向左滑了
function ts_touchToLeft(){
    if(isMovingOver()){
        moveToLeft();
        isWin();
    }
}
//向右滑了
function ts_touchToRight(){
    if(isMovingOver()){
        moveToRight();
        isWin();
    }
}
//验证是否游戏完成
function isWin(){
    findNull();
    if(nullX != date.length - 1 || nullY != date.length - 1)
        return false;
    else {
        date[nullX][nullY] = 9;
    }
    for(var i = 0; i < date.length ; i ++){
        for(var j = 0 ; j < date[i].length ; j ++){
            var objNum = i * 3 + j + 1;
            if(date[i][j] != objNum){
                date[nullX][nullY] = 0;
                return false;
            }
        }
    }
    showWin();
    return true;
}
//展示数据
function showDate(){
    //   makePic();
    for(var i = 0; i < date.length ; i ++){
        for(var j = 0 ; j < date[i].length ; j ++){
            fixedBoxs[i * 3 +j].innerHTML = date[i][j] + "";
        }
    }
}
//播放背景音乐
function playBgm(){
    if(isStart && openBgm){
        bgm.volume = 0.1;
        bgm.play();
    }
}
//播放isOkMic
function playIsOkMic(){
    if(isStart && openBgm) {
        isOkMic.volume = 0.6;
        isOkMic.currentTime = 0;
        isOkMic.play();
    }
}
//播放游戏成功音效
function playWinMic(){
    if(openBgm) {
        bgm.pause();
        isWinMic.volume = 0.05;
        isWinMic.play();
        bgm.currentTime = 0;
    }
}
//改变是否播放声音的状态
function changOpenBgm(){
    if(openBgm){
        openBgm = false;
        bgm.pause();
        bgm.currentTime = 0;
        document.getElementById("isOpen").src = "img/isOpen0.png";
    }else{
        openBgm = true;
        document.getElementById("isOpen").src = "img/isOpen1.png";
        playBgm();
    }
}