// v1.2.0
// publish 2.x 也是用这个文件，需要做兼容
let isPublish2 = process.argv[2].includes("publish_vivogame.js") && process.argv[3].includes("--evn=publish2");
// 获取Node插件和工作路径
let ideModuleDir, workSpaceDir;
if (isPublish2) {
	//是否使用IDE自带的node环境和插件，设置false后，则使用自己环境(使用命令行方式执行)
	const useIDENode = process.argv[0].indexOf("LayaAir") > -1 ? true : false;
	ideModuleDir = useIDENode ? process.argv[1].replace("gulp\\bin\\gulp.js", "").replace("gulp/bin/gulp.js", "") : "";
	workSpaceDir = useIDENode ? process.argv[2].replace("--gulpfile=", "").replace("\\.laya\\publish_vivogame.js", "").replace("/.laya/publish_vivogame.js", "") + "/" : "./../";
} else {
	ideModuleDir = global.ideModuleDir;
	workSpaceDir = global.workSpaceDir;
}

//引用插件模块
const gulp = require(ideModuleDir + "gulp");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");
const del = require(ideModuleDir + "del");
const iconv =  require(ideModuleDir + "iconv-lite");
const revCollector = require(ideModuleDir + 'gulp-rev-collector');
let commandSuffix = ".cmd";

let prevTasks = ["packfile"];
if (isPublish2) {
	prevTasks = "";
}

let 
    config,
	platform,
	releaseDir,
    tempReleaseDir, // vivo临时拷贝目录
	projDir, // vivo快游戏工程目录
	isDealNoCompile = true,
	physicsLibsPathList = [],
	isExistEngineFolder = false; // bin目录下是否存在engine文件夹
let projSrc;
let versionCon; // 版本管理version.json
// 创建vivo项目前，拷贝vivo引擎库、修改index.js
// 应该在publish中的，但是为了方便发布2.0及IDE 1.x，放在这里修改
gulp.task("preCreate_VIVO", prevTasks, function() {
	if (isPublish2) {
		let pubsetPath = path.join(workSpaceDir, ".laya", "pubset.json");
		let content = fs.readFileSync(pubsetPath, "utf8");
		let pubsetJson = JSON.parse(content);
		platform = "vivogame";
		releaseDir = path.join(workSpaceDir, "release", platform).replace(/\\/g, "/");
		releaseDir = tempReleaseDir = path.join(releaseDir, "temprelease");
		config = pubsetJson[6]; // 只用到了 config.vivoInfo|config.vivoSign
	} else {
		platform = global.platform;
		releaseDir = global.releaseDir;
		tempReleaseDir = global.tempReleaseDir;
		config = global.config;
	}
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (process.platform === "darwin") {
		commandSuffix = "";
	}
	let copyLibsList = [`${workSpaceDir}/bin/libs/laya.vvmini.js`];
	var stream = gulp.src(copyLibsList, { base: `${workSpaceDir}/bin` });
	return stream.pipe(gulp.dest(tempReleaseDir));
});

gulp.task("copyPlatformFile_VIVO", ["preCreate_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	let vivoAdapterPath = path.join(ideModuleDir, "../", "out", "layarepublic", "LayaAirProjectPack", "lib", "data", "vivofiles");
	let copyLibsList = [`${vivoAdapterPath}/**/*.*`];
	var stream = gulp.src(copyLibsList);
	return stream.pipe(gulp.dest(tempReleaseDir));
});

// 检查是否全局安装了qgame
gulp.task("createGlobalQGame_VIVO", ["copyPlatformFile_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	releaseDir = path.dirname(releaseDir);
	projDir = path.join(releaseDir, config.vivoInfo.projName);
	projSrc = path.join(projDir, "src");
	// npm view @vivo-minigame/cli version
	// npm install -g @vivo-minigame/cli
	let remoteVersion, localVersion;
	let isGetRemote, isGetLocal;
	let isUpdateGlobalQGame = true;
	return new Promise((resolve, reject) => { // 远程版本号
		childProcess.exec("npm view  @vivo-minigame/cli version", function(error, stdout, stderr) {
			if (!stdout) { // 获取 @vivo-minigame/cli 远程版本号失败
				console.log("获取 @vivo-minigame/cli 远程版本号失败");
				resolve();
				return;
			}
			remoteVersion = stdout;
			isGetRemote = true;
			if (isGetRemote && isGetLocal) {
				isUpdateGlobalQGame = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		childProcess.exec("mg -v", { cwd: `${projDir}/node_modules` }, function(error, stdout, stderr) {
			if (!stdout) { // 获取  @vivo-minigame/cli 本地版本号失败
				console.log("获取 @vivo-minigame/cli 本地版本号失败");
				resolve();
				return;
			}
			localVersion = stdout;
			isGetLocal = true;
			if (isGetRemote && isGetLocal) {
				isUpdateGlobalQGame = remoteVersion != localVersion;
				console.log(`remoteVersion: ${remoteVersion}, localVersion: ${localVersion}`);
				resolve();
			}
		});
		setTimeout(() => {
			if (!isGetLocal || !isGetRemote) {
				console.log("获取远程版本号或本地版本号失败");
				resolve();
				return;
			}
		}, 10000);
	}).then(() => {
		return new Promise((resolve, reject) => {
			if (!isUpdateGlobalQGame) {
				resolve();
				return;
			}
			console.log("全局安装@vivo-minigame/cli");
			// npm install -g @vivo-minigame/cli
			let cmd = `npm${commandSuffix}`;
			let args = ["install", "@vivo-minigame/cli", "-g"];
			let cp = childProcess.spawn(cmd, args);
			
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
	
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
	
			cp.on('close', (code) => {
				console.log(`2 end) npm install -g @vivo-minigame/cli：${code}`);
				resolve();
			});
		});
	}).catch((e) => {
		console.log("catch e", e);
	});
});

gulp.task("createProj_VIVO", ["createGlobalQGame_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 如果有即存项目，不再新建
	let isProjExist = fs.existsSync(projDir + "/node_modules") && 
					  fs.existsSync(projDir + "/sign");
	if (isProjExist) {
		// 检测是否需要升级
		let packageCon = fs.readFileSync(`${projDir}/package.json`, "utf8");
		let minigamePath = path.join(projDir, "minigame.config.js");
		if (packageCon.includes("@vivo-minigame/cli-service") && fs.existsSync(minigamePath)) {
			return;
		}
	}
	// 如果有即存项目，但是是旧的项目，删掉后重新创建
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(projDir)) {
			return resolve();
		}
		let delList = [projDir];
		del(delList, { force: true }).then(paths => {
			resolve();
		});
	}).then(function() {
		// 在项目中创建vivo项目
		return new Promise((resolve, reject) => {
			console.log("(proj)开始创建vivo快游戏项目");
			// mg init <project-name>
			let cmd = `mg${commandSuffix}`;
			let args = ["init", config.vivoInfo.projName];
			let opts = {
				cwd: releaseDir,
				shell: true
			};

			let cp = childProcess.spawn(cmd, args, opts);
			
			cp.stdout.on('data', (data) => {
				console.log(`stdout: ${data}`);
			});
			
			cp.stderr.on('data', (data) => {
				console.log(`stderr: ${data}`);
				// reject();
			});
			
			cp.on('close', (code) => {
				cp = null;
				console.log(`子进程退出码：${code}`);
				resolve();
			});
		});
	});
});

// 拷贝文件到vivo快游戏
gulp.task("copyFileToProj_VIVO", ["createProj_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 如果有js/main.js，将其删除
	let vivoMainPath = path.join(projDir, "src", "js", "main.js");
	if (fs.existsSync(vivoMainPath)) {
		fs.unlinkSync(vivoMainPath);
	}
	// 将临时文件夹中的文件，拷贝到项目中去
	let originalDir = `${tempReleaseDir}/**/*.*`;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(path.join(projSrc)));
});

// 拷贝icon到vivo快游戏
gulp.task("copyIconToProj_VIVO", ["copyFileToProj_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	let originalDir = config.vivoInfo.icon;
	let stream = gulp.src(originalDir);
	return stream.pipe(gulp.dest(projSrc));
});

// 清除vivo快游戏临时目录
gulp.task("clearTempDir_VIVO", ["copyIconToProj_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 删掉临时目录
	return del([tempReleaseDir], { force: true });
});

// 生成release签名(私钥文件 private.pem 和证书文件 certificate.pem )
gulp.task("generateSign_VIVO", ["clearTempDir_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
    }
    if (!config.vivoSign.generateSign) {
        return;
    }
	// https://doc.quickapp.cn/tools/compiling-tools.html
	return new Promise((resolve, reject) => {
		let cmd = "openssl";
		let args = ["req", "-newkey", "rsa:2048", "-nodes", "-keyout", "private.pem", 
					"-x509", "-days", "3650", "-out", "certificate.pem"];
		let opts = {
			cwd: projDir,
			shell: true
		};
		let cp = childProcess.spawn(cmd, args, opts);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			data += "";
			if (data.includes("Country Name")) {
				cp.stdin.write(`${config.vivoSign.countryName}\n`);
				console.log(`Country Name: ${config.vivoSign.countryName}`);
			} else if (data.includes("Province Name")) {
				cp.stdin.write(`${config.vivoSign.provinceName}\n`);
				console.log(`Province Name: ${config.vivoSign.provinceName}`);
			} else if (data.includes("Locality Name")) {
				cp.stdin.write(`${config.vivoSign.localityName}\n`);
				console.log(`Locality Name: ${config.vivoSign.localityName}`);
			} else if (data.includes("Organization Name")) {
				cp.stdin.write(`${config.vivoSign.orgName}\n`);
				console.log(`Organization Name: ${config.vivoSign.orgName}`);
			} else if (data.includes("Organizational Unit Name")) {
				cp.stdin.write(`${config.vivoSign.orgUnitName}\n`);
				console.log(`Organizational Unit Name: ${config.vivoSign.orgUnitName}`);
			} else if (data.includes("Common Name")) {
				cp.stdin.write(`${config.vivoSign.commonName}\n`);
				console.log(`Common Name: ${config.vivoSign.commonName}`);
			} else if (data.includes("Email Address")) {
				cp.stdin.write(`${config.vivoSign.emailAddr}\n`);
				console.log(`Email Address: ${config.vivoSign.emailAddr}`);
				// cp.stdin.end();
			}
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

// 拷贝sign文件到指定位置
gulp.task("copySignFile_VIVO", ["generateSign_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
    }
    if (config.vivoSign.generateSign) { // 新生成的签名
        // 移动签名文件到项目中（Laya & vivo快游戏项目中）
        let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`,
            layaDest = `${workSpaceDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest))
                    .pipe(gulp.dest(layaDest));
    } else if (config.vivoInfo.useReleaseSign && !config.vivoSign.generateSign) { // 使用release签名，并且没有重新生成
        // 从项目中将签名拷贝到vivo快游戏项目中
        let 
            privatePem = path.join(workSpaceDir, "sign", "release", "private.pem"),
            certificatePem = path.join(workSpaceDir, "sign", "release", "certificate.pem");
        let isSignExits = fs.existsSync(privatePem) && fs.existsSync(certificatePem);
        if (!isSignExits) {
            return;
        }
        let 
            xiaomiDest = `${projDir}/sign/release`;
        let stream = gulp.src([privatePem, certificatePem]);
        return stream.pipe(gulp.dest(xiaomiDest));
    }
});

gulp.task("deleteSignFile_VIVO", ["copySignFile_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (config.vivoSign.generateSign) { // 新生成的签名
		let 
            privatePem = path.join(projDir, "private.pem"),
            certificatePem = path.join(projDir, "certificate.pem");
		return del([privatePem, certificatePem], { force: true });
	}
});

gulp.task("modifyFile_VIVO", ["deleteSignFile_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 修改manifest.json文件
	let manifestPath = path.join(projSrc, "manifest.json");
	if (!fs.existsSync(manifestPath)) {
		return;
	}
	let manifestContent = fs.readFileSync(manifestPath, "utf8");
	let manifestJson = JSON.parse(manifestContent);
	manifestJson.package = config.vivoInfo.package;
	manifestJson.name = config.vivoInfo.name;
	manifestJson.orientation = config.vivoInfo.orientation;
	manifestJson.config.logLevel = config.vivoInfo.logLevel || "off";
	manifestJson.deviceOrientation = config.vivoInfo.orientation;
	manifestJson.versionName = config.vivoInfo.versionName;
	manifestJson.versionCode = config.vivoInfo.versionCode;
	manifestJson.minPlatformVersion = config.vivoInfo.minPlatformVersion;
	manifestJson.icon = `/${path.basename(config.vivoInfo.icon)}`;
	if (config.vivoInfo.subpack) { // 分包
		manifestJson.subpackages = config.vivoSubpack;
	} else {
		delete manifestJson.subpackages;
	}
	// 增加thirdEngine字段
	let EngineVersion = getEngineVersion();
	if (EngineVersion) {
		manifestJson.thirdEngine = {
			"laya": EngineVersion
		};
	}
	fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 4), "utf8");
	
	if (config.version) {
		let versionPath = projSrc + "/version.json";
		versionCon = fs.readFileSync(versionPath, "utf8");
		versionCon = JSON.parse(versionCon);
	}
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// 修改game.js文件
	let content = `require("./qgame-adapter.js");\nif(!window.navigator)\n\twindow.navigator = {};\nwindow.navigator.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 VVGame NetType/WIFI Language/zh_CN';
require("./libs/laya.vvmini.js");\nrequire("./index.js");`;
	let gameJsPath = path.join(projSrc, "game.js");
	fs.writeFileSync(gameJsPath, content, "utf8");

	// vivo项目，修改index.js
	let filePath = path.join(projSrc, indexJsStr);
	if (!fs.existsSync(filePath)) {
		return;
	}
	let fileContent = fs.readFileSync(filePath, "utf8");
	fileContent = fileContent.replace(/loadLib(\(['"])/gm, "require$1./");
	fs.writeFileSync(filePath, fileContent, "utf8");
})

function getEngineVersion() {
	let coreLibPath = path.join(workSpaceDir, "bin", "libs", "laya.core.js");
	let isHasCoreLib = fs.existsSync(coreLibPath);
	let isOldAsProj = fs.existsSync(`${workSpaceDir}/asconfig.json`) && !isHasCoreLib;
	let isNewTsProj = fs.existsSync(`${workSpaceDir}/src/tsconfig.json`) && !isHasCoreLib;
	let EngineVersion;
	if (isHasCoreLib) {
		let con = fs.readFileSync(coreLibPath, "utf8");
		let matchList = con.match(/Laya\.version\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
		if (!Array.isArray(matchList)) {
			return null;
		}
		EngineVersion = matchList[1];
	} else { // newts项目和旧版本as项目
		if (isOldAsProj) {
			let coreLibFilePath = path.join(workSpaceDir, "libs", "laya", "src", "Laya.as");
			if (!fs.existsSync(coreLibFilePath)) {
				return null;
			}
			let con = fs.readFileSync(coreLibFilePath, "utf8");
			let matchList = con.match(/version:String\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
			if (!Array.isArray(matchList)) {
				return null;
			}
			EngineVersion = matchList[1];
		} else if (isNewTsProj) {
			let coreLibFilePath = path.join(workSpaceDir, "libs", "Laya.ts");
			if (!fs.existsSync(coreLibFilePath)) {
				return null;
			}
			let con = fs.readFileSync(coreLibFilePath, "utf8");
			let matchList = con.match(/static\s*version:\s*string\s*=\s*['"]([0-9\.]+(beta)?.*)['"]/);
			if (!Array.isArray(matchList)) {
				return null;
			}
			EngineVersion = matchList[1];
		}
	}
	return EngineVersion;
}

gulp.task("version_VIVO", ["modifyFile_VIVO"], function () {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (config.version) {
		let versionPath = projSrc + "/version.json";
		let mainJSPath = projSrc + "/game.js";
		let srcList = [versionPath, mainJSPath];
		return gulp.src(srcList)
			.pipe(revCollector())
			.pipe(gulp.dest(projSrc));
	}
});

// 处理engine文件夹
gulp.task("dealEngineFolder1_VIVO", ["version_VIVO"], function() {
	// 如果项目中有engine文件夹，我们默认该开发者是熟悉VIVO发布流程的，已经处理好所有的逻辑
	// 值得注意的:
	// 1) 如果有engine文件夹而未处理2D物理库(box2d.js/physics.js)，项目将无法运行
	// 2) 如果未处理3D物理库(physics3D.js)，打包时间将会很长

	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	let engineFolder = path.join(projDir, "src", "engine");
	isExistEngineFolder = fs.existsSync(engineFolder);
	if (!isExistEngineFolder) {
		return;
	}

	let adapterOriginalPath = path.join(projDir, "src", "qgame-adapter.js");

	// 不想写一堆task任务，500ms默认拷贝完成吧
	// 未来有了更好的解决方案再修改
	return new Promise(function(resolve, reject) {
		// 将engine文件夹拷贝到projRoot下
		setTimeout(resolve, 500);
		var stream = gulp.src([`${engineFolder}/**/*.*`], {base: `${projDir}/src`});
		return stream.pipe(gulp.dest(projDir));
	}).then(function() {
		return new Promise(function(resolve, reject) {
			// 将adapter.js拷贝到engine文件夹中
			setTimeout(resolve, 500);
			var stream = gulp.src([adapterOriginalPath]);
			return stream.pipe(gulp.dest(`${projDir}/engine`));
		});
	}).then(function() {
		return new Promise(function(resolve, reject) {
			// 删掉src下的engine和adapter
			setTimeout(resolve, 500);
			return del([engineFolder, adapterOriginalPath], { force: true });
		});
	}).catch(function(err) {
		console.log(err);
	});
});

gulp.task("dealEngineFolder2_VIVO", ["dealEngineFolder1_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (!isExistEngineFolder) {
		return;
	}
	
	let engineFolder = path.join(projDir, "engine");
	let engineFileList = fs.readdirSync(engineFolder);
	// 修改配置文件
	configVivoConfigFile(engineFileList);
});

// 如果项目中用到了 box2d.js|laya.physics.js/laya.physics3D.js ，需要特殊处理
// 之前处理的是有项目中已经存在engine文件夹的情况，现在开始处理没有文件夹的情况
gulp.task("dealNoCompile1_VIVO", ["dealEngineFolder2_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (!isDealNoCompile) {
		return;
	}

	// let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	// let bundleJsStr = (versionCon && versionCon["js/bundle.js"]) ? versionCon["js/bundle.js"] :  "js/bundle.js";
	// let box2dJsStr = (versionCon && versionCon["libs/box2d.js"]) ? versionCon["libs/box2d.js"] :  "libs/box2d.js";
	// let physicsJsStr = (versionCon && versionCon["libs/laya.physics.js"]) ? versionCon["libs/laya.physics.js"] :  "libs/laya.physics.js";
	// let physics3DJsStr = (versionCon && versionCon["libs/laya.physics3D.js"]) ? versionCon["libs/laya.physics3D.js"] :  "libs/laya.physics3D.js";

	// // 修改index.js，去掉物理库前面的libs
	// let filePath = path.join(projSrc, indexJsStr);
	// let fileContent = fs.readFileSync(filePath, "utf8");
	// let physicsNameList = [];

	// if (fileContent.includes(bundleJsStr)) {
	// 	let adapterJsPath = path.join(projSrc, bundleJsStr);
	// 	physicsNameList.push(bundleJsStr);
	// 	physicsLibsPathList.push(adapterJsPath);
	// }
	// if (fileContent.includes(box2dJsStr)) {
	// 	let libPath = path.join(projSrc, box2dJsStr);
	// 	physicsNameList.push(box2dJsStr);
	// 	physicsLibsPathList.push(libPath);
	// }
	// if (fileContent.includes(physicsJsStr)) {
	// 	let libPath = path.join(projSrc, physicsJsStr);
	// 	physicsNameList.push(physicsJsStr);
	// 	physicsLibsPathList.push(libPath);
	// }
	// if (fileContent.includes(physics3DJsStr)) {
	// 	let libPath = path.join(projSrc, physics3DJsStr);
	// 	physicsNameList.push(physics3DJsStr);
	// 	physicsLibsPathList.push(libPath);
	// }
	// if (physicsLibsPathList.length > 0) {
	// 	let adapterJsPath = path.join(projSrc, "qgame-adapter.js");
	// 	physicsNameList.push("qgame-adapter.js");
	// 	physicsLibsPathList.push(adapterJsPath);
	// }


	// 将js/bundle.js | libs/*.* qgame-adapter.js 全放到engine文件夹中
	let indexJsStr = (versionCon && versionCon["index.js"]) ? versionCon["index.js"] :  "index.js";
	let bundleJsStr = (versionCon && versionCon["js/bundle.js"]) ? versionCon["js/bundle.js"] :  "js/bundle.js";

	// 修改index.js，去掉物理库前面的libs
	let filePath = path.join(projSrc, indexJsStr);
	let fileContent = fs.readFileSync(filePath, "utf8");
	let physicsNameList = [];

	if (fileContent.includes(bundleJsStr)) {
		let adapterJsPath = path.join(projSrc, bundleJsStr);
		physicsNameList.push(bundleJsStr);
		physicsLibsPathList.push(adapterJsPath);
	}
	let libsList = fs.readdirSync(path.join(projSrc, "libs"));
	let libsFileName, libsFilePath;
	for (let i = 0, len = libsList.length; i < len; i++) {
		libsFileName = libsList[i];
		libsFilePath = path.join(projSrc, "libs", libsFileName);
		physicsNameList.push(`libs/${libsFileName}`);
		physicsLibsPathList.push(libsFilePath);
	}
	if (physicsLibsPathList.length > 0) {
		let adapterJsPath = path.join(projSrc, "qgame-adapter.js");
		physicsNameList.push("qgame-adapter.js");
		physicsLibsPathList.push(adapterJsPath);
	}

	// 修改配置文件
	configVivoConfigFile(physicsNameList);

	// 将物理库、qgame-adapter.js拷贝到engine中
	var stream = gulp.src(physicsLibsPathList, {base: projSrc});
	return stream.pipe(gulp.dest(path.join(projDir, "engine")));
});

function configVivoConfigFile(engineFileList) {
	let vvConfigPath = path.join(projDir, "minigame.config.js");
	let content = fs.readFileSync(vvConfigPath, "utf8");
	let externalsStr = 'const externals = [\n';
	let libName;
	for (let i = 0, len = engineFileList.length; i < len; i++) {
		libName = engineFileList[i];
		if (i !== 0) {
			externalsStr += ',\n';
		}
		// 不要改这里的缩进，否则最终的结果不好看
		externalsStr += `{
		module_name:'./${libName}',
		module_path:'./${libName}',
		module_from:'engine/${libName}'
	}`;
	}
	externalsStr += '\t]';
	content = content.replace(/const externals = \[([^*].|\n|\r)*\]/gm, externalsStr);
	fs.writeFileSync(vvConfigPath, content, "utf8");
}

gulp.task("dealNoCompile2_VIVO", ["dealNoCompile1_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	if (!isDealNoCompile || physicsLibsPathList.length === 0) {
		return;
	}
	return del(physicsLibsPathList, { force: true });
});

// 打包rpk
gulp.task("buildRPK_VIVO", ["dealNoCompile2_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 在vivo轻游戏项目目录中执行:
    // npm run build || npm run release
    let cmdStr = "build";
    if (config.vivoInfo.useReleaseSign) {
        cmdStr = "release";
    }
	return new Promise((resolve, reject) => {
		let cmd = `npm${commandSuffix}`;
		let args = ["run", cmdStr];
		let opts = {
			cwd: projDir
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn(`npx${commandSuffix}`, ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			console.log(`stderr(iconv): ${iconv.decode(data, 'gbk')}`);
			
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});

gulp.task("showQRCode_VIVO", ["buildRPK_VIVO"], function() {
	// 如果不是vivo快游戏
	if (platform !== "vivogame") {
		return;
	}
	// 在vivo轻游戏项目目录中执行:
	// npm run server
	return new Promise((resolve, reject) => {
		let cmd = `npm${commandSuffix}`;
		let args = ["run", "server"];
		let opts = {
			cwd: projDir
		};
		let cp = childProcess.spawn(cmd, args, opts);
		// let cp = childProcess.spawn(`npx${commandSuffix}`, ['-v']);
		cp.stdout.on('data', (data) => {
			console.log(`${data}`);
			// 输出pid，macos要用: macos无法kill进程树，也无法执行命令获取3000端口pid(没有查询权限)，导致无法kill这个进程
			console.log('vv_qrcode_pid:' + cp.pid);
		});

		cp.stderr.on('data', (data) => {
			console.log(`stderr: ${data}`);
			console.log(`stderr(iconv): ${iconv.decode(data, 'gbk')}`);
			// reject();
		});

		cp.on('close', (code) => {
			console.log(`子进程退出码：${code}`);
			resolve();
		});
	});
});


gulp.task("buildVivoProj", ["showQRCode_VIVO"], function() {
	console.log("all tasks completed");
});