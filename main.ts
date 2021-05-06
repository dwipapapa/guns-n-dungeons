namespace SpriteKind {
    export const TrappedPlayer = SpriteKind.create()
    export const Key = SpriteKind.create()
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    LastDirection = 2
})
scene.onHitWall(SpriteKind.Player, function (sprite, location) {
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
            game.splash("You obtained a", "BEGINNERS PISTOL!")
            game.splash("Press A to shoot!")
        }
    } else if (tiles.tileIs(location, sprites.dungeon.doorClosedNorth)) {
        if (Have_key) {
            if (sprites.readDataString(sprites.readDataSprite(mySprite, "Following key"), "KeyKind") == "door") {
                tiles.setWallAt(location, false)
                tiles.setTileAt(location, sprites.dungeon.doorOpenNorth)
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
            sprites.setDataNumber(projectile, "Power", 1)
            music.pewPew.play()
        }
    }
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`Hole`, function (sprite, location) {
    if (Start_cutsceene) {
        story.startCutscene(function () {
            tiles.loadMap(Dungeon)
            lantern.startLanternEffect(mySprite)
            tiles.placeOnRandomTile(sprite, sprites.dungeon.purpleOuterNorth1)
            sprite.ay = 150
            sprite.setImage(img`
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
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.floorDark5, function (sprite, location) {
    if (Start_cutsceene) {
        story.startCutscene(function () {
            sprite.setImage(img`
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
            sprite.ay = 0
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
                controller.moveSprite(mySprite)
                music.thump.play()
            })
        })
    }
    Start_cutsceene = false
})
scene.onOverlapTile(SpriteKind.Projectile, assets.tile`myTile1`, function (sprite, location) {
    tiles.setTileAt(location, sprites.dungeon.floorDark2)
    sprite.destroy()
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.doorOpenNorth, function (sprite, location) {
    if (Dungeons == []) {
        game.over(true, effects.confetti)
    }
})
let KKey: Sprite = null
let projectile: Sprite = null
let trap_time = 0
let Have_key = false
let LastDirection = 0
let Start_cutsceene = false
let mySprite: Sprite = null
let Dungeon: tiles.WorldMap = null
let Dungeons: tiles.WorldMap[] = []
let Have_Gun = false
let trap = false
trap = false
Have_Gun = false
let Start_Map = tiles.createMap(tilemap`level1`)
Dungeons = [tiles.createMap(tilemap`level3`)]
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
forever(function () {
    for (let index = 0; index < 3; index++) {
        music.playMelody("E - F - A A B B ", 200)
    }
    music.playMelody("F - G E A A G G ", 200)
    for (let index = 0; index < 3; index++) {
        music.playMelody("B - A - F F E E ", 200)
    }
    music.playMelody("F - G E A A G G ", 200)
})
