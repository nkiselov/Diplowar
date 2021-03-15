"use strict";
exports.__esModule = true;
exports.GameDataDirect = exports.Region = exports.MilitaryType = exports.ResourceType = exports.Game = exports.GameCreator = void 0;
var Map_1 = require("./Map");
var WebGlUtils_1 = require("./WebGlUtils");
var GameCreator = /** @class */ (function () {
    function GameCreator(gl, onAllResourcesLoaded) {
        this.gl = gl;
        this.onAllResourcesLoaded = onAllResourcesLoaded;
        this.resourcesLoaded = 0;
    }
    GameCreator.prototype.resourceLoad = function (type, resource) {
        if (this.resourcesLoaded == 63) {
            throw new Error('Trying to load an already loaded resource: type = ' + type);
        }
        var shaderText;
        switch (type) {
            case ResourceType.BACKGROUND_VERT:
                shaderText = resource;
                if (shaderText == null) {
                    throw new Error('An error occurred reading shader: background vertex shader');
                }
                this.backgroundVert = WebGlUtils_1.WebGlUtils.loadShader(this.gl, this.gl.VERTEX_SHADER, shaderText);
                break;
            case ResourceType.BACKGROUND_FRAG:
                shaderText = resource;
                if (shaderText == null) {
                    throw new Error('An error occurred reading shader: background fragment shader');
                }
                this.backgroundFrag = WebGlUtils_1.WebGlUtils.loadShader(this.gl, this.gl.FRAGMENT_SHADER, shaderText);
                break;
            case ResourceType.REGION_VERT:
                shaderText = resource;
                if (shaderText == null) {
                    throw new Error('An error occurred reading shader: region vertex shader');
                }
                this.regionVert = WebGlUtils_1.WebGlUtils.loadShader(this.gl, this.gl.VERTEX_SHADER, shaderText);
                break;
            case ResourceType.REGION_FRAG:
                shaderText = resource;
                if (shaderText == null) {
                    throw new Error('An error occurred reading shader: region fragment shader');
                }
                this.regionFrag = WebGlUtils_1.WebGlUtils.loadShader(this.gl, this.gl.FRAGMENT_SHADER, shaderText);
                break;
            case ResourceType.MAP_DATA:
                var mapData = resource;
                if (mapData == null) {
                    throw new Error('An error occurred reading map data');
                }
                this.map = new Map_1.Map(mapData);
                break;
            case ResourceType.GAME_DATA:
                var gameData = resource;
                if (gameData == null) {
                    throw new Error('An error occurred reading map data');
                }
                this.gameData = gameData.getData();
                break;
        }
        this.resourcesLoaded |= type;
        if (this.resourcesLoaded == (this.resourcesLoaded && (ResourceType.BACKGROUND_FRAG || ResourceType.BACKGROUND_VERT))) {
            if (this.backgroundFrag != null && this.backgroundVert != null) {
                this.backgroundProgram = WebGlUtils_1.WebGlUtils.initShaderProgram(this.gl, [this.backgroundVert, this.backgroundFrag]);
            }
            else {
                throw new Error('An error occurred accessing background shaders');
            }
        }
        if (this.resourcesLoaded == (this.resourcesLoaded && (ResourceType.REGION_FRAG || ResourceType.REGION_VERT))) {
            if (this.regionFrag != null && this.regionVert != null) {
                this.regionProgram = WebGlUtils_1.WebGlUtils.initShaderProgram(this.gl, [this.regionVert, this.regionFrag]);
            }
            else {
                throw new Error('An error occurred accessing region shaders');
            }
        }
        if (this.resourcesLoaded == 63) {
            this.onAllResourcesLoaded(new Game(gl));
        }
    };
    return GameCreator;
}());
exports.GameCreator = GameCreator;
var Game = /** @class */ (function () {
    function Game(gl, backgroundProgram, regionProgram, gameData, map) {
        this.gl = gl;
        this.backgroundProgram = backgroundProgram;
        this.regionProgram = regionProgram;
        this.gameData = gameData;
        this.map = map;
    }
    return Game;
}());
exports.Game = Game;
var ResourceType;
(function (ResourceType) {
    ResourceType[ResourceType["BACKGROUND_VERT"] = 1] = "BACKGROUND_VERT";
    ResourceType[ResourceType["BACKGROUND_FRAG"] = 2] = "BACKGROUND_FRAG";
    ResourceType[ResourceType["REGION_VERT"] = 4] = "REGION_VERT";
    ResourceType[ResourceType["REGION_FRAG"] = 8] = "REGION_FRAG";
    ResourceType[ResourceType["MAP_DATA"] = 16] = "MAP_DATA";
    ResourceType[ResourceType["GAME_DATA"] = 32] = "GAME_DATA";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
var MilitaryType;
(function (MilitaryType) {
    MilitaryType[MilitaryType["NONE"] = 0] = "NONE";
    MilitaryType[MilitaryType["ARMY"] = 1] = "ARMY";
    MilitaryType[MilitaryType["FLEET"] = 2] = "FLEET";
})(MilitaryType = exports.MilitaryType || (exports.MilitaryType = {}));
var Region = /** @class */ (function () {
    function Region(name, owner, militaryOwner, militaryType) {
        this.name = name;
        this.owner = owner;
        this.militaryOwner = militaryOwner;
        this.militaryType = militaryType;
    }
    return Region;
}());
exports.Region = Region;
var GameDataDirect = /** @class */ (function () {
    function GameDataDirect(regions) {
        this.regions = regions;
    }
    GameDataDirect.prototype.getData = function () {
        return this.regions;
    };
    return GameDataDirect;
}());
exports.GameDataDirect = GameDataDirect;
