const gameDatas = {
    house: [],
    level: 0,
    towerBase: 175,
    houseConnect: [],
    activeLine: null,
    lines: [],
};

const levelDatas = [
    {
        housePos: [
            { x: 800, y: 600 },
            { x: 600, y: 300 },
            { x: 500, y: 100 },
            { x: 100, y: 900 },
            { x: 1000, y: 400 },
            { x: 1500, y: 900 },
        ],
        towerPos: { x: 200, y: 300 },
        towerConnect: [0, 3],
        houseConnect: [[1, 4], [2], [], [], [5]],
    },
];

class Main extends Phaser.Scene {
    preload() {
        this.load.image("background", "./src/background.png");
        this.load.image("house", "./src/house.svg");
        this.load.image("tower", "./src/tower.svg");
        this.load.image("electro", "./src/electro.svg");
        this.load.image("noElec", "./src/noElec.svg");
        this.load.image("yesElec", "./src/yesElec.svg");
    }
    create() {
        this.add
            .image(config.width / 2, config.height / 2, "background")
            .setScale(2);
        const levelData = levelDatas[gameDatas.level];
        const width = 7;
        const connects = [];
        for (let i in levelData.housePos) {
            connects.push([]);
        }
        for (let i of levelData.towerConnect) {
            const line = this.add.line(
                -width / 2,
                -width / 2,
                levelData.towerPos.x,
                levelData.towerPos.y + gameDatas.towerBase,
                levelData.housePos[i].x,
                levelData.housePos[i].y,
                0x000000,
                0.2
            );
            line.setLineWidth(width);
            line.setOrigin(0);
            connects[i].push(-1);
        }
        for (let i in levelData.houseConnect) {
            for (let j of levelData.houseConnect[i]) {
                const line = this.add.line(
                    -width / 2,
                    -width / 2,
                    levelData.housePos[i].x,
                    levelData.housePos[i].y,
                    levelData.housePos[j].x,
                    levelData.housePos[j].y,
                    0x000000,
                    0.2
                );
                line.setLineWidth(width);
                line.setOrigin(0);
                connects[j].push(parseInt(i));
            }
        }
        const lineLayer = this.add.layer();
        gameDatas.houseConnect = connects;
        const towerBase = this.add.circle(
            levelData.towerPos.x,
            levelData.towerPos.y + gameDatas.towerBase,
            20,
            0xffff00
        );
        const tower = this.add.image(
            levelData.towerPos.x,
            levelData.towerPos.y,
            "tower"
        );
        tower.num = -1;
        tower.node = "connect";
        tower.setScale(0.15);
        tower.setInteractive();
        const housePos = levelData.housePos;
        for (let i in housePos) {
            const house = this.add.image(housePos[i].x, housePos[i].y, "house");
            const text = this.add.text(housePos[i].x, housePos[i].y - 20, i, {
                fontSize: "50px",
                fill: "#000000",
            });
            house.setScale(0.2);
            house.setInteractive();
            house.num = parseInt(i);
            house.node = "connect";
            gameDatas.house.push(house);
        }

        this.input.on("pointerdown", (pointer, object) => {
            
            if(object.length == 0){
                return
            }
            if (object[0].node == "connect") {
                let startPos;
                const width  =10
                if (object[0].num == -1) {
                    startPos = [
                        levelData.towerPos.x,
                        levelData.towerPos.y + gameDatas.towerBase,
                    ];
                } else {
                    startPos = [object[0].x, object[0].y];
                }
                const line = this.add.line(-width / 2, -width / 2, startPos[0], startPos[1], pointer.x, pointer.y, 0x000000, 1)
                line.setOrigin(0);
                line.setLineWidth(width);
                line.startPos = [startPos[0], startPos[1]]
                lineLayer.add(line)
                gameDatas.activeLine = line;
            }

        });
        this.input.on("pointermove", (pointer) => {
            if(gameDatas.activeLine){
                gameDatas.activeLine.setTo(gameDatas.activeLine.startPos[0], gameDatas.activeLine.startPos[1], pointer.x, pointer.y)
            }
        });
        this.input.on("pointerup", (pointer, object) => {
            if(gameDatas.activeLine){
                if(object.length == 0){
                    gameDatas.activeLine.destroy()
                    gameDatas.activeLine = null;
                }else{
                    console.log("!@");
                    if (object[0].node == "connect") {
                        var endPos
                        if (object[0].num == -1) {
                            endPos = [levelData.towerPos.x, levelData.towerPos.y + gameDatas.towerBase]
                        } else {
                            endPos = [levelData.housePos[object[0].num].x, levelData.housePos[object[0].num].y]
                        }
                        gameDatas.activeLine.setTo(gameDatas.activeLine.startPos[0], gameDatas.activeLine.startPos[1], endPos[0], endPos[1])
                        gameDatas.lines.push(gameDatas.activeLine)
                        gameDatas.activeLine = null;
                    }
                }
            }
        });
    }
    update() {}
}

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 1200,
    scene: Main,
    parent: "main",
};

const game = new Phaser.Game(config);
const windowBorder = 10;
const gameWindow = document.getElementById("main");
function ResizeWindow() {
    let width = window.innerWidth - windowBorder;
    let height = window.innerHeight - windowBorder;
    let scale = 1;
    let testWidth;
    testWidth = (height / gameWindow.offsetHeight) * gameWindow.offsetWidth;
    if (testWidth < width) {
        scale = testWidth / gameWindow.offsetWidth;
    } else {
        scale = width / gameWindow.offsetWidth;
    }

    gameWindow.style.transform =
        "translate(-50%, -50%)" + "scale(" + scale + ")";
}

ResizeWindow();
