// v1.0.0
// publish 2.x 也是用这个文件，需要做兼容
let isPublish2 = process.argv[2].includes("publish_qqgame.js") && process.argv[3].includes("--evn=publish2");
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
if (isPublish2) {
	//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
	const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
	ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
	workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_qqgame.js", "").replace("/.laya/publish_qqgame.js", "") + "/" : "./../";
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
gulp.task("preCreate_QQ", prevTasks, function() {
	if (isPublish2) {
		let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
		let content = fs.readFileSync(pubsetPath, "utf8");
		let pubsetJson = JSON.parse(content);
		platform = "qqgame";
		releaseDir = path.join(workSpaceDir, "release", platform).replace(/\\/g, "/");
		config = pubsetJson[2];
	} else {
		platform = global.platform;
		releaseDir = global.releaseDir;
		config = global.config;
	}
	// 如果不是QQ小游戏
	if (platform !== "qqgame") {
		return;
	}
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	let copyLibsList = [`${workSpaceDir}/bin/libs/laya.qqmini.js`];
	var stream = gulp.src(copyLibsList, { base: `${workSpaceDir}/bin` });
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("copyPlatformFile_QQ", ["preCreate_QQ"], function() {
	// 如果不是QQ小游戏
	if (platform !== "qqgame") {
		return;
	}
	let adapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "qqfiles");
	let stream = gulp.src(adapterPath + "/*.*");
	return stream.pipe(gulp.dest(releaseDir));
});

gulp.task("version_QQ", ["copyPlatformFile_QQ"], function() {
	// 如果不是QQ小游戏
	if (platform !== "qqgame") {
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

gulp.task("buildQQProj", ["version_QQ"], function() {
	console.log("all tasks completed");
});