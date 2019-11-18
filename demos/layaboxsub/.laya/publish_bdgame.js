// v1.2.0
// publish 2.x 也是用这个文件，需要做兼容
let isPublish2 = process.argv[2].includes("publish_bdgame.js") && process.argv[3].includes("--evn=publish2");
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
if (isPublish2) {
	//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
	const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
	ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
	workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_bdgame.js", "").replace("/.laya/publish_bdgame.js", "") + "/" : "./../";
} else {
	ideModuleDir = global.ideModuleDir;
	workSpaceDir = global.workSpaceDir;
}

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
let commandSuffix = ".cmd";
let prevTasks = ["packfile"];
if (isPublish2) {
	prevTasks = "";
}

let 
    config,
	platform,
    releaseDir;
let isGlobalCli = true;
let versionCon; // 版本管理version.json
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_BD", prevTasks, function() {
	if (isPublish2) {
		let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
		let content = fs.readFileSync(pubsetPath, "utf8");
		let pubsetJson = JSON.parse(content);
		platform = "bdgame";
		releaseDir = path.join(workSpaceDir, "release", platform).replace(/\\/g, "/");
		config = pubsetJson[3];
	} else {
		platform = global.platform;
		releaseDir = global.releaseDir;
		config = global.config;
	}
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return;
	}
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	let copyLibsList = [`${workSpaceDir}/bin/libs/laya.bdmini.js`];
	var stream = gulp.src(copyLibsList, { base: `${workSpaceDir}/bin` });
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("copyPlatformFile_BD", ["preCreate_BD"], function() {
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return;
	}
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "bdfiles");
	// 如果新建项目时已经点击了"微信/百度小游戏bin目录快速调试"，不再拷贝
	let isHadBdFiles =
		fs.existsSync(path.join(workSpaceDir, "bin", "game.js")) &&
		fs.existsSync(path.join(workSpaceDir, "bin", "game.json")) &&
		fs.existsSync(path.join(workSpaceDir, "bin", "project.swan.json")) &&
		fs.existsSync(path.join(workSpaceDir, "bin", "swan-game-adapter.js"));
	if (isHadBdFiles) {
		return;
	}
	let stream = gulp.src(adapterPath + "/*.*");
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("modifyFile_BD", ["copyPlatformFile_BD"], function() {
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return;
	}
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// 百度小游戏项目，修改index.js
	let filePath = path.join(releaseDir, indexJsStr);
	if (!fs.existsSync(filePath)) {
		return;
	}
	let fileContent = fs.readFileSync(filePath, "utf8");
	fileContent = fileContent.replace(/loadLib(\(['"])/gm, "require$1./");
	fs.writeFileSync(filePath, fileContent, "utf8");
});

// 开放域的情况下，合并game.js和index.js，并删除game.js
gulp.task("openData_BD", ["modifyFile_BD"], function (cb) {
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return cb();
	}
	if (config.openDataZone) {
		let versionCon;
		if (config.version) {
			let versionPath = releaseDir + "/version.json";
			versionCon = fs.readFileSync(versionPath, "utf8");
			versionCon = JSON.parse(versionCon);
		}
		let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
		let indexPath = path.join(releaseDir, indexJsStr);
		let indexjs = readFile(indexPath);
		let gamejs = readFile(releaseDir + "/game.js");
		if (gamejs && indexjs) {
			gamejs = gamejs.replace(`require("index.js")`, indexjs);
			fs.writeFileSync(indexPath, gamejs, 'utf-8');
		}
		return cb();
	}
	cb();
});

function readFile(path) {
	if (fs.existsSync(path)) {
		return fs.readFileSync(path, "utf-8");
	}
	return null;
}

gulp.task("version_BD", ["openData_BD"], function() {
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return;
	}
	if (config.version) {
		let versionPath = releaseDir + "/version.json";
		let gameJSPath = releaseDir + "/game.js";
		let srcList = [versionPath, gameJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(releaseDir));
	}
});

gulp.task("optimizeOpen_BD", ["version_BD"], function(cb) {
	// 如果不是百度小游戏
	if (platform !== "bdgame") {
		return cb();
	}
	let bdOptimize = config.bdOptimize;
	if (!bdOptimize || !bdOptimize.useOptimizeOpen) {
		return cb();
	}
	// 首屏加载优化(秒开)，修改game.json
	let filePath = path.join(releaseDir, "game.json");
	if (!fs.existsSync(filePath)) {
		return cb();
	}
	let fileContent = fs.readFileSync(filePath, "utf8");
	let fileConObj = JSON.parse(fileContent);
	if (bdOptimize.preloadRes) {
		fileConObj.preloadResources = bdOptimize.preloadResList;
	} else {
		delete fileConObj.preloadResources;
	}

	fs.writeFileSync(filePath, JSON.stringify(fileConObj, null, 4), "utf8");
	return cb();
});

gulp.task("buildBDProj", ["optimizeOpen_BD"], function() {
	console.log("all tasks completed");
});