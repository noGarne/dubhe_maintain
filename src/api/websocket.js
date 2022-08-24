import userService from "./user.server"
import message from "../common/utils/message"

const RECONNECT_INTERVAL = 2000;
const WS_IDLE_TIMEOUT = 60000;
const MESSAGE_TIMEOUT = 3000;
// const SERVER_TIMEOUT = 3000;

const MAX_PUBLISH_COMMANDS = 10;

var isOpening = false,
    isOpened = false,
    isActive = false,
    isReconnect = false,
    reconnectSubscribers = [],
    lastCmdId = 0,
    subscribers = {},
    subscribersCount = 0,
    commands = {},
    cmdsWrapper = {
        tsSubCmds: [],
        historyCmds: [],
        attrSubCmds: [],
        mvAthoUpdateCmds:[],
        disAlarmCmds:[],
        systemAlarmCmds:[],
        monitorAlarmCmds:[],
        cabinInfoReportCmds:[],
        hdMapLoadBoundaryCmds:[],
        hdMapUnloadBoundaryCmds:[],
        shapeReloadCmds:[]
    },
    telemetryUri,
    dataStream,
    location = window.location,
    socketCloseTimer,
    reconnectTimer,
    messageTimer,
    serverTimer;

var port = location.port;
if (location.protocol === "https:") {
    if (!port) {
        port = "443";
    }
    telemetryUri = "wss:";
} else {
    if (!port) {
        port = "80";
    }
    telemetryUri = "ws:";
}
telemetryUri += "//" + location.hostname + ":" + port;
// telemetryUri += "/api/ws/plugins/telemetry";
telemetryUri += "/api/ws/plugins/webSocket";


async function dataStreamSend(){
    dataStream.send(preparePublishCommands())
}

function publishCommands() {
    while(isOpened && hasCommands()) {
        dataStreamSend().then(function(){
            checkToClose();
        })
        // var send = dataStream.send(preparePublishCommands())
    }
    tryOpenSocket();
}

function hasCommands() {
    return cmdsWrapper.tsSubCmds.length > 0 ||
        cmdsWrapper.historyCmds.length > 0 ||
        cmdsWrapper.disAlarmCmds.length > 0 ||
        cmdsWrapper.systemAlarmCmds.length > 0 ||
        cmdsWrapper.mvAthoUpdateCmds.length > 0 ||
        cmdsWrapper.monitorAlarmCmds.length > 0 ||
        cmdsWrapper.cabinInfoReportCmds.length > 0 ||
        cmdsWrapper.hdMapLoadBoundaryCmds.length > 0 ||
        cmdsWrapper.hdMapUnloadBoundaryCmds.length > 0 ||
        cmdsWrapper.shapeReloadCmds.length > 0 ||
        cmdsWrapper.attrSubCmds.length > 0;
}

function preparePublishCommands() {
    var preparedWrapper = {};
    var leftCount = MAX_PUBLISH_COMMANDS;
    preparedWrapper.tsSubCmds = popCmds(cmdsWrapper.tsSubCmds, leftCount);
    leftCount -= preparedWrapper.tsSubCmds.length;
    preparedWrapper.historyCmds = popCmds(cmdsWrapper.historyCmds, leftCount);
    leftCount -= preparedWrapper.historyCmds.length;
    preparedWrapper.attrSubCmds = popCmds(cmdsWrapper.attrSubCmds, leftCount);
    leftCount -= preparedWrapper.attrSubCmds.length;
    preparedWrapper.mvAthoUpdateCmds = popCmds(cmdsWrapper.mvAthoUpdateCmds, leftCount);
    leftCount -= preparedWrapper.mvAthoUpdateCmds.length;
    preparedWrapper.hdMapLoadBoundaryCmds = popCmds(cmdsWrapper.hdMapLoadBoundaryCmds, leftCount);
    preparedWrapper.hdMapUnloadBoundaryCmds = popCmds(cmdsWrapper.hdMapUnloadBoundaryCmds, leftCount);
    preparedWrapper.shapeReloadCmds = popCmds(cmdsWrapper.shapeReloadCmds, leftCount);
    preparedWrapper.systemAlarmCmds = popCmds(cmdsWrapper.systemAlarmCmds, leftCount);
    preparedWrapper.monitorAlarmCmds = popCmds(cmdsWrapper.monitorAlarmCmds, leftCount);
    preparedWrapper.cabinInfoReportCmds = popCmds(cmdsWrapper.cabinInfoReportCmds, leftCount);
    preparedWrapper.disAlarmCmds = popCmds(cmdsWrapper.disAlarmCmds, leftCount);
    return JSON.stringify(preparedWrapper);
}

function popCmds(cmds, leftCount) {
    var toPublish = Math.min(cmds.length, leftCount);
    if (toPublish > 0) {
        return cmds.splice(0, toPublish);
    } else {
        return [];
    }
}

function onError(/*message*/) {
    isOpening = false;
}

function onOpen() {
    isOpening = false;
    isOpened = true;
    if (reconnectTimer) {
        reconnectTimer = null;
    }
    if (isReconnect) {
        isReconnect = false;
        for (var r=0; r<reconnectSubscribers.length;r++) {
            var reconnectSubscriber = reconnectSubscribers[r];
            if (reconnectSubscriber.onReconnected) {
                reconnectSubscriber.onReconnected();
            }
            subscribe(reconnectSubscriber);
        }
        reconnectSubscribers = [];
    } else {
        publishCommands();
    }
}

function onClose() {
    isOpening = false;
    isOpened = false;
    if (isActive) {
        if (!isReconnect) {
            reconnectSubscribers = [];
            for (var id in subscribers) {
                var subscriber = subscribers[id];
                if (reconnectSubscribers.indexOf(subscriber) === -1) {
                    reconnectSubscribers.push(subscriber);
                }
            }
            reset(false);
            isReconnect = true;
        }
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer=null;
        }
        reconnectTimer = setTimeout(tryOpenSocket, RECONNECT_INTERVAL)
    }
}

function timeoutMessage(){
    clearTimeout(messageTimer);
    messageTimer=null;
    messageTimer = setTimeout(() => {
        dataStream.close();
    }, MESSAGE_TIMEOUT);

}

function onMessage (message) {
    if (message.data) {
        var info = JSON.parse(message.data);
        var data = info.filter(v=>v!=1);
        var len = data.length;

        for(let i=0;i<len;i++){
            var info = data[i]
            if (info.subscriptionId) {
                var subscriber = subscribers[info.subscriptionId];
                if (subscriber && info) {
                    // var keys = fetchKeys(info.subscriptionId);
                    // if (!info.info) {
                    //     info.info = {};
                    // }
                    // for (var k = 0; k < keys.length; k++) {
                    //     var key = keys[k];
                    //     if (!info.info[key]) {
                    //         info.info[key] = [];
                    //     }
                    // }
                    info['entity']=fetchEntity(info.subscriptionId)
                    subscriber.onData(info, info.subscriptionId);
                }
            }
        }

    }
    timeoutMessage();
    checkToClose();
}


function fetchKeys(subscriptionId) {
    var command = commands[subscriptionId];
    if (command && command.keys && command.keys.length > 0) {

        return command.keys.split(",");
    } else {
        return [];
    }
}
function fetchEntity(subscriptionId) {
    var command = commands[subscriptionId];
    var sub = subscribers[subscriptionId];
    if (command && command.entityId && command.entityType) {
        if(command.startTs  && command.timeWindow){
            var jsonReturn = {
                entityType:command.entityType,
                entityId:command.entityId,
                startTs:command.startTs,
                timeWindow:command.timeWindow
            }
        }else{
            var jsonReturn = {
                entityType:command.entityType,
                entityId:command.entityId,
                type:sub.type
            }
        }

        return jsonReturn
    } else {
        return [];
    }
}

function nextCmdId () {
    lastCmdId++;
    return lastCmdId;
}

function subscribe (subscriber,callback) {
    isActive = true;
    var cmdId;

    if (subscriber.hasOwnProperty("subscriptionCommands")) {
        var data = [];
        for (var i=0;i<subscriber.subscriptionCommands.length;i++) {
            var subscriptionCommand = subscriber.subscriptionCommands[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            subscriptionCommand.cmdId = cmdId;
            commands[cmdId] = subscriptionCommand;
            if (subscriber.type === 'tsScriber') {
                cmdsWrapper.tsSubCmds.push(subscriptionCommand);
            } else if (subscriber.type === 'attrSub') {
                cmdsWrapper.attrSubCmds.push(subscriptionCommand);
            }
            data.push(subscriptionCommand);
        }
        if(callback){
            callback(data);
        }

    }
    if (subscriber.hasOwnProperty("mvAthoUpdateCmds")) {
        var data = [];
        for (var i=0;i<subscriber.mvAthoUpdateCmds.length;i++) {
            var mvAthoUpdateCmd = subscriber.mvAthoUpdateCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            mvAthoUpdateCmd.cmdId = cmdId;
            commands[cmdId] = mvAthoUpdateCmd;
            if (subscriber.type === 'mvAthoUpdate') {
                cmdsWrapper.mvAthoUpdateCmds.push(mvAthoUpdateCmd);
            }
            data.push(mvAthoUpdateCmd);
        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("disAlarmCommands")) {
        var data = [];
        for (var i=0;i<subscriber.disAlarmCommands.length;i++) {
            var disAlarmCommand = subscriber.disAlarmCommands[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            disAlarmCommand.cmdId = cmdId;
            commands[cmdId] = disAlarmCommand;
            if (subscriber.type === 'disAlarm') {
                cmdsWrapper.disAlarmCmds.push(disAlarmCommand);
            }
            data.push(disAlarmCommand);
        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("systemAlarmCommands")) {
        var data = [];
        for (var i=0;i<subscriber.systemAlarmCommands.length;i++) {
            var systemAlarmCommand = subscriber.systemAlarmCommands[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            systemAlarmCommand.cmdId = cmdId;
            commands[cmdId] = systemAlarmCommand;
            if (subscriber.type === 'systemAlarm') {
                cmdsWrapper.systemAlarmCmds.push(systemAlarmCommand);
            }
            data.push(systemAlarmCommand);
        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("monitorAlarmCmds")) {
        var data = [];
        for (var i=0;i<subscriber.monitorAlarmCmds.length;i++) {
            var monitorAlarmCommand = subscriber.monitorAlarmCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            monitorAlarmCommand.cmdId = cmdId;
            commands[cmdId] = monitorAlarmCommand;
            if (subscriber.type === 'monitorAlarm') {
                cmdsWrapper.monitorAlarmCmds.push(monitorAlarmCommand);
            }
            data.push(monitorAlarmCommand);
        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("cabinInfoReportCmds")) {
        var data = [];
        for (var i=0;i<subscriber.cabinInfoReportCmds.length;i++) {
            var cabinListCommand = subscriber.cabinInfoReportCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            cabinListCommand.cmdId = cmdId;
            commands[cmdId] = cabinListCommand;
            if (subscriber.type === 'cabinList') {
                cmdsWrapper.cabinInfoReportCmds.push(cabinListCommand);
            }
            data.push(cabinListCommand);
        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("hdMapLoadBoundaryCmds")) {
        var data = [];
        for (var i=0;i<subscriber.hdMapLoadBoundaryCmds.length;i++) {
            var boundryUpdateCommand = subscriber.hdMapLoadBoundaryCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            boundryUpdateCommand.cmdId = cmdId;
            commands[cmdId] = boundryUpdateCommand;
            if (subscriber.type === 'loadBoundryUpdate') {
                cmdsWrapper.hdMapLoadBoundaryCmds.push(boundryUpdateCommand);
            }
            data.push(boundryUpdateCommand);

        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("hdMapUnloadBoundaryCmds")) {
        var data = [];
        for (var i=0;i<subscriber.hdMapUnloadBoundaryCmds.length;i++) {
            var unloadBoundryUpdateCommand = subscriber.hdMapUnloadBoundaryCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            unloadBoundryUpdateCommand.cmdId = cmdId;
            commands[cmdId] = unloadBoundryUpdateCommand;
            if (subscriber.type === 'unloadBoundryUpdate') {
                cmdsWrapper.hdMapUnloadBoundaryCmds.push(unloadBoundryUpdateCommand);
            }
            data.push(unloadBoundryUpdateCommand);

        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty("shapeReloadCmds")) {
        var data = [];
        for (var i=0;i<subscriber.shapeReloadCmds.length;i++) {
            var shapeReloadCommand = subscriber.shapeReloadCmds[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            shapeReloadCommand.cmdId = cmdId;
            commands[cmdId] = shapeReloadCommand;
            if (subscriber.type === 'shapeReload') {
                cmdsWrapper.shapeReloadCmds.push(shapeReloadCommand);
            }
            data.push(shapeReloadCommand);

        }
        if(callback){
            callback(data);
        }
    }
    if (subscriber.hasOwnProperty('historyCommands')) {
        var data = [];
        for (i=0;i<subscriber.historyCommands.length;i++) {
            var historyCommand = subscriber.historyCommands[i];
            cmdId = nextCmdId();
            subscribers[cmdId] = subscriber;
            historyCommand.cmdId = cmdId;
            commands[cmdId] = historyCommand;
            cmdsWrapper.historyCmds.push(historyCommand);

            data.push(historyCommand);
        }
        if(callback){
            callback(data);
        }
    }
    subscribersCount++;
    publishCommands();
}

function unsubscribe (subscriber) {
    if (isActive) {
        var cmdId = null;
        if (subscriber.subscriptionCommands) {
            for (var i=0;i<subscriber.subscriptionCommands.length;i++) {
                var subscriptionCommand = subscriber.subscriptionCommands[i];
                subscriptionCommand.unsubscribe = true;
                if (subscriber.type === 'tsScriber') {
                    cmdsWrapper.tsSubCmds.push(subscriptionCommand);
                } else if (subscriber.type === 'attrSub') {
                    cmdsWrapper.attrSubCmds.push(subscriptionCommand);
                }
                cmdId = subscriptionCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.mvAthoUpdateCmds) {
            for (var i=0;i<subscriber.mvAthoUpdateCmds.length;i++) {
                var mvAthoUpdateCmd = subscriber.mvAthoUpdateCmds[i];
                mvAthoUpdateCmd.unsubscribe = true;
                if (subscriber.type === 'mvAthoUpdate') {
                    cmdsWrapper.mvAthoUpdateCmds.push(mvAthoUpdateCmd);
                }
                // mvAthoUpdateCmds
                cmdId = mvAthoUpdateCmd.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.disAlarmCommands) {
            for (var i=0;i<subscriber.disAlarmCommands.length;i++) {
                var disAlarmCommand = subscriber.disAlarmCommands[i];
                disAlarmCommand.unsubscribe = true;
                if (subscriber.type === 'disAlarm') {
                    cmdsWrapper.disAlarmCmds.push(disAlarmCommand);
                }
                // disAlarmCmds
                cmdId = disAlarmCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.systemAlarmCommands) {
            for (var i=0;i<subscriber.systemAlarmCommands.length;i++) {
                var systemAlarmCommand = subscriber.systemAlarmCommands[i];
                systemAlarmCommand.unsubscribe = true;
                if (subscriber.type === 'systemAlarm') {
                    cmdsWrapper.systemAlarmCmds.push(systemAlarmCommand);
                }
                // systemAlarmCmds
                cmdId = systemAlarmCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.monitorAlarmCmds) {
            for (var i=0;i<subscriber.monitorAlarmCmds.length;i++) {
                var monitorAlarmCommand = subscriber.monitorAlarmCmds[i];
                monitorAlarmCommand.unsubscribe = true;
                if (subscriber.type === 'monitorAlarm') {
                    cmdsWrapper.monitorAlarmCmds.push(monitorAlarmCommand);
                }
                // monitorAlarmCmds
                cmdId = monitorAlarmCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.cabinInfoReportCmds) {
            for (var i=0;i<subscriber.cabinInfoReportCmds.length;i++) {
                var cabinListCommand = subscriber.cabinInfoReportCmds[i];
                cabinListCommand.unsubscribe = true;
                if (subscriber.type === 'cabinList') {
                    cmdsWrapper.cabinInfoReportCmds.push(cabinListCommand);
                }
                // cabinInfoReportCmds
                cmdId = cabinListCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.hdMapLoadBoundaryCmds) {
            for (var i=0;i<subscriber.hdMapLoadBoundaryCmds.length;i++) {
                var boundryUpdateCommand = subscriber.hdMapLoadBoundaryCmds[i];
                boundryUpdateCommand.unsubscribe = true;
                if (subscriber.type === 'loadBoundryUpdate') {
                    cmdsWrapper.hdMapLoadBoundaryCmds.push(boundryUpdateCommand);
                }
                // hdMapLoadBoundaryCmds
                cmdId = boundryUpdateCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.hdMapUnloadBoundaryCmds) {
            for (var i=0;i<subscriber.hdMapUnloadBoundaryCmds.length;i++) {
                var unloadBoundryUpdateCommand = subscriber.hdMapUnloadBoundaryCmds[i];
                unloadBoundryUpdateCommand.unsubscribe = true;
                if (subscriber.type === 'unloadBoundryUpdate') {
                    cmdsWrapper.hdMapUnloadBoundaryCmds.push(unloadBoundryUpdateCommand);
                }
                // hdMapUnloadBoundaryCmds
                cmdId = unloadBoundryUpdateCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.shapeReloadCmds) {
            for (var i=0;i<subscriber.shapeReloadCmds.length;i++) {
                var shapeReloadCommand = subscriber.shapeReloadCmds[i];
                shapeReloadCommand.unsubscribe = true;
                if (subscriber.type === 'shapeReload') {
                    cmdsWrapper.shapeReloadCmds.push(shapeReloadCommand);
                }
                // shapeReloadCmds
                cmdId = shapeReloadCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.historyCommands) {
            for (i=0;i<subscriber.historyCommands.length;i++) {
                var historyCommand = subscriber.historyCommands[i];
                cmdId = historyCommand.cmdId;
                if (cmdId) {
                    if (subscribers[cmdId]) {
                        delete subscribers[cmdId];
                    }
                    if (commands[cmdId]) {
                        delete commands[cmdId];
                    }
                }
            }
        }
        var index = reconnectSubscribers.indexOf(subscriber);
        if (index > -1) {
            reconnectSubscribers.splice(index, 1);
        }
        subscribersCount--;
        publishCommands();

        if(subscribersCount == 0){
            clearTimeout(messageTimer);
            messageTimer = null;
        }

    }
}

function checkToClose () {
    if (subscribersCount === 0 && isOpened) {

        if (!socketCloseTimer) {
            socketCloseTimer = setTimeout(closeSocket, WS_IDLE_TIMEOUT);
        }
    }

}

function tryOpenSocket () {
    if (isActive) {
        if (!isOpened && !isOpening) {
            isOpening = true;
            if (userService.isJwtTokenValid()) {
                openSocket(userService.getJwtToken());
            } else {
                userService.refreshJwtToken().then(function success() {
                    openSocket(userService.getJwtToken());
                }, function fail() {
                    message.error('websocket error')
                    isOpening = false;
                });
            }
        }
        if (socketCloseTimer) {
            clearTimeout(socketCloseTimer);
            socketCloseTimer = null;
        }
    }
}

function openSocket(token) {
	return
    dataStream = new WebSocket(telemetryUri + '?token=' + token);
    dataStream.onerror=onError;
    dataStream.onopen=onOpen;
    dataStream.onclose=onClose;
    dataStream.onmessage=onMessage;
}

function closeSocket() {
    isActive = false;
    if (isOpened) {
        dataStream.close();
    }
}

function reset(close) {
    if (socketCloseTimer) {
        clearTimeout(socketCloseTimer);
        socketCloseTimer = null;
    }
    lastCmdId = 0;
    subscribers = {};
    subscribersCount = 0;
    commands = {};
    cmdsWrapper.tsSubCmds = [];
    cmdsWrapper.attrSubCmds = [];
    cmdsWrapper.mvAthoUpdateCmds = [];
    cmdsWrapper.disAlarmCmds = [];
    cmdsWrapper.systemAlarmCmds = [];
    cmdsWrapper.monitorAlarmCmds = [];
    cmdsWrapper.cabinInfoReportCmds = [];
    cmdsWrapper.hdMapLoadBoundaryCmds = [];
    cmdsWrapper.hdMapUnloadBoundaryCmds = [];
    cmdsWrapper.shapeReloadCmds = [];
    if (close) {
        closeSocket();
    }
}

export default{
    unsubscribe,
    subscribe
}

