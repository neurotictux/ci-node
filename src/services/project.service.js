"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var child_process_1 = require("child_process");
var pathFile = path_1.join(__dirname, '..', 'projects.json');
var pathLogs = path_1.join(__dirname, '..', 'logs');
var publishPath = path_1.join(__dirname, '..', 'publish');
var isLinux = process.platform === 'linux';
var currentProcess = null;
var runningProcesses = [];
if (!fs_1.existsSync(pathFile))
    fs_1.writeFileSync(pathFile, JSON.stringify([]), 'utf-8');
if (!fs_1.existsSync(pathLogs))
    fs_1.mkdirSync(pathLogs);
if (!fs_1.existsSync(publishPath))
    fs_1.mkdirSync(publishPath);
var runnerPublish = null;
var runnerLoadBranches = null;
var runnerApp = null;
if (isLinux) {
    runnerPublish = path_1.join(__dirname, 'scripts', 'publish.sh');
    runnerLoadBranches = "sh " + path_1.join(__dirname, 'scripts', 'load-branches.sh');
    runnerApp = path_1.join(__dirname, 'scripts', 'run.sh');
}
else {
    runnerPublish = "powershell " + path_1.join(__dirname, 'scripts', 'publish.ps1');
    runnerLoadBranches = "powershell " + path_1.join(__dirname, 'scripts', 'load-branches.ps1');
    runnerApp = "powershell " + path_1.join(__dirname, 'scripts', 'run.sh');
}
var resolveString = function (str) { return (str || '').replace(/[ ]/g, ''); };
var loadAll = function () { return JSON.parse(fs_1.readFileSync(pathFile, 'utf-8')) || []; };
var loadOne = function (name) { return loadAll().find(function (p) { return p.name === name; }); };
var save = function (proj) {
    var projects = loadAll().filter(function (p) { return p.name.toLowerCase() !== proj.name.toLowerCase(); });
    proj.branches = [];
    projects.push(proj);
    fs_1.writeFileSync(pathFile, JSON.stringify(projects), 'utf-8');
    updateBranches(proj.name);
};
var remove = function (name) {
    var projects = loadAll().filter(function (p) { return p.name.toLowerCase() !== name.toLowerCase(); });
    fs_1.writeFileSync(pathFile, JSON.stringify(projects), 'utf-8');
};
var updateBranches = function (name) {
    var projects = loadAll();
    var proj = projects.find(function (p) { return p.name.toLowerCase() === name.toLowerCase(); });
    var outputPath = path_1.join(__dirname, "branches_" + name);
    child_process_1.execSync(runnerLoadBranches + " " + name + " " + proj.path + " " + outputPath);
    var result = fs_1.readFileSync(outputPath, 'utf-8').replace(/(refs[/](heads|(remotes[/]origin))[/])|(\n)/g, '');
    fs_1.unlinkSync(outputPath);
    proj.branches = result.split(' ').map(function (p) { return p.trim(); });
    proj.branches = proj.branches.filter(function (v, i, arr) { return arr.indexOf(v) === i; });
    proj.selectedBranch = proj.selectedBranch && proj.branches.includes(proj.selectedBranch) ? proj.selectedBranch : proj.branches[0];
    fs_1.writeFileSync(pathFile, JSON.stringify(projects), 'utf-8');
};
var publish = function (name, branch) {
    if (currentProcess && currentProcess.publishing)
        throw 'Há um projeto sendo publicado';
    name = resolveString(name);
    branch = resolveString(branch);
    var proj = loadAll().find(function (p) { return p.name === name; });
    var logFile = path_1.join(pathLogs, name + ".log");
    var publishFolder = path_1.join(publishPath, name);
    var child = child_process_1.spawn('sh', [runnerPublish, proj.path, branch, publishFolder]);
    child.stdout.on('data', function (data) {
        var str = data.toString();
        if (str && !str.includes('Progress'))
            console.log(data.toString());
    });
    child.stdout.on('close', function () {
        currentProcess.publishing = false;
        proj.published = true;
        proj.selectedBranch = branch;
        save(proj);
    });
    currentProcess = { logFile: logFile, name: name, branch: branch };
};
var run = function (name) {
    console.log(runningProcesses);
    var proj = loadOne(name);
    var running = runningProcesses.find(function (p) { return p.name === name; });
    if (running) {
        process.kill(running.pid);
        console.log(name + " killed.");
        runningProcesses = runningProcesses.filter(function (p) { return p.name !== name; });
    }
    else {
        var child = child_process_1.spawn('sh', [runnerApp, path_1.join(publishPath, name), proj.fileName.replace('csproj', 'dll')]);
        child.stdout.on('data', function (data) { return console.log(data.toString()); });
        child.stdout.on('close', function (data) { return console.log('FECHOU'); });
        runningProcesses.push({ name: name, pid: child.pid });
        console.log(child.pid + " started");
    }
    proj.running = !running;
    save(proj);
};
var currentPublish = function () {
    var result = Object.assign({}, currentProcess);
    if (result && result.logFile)
        result.log = fs_1.readFileSync(result.logFile, 'utf-8');
    return Object.assign({}, result);
};
exports.projectService = {
    loadAll: loadAll,
    save: save,
    updateBranches: updateBranches,
    remove: remove,
    publish: publish,
    run: run,
    currentPublish: currentPublish,
    runningProcesses: runningProcesses
};
