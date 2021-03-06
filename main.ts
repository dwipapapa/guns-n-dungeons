namespace SpriteKind {
    export const TrappedPlayer = SpriteKind.create()
    export const Key = SpriteKind.create()
    export const Screen = SpriteKind.create()
}
function Make_obtained_splash () {
    game.splash("You obtained a", "" + list[0] + "!")
    our_guns.push(list.shift())
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    LastDirection = 2
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
    if (controller.A.isPressed()) {
        if (tiles.tileIs(location, sprites.dungeon.chestClosed)) {
            if (controller.A.isPressed()) {
                Have_Gun = true
                music.powerUp.play()
                tiles.setTileAt(location, sprites.dungeon.chestOpen)
                game.setDialogCursor(img`
                    .........................
                    ....................cccbb
                    ...................bbbbbb
                    ...................bb.b..
                    ..................111b...
                    ...6666666........111....
                    .66666666666......111....
                    6666666666666......1.....
                    6666666666666.....11.....
                    6661f66661f666...11......
                    6661f66661f666...1.......
                    66666666666666..1........
                    6666666666666611.........
                    66666666666666...........
                    66666666666666...........
                    66666666666666...........
                    6666666666666............
                    6666666666666............
                    .66666666666.............
                    ...6666666...............
                    `)
                Make_obtained_splash()
                POWER = 1
                if (our_guns.length == 1) {
                    game.splash("Press A to shoot!")
                } else if (our_guns.length == 2) {
                    game.splash("Press Menu to Select Guns!")
                }
            }
        } else if (tiles.tileIs(location, sprites.dungeon.doorClosedNorth)) {
            if (Have_key) {
                if (sprites.readDataString(sprites.readDataSprite(mySprite, "Following key"), "KeyKind") == "door") {
                    tiles.setWallAt(location, false)
                    tiles.setTileAt(location, sprites.dungeon.doorOpenNorth)
                }
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`myTile`, function (sprite, location) {
    sprite.setKind(SpriteKind.TrappedPlayer)
    trap = true
    tiles.setTileAt(location, assets.tile`myTile1`)
    controller.moveSprite(sprite, 0, 0)
    tiles.placeOnTile(sprite, location)
    trap_time = 5
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`myTile`, function (sprite, location) {
    tiles.setTileAt(location, sprites.dungeon.floorDark2)
    sprite.destroy()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (Start_Screen_open) {
        mySprite2.destroy(effects.ashes, 1000)
        timer.after(1000, function () {
            Start_Screen_open = false
            Have_Gun = false
            Start_Map = tiles.createMap(tilemap`level1`)
            Dungeons = [tiles.createMap(tilemap`level4`), tiles.createMap(tilemap`level3`)]
            Dungeon = Dungeons.shift()
            info.setLife(100)
            tiles.loadMap(Start_Map)
            mySprite = sprites.create(img`
                . . . . 6 6 6 6 6 6 6 . . . . 
                . . 6 6 6 6 6 6 6 6 6 6 6 . . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                6 6 6 6 1 f 6 6 6 6 1 f 6 6 6 
                6 6 6 6 1 f 6 6 6 6 1 f 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . . 6 6 6 6 6 6 6 6 6 6 6 . . 
                . . . . 6 6 6 6 6 6 6 . . . . 
                `, SpriteKind.Player)
            scene.cameraFollowSprite(mySprite)
            Intro()
        })
    } else {
        if (trap_time > 0) {
            info.changeLifeBy(-1)
            trap_time += -1
            animation.runMovementAnimation(
            mySprite,
            animation.animationPresets(animation.shake),
            500,
            false
            )
        } else if (trap && trap_time == 0) {
            tiles.setTileAt(tiles.locationOfSprite(mySprite), sprites.dungeon.floorDark2)
            mySprite.setKind(SpriteKind.Player)
            controller.moveSprite(mySprite)
            trap = false
        } else {
            if (Have_Gun) {
                if (LastDirection == 0) {
                    projectile = sprites.createProjectileFromSprite(img`
                        b b 
                        b b 
                        `, mySprite, -150, 0)
                } else if (LastDirection == 1) {
                    projectile = sprites.createProjectileFromSprite(img`
                        b b 
                        b b 
                        `, mySprite, 150, 0)
                } else if (LastDirection == 2) {
                    projectile = sprites.createProjectileFromSprite(img`
                        b b 
                        b b 
                        `, mySprite, 0, -150)
                } else {
                    projectile = sprites.createProjectileFromSprite(img`
                        b b 
                        b b 
                        `, mySprite, 0, 150)
                }
                sprites.setDataNumber(projectile, "Power", POWER)
                music.pewPew.play()
            }
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`Hole`, function (sprite, location) {
    Dungeon_Intro(sprite)
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    LastDirection = 0
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Key, function (sprite, otherSprite) {
    sprite.z = 100
    otherSprite.follow(sprite, 50)
    Have_key = true
    sprites.setDataSprite(sprite, "Following key", otherSprite)
})
function Dungeon_Intro (Sprite2: Sprite) {
    if (Start_cutsceene) {
        story.startCutscene(function () {
            tiles.loadMap(Dungeon)
            lantern.startLanternEffect(Sprite2)
            tiles.placeOnRandomTile(Sprite2, sprites.dungeon.purpleOuterNorth1)
            Sprite2.ay = 150
            Sprite2.setImage(img`
                ........1.1.........
                ......1.1.1.1.......
                ......1.1.1.1......1
                ......1.1.1.1......1
                ......1.1.1.1......1
                ......1.1.1.1....1.1
                ................1...
                ......6666666......1
                ....66666666666.....
                ...6666666666666....
                ...6666666666666....
                ..666666666666666...
                ..666fff666fff666...
                ..666666666666666...
                ..666666666666666...
                ..666666666666666...
                ..666666666666666...
                ..666666666666666...
                ...6666666666666....
                ...6666666666666....
                ....66666666666.....
                11....6666666.....11
                ..11............11..
                ....11........11....
                ......1.....11......
                `)
            Make_Key_for("door")
            Have_key = false
        })
    }
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    LastDirection = 1
})
function Make_Key_for (KeyKind: string) {
    KKey = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . 5 5 5 5 5 . . . . . . 
        . . . . . 5 . . . 5 . . . . . . 
        . . . . . 5 . . . 5 . . . . . . 
        . . . . . 5 5 5 5 5 . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . 5 5 5 5 . . . . . . . . 
        . . . . . . . 5 . . . . . . . . 
        . . . . 5 5 5 5 . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Key)
    tiles.placeOnRandomTile(KKey, assets.tile`myTile2`)
    tiles.coverAllTiles(assets.tile`myTile2`, sprites.dungeon.floorDarkDiamond)
    sprites.setDataString(KKey, "KeyKind", KeyKind)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    LastDirection = 3
})
function Intro () {
    story.startCutscene(function () {
        Start_cutsceene = true
        story.printCharacterText("A  beautiful day", "You")
        story.printCharacterText("Wait...", "You")
        story.printCharacterText("Hmm...", "You")
        timer.after(1500, function () {
            story.printCharacterText("Is that a hole?", "You")
            story.printCharacterText("Whats inside?", "You")
            story.spriteMoveToLocation(mySprite, 16 * 2 + 8, 16 * 2 + 8, 25)
        })
    })
}
controller.menu.onEvent(ControllerButtonEvent.Pressed, function () {
    if (not_Menu_open) {
        blockMenu.showMenu(our_guns, MenuStyle.Grid, MenuLocation.FullScreen)
        not_Menu_open = false
    } else {
        not_Menu_open = true
        blockMenu.closeMenu()
    }
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.floorDark5, function (sprite, location) {
    Dungeon_Intro_2(sprite)
})
function Dungeon_Intro_2 (Sprite2: Sprite) {
    if (Start_cutsceene) {
        story.startCutscene(function () {
            Sprite2.setImage(img`
                . . . . 6 6 6 6 6 6 6 . . . . 
                . . 6 6 6 6 6 6 6 6 6 6 6 . . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                6 6 6 6 1 f 6 6 6 6 1 f 6 6 6 
                6 6 6 6 1 f 6 6 6 6 1 f 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . 6 6 6 6 6 6 6 6 6 6 6 6 6 . 
                . . 6 6 6 6 6 6 6 6 6 6 6 . . 
                . . . . 6 6 6 6 6 6 6 . . . . 
                `)
            Sprite2.ay = 0
            story.printCharacterText("Oww...", "You")
            story.printCharacterText("That hurts...", "You")
            story.printCharacterText("...a lot", "You")
            story.startCutscene(function () {
                game.setDialogCursor(img`
                    ....................
                    ....................
                    ........1.1........f
                    ......1.1.1.1......f
                    ......1.1.1.1......f
                    ......1.1.1.1....f.f
                    ................f...
                    ......6666666......f
                    ....66666666666.....
                    ...6666666666666....
                    ...6666666666666....
                    ..666666666666666...
                    ..666fff666fff666...
                    ..666666666666666...
                    ..666666666666666...
                    ..666666666666666...
                    ..666666666666666...
                    ..666666666666666...
                    ...6666666666666....
                    ...6666666666666....
                    ....66666666666.....
                    11....6666666.....11
                    ..11............11..
                    ....11........11....
                    ......1.....11......
                    `)
                game.splash("You fell into a dark", "dungeon!")
                controller.moveSprite(Sprite2)
                music.thump.play()
            })
        })
    }
    Start_cutsceene = false
}
function Next_Dungeon () {
    Dungeon = Dungeons.shift()
    tiles.loadMap(Dungeon)
    tiles.placeOnTile(mySprite, tiles.locationInDirection(Door_Location, CollisionDirection.Bottom))
}
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`myTile1`, function (sprite, location) {
    tiles.setTileAt(location, sprites.dungeon.floorDark2)
    sprite.destroy()
})
blockMenu.onMenuOptionSelected(function (option, index) {
    if (option == "BEGINNERS PISTOL") {
        POWER = 1
    } else if (option == "EXPERT PISTOL") {
        POWER = 5
    } else if (option == "BEGINNERS SNIPER") {
        POWER = 10
    } else if (option == "EXPERT SNIPER") {
        POWER = 15
    } else if (option == "BEGINNERS BAZOOKA") {
        POWER = 20
    } else if (option == "EXPERT BAZOOKA") {
        POWER = 25
    }
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.doorOpenNorth, function (sprite, location) {
    Door_Location = location
    if (Dungeons == []) {
        game.over(true, effects.confetti)
    } else {
        Next_Dungeon()
    }
})
let Door_Location: tiles.Location = null
let KKey: Sprite = null
let Start_cutsceene = false
let projectile: Sprite = null
let Dungeon: tiles.WorldMap = null
let Dungeons: tiles.WorldMap[] = []
let Start_Map: tiles.WorldMap = null
let trap_time = 0
let trap = false
let mySprite: Sprite = null
let Have_key = false
let POWER = 0
let Have_Gun = false
let LastDirection = 0
let list: string[] = []
let our_guns: string[] = []
let not_Menu_open = false
let Start_Screen_open = false
let mySprite2: Sprite = null
mySprite2 = sprites.create(img`
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbcccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbcccccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbccccccbcccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbcccbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbcbbbbbbccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbccccccbbbbcccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbbbbbbbcccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbb
    bccccccbbbbbccccccccccccccccccbbbbccccbbbbbbbbbbccbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbbbbbbbccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbb
    bbccccccbbbbccccccccccccccccccbbbbccccccbbbbbbcccccbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbb
    bbccccccbbbbcccccccccccccccccbbbbbccccccbbbbbccccccbbbbbbbbbbbbbbcccccccccccccccccbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbb
    bbbccccccbbbbccccccccccccccccbbbbbcccccbbbbbbcccccccbbbbbbbbbbbbbccccccccccccccccccbbbbcccccccccccccbbbbbbbbbbbbbbbbcccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbb
    bbbccccccbbbbbbbbbbbbbbcccccbbbbbbcccccbbbbbbbccccccbbbbbbbbbbbbccccccccccccccccccccbbbbcccccccccccccbbbbbbbbbbbbbbbbcccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbb
    bbbbccccccbbbbbbbbbbbbbcccccbbbbbcccccbbbbbbbbcccccccbbbbbbbbbbcccccccccccccccccccccbbbbbcccccccccccccbbbbbbbbbbbbbbbccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccccbbbbbbbbbbbccccccbbbbbcccccbbbbbbbbbccccccbbbbbbbbbcccccccccccccccccccccccbbbbbccccccccccccbbbbbbbbbbbbbbbbccccccccbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbb
    bbbbbccccccbbbbbbbbbbbcccccbbbbbcccccbbbbbbbbbbbccccccbbbbbbbbbcccccccccccccccccccccccbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbccccccccbbbbbbbccccccbbbbbbbbbbbbbbbbbbbbb
    bbbbbcccccccbbbbbbbbbccccccbbbbbbccccbbbbbbbbbbccccccccbbbbbbbbccccccccccccccccccccccbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbccccccccbbbbbccccccbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbccccccbbbbbbbbbcccccbbbbbbbcccccbbbbbbbbccccccccccbbbbbbbbccccccccbbbbbbbccccccbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbccccccccbbbbcccccccbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbccccccccccccccccccccbbbbbbbbcccccbbbbbbbcccccccccccbbbbbbbccccccccbbbbbbbccccccbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbcccccccbbbbbccccccbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbccccccccccccccccccbbbbbbbbbbccccbbbbbbcccccccccccccbbbbbbbccccccccbbbbbccccccbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbccccccbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbccccccccccccccccccbbbbbbbbbbccccccccccccccccccccccccbbbbbbccccccccbbbbcccccccbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbccccccbbbbccccccbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbcccccccccccccccccbbbbbbbbbbbccccccccccccccccccccccbbbbbbbbcccccccbbbbbccccccbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbcccccbbbbccccccbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccbbcccccbbbbbbbbbbccccccbbbbbcccccbbbbbccccccccccccccccbbbbbbbbbbbbbbbbbbcccbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccccbbbccccbbbbbbbbbbccccccbbbbccccccbbbbbcccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccbbbcccbbbbbbbbbbbbcccccbbbbccccccbbbbbcccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbbbbbcccbbbbbbbbcccbbbbbbccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66661116666666661116666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666611f66666666611f66666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666611f66666666611f66666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666611f66666666611f66666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666611f66666666611f66666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666611166666666611166666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbcccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb666666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66666666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6666666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbcccccbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb66666666666bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbccccbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbccccbbbbcccccbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbccccbbbccccccbbbbbbbbbbbbbbbbbbcccccccccccbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbbbb
    bbbbccccbbbccccccbbbbbbbbbbbbbbbbbbccccccccccccbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbb
    bbbbccccbbbccccccbbbbbbbbcccccbbbbcccccccccccccbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbbbbbbbbccccccccccbbbbbbbbbbbbbbbccccccccbbbbbbbbbbbbb
    bbbbccccbbbbcccccbbbbbbbbcccccbbbbccccccbbccccccbbccccccccbbbbbbbbbbbbbccccccbbbbbbcccccccccccbbbbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbb
    bbbbcccbbbbbcccccbbbbbbbbcccccbbbbccccccbbccccccbbcccccccccbbbbbbbbbcccccccccbbbbbccccbbbbbccccbbbcccccccccbbbbbbbcccccccccccbbbbbbbbbbbbccccccbbbbbbbbbbbbbbbbb
    bbbbcccbbbbbcccccbbbbbbbbccccccbbbccccccbbbcccccbbccccccccccbbbbbbbbccccccccccbbbbccccbbbbbccccbbbcccccccccccbbbbbcccccbbcccccbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbb
    bbbbccccbbbbcccccbbbbbbbbccccccbbcccccccbbbcccccbbccccccccccbbbbbbbccccbbbbcccbbbbccccbbbbbccccbbcccccccccccccbbbbccccbbbbccccbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbb
    bbbbccccbbbbcccccbbbbbbbbbccccccccccccccbbbccccbbbcccccbccccbbbbbbbcccbbbbbcccbbbbcccccccccccccbcccccbbbccccccccbbccccbbbbbcccbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbb
    bbbbcccccbbbcccccbbbbbbbbbccccccccccccccbbbbcccbbbcccccbccccbbbbbbccccbbbbbccccbbbcccccccccccccbccccbbbbbbbcccccbbcccbbbbbccccbbbbbbbbbbbcccccccccbbbbbbbbbbbbbb
    bbbbcccccccccccccbbbbbbbbbcccccccccccccbbbbbcccbbbcccccbccccbbbbbbccccbbbbcccccbbbccccccccccccbbccccbbbbbbbbccccbbcccbbbbbccccbbbbbbbbbbbbcccccccccbbbbbbbbbbbbb
    bbbbccccccccccccbbbbbbbbbbccccccccccccbbbbbbcccbbbccccbbccccbbbbbcccccccccccccccbbcccccccbbbbbbbcccbbbbbbbbcccccbbcccbbbbbcccbbbbbbbbbbbbbbccccccccccbbbbbbbbbbb
    bbbbcccccccccccbbbbbbbbbbbbcccccccccccbbbbbbcccbbbccccbbccccbbbbbcccccccccccccccbbbcccccbbbbbbbbccccbbbbbbccccccbbccccbbbbcccbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbb
    bbbbcccccccccccbbbbbbbbbbbbbccccccccbbbbbbbbcccbbbccccbbccccbbbbbbbbccccccccccccbbbccccccbbbbbbbccccccbbcccccccbbbccccbbbbcccbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbb
    bbbbccccccccccbbbbbbbbbbbbbbbccccbbbbbbbbbbbcccbbbcccbbbccccbbbbbbbbbbccccccccccbbbbcccccccccbbbccccccccccccccbbbbccccbbbbcccbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbb
    bbbbbccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccbbbbbbbbbbccccbbbbbbbbbbbbbbbcccccbbbbbccccccccbbbbccccccccccccbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbcccccccbbbbbbccccccccbbbbbbbbbbbbbbbcccbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbcccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbcccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccbcbbccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbccccccbbcbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbcccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbccccbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
    `, SpriteKind.Screen)
Start_Screen_open = true
not_Menu_open = true
our_guns = []
list = [
"BEGINNERS PISTOL",
"EXPERTS PISTOL",
"BEGINNERS SNIPER",
"EXPERTS SNIPER",
"BEGINNERS BAZOOKA",
"EXPERTS BAZOOKA"
]
forever(function () {
    for (let index = 0; index < 3; index++) {
        music.playMelody("E - F - A A B B ", 200)
    }
    music.playMelody("F - G E A A G G ", 200)
    for (let index = 0; index < 3; index++) {
        music.playMelody("B - A - F F E E ", 200)
        music.playMelody("F - G E A A G G ", 200)
    }
})
